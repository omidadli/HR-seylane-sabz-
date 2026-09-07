/**
 * Shared Type Definitions for Iranian HRMS (سامانه جامع منابع انسانی سیلانه سبز)
 * Designed for full monorepo reusability (Web App + React Native / Expo Mobile APK)
 */

export enum UserRole {
  HR_DIRECTOR = 'HR_DIRECTOR',       // مدیر ارشد منابع انسانی
  DEPT_MANAGER = 'DEPT_MANAGER',     // مدیر واحد
  EMPLOYEE = 'EMPLOYEE'              // کارمند
}

export enum CandidateStage {
  INITIAL_SCREENING = 'INITIAL_SCREENING',     // بررسی اولیه
  PHONE_INTERVIEW = 'PHONE_INTERVIEW',         // مصاحبه تلفنی
  IN_PERSON_INTERVIEW = 'IN_PERSON_INTERVIEW', // مصاحبه حضوری / فنی
  OFFER = 'OFFER',                             // پیشنهاد همکاری
  HIRED = 'HIRED',                             // استخدام شده
  REJECTED = 'REJECTED'                        // رد شده
}

export enum CandidateCategory {
  INTERVIEW_PRIORITY = 'INTERVIEW_PRIORITY', // اولویت مصاحبه (نمره بالای ۷)
  NEEDS_REVIEW = 'NEEDS_REVIEW',             // نیازمند بررسی مدیر (نمره ۵ تا ۷)
  INITIAL_REJECTION = 'INITIAL_REJECTION'    // رد اولیه (نمره زیر ۵)
}

export enum LeaveType {
  ANNUAL = 'ANNUAL',       // مرخصی استحقاقی (۲۶ روز کاری سالانه)
  SICK = 'SICK',           // مرخصی استعلاجی
  HOURLY = 'HOURLY',       // مرخصی ساعتی
  UNPAID = 'UNPAID',       // مرخصی بدون حقوق
  MARRIAGE = 'MARRIAGE',   // مرخصی ازدواج (۳ روز)
  MATERNITY = 'MATERNITY'  // مرخصی زایمان
}

export enum LeaveStatus {
  PENDING_MANAGER = 'PENDING_MANAGER',
  PENDING_HR = 'PENDING_HR',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED',
  PAID = 'PAID'
}

// ---------------- Module 1 Types ----------------
export interface JobCriteria {
  id: string;
  title: string;
  weight: number; // 1 to 100
  description?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  employmentType: string;
  location: string;
  description: string;
  requirements: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  criteria: JobCriteria[];
  createdAtJalali: string;
  applicationsCount: number;
}

export interface EmailDraft {
  type: 'INVITATION' | 'REJECTION';
  subject: string;
  body: string;
  status: 'DRAFT_ONLY'; // Must NEVER auto send
  createdAtJalali: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  resumeFileName: string;
  resumeText: string;
  overallScore?: number; // 1 to 10
  category?: CandidateCategory;
  stage: CandidateStage;
  strengths: string[];
  weaknesses: string[];
  resumeQuotes: string[];
  criteriaScores?: Record<string, number>; // Criteria title -> score (1-10)
  inTalentPool: boolean;
  talentPoolNotes?: string;
  scheduledInterview?: string;
  interviewJalali?: string;
  interviewType?: string;
  interviewNotes?: string;
  emailDraft?: EmailDraft;
  appliedAtJalali: string;
}

// ---------------- Module 2 Types ----------------
export interface EmployeeDocument {
  id: string;
  title: string;
  fileType: string;
  fileUrl: string;
  uploadedAtJalali: string;
}

export interface JobHistoryItem {
  id: string;
  changeType: 'PROMOTION' | 'TRANSFER' | 'SALARY_CHANGE';
  previousTitle: string;
  newTitle: string;
  effectiveDateJalali: string;
  description: string;
}

export interface Employee {
  id: string;
  personnelCode: string;
  nationalId: string;
  fullName: string;
  fatherName?: string;
  birthDateJalali: string;
  phone: string;
  email: string;
  department: string;
  jobTitle: string;
  hireDateJalali: string;
  baseSalaryToman: number;
  maritalStatus: 'SINGLE' | 'MARRIED';
  childrenCount: number;
  bankIban: string;
  directManagerId?: string;
  status: 'ACTIVE' | 'RESIGNED' | 'ON_LEAVE';
  avatarUrl?: string;
  documents?: EmployeeDocument[];
  jobHistories?: JobHistoryItem[];
}

// ---------------- Module 3 Types ----------------
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName?: string;
  dateJalali: string;
  checkIn?: string;
  checkOut?: string;
  delayMinutes: number;
  overtimeHours: number;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE' | 'MISSION';
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveType: LeaveType;
  startDateJalali: string;
  endDateJalali: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  managerApproved?: boolean;
  hrApproved?: boolean;
  managerComment?: string;
  hrComment?: string;
  createdAtJalali: string;
}

// ---------------- Module 4 Types ----------------
export interface PayrollSlip {
  id: string;
  employeeId: string;
  employeeName?: string;
  personnelCode?: string;
  monthJalali: number;
  monthName: string;
  yearJalali: number;
  baseSalaryToman: number;
  housingAllowanceToman: number;
  bonKargariToman: number;
  childAllowanceToman: number;
  commuteAllowanceToman: number;
  overtimePayToman: number;
  grossSalaryToman: number;
  ssoInsurance7PctToman: number; // 7% social security
  incomeTaxToman: number;        // Iranian progressive tax brackets
  otherDeductionsToman: number;
  netSalaryToman: number;
  sanavatReserveToman: number;   // حق سنوات
  eidiReserveToman: number;      // پاداش و عیدی سالانه
  status: PayrollStatus;
  paidAtJalali?: string;
}

// ---------------- Module 5 Types ----------------
export interface PerformanceGoal {
  id: string;
  employeeId: string;
  employeeName?: string;
  title: string;
  targetMetric: string;
  currentProgress: number; // 0 - 100
  weight: number;
  deadlineJalali: string;
  score?: number;
}

// ---------------- Module 6 Types ----------------
export interface TrainingCourse {
  id: string;
  title: string;
  instructor: string;
  durationHours: number;
  department: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  participantsCount: number;
  completionRate: number;
}

export interface SkillMatrixItem {
  skillName: string;
  category: string;
  requiredLevel: number; // 1-5
  teamAverageLevel: number; // 1-5
}

// ---------------- Module 7 Types ----------------
export interface ChecklistItem {
  id: string;
  employeeId: string;
  employeeName?: string;
  type: 'ONBOARDING' | 'OFFBOARDING';
  title: string;
  department: string;
  dueDateJalali: string;
  isCompleted: boolean;
  completedAtJalali?: string;
}

// ---------------- Module 8 Types ----------------
export interface HRDashboardMetrics {
  turnoverRatePct: number;
  averageTimeToHireDays: number;
  costPerHireToman: number;
  activeHeadcount: number;
  openPositionsCount: number;
  pendingLeavesCount: number;
  monthlyPayrollTotalToman: number;
}

export interface HRMetrics {
  turnoverRatePct: number;
  averageTimeToHireDays: number;
  costPerHireToman: number;
  totalActiveEmployees: number;
}

// ---------------- AI Agent Types ----------------
export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  toolCall?: {
    name: string;
    args: any;
    result?: any;
  };
  suggestedActions?: string[];
  radarData?: {
    candidates: string[];
    criteria: string[];
    scores: Record<string, Record<string, number>>;
  };
  emailDraftPreview?: EmailDraft & { candidateName: string; candidateEmail: string };
}

// ---------------- Seilaneh Sabz Holding Types ----------------
export interface HoldingDepartment {
  id: string;
  name: string;
  englishName: string;
  category:
    | 'MANUFACTURING'
    | 'R_AND_D'
    | 'MARKETING'
    | 'SALES'
    | 'SUPPLY_CHAIN'
    | 'QUALITY'
    | 'HR'
    | 'FINANCE'
    | 'IT'
    | 'LEGAL';
  headName: string;
  headTitle: string;
  avatar: string;
  headcount: number;
  vacancies: number;
  brands: string[];
  location: string;
  kpiScore: number;
  pendingLeaves: number;
  activeProjects: string[];
  description: string;
  shiftType?: string;
  colorTheme?: string;
}

export interface JobAdGenerationRequest {
  jobTitle: string;
  departmentId: string;
  departmentName: string;
  seniority: 'کارآموز' | 'کارشناس' | 'کارشناس ارشد' | 'سرپرست' | 'مدیر';
  workType: 'تمام‌وقت' | 'پاره‌وقت' | 'پروژه‌ای' | 'شیفتی کارخانه';
  location: string;
  brandFocus?: string;
  keySkills: string;
  perks: string[];
  tone: 'حرفه‌ای و سازمانی' | 'پرانرژی و استارتاپی' | 'کاریزماتیک و الهام‌بخش';
}

export interface JobAdGenerationResult {
  jobTitle: string;
  departmentName: string;
  brandFocus?: string;
  jobDescriptionMarkdown: string;
  recruitmentAdSocial: string;
  interviewQuestions: string[];
  salaryBenchmarkToman: string;
  perksList: string[];
}

export interface VoiceCallMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTaken?: string;
  actionPayload?: any;
  audioGenerated?: boolean;
}

export interface HRAutomationTask {
  id: string;
  title: string;
  category: 'PAYROLL' | 'SCREENING' | 'CONTRACT' | 'LEAVES' | 'ONBOARDING' | 'ALERTS';
  description: string;
  estimatedTimeSaved: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED';
  lastRunJalali?: string;
  successCount?: number;
  badge: string;
}

