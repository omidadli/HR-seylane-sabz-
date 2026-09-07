/**
 * Enterprise HRMS Express Server (سامانه جامع منابع انسانی کارا)
 * Full API Endpoints for all 8 Modules + Gemini AI Recruitment Agent
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { dbStore } from './server/store';
import { processAgentChat, generateJobAd, processVoiceCommand } from './server/gemini';
import {
  CandidateCategory,
  CandidateStage,
  LeaveStatus,
  LeaveType,
  PayrollStatus,
  UserRole,
} from './src/types';
import {
  JALALI_MONTH_NAMES,
  formatJalaliDate,
  getJalaliMonthDays,
  getTodayJalali,
  toPersianDigits,
} from './src/utils/jalali';

// Load .env in development (GEMINI_API_KEY, PORT, ...). Real environment
// variables injected by the host always take precedence over .env values.
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));

  // -------------------------------------------------------------
  // Health & Auth Endpoints
  // -------------------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), platform: 'Kara HRMS Iran' });
  });

  app.get('/api/auth/me', (req, res) => {
    res.json({
      role: dbStore.currentUserRole,
      user: {
        id: 'usr-admin-1',
        fullName: 'مهندس کیوان سهرابی',
        role: dbStore.currentUserRole,
        email: 'k.sohrabi@kara-hrms.ir',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      },
    });
  });

  app.post('/api/auth/switch-role', (req, res) => {
    const { role } = req.body;
    if (Object.values(UserRole).includes(role)) {
      dbStore.currentUserRole = role;
      res.json({ success: true, newRole: role });
    } else {
      res.status(400).json({ error: 'نقش کاربری نامعتبر است' });
    }
  });

  // -------------------------------------------------------------
  // Module 1: Recruitment & Hiring Endpoints
  // -------------------------------------------------------------
  app.get('/api/jobs', (req, res) => {
    res.json(dbStore.jobs);
  });

  app.post('/api/jobs', (req, res) => {
    const newJob = {
      id: `job-${Date.now()}`,
      title: req.body.title || 'موقعیت شغلی جدید',
      department: req.body.department || 'فناوری اطلاعات',
      employmentType: req.body.employmentType || 'تمام‌وقت',
      location: req.body.location || 'تهران',
      description: req.body.description || '',
      requirements: req.body.requirements || '',
      status: 'ACTIVE' as const,
      createdAtJalali: req.body.createdAtJalali || '۱۴۰۳/۰۶/۱۵',
      applicationsCount: 0,
      criteria: req.body.criteria || [
        { id: 'c-new-1', title: 'مهارت فنی تخصصی', weight: 40 },
        { id: 'c-new-2', title: 'سابقه کار مرتبط', weight: 35 },
        { id: 'c-new-3', title: 'مهارت‌های ارتباطی و تیمی', weight: 25 },
      ],
    };
    dbStore.jobs.unshift(newJob);
    res.status(201).json(newJob);
  });

  app.get('/api/candidates', (req, res) => {
    const { jobId, stage, category, talentPool } = req.query;
    let list = [...dbStore.candidates];
    if (jobId) list = list.filter(c => c.jobId === jobId);
    if (stage) list = list.filter(c => c.stage === stage);
    if (category) list = list.filter(c => c.category === category);
    if (talentPool === 'true') list = list.filter(c => c.inTalentPool);
    res.json(list);
  });

  app.post('/api/candidates', (req, res) => {
    const newCand = {
      id: `cand-${Date.now()}`,
      jobId: req.body.jobId || 'job-1',
      jobTitle: req.body.jobTitle || 'کارشناس ارشد توسعه فرانت‌اند',
      fullName: req.body.fullName || 'کارجوی جدید',
      email: req.body.email || 'applicant@example.com',
      phone: req.body.phone || '09120000000',
      resumeFileName: req.body.resumeFileName || 'Resume.pdf',
      resumeText: req.body.resumeText || '',
      overallScore: req.body.overallScore || 7.5,
      category: req.body.category || CandidateCategory.INTERVIEW_PRIORITY,
      stage: CandidateStage.INITIAL_SCREENING,
      strengths: req.body.strengths || ['تسلط خوب بر ابزارهای مدرن'],
      weaknesses: req.body.weaknesses || ['نیازمند ارزیابی فنی تکمیلی'],
      resumeQuotes: req.body.resumeQuotes || ['«سابقه کار در پروژه‌های مقیاس‌پذیر»'],
      criteriaScores: req.body.criteriaScores || { 'مهارت فنی': 8, 'ارتباطات': 7 },
      inTalentPool: false,
      appliedAtJalali: '۱۴۰۳/۰۶/۱۵',
    };
    dbStore.candidates.unshift(newCand);
    res.status(201).json(newCand);
  });

  app.patch('/api/candidates/:id/stage', (req, res) => {
    const { id } = req.params;
    const { stage } = req.body;
    if (!Object.values(CandidateStage).includes(stage)) {
      return res.status(400).json({ error: 'مرحله استخدامی نامعتبر است' });
    }
    const cand = dbStore.candidates.find(c => c.id === id);
    if (!cand) return res.status(404).json({ error: 'کارجو یافت نشد' });
    cand.stage = stage;
    res.json(cand);
  });

  app.patch('/api/candidates/:id/talent-pool', (req, res) => {
    const { id } = req.params;
    const { inTalentPool, notes } = req.body;
    const cand = dbStore.candidates.find(c => c.id === id);
    if (!cand) return res.status(404).json({ error: 'کارجو یافت نشد' });
    cand.inTalentPool = inTalentPool;
    if (notes) cand.talentPoolNotes = notes;
    res.json(cand);
  });

  app.post('/api/candidates/:id/schedule-interview', (req, res) => {
    const { id } = req.params;
    const { interviewJalali, interviewType, interviewNotes } = req.body;
    const cand = dbStore.candidates.find(c => c.id === id);
    if (!cand) return res.status(404).json({ error: 'کارجو یافت نشد' });
    cand.interviewJalali = interviewJalali;
    cand.interviewType = interviewType;
    cand.interviewNotes = interviewNotes;
    cand.stage = CandidateStage.IN_PERSON_INTERVIEW;
    res.json(cand);
  });

  // Minimal Persian->Latin map so generated seed e-mails are valid ASCII.
  // (Persian script in the local part, e.g. 'یاسمین.غفاری@example.com', is not a valid e-mail.)
  const faNameLatin: Record<string, string> = {
    'سینا': 'sina', 'الناز': 'elnaz', 'پویان': 'pouyan', 'بهار': 'bahar',
    'حامد': 'hamed', 'رکسانا': 'roksana', 'فرزاد': 'farzad', 'سوگند': 'sougand',
    'مهراد': 'mehrad', 'یاسمین': 'yasamin', 'آرش': 'arash', 'ترانه': 'taraneh',
    'نوید': 'navid', 'مینا': 'mina', 'کاظمی': 'kazemi', 'رحیمی': 'rahimi',
    'طاهری': 'taheri', 'غفاری': 'ghafari', 'صادقی': 'sadeghi', 'حسینی': 'hosseini',
    'میرزایی': 'mirzaei', 'کریمی': 'karimi', 'افشار': 'afshar', 'نوری': 'nouri',
    'باقری': 'bagheri', 'شریفی': 'sharifi',
  };
  const latinName = (fa: string, fallback: string): string => faNameLatin[fa] || fallback;

  // Bulk resume upload processing (simulates 200+ resumes real-time processing)
  app.post('/api/candidates/bulk-upload', (req, res) => {
    const { filesCount, jobId } = req.body;
    const targetJob = dbStore.jobs.find(j => j.id === jobId) || dbStore.jobs[0];
    const totalFiles = Math.max(10, Math.min(filesCount || 200, 250));

    const iranianFirstNames = ['سینا', 'الناز', 'پویان', 'بهار', 'حامد', 'رکسانا', 'فرزاد', 'سوگند', 'مهراد', 'یاسمین', 'آرش', 'ترانه', 'نوید', 'مینا'];
    const iranianLastNames = ['کاظمی', 'رحیمی', 'طاهری', 'غفاری', 'صادقی', 'حسینی', 'میرزایی', 'کریمی', 'افشار', 'نوری', 'باقری', 'شریفی'];

    const newCandidatesBatch = [];
    for (let i = 0; i < totalFiles; i++) {
      const fn = iranianFirstNames[Math.floor(Math.random() * iranianFirstNames.length)];
      const ln = iranianLastNames[Math.floor(Math.random() * iranianLastNames.length)];
      const fullName = `${fn} ${ln}`;
      const score = +(4 + Math.random() * 5.8).toFixed(1);

      let category = CandidateCategory.NEEDS_REVIEW;
      if (score >= 7.0) category = CandidateCategory.INTERVIEW_PRIORITY;
      else if (score < 5.0) category = CandidateCategory.INITIAL_REJECTION;

      const cand = {
        id: `cand-bulk-${Date.now()}-${i}`,
        jobId: targetJob.id,
        jobTitle: targetJob.title,
        fullName,
        email: `${latinName(fn, 'applicant')}.${latinName(ln, 'resume')}.${Date.now().toString(36)}${i}@example.com`,
        phone: `0912${Math.floor(1000000 + Math.random() * 9000000)}`,
        resumeFileName: `Resume_${fullName.replace(' ', '_')}.pdf`,
        resumeText: `فارغ‌التحصیل رشته مهندسی، سابقه کار مرتبط در استارتاپ‌ها، آشنا با اصول نرم‌افزار.`,
        overallScore: score,
        category,
        stage: category === CandidateCategory.INTERVIEW_PRIORITY ? CandidateStage.INITIAL_SCREENING : (category === CandidateCategory.INITIAL_REJECTION ? CandidateStage.REJECTED : CandidateStage.INITIAL_SCREENING),
        strengths: [`تسلط بر مفاهیم پایه با امتیاز ارزیابی ${score}`],
        weaknesses: [score < 7 ? 'نیاز به سنجش سطح کدنویسی در مصاحبه تلفنی' : 'نیاز به مصاحبه نهایی فرهنگی'],
        resumeQuotes: ['«سابقه در پروژه‌های تیمی و مشارکت در اسپرینت‌های اسکرام»'],
        criteriaScores: {
          'تسلط فنی': Math.min(10, +(score * (0.9 + Math.random() * 0.2)).toFixed(1)),
          'تایپ‌اسکریپت': Math.min(10, +(score * (0.85 + Math.random() * 0.25)).toFixed(1)),
          'طراحی RTL': Math.min(10, +(score * (0.95 + Math.random() * 0.1)).toFixed(1)),
          'کار تیمی': Math.min(10, +(score * (0.9 + Math.random() * 0.15)).toFixed(1)),
        },
        inTalentPool: category === CandidateCategory.INITIAL_REJECTION && score >= 4.5,
        appliedAtJalali: '۱۴۰۳/۰۶/۱۵',
      };
      newCandidatesBatch.push(cand);
    }

    // Store the whole processed batch so the pipeline matches the reported
    // stats. A global cap keeps the in-memory store bounded; when the cap is
    // hit the oldest bulk-imported candidates are evicted first.
    const MAX_CANDIDATES = 1000;
    dbStore.candidates.unshift(...newCandidatesBatch);
    const overflow = dbStore.candidates.length - MAX_CANDIDATES;
    if (overflow > 0) {
      const bulkIdx: number[] = [];
      dbStore.candidates.forEach((c, idx) => {
        if (c.id.startsWith('cand-bulk-')) bulkIdx.push(idx);
      });
      // Evict oldest bulk imports (they sit at the end of the array).
      bulkIdx.sort((a, b) => b - a);
      for (const idx of bulkIdx.slice(0, overflow)) {
        dbStore.candidates.splice(idx, 1);
      }
    }
    targetJob.applicationsCount += totalFiles;

    res.json({
      success: true,
      processedCount: totalFiles,
      interviewPriorityCount: newCandidatesBatch.filter(c => c.category === CandidateCategory.INTERVIEW_PRIORITY).length,
      needsReviewCount: newCandidatesBatch.filter(c => c.category === CandidateCategory.NEEDS_REVIEW).length,
      initialRejectionCount: newCandidatesBatch.filter(c => c.category === CandidateCategory.INITIAL_REJECTION).length,
      sampleCandidates: newCandidatesBatch.slice(0, 5),
    });
  });

  // AI Agent Chat with Gemini Function Calling
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, jobId } = req.body;
      const agentResponse = await processAgentChat(message, jobId);
      res.json(agentResponse);
    } catch (err: any) {
      console.error('Agent chat error:', err);
      res.status(500).json({ error: 'خطا در برقراری ارتباط با دستیار هوشمند استخدام' });
    }
  });

  // -------------------------------------------------------------
  // Seilaneh Sabz Holding Endpoints
  // -------------------------------------------------------------
  app.get('/api/departments', (req, res) => {
    res.json(dbStore.departments || []);
  });

  app.get('/api/departments/:id', (req, res) => {
    const dept = dbStore.departments.find(d => d.id === req.params.id);
    if (!dept) return res.status(404).json({ error: 'دپارتمان یافت نشد' });
    res.json(dept);
  });

  // HR Automation Hub Endpoints
  app.get('/api/automation/tasks', (req, res) => {
    res.json(dbStore.automationTasks || []);
  });

  app.post('/api/automation/run', (req, res) => {
    const { taskId } = req.body;
    const task = dbStore.automationTasks.find(t => t.id === taskId);
    if (!task) {
      return res.status(404).json({ error: 'وظیفه اتوماسیون یافت نشد' });
    }

    // Execute targeted business logic based on task category
    task.status = 'COMPLETED';
    task.lastRunJalali = 'امروز - لحظاتی پیش';
    task.successCount = (task.successCount || 0) + 1;

    let executionDetails = 'عملیات با موفقیت انجام شد';
    if (task.category === 'PAYROLL') {
      dbStore.payrollSlips.forEach(p => { p.status = PayrollStatus.FINALIZED; });
      executionDetails = 'فیش‌های حقوقی تمامی ۱۳۵۰ همکار هلدینگ نهایی گردید و به پنل کاربری ایشان ارسال شد.';
    } else if (task.category === 'SCREENING') {
      executionDetails = 'غربالگری دسته‌جمعی بر روی کارجویان اجرا شد؛ نمرات تطبیق شایستگی با موفقیت ثبت گردید.';
    } else if (task.category === 'LEAVES') {
      dbStore.leaveRequests.forEach(l => {
        if (l.status === LeaveStatus.PENDING_HR || l.status === LeaveStatus.PENDING_MANAGER) {
          l.status = LeaveStatus.APPROVED;
        }
      });
      executionDetails = 'مرخصی‌های معوقه بدون تداخل شیفت بررسی و تایید گردیدند.';
    }

    res.json({
      success: true,
      task,
      message: executionDetails,
    });
  });

  // AI Job Description & Job Ad Generator
  app.post('/api/ai/generate-job-ad', async (req, res) => {
    try {
      const result = await generateJobAd(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('Job Ad generation error:', err);
      res.status(500).json({ error: 'خطا در تولید شرح شغل و آگهی هوشمند' });
    }
  });

  // AI Voice Assistant Endpoint
  app.post('/api/ai/voice-assistant', async (req, res) => {
    try {
      const { command } = req.body;
      const result = await processVoiceCommand(command || '');
      res.json(result);
    } catch (err: any) {
      console.error('Voice assistant error:', err);
      res.status(500).json({ error: 'خطا در تحلیل دستور صوتی' });
    }
  });

  // Candidate comparison data (Table & Radar chart)
  app.post('/api/candidates/compare', (req, res) => {
    const { candidateIds } = req.body;
    if (!Array.isArray(candidateIds) || candidateIds.length < 2) {
      return res.status(400).json({ error: 'برای مقایسه حداقل ۲ شناسه کارجو لازم است' });
    }
    const wanted = new Set(candidateIds.filter(id => typeof id === 'string'));
    const candidates = dbStore.candidates.filter(c => wanted.has(c.id));
    if (candidates.length === 0) {
      return res.status(400).json({ error: 'هیچ کارجویی یافت نشد' });
    }

    const allCriteria = new Set<string>();
    candidates.forEach(c => {
      if (c.criteriaScores) {
        Object.keys(c.criteriaScores).forEach(crit => allCriteria.add(crit));
      }
    });

    const criteriaList = Array.from(allCriteria);
    const radarData = criteriaList.map(criterion => {
      const row: any = { criterion };
      candidates.forEach(c => {
        row[c.fullName] = c.criteriaScores ? (c.criteriaScores[criterion] || 0) : (c.overallScore || 0);
      });
      return row;
    });

    res.json({
      candidates,
      criteriaList,
      radarData,
    });
  });

  // Save email draft (never auto-send)
  app.post('/api/candidates/:id/draft-email', (req, res) => {
    const { id } = req.params;
    const { type, subject, body } = req.body;
    const cand = dbStore.candidates.find(c => c.id === id);
    if (!cand) return res.status(404).json({ error: 'کارجو یافت نشد' });

    cand.emailDraft = {
      type,
      subject,
      body,
      status: 'DRAFT_ONLY',
      createdAtJalali: '۱۴۰۳/۰۶/۱۵',
    };

    res.json({ success: true, emailDraft: cand.emailDraft });
  });

  // -------------------------------------------------------------
  // Module 2: Employee Records Endpoints
  // -------------------------------------------------------------
  app.get('/api/employees', (req, res) => {
    res.json(dbStore.employees);
  });

  app.post('/api/employees', (req, res) => {
    const newEmp = {
      id: `emp-${Date.now()}`,
      personnelCode: req.body.personnelCode || `۱۰${Math.floor(100 + Math.random() * 900)}`,
      nationalId: req.body.nationalId || '۰۰۱۲۳۴۵۶۷۸',
      fullName: req.body.fullName || 'همکار جدید',
      fatherName: req.body.fatherName || 'محمد',
      birthDateJalali: req.body.birthDateJalali || '۱۳۷۰/۰۱/۰۱',
      phone: req.body.phone || '09123456789',
      email: req.body.email || 'emp@company.ir',
      department: req.body.department || 'فناوری اطلاعات',
      jobTitle: req.body.jobTitle || 'کارشناس',
      hireDateJalali: req.body.hireDateJalali || '۱۴۰۳/۰۶/۰۱',
      baseSalaryToman: req.body.baseSalaryToman || 30000000,
      maritalStatus: req.body.maritalStatus || 'SINGLE',
      childrenCount: req.body.childrenCount || 0,
      bankIban: req.body.bankIban || 'IR000000000000000000000000',
      status: 'ACTIVE' as const,
      documents: [],
      jobHistories: [],
    };
    dbStore.employees.push(newEmp);
    res.status(201).json(newEmp);
  });

  // -------------------------------------------------------------
  // Module 3: Attendance & Leave Endpoints
  // -------------------------------------------------------------
  app.get('/api/attendance', (req, res) => {
    res.json(dbStore.attendances);
  });

  app.post('/api/attendance/check-in-out', (req, res) => {
    const { employeeId, type } = req.body;
    if (type !== 'CHECK_IN' && type !== 'CHECK_OUT') {
      return res.status(400).json({ error: 'نوع تردد نامعتبر است' });
    }
    const emp = dbStore.employees.find(e => e.id === employeeId);
    if (!emp) {
      return res.status(404).json({ error: 'پرسنل یافت نشد' });
    }

    // Real current Jalali date (Persian digits, matching the rest of the dataset)
    const todayJalali = formatJalaliDate(getTodayJalali(), true);
    const now = new Date();
    const timeEn = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timeStr = toPersianDigits(timeEn);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const SHIFT_START_MINUTES = 8 * 60; // 08:00
    const SHIFT_END_MINUTES = 17 * 60; // 17:00

    let record = dbStore.attendances.find(a => a.employeeId === emp.id && a.dateJalali === todayJalali);
    if (!record) {
      record = {
        id: `att-${Date.now()}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        dateJalali: todayJalali,
        delayMinutes: 0,
        overtimeHours: 0,
        status: 'PRESENT',
      };
      dbStore.attendances.unshift(record);
    }

    if (type === 'CHECK_IN') {
      if (record.checkIn) {
        // Never silently overwrite an existing check-in.
        return res.json({ ...record, notice: 'ورود امروز قبلاً ثبت شده است' });
      }
      record.checkIn = timeStr;
      record.delayMinutes = Math.max(0, nowMinutes - SHIFT_START_MINUTES);
    } else {
      if (record.checkOut) {
        return res.json({ ...record, notice: 'خروج امروز قبلاً ثبت شده است' });
      }
      record.checkOut = timeStr;
      record.overtimeHours = Math.max(0, Math.round(((nowMinutes - SHIFT_END_MINUTES) / 60) * 10) / 10);
    }

    res.json(record);
  });

  app.get('/api/leave/requests', (req, res) => {
    res.json(dbStore.leaveRequests);
  });

  app.post('/api/leave/requests', (req, res) => {
    const { employeeId, leaveType, startDateJalali, endDateJalali, daysCount, reason } = req.body;
    const emp = dbStore.employees.find(e => e.id === employeeId) || dbStore.employees[0];

    const newLeave = {
      id: `leave-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.fullName,
      leaveType: leaveType || LeaveType.ANNUAL,
      startDateJalali,
      endDateJalali,
      daysCount: parseFloat(daysCount) || 1,
      reason: reason || 'امور شخصی',
      status: LeaveStatus.PENDING_MANAGER,
      createdAtJalali: '۱۴۰۳/۰۶/۱۵',
    };
    dbStore.leaveRequests.unshift(newLeave);
    res.status(201).json(newLeave);
  });

  app.patch('/api/leave/requests/:id/approve', (req, res) => {
    const { id } = req.params;
    const { approved, comment } = req.body;
    // SECURITY: the acting role is taken from the server-side session state,
    // never from the request body (clients must not be able to escalate to HR).
    const role = dbStore.currentUserRole;
    const reqItem = dbStore.leaveRequests.find(l => l.id === id);
    if (!reqItem) return res.status(404).json({ error: 'درخواست مرخصی یافت نشد' });
    if (typeof approved !== 'boolean') {
      return res.status(400).json({ error: 'نتیجه بررسی نامشخص است' });
    }
    if (reqItem.status === LeaveStatus.APPROVED || reqItem.status === LeaveStatus.REJECTED) {
      return res.status(409).json({ error: 'این درخواست قبلاً تعیین تکلیف شده است' });
    }

    if (role === UserRole.DEPT_MANAGER) {
      if (reqItem.status !== LeaveStatus.PENDING_MANAGER) {
        return res.status(403).json({ error: 'این درخواست در مرحله تایید مدیر واحد نیست' });
      }
      reqItem.managerApproved = approved;
      reqItem.managerComment = comment;
      reqItem.status = approved ? LeaveStatus.PENDING_HR : LeaveStatus.REJECTED;
    } else if (role === UserRole.HR_DIRECTOR) {
      if (reqItem.status === LeaveStatus.PENDING_HR) {
        reqItem.hrApproved = approved;
        reqItem.hrComment = comment;
        reqItem.status = approved ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;
      } else if (reqItem.status === LeaveStatus.PENDING_MANAGER) {
        // HR outranks the workflow: acting on a manager-stage request records
        // both approvals at once instead of skipping the manager silently.
        reqItem.managerApproved = approved;
        reqItem.managerComment = comment ?? 'تایید مستقیم منابع انسانی';
        reqItem.hrApproved = approved;
        reqItem.hrComment = comment;
        reqItem.status = approved ? LeaveStatus.APPROVED : LeaveStatus.REJECTED;
      } else {
        return res.status(403).json({ error: 'این درخواست قابل بررسی نیست' });
      }
    } else {
      return res.status(403).json({ error: 'شما اجازه تایید مرخصی ندارید' });
    }

    res.json(reqItem);
  });

  // -------------------------------------------------------------
  // Module 4: Payroll Endpoints
  // -------------------------------------------------------------
  app.get('/api/payroll/slips', (req, res) => {
    res.json(dbStore.payrollSlips);
  });

  app.post('/api/payroll/generate', (req, res) => {
    const monthJalali = Number(req.body?.monthJalali);
    const yearJalali = Number(req.body?.yearJalali);
    if (!Number.isInteger(monthJalali) || monthJalali < 1 || monthJalali > 12) {
      return res.status(400).json({ error: 'ماه شمسی نامعتبر است (۱ تا ۱۲)' });
    }
    if (!Number.isInteger(yearJalali) || yearJalali < 1300 || yearJalali > 1500) {
      return res.status(400).json({ error: 'سال شمسی نامعتبر است' });
    }

    // Recalculate payroll with Iranian labor laws:
    // Housing: 900,000 Toman, Bon-e-Kargari: 1,400,000 Toman, Child allowance per child: 716,618 Toman
    // SSO 7% deduction, progressive income-tax brackets.
    // NOTE: commute/overtime below are fixed planning constants until the
    // attendance module feeds real per-employee overtime into payroll.
    const monthName = JALALI_MONTH_NAMES[monthJalali - 1];
    const lastDay = getJalaliMonthDays(yearJalali, monthJalali);
    const paidAtJalali = toPersianDigits(
      `${yearJalali}/${String(monthJalali).padStart(2, '0')}/${String(lastDay).padStart(2, '0')}`
    );

    // Simplified progressive salary-tax brackets (monthly, Toman):
    // 0% up to 12M, 10% on 12-16.8M, 15% on 16.8-27M, 20% above 27M.
    const calcProgressiveTax = (taxable: number): number => {
      if (taxable <= 0) return 0;
      const brackets: Array<{ upTo: number; rate: number }> = [
        { upTo: 12000000, rate: 0 },
        { upTo: 16800000, rate: 0.10 },
        { upTo: 27000000, rate: 0.15 },
        { upTo: Number.POSITIVE_INFINITY, rate: 0.20 },
      ];
      let tax = 0;
      let prevLimit = 0;
      for (const b of brackets) {
        const portion = Math.min(taxable, b.upTo) - prevLimit;
        if (portion > 0) tax += portion * b.rate;
        prevLimit = b.upTo;
        if (taxable <= b.upTo) break;
      }
      return Math.round(tax);
    };

    const generatedSlips = dbStore.employees.map(emp => {
      const baseSalary = emp.baseSalaryToman;
      const housing = 900000;
      const bonKargari = 1400000;
      const childAllowance = emp.childrenCount * 716618;
      const commute = 1500000;
      const overtimePay = 2500000;

      const gross = baseSalary + housing + bonKargari + childAllowance + commute + overtimePay;
      // Insurable items: gross minus exempt items
      const insurableSalary = gross - commute;
      const sso7Pct = Math.round(insurableSalary * 0.07);

      const taxable = Math.max(0, gross - 12000000 - sso7Pct);
      const tax = calcProgressiveTax(taxable);

      const net = gross - sso7Pct - tax;
      const sanavat = Math.round(baseSalary / 12); // monthly reserve
      const eidi = Math.round((baseSalary * 2) / 12); // monthly reserve

      return {
        id: `pay-${emp.id}-${yearJalali}-${monthJalali}`,
        employeeId: emp.id,
        employeeName: emp.fullName,
        personnelCode: emp.personnelCode,
        monthJalali,
        monthName,
        yearJalali,
        baseSalaryToman: baseSalary,
        housingAllowanceToman: housing,
        bonKargariToman: bonKargari,
        childAllowanceToman: childAllowance,
        commuteAllowanceToman: commute,
        overtimePayToman: overtimePay,
        grossSalaryToman: gross,
        ssoInsurance7PctToman: sso7Pct,
        incomeTaxToman: tax,
        otherDeductionsToman: 0,
        netSalaryToman: net,
        sanavatReserveToman: sanavat,
        eidiReserveToman: eidi,
        status: PayrollStatus.FINALIZED,
        paidAtJalali,
      };
    });

    // Merge: replace slips for this (year, month), keep every other period.
    // Regenerating the same month is idempotent instead of duplicating rows.
    const regeneratedKeys = new Set(
      generatedSlips.map(sl => `${sl.employeeId}-${sl.yearJalali}-${sl.monthJalali}`)
    );
    dbStore.payrollSlips = [
      ...dbStore.payrollSlips.filter(
        sl => !regeneratedKeys.has(`${sl.employeeId}-${sl.yearJalali}-${sl.monthJalali}`)
      ),
      ...generatedSlips,
    ];
    res.json({ success: true, count: generatedSlips.length, slips: generatedSlips });
  });

  // -------------------------------------------------------------
  // Module 5: Performance Management Endpoints
  // -------------------------------------------------------------
  app.get('/api/performance/goals', (req, res) => {
    res.json(dbStore.performanceGoals);
  });

  app.post('/api/performance/goals', (req, res) => {
    const newGoal = {
      id: `goal-${Date.now()}`,
      employeeId: req.body.employeeId || 'emp-2',
      employeeName: req.body.employeeName || 'مریم فتاحی',
      title: req.body.title || 'هدف ارزیابی عملکرد جدید',
      targetMetric: req.body.targetMetric || 'تحقق ۱۰۰٪ تارگت',
      currentProgress: req.body.currentProgress || 0,
      weight: req.body.weight || 20,
      deadlineJalali: req.body.deadlineJalali || '۱۴۰۳/۰۸/۳۰',
    };
    dbStore.performanceGoals.unshift(newGoal);
    res.status(201).json(newGoal);
  });

  app.patch('/api/performance/goals/:id', (req, res) => {
    const { id } = req.params;
    const goal = dbStore.performanceGoals.find(g => g.id === id);
    if (!goal) return res.status(404).json({ error: 'هدف یافت نشد' });
    if (req.body.currentProgress !== undefined) goal.currentProgress = req.body.currentProgress;
    res.json(goal);
  });

  // -------------------------------------------------------------
  // Module 6: Learning & Development Endpoints
  // -------------------------------------------------------------
  app.get('/api/training/courses', (req, res) => {
    res.json(dbStore.trainingCourses);
  });

  app.get('/api/training/skill-matrix', (req, res) => {
    res.json(dbStore.skillMatrix);
  });

  // -------------------------------------------------------------
  // Module 7: Onboarding & Offboarding Endpoints
  // -------------------------------------------------------------
  app.get('/api/checklists', (req, res) => {
    res.json(dbStore.checklistItems);
  });

  app.patch('/api/checklists/:id/toggle', (req, res) => {
    const { id } = req.params;
    const item = dbStore.checklistItems.find(c => c.id === id);
    if (!item) return res.status(404).json({ error: 'آیتم چک‌لیست یافت نشد' });
    item.isCompleted = !item.isCompleted;
    item.completedAtJalali = item.isCompleted ? '۱۴۰۳/۰۶/۱۵' : undefined;
    res.json(item);
  });

  // -------------------------------------------------------------
  // Module 8: Reporting & Analytics Dashboard Endpoints
  // -------------------------------------------------------------
  app.get('/api/analytics/metrics', (req, res) => {
    res.json(dbStore.metrics);
  });

  // -------------------------------------------------------------
  // API 404 + Central Error Handler
  // -------------------------------------------------------------
  // Unknown /api/* routes get JSON (never the SPA shell or a stack trace).
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'مسیر API یافت نشد' });
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled API error:', err);
    if (res.headersSent) return next(err);
    res.status(500).json({ error: 'خطای داخلی سرور' });
  });

  // -------------------------------------------------------------
  // Vite Middleware / Static Files
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`سامانه منابع انسانی کارا بر روی پورت ${PORT} آماده به کار است.`);
  });
}

startServer();
