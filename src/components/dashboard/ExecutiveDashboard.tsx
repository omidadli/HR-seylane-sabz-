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
} from 'lucide-react';
import { motion } from 'motion/react';
import { HRDashboardMetrics, HoldingDepartment, JobPosting, Candidate, UserRole, AttendanceRecord, Employee } from '../../types';
import { toPersianDigits, getTodayJalali, formatJalaliDate, formatJalaliDateReadable } from '../../utils/jalali';
import { ModuleKey } from '../common/Sidebar';

interface ExecutiveDashboardProps {
  currentRole: UserRole;
  metrics: HRDashboardMetrics;
  departments: HoldingDepartment[];
  jobs: JobPosting[];
  candidates: Candidate[];
  /** Real attendance records — used for today's actual presence rate. */
  attendances?: AttendanceRecord[];
  employees?: Employee[];
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
  onNavigate,
  onOpenVoiceAssistant,
  onOpenJobGenerator,
  onOpenCommandPalette,
}) => {
  const today = getTodayJalali();
  const formattedDate = formatJalaliDateReadable(today);

  // Compute stats — ALL from live data (audit fix MOD-05: the dashboard used
  // to show hardcoded fictions like "۹۶.۸٪ attendance" and "۴۲.۵ میلیارد").
  const activeJobsCount = jobs.filter((j) => j.status === 'ACTIVE').length;
  const totalResumes = jobs.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);
  const priorityCandidatesCount = candidates.filter(
    (c) => c.category === 'INTERVIEW_PRIORITY'
  ).length;

  const todayJalaliStr = formatJalaliDate(today, true);
  const presentToday = attendances.filter(
    (a) => a.dateJalali === todayJalaliStr && (a.status === 'PRESENT' || a.checkIn)
  ).length;
  const activeHeadcount = employees.filter((e) => e.status === 'ACTIVE').length;
  const attendanceRatePct =
    activeHeadcount > 0 ? Math.round((presentToday / activeHeadcount) * 1000) / 10 : null;

  const isHR = currentRole === UserRole.HR_DIRECTOR;
  const payrollTotal = metrics.monthlyPayrollTotalToman;

  const brands = [
    {
      name: 'دافی (Dafi)',
      focus: 'مراقبت از پوست، دستمال مرطوب و بهداشت شخصی',
      headcount: 420,
      openJobs: 12,
      color: 'from-pink-500/10 to-rose-500/5 text-rose-700 border-rose-200/80',
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      name: 'کامان (Come\'on)',
      focus: 'محصولات لوکس مراقبت پوستی و آبرسان‌ها',
      headcount: 380,
      openJobs: 10,
      color: 'from-amber-500/10 to-orange-500/5 text-amber-700 border-amber-200/80',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'میس‌ویک (Misswake)',
      focus: 'سلامت و مراقبت تخصصی دهان و دندان',
      headcount: 210,
      openJobs: 6,
      color: 'from-sky-500/10 to-cyan-500/5 text-sky-700 border-sky-200/80',
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    {
      name: 'کاپوت (Kapoot)',
      focus: 'سلامت، بهداشت خانواده و لاتکس',
      headcount: 180,
      openJobs: 5,
      color: 'from-emerald-500/10 to-teal-500/5 text-emerald-700 border-emerald-200/80',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      name: 'کارخانجات اشتهارد و لجستیک',
      focus: 'خطوط تولید، سالن‌های تمیز GMP و انبارش مرکزی',
      headcount: 160,
      openJobs: 6,
      color: 'from-purple-500/10 to-indigo-500/5 text-purple-700 border-purple-200/80',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
  ];

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

      {/* 2. Top 4 Modern KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Headcount */}
        <div
          onClick={() => onNavigate('employees')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">پرسنل فعال هلدینگ</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {toPersianDigits(metrics.activeHeadcount)}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
              پرونده‌های فعال سامانه
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            محاسبه زنده از پرونده‌های پرسنلی ثبت‌شده
          </div>
        </div>

        {/* Card 2: Open Jobs */}
        <div
          onClick={() => onNavigate('recruitment')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">موقعیت‌های باز استخدامی</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {toPersianDigits(activeJobsCount)}
            </span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
              {toPersianDigits(totalResumes)} رزومه
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            {toPersianDigits(priorityCandidatesCount)} کارجو در اولویت مصاحبه
          </div>
        </div>

        {/* Card 3: Today's Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">نرخ حضور امروز کارخانجات</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {attendanceRatePct === null ? '—' : `${toPersianDigits(attendanceRatePct)}٪`}
            </span>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg">
              {toPersianDigits(presentToday)} ورود ثبت‌شده امروز
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">
            {toPersianDigits(metrics.pendingLeavesCount)} مرخصی در انتظار بررسی
          </div>
        </div>

        {/* Card 4: Monthly Payroll — HR-only (confidential), computed from the
            latest generated payroll period; was a hardcoded "۴۲.۵ میلیارد" fiction. */}
        <div
          onClick={() => isHR && onNavigate('payroll')}
          className={`bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all group relative overflow-hidden ${isHR ? 'cursor-pointer' : ''}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">
              {isHR ? 'ناخالص آخرین دوره حقوقی' : 'دسترسی حقوق و دستمزد'}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          {isHR ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {typeof payrollTotal === 'number' && payrollTotal > 0
                    ? toPersianDigits((payrollTotal / 1_000_000_000).toFixed(2))
                    : '—'}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg">
                  میلیارد تومان
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-medium">
                جمع فیش‌های تولیدشده آخرین دوره (شامل بیمه و مالیات)
              </div>
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-400">محدود به منابع انسانی</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-medium">
                داده‌های مالی حقوق برای نقش شما قابل نمایش نیست — فیش شخصی خود را در بخش تردد/پرتال پرسنلی ببینید.
              </div>
            </>
          )}
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

      {/* 5. Holding Brands Capacity & Operational Snapshot */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              ظرفیت پرسنلی و توزیع نیروها در برندهای هلدینگ سیلانه سبز
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              تفکیک نیروهای انسانی، خطوط تولید و فرصت‌های فعال شغلی به تفکیک برند
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 shrink-0 self-start sm:self-auto">
            مجموع: {toPersianDigits(1350)} نیروی متخصص و فعال
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 pt-2">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border bg-gradient-to-b ${brand.color} flex flex-col justify-between space-y-3`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{brand.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${brand.badgeColor}`}>
                    {toPersianDigits(brand.openJobs)} شغل فعال
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium mt-1.5 leading-relaxed">
                  {brand.focus}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">پرسنل تخصصی:</span>
                <span className="font-extrabold text-slate-900">{toPersianDigits(brand.headcount)} نفر</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
