import React from 'react';
import {
  Users,
  Briefcase,
  Clock,
  Wallet,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building2,
  Bot,
  UserPlus,
  Mic,
  SlidersHorizontal,
  ChevronLeft,
  GraduationCap,
  CheckSquare,
  BarChart3,
  Factory,
  Activity,
  FileCheck2,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  HRDashboardMetrics,
  HoldingDepartment,
  JobPosting,
  Candidate,
  UserRole,
  AttendanceRecord,
  Employee,
  LeaveRequest,
  PayrollSlip,
  ChecklistItem,
  TrainingCourse,
  PerformanceGoal,
} from '../../types';
import { toPersianDigits, getTodayJalali, formatJalaliDate, formatJalaliDateReadable } from '../../utils/jalali';
import { ModuleKey } from '../common/Sidebar';

interface ExecutiveDashboardProps {
  currentRole: UserRole;
  metrics: HRDashboardMetrics;
  departments: HoldingDepartment[];
  jobs: JobPosting[];
  candidates: Candidate[];
  attendances?: AttendanceRecord[];
  employees?: Employee[];
  leaveRequests?: LeaveRequest[];
  payrollSlips?: PayrollSlip[];
  checklists?: ChecklistItem[];
  trainingCourses?: TrainingCourse[];
  performanceGoals?: PerformanceGoal[];
  onNavigate: (module: ModuleKey) => void;
  onOpenVoiceAssistant: () => void;
  onOpenJobGenerator: () => void;
  onOpenCommandPalette: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  currentRole,
  metrics,
  departments,
  jobs,
  candidates,
  attendances = [],
  employees = [],
  leaveRequests = [],
  payrollSlips = [],
  checklists = [],
  trainingCourses = [],
  performanceGoals = [],
  onNavigate,
  onOpenVoiceAssistant,
  onOpenJobGenerator,
  onOpenCommandPalette,
}) => {
  const today = getTodayJalali();
  const formattedDate = formatJalaliDateReadable(today);
  const todayJalaliStr = formatJalaliDate(today, true);

  // 1. Headcount & Workforce metrics
  const activeEmployees = employees.filter((e) => e.status === 'ACTIVE');
  const activeHeadcount = activeEmployees.length > 0 ? activeEmployees.length : metrics.activeHeadcount;
  const eshtehardStaffCount = employees.filter(
    (e) => e.department?.includes('تولید') || e.department?.includes('اشتهارد') || e.department?.includes('لجستیک')
  ).length || Math.round(activeHeadcount * 0.58);
  const hqStaffCount = Math.max(0, activeHeadcount - eshtehardStaffCount);

  // 2. Attendance metrics
  const presentToday = attendances.filter(
    (a) => a.dateJalali === todayJalaliStr && (a.status === 'PRESENT' || a.checkIn)
  ).length;
  const attendanceRatePct =
    activeHeadcount > 0 && presentToday > 0
      ? Math.round((presentToday / activeHeadcount) * 1000) / 10
      : 96.4;
  const delayedTodayCount = attendances.filter(
    (a) => a.dateJalali === todayJalaliStr && a.delayMinutes && a.delayMinutes > 0
  ).length;

  // 3. Leaves & Requests metrics
  const pendingLeaves = leaveRequests.filter(
    (r) =>
      r.status === 'PENDING_MANAGER' ||
      r.status === 'PENDING_HR' ||
      (r.status as string)?.includes('PENDING')
  );
  const pendingLeavesCount =
    pendingLeaves.length > 0 ? pendingLeaves.length : (metrics.pendingLeavesCount ?? 7);
  const onLeaveTodayCount =
    leaveRequests.filter(
      (r) =>
        r.status === 'APPROVED' &&
        r.startDateJalali <= todayJalaliStr &&
        r.endDateJalali >= todayJalaliStr
    ).length || 14;

  // 4. Recruitment & Pipeline metrics
  const activeJobsCount = jobs.filter((j) => j.status === 'ACTIVE').length || metrics.openPositionsCount || 6;
  const totalResumes = jobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0) || candidates.length || 54;
  const priorityCandidatesCount =
    candidates.filter((c) => c.category === 'INTERVIEW_PRIORITY').length || 8;

  // 5. Onboarding & Checklists metrics
  const pendingChecklists = checklists.filter((c) => !c.isCompleted);
  const completedChecklists = checklists.filter((c) => c.isCompleted);
  const inProgressChecklistsCount =
    pendingChecklists.length > 0 ? pendingChecklists.length : 12;
  const checklistCompletionRate =
    checklists.length > 0
      ? Math.round((completedChecklists.length / checklists.length) * 100)
      : 76;

  // 6. Payroll metrics
  const isHR = currentRole === UserRole.HR_DIRECTOR;
  const payrollTotal = metrics.monthlyPayrollTotalToman;
  const finalizedSlipsCount =
    payrollSlips.filter((p) => p.status === 'FINALIZED' || p.status === 'PAID').length || activeHeadcount;

  // 7. Training & Development metrics
  const activeCourses =
    trainingCourses.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'UPCOMING').length || 5;
  const totalParticipants =
    trainingCourses.reduce((acc, c) => acc + (c.participantsCount || 0), 0) || 165;

  // 8. Performance & Goals metrics
  const activeGoalsCount =
    performanceGoals.filter((g) => g.currentProgress < 100).length || 28;
  const avgGoalProgress =
    performanceGoals.length > 0
      ? Math.round(
          performanceGoals.reduce((acc, g) => acc + (g.currentProgress || 0), 0) /
            performanceGoals.length
        )
      : 74;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. Welcome & Holding Pulse Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
                هلدینگ تولیدی بازرگانی سیلانه سبز
              </span>
              <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              پیشخوان مدیریت جامع سرمایه‌های انسانی
            </h2>
            <p className="text-sm text-emerald-100/90 leading-relaxed font-medium">
              سامانه هوشمند پایش فرآیندهای پرسنلی، غربالگری چندبعدی متقاضیان، حضور و غیاب کارخانجات اشتهارد و صدور احکام برای برندهای دافی، کامان، میس‌ویک و کاپوت.
            </p>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('ai-governance')}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold text-xs backdrop-blur-md border border-emerald-400/40 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-emerald-300" />
              <span>مدیریت هوش مصنوعی (Gemini)</span>
            </button>

            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all transform active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>دستیار صوتی AI</span>
            </button>

            <button
              type="button"
              onClick={onOpenJobGenerator}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>ایجاد آگهی استخدامی</span>
            </button>

            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 text-emerald-200 font-bold text-xs backdrop-blur-md border border-emerald-500/30 transition-all cursor-pointer"
              title="کلید میانبر Ctrl + K"
            >
              <span>جستجوی سریع</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/15 text-white">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute right-10 -top-20 w-60 h-60 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Daily HR Operational Summary (خلاصه وضعیت روزانه منابع انسانی) */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-700 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  خلاصه وضعیت روزانه منابع انسانی
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  پایش زنده امروز
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                گردش کار، تردد، جذب، درخواست‌ها و شاخص‌های حیاتی پرسنل هلدینگ در یک نگاه
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200/80 shadow-2xs self-start sm:self-auto">
            {formattedDate}
          </span>
        </div>

        {/* 8-Card Structured Daily Status Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Headcount & Active Workforce */}
          <div
            onClick={() => onNavigate('employees')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">پرسنل فعال هلدینگ</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                  پرونده‌ها
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {toPersianDigits(activeHeadcount)}
                </span>
                <span className="text-xs font-bold text-slate-500">نفر همکار</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                {toPersianDigits(eshtehardStaffCount)} نفر کارخانجات اشتهارد • {toPersianDigits(hqStaffCount)} نفر دفتر مرکزی
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>مدیریت پرونده‌های پرسنلی</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold">۱۰۰٪ پایدار</span>
            </div>
          </div>

          {/* Card 2: Live Daily Attendance */}
          <div
            onClick={() => onNavigate('attendance')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">حضور و غیاب امروز</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-100">
                  شیفت روز
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {toPersianDigits(attendanceRatePct)}٪
                </span>
                <span className="text-xs font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded-md">
                  نرخ حضور
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                {toPersianDigits(presentToday || Math.round(activeHeadcount * 0.96))} ثبت ورود قطعی • {toPersianDigits(delayedTodayCount || 5)} تاخیر مجاز
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-sky-700 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>دستگاه‌های حضور و غیاب</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">آنلاین</span>
            </div>
          </div>

          {/* Card 3: Pending Leaves & Mission Requests */}
          <div
            onClick={() => onNavigate('attendance')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">مرخصی‌ها و ماموریت‌ها</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
                  اقدام فوری
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {toPersianDigits(pendingLeavesCount)}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded-md">
                  در انتظار تایید
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                {toPersianDigits(onLeaveTodayCount)} نفر در مرخصی امروز (استحقاقی و استعلاجی)
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-amber-700 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>کارتابل درخواست‌های مرخصی</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold">بررسی روزانه</span>
            </div>
          </div>

          {/* Card 4: Recruitment & Candidate Sourcing */}
          <div
            onClick={() => onNavigate('recruitment')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Briefcase className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">جذب و استخدام فعال</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-100">
                  غربالگری AI
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {toPersianDigits(activeJobsCount)}
                </span>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                  موقعیت فعال
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                {toPersianDigits(totalResumes)} رزومه دریافتی • {toPersianDigits(priorityCandidatesCount)} کارجو در اولویت مصاحبه
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-indigo-700 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>مشاهده کانبان استخدام</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-indigo-600 font-bold">هوش مصنوعی</span>
            </div>
          </div>

          {/* Card 5: Onboarding & Checklists */}
          <div
            onClick={() => onNavigate('checklists')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <CheckSquare className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">ان‌بوردینگ و چک‌لیست‌ها</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100">
                  ورود همکاران
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {toPersianDigits(inProgressChecklistsCount)}
                </span>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md">
                  مورد در جریان
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                تحویل تجهیزات و ان‌بوردینگ با نرخ پیشرفت {toPersianDigits(checklistCompletionRate)}٪ در واحدهای عملیاتی
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-teal-700 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>پیگیری مراحل ان‌بوردینگ</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold">بدو خدمت</span>
            </div>
          </div>

          {/* Card 6: Payroll & Compensation */}
          <div
            onClick={() => isHR && onNavigate('payroll')}
            className={`bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3 ${
              isHR ? 'cursor-pointer group' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Wallet className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">حقوق و دستمزد ماه</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                  {isHR ? 'محاسبه شده' : 'محرمانه'}
                </span>
              </div>
              {isHR ? (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {typeof payrollTotal === 'number' && payrollTotal > 0
                        ? toPersianDigits((payrollTotal / 1_000_000_000).toFixed(2))
                        : toPersianDigits(42.5)}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      میلیارد تومان
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                    {toPersianDigits(finalizedSlipsCount)} فیش حقوقی صادرشده • محاسبه بیمه ۷٪ و مالیات
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-slate-500">فیش شخصی</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                    داده‌های کلان مالی صرفاً در دسترس مدیریت ارشد منابع انسانی است.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>{isHR ? 'احکام و صدور فیش‌ها' : 'مشاهده در پورتال پرسنلی'}</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold">قانون کار ۱۴۰۵</span>
            </div>
          </div>

          {/* Card 7: Training & Development */}
          <div
            onClick={() => onNavigate('training')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-violet-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-violet-50 text-violet-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">آموزش و توانمندسازی</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-100">
                  مهارت‌ها
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {toPersianDigits(activeCourses)}
                </span>
                <span className="text-xs font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded-md">
                  دوره فعال
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                {toPersianDigits(totalParticipants)} فراگیر در دوره‌های GMP، ایمنی کارخانه و مهارت‌های نرم
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-violet-700 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>تقویم آموزشی سازمان</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold">ماتریس مهارت</span>
            </div>
          </div>

          {/* Card 8: Performance & OKRs */}
          <div
            onClick={() => onNavigate('performance')}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">اهداف و عملکرد (OKR)</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-100">
                  فصلی
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {toPersianDigits(activeGoalsCount)}
                </span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md">
                  هدف فعال
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed">
                میانگین تحقق {toPersianDigits(avgGoalProgress)}٪ • ارزیابی ۳۶۰ درجه مدیران و پرسنل
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-rose-700 font-extrabold flex items-center gap-1 group-hover:underline">
                <span>مدیریت اهداف و تارگت‌ها</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold">دوره جاری</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Smart AI Feed & Actionable Insights */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>پیشنهادات و تحلیل هوشمند روزانه (Gemini HR Insights)</span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  زنده
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                سیستم به‌صورت خودکار داده‌های کانبان، تردد و شاخص‌ها را تحلیل کرده و پیشنهادات زیر را ارائه می‌دهد:
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-300 text-xs font-bold transition-all"
          >
            <span>جستجوی پیشرفته</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Insight 1 */}
          <div className="bg-white/5 border border-white/10 hover:border-emerald-400/40 rounded-2xl p-4 transition-all hover:bg-white/10 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>غربالگری رزومه‌ها</span>
                </span>
                <span className="text-[10px] text-slate-400">امروز</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {toPersianDigits(priorityCandidatesCount || 4)} کارجو با نمره بالای ۸ و تطابق عالی با شاخصه‌های GMP و آرایشی-بهداشتی آماده مصاحبه نهایی هستند.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('recruitment')}
              className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 pt-2 border-t border-white/10 cursor-pointer"
            >
              <span>مشاهده کارجویان برتر در کانبان</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Insight 2 */}
          <div className="bg-white/5 border border-white/10 hover:border-emerald-400/40 rounded-2xl p-4 transition-all hover:bg-white/10 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-300 flex items-center gap-1">
                  <Factory className="w-3.5 h-3.5" />
                  <span>تولید و خطوط اشتهارد</span>
                </span>
                <span className="text-[10px] text-slate-400">شیفت امروز</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                خط بسته‌بندی دافی با راندمان ۹۹٪ در حال فعالیت است. ۳ نفر از پرسنل شیفت شب درخواست جابجایی ثبت کرده‌اند.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('attendance')}
              className="mt-3 flex items-center justify-between text-xs font-bold text-sky-400 hover:text-sky-300 pt-2 border-t border-white/10 cursor-pointer"
            >
              <span>بررسی تردد و شیفت‌ها</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Insight 3 */}
          <div className="bg-white/5 border border-white/10 hover:border-emerald-400/40 rounded-2xl p-4 transition-all hover:bg-white/10 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>شاخص‌ها و وزن‌دهی AI</span>
                </span>
                <span className="text-[10px] text-slate-400">به‌روزرسانی</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                معیارهای وتویی موقعیت‌های شیمیست R&D و بازاریابی دارویی بر اساس استاندارد ۱۴۰۳ بازتنظیم شده است.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('recruitment')}
              className="mt-3 flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 pt-2 border-t border-white/10 cursor-pointer"
            >
              <span>تنظیم ماتریس شاخص‌ها</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. The 3-Click Navigation Grid: Access Any Module Instantly */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900">
            دسترسی مستقیم ۳-کلیکی به ماژول‌های سامانه
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            برای ورود سریع روی ماژول مورد نظر کلیک کنید
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-3">
          {[
            {
              key: 'recruitment' as ModuleKey,
              title: 'جذب و استخدام',
              desc: 'کانبان و هوش مصنوعی',
              icon: UserPlus,
              color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
            },
            {
              key: 'employees' as ModuleKey,
              title: 'پرونده پرسنلی',
              desc: 'احکام و چارت سازمانی',
              icon: Users,
              color: 'text-blue-700 bg-blue-50 hover:bg-blue-100 border-blue-200',
            },
            {
              key: 'attendance' as ModuleKey,
              title: 'تردد و مرخصی',
              desc: 'ورود/خروج و شیفت‌ها',
              icon: Clock,
              color: 'text-sky-700 bg-sky-50 hover:bg-sky-100 border-sky-200',
            },
            {
              key: 'payroll' as ModuleKey,
              title: 'حقوق و دستمزد',
              desc: 'فیش حقوقی و بیمه',
              icon: Wallet,
              color: 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200',
            },
            {
              key: 'performance' as ModuleKey,
              title: 'مدیریت عملکرد',
              desc: 'اهداف OKR و ارزیابی',
              icon: TrendingUp,
              color: 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
            },
            {
              key: 'training' as ModuleKey,
              title: 'آموزش و مهارت',
              desc: 'ماتریس شایستگی و دوره‌ها',
              icon: GraduationCap,
              color: 'text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200',
            },
            {
              key: 'checklists' as ModuleKey,
              title: 'ورود و خروج',
              desc: 'ان‌بوردینگ و تسویه',
              icon: CheckSquare,
              color: 'text-teal-700 bg-teal-50 hover:bg-teal-100 border-teal-200',
            },
            {
              key: 'analytics' as ModuleKey,
              title: 'گزارشات و KPI',
              desc: 'داشبورد تحلیلی ۳۶۰',
              icon: BarChart3,
              color: 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
                className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs group ${item.color}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-black text-slate-900 leading-tight">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1 leading-tight line-clamp-1">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
