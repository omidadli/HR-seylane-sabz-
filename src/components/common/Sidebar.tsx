import React from 'react';
import { UserRole } from '../../types';
import {
  Users,
  UserPlus,
  Clock,
  Wallet,
  TrendingUp,
  GraduationCap,
  CheckSquare,
  BarChart3,
  Sparkles,
  LayoutDashboard,
  X,
  Bot,
  Building2,
  Lock,
} from 'lucide-react';

export type ModuleKey =
  | 'dashboard'
  | 'recruitment'
  | 'employees'
  | 'attendance'
  | 'payroll'
  | 'performance'
  | 'training'
  | 'checklists'
  | 'analytics';

/**
 * Role-based module visibility (audit fix SEC-02). Payroll data is
 * HR-confidential, company-wide analytics too; recruitment is limited to HR
 * and hiring managers. The API enforces the same rules server-side — this map
 * only keeps the navigation honest about what the role can actually open.
 */
export const MODULE_ACCESS: Record<ModuleKey, UserRole[]> = {
  dashboard: [UserRole.HR_DIRECTOR, UserRole.DEPT_MANAGER, UserRole.EMPLOYEE],
  recruitment: [UserRole.HR_DIRECTOR, UserRole.DEPT_MANAGER],
  employees: [UserRole.HR_DIRECTOR, UserRole.DEPT_MANAGER, UserRole.EMPLOYEE],
  attendance: [UserRole.HR_DIRECTOR, UserRole.DEPT_MANAGER, UserRole.EMPLOYEE],
  payroll: [UserRole.HR_DIRECTOR],
  performance: [UserRole.HR_DIRECTOR, UserRole.DEPT_MANAGER, UserRole.EMPLOYEE],
  training: [UserRole.HR_DIRECTOR, UserRole.DEPT_MANAGER, UserRole.EMPLOYEE],
  checklists: [UserRole.HR_DIRECTOR, UserRole.DEPT_MANAGER, UserRole.EMPLOYEE],
  analytics: [UserRole.HR_DIRECTOR],
};

export const canAccessModule = (role: UserRole, module: ModuleKey): boolean =>
  MODULE_ACCESS[module]?.includes(role) ?? false;

interface SidebarProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  currentRole?: UserRole;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  currentRole = UserRole.HR_DIRECTOR,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const menuItems: {
    key: ModuleKey;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
    isPrimary?: boolean;
  }[] = [
    {
      key: 'dashboard',
      label: 'پیشخوان هوشمند',
      description: 'نمای ۳۶۰ درجه و پایش لحظه‌ای هلدینگ',
      icon: LayoutDashboard,
      badge: 'مرکزی',
      isPrimary: true,
    },
    {
      key: 'recruitment',
      label: 'جذب و استخدام',
      description: 'کانبان، رزومه‌ها، ارزیابی چندبعدی هوش مصنوعی',
      icon: UserPlus,
      badge: 'هوشمند (AI)',
    },
    {
      key: 'employees',
      label: 'پرونده پرسنلی و چارت',
      description: 'مشخصات، احکام و ساختار سازمانی برندها',
      icon: Users,
    },
    {
      key: 'attendance',
      label: 'تردد و مرخصی‌ها',
      description: 'ثبت ورود/خروج کارخانجات اشتهارد و سقف ۲۶ روزه',
      icon: Clock,
    },
    {
      key: 'payroll',
      label: 'حقوق و دستمزد',
      description: 'فیش حقوقی بر مبنای بخشنامه سال، بیمه ۷٪ و مالیات پله‌ای',
      icon: Wallet,
    },
    {
      key: 'performance',
      label: 'مدیریت عملکرد',
      description: 'اهداف OKR، شاخص‌ها و ارزیابی شایستگی',
      icon: TrendingUp,
    },
    {
      key: 'training',
      label: 'آموزش و مهارت‌ها',
      description: 'دوره‌های سازمانی، استانداردهای GMP و ماتریس مهارت',
      icon: GraduationCap,
    },
    {
      key: 'checklists',
      label: 'ورود و خروج همکاران',
      description: 'چک‌لیست‌های ان‌بوردینگ و تسویه‌حساب مرحله‌ای',
      icon: CheckSquare,
    },
    {
      key: 'analytics',
      label: 'داشبورد و گزارشات',
      description: 'شاخص‌های کلیدی منابع انسانی (HR KPI)',
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 right-0 bottom-0 z-50 w-72 bg-white border-l border-slate-200/90 shrink-0 min-h-[calc(100vh-65px)] flex flex-col justify-between p-3.5 transition-all duration-200 shadow-xl lg:shadow-none ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          {/* Mobile Header Inside Drawer */}
          <div className="flex items-center justify-between px-3 py-2 lg:hidden border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xs">
                سیلانه
              </div>
              <span className="text-xs font-black text-slate-800">منوی ماژول‌های سامانه</span>
            </div>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            ماژول‌های تخصصی هلدینگ سیلانه سبز
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.key;
            const allowed = canAccessModule(currentRole, item.key);

            return (
              <button
                key={item.key}
                type="button"
                disabled={!allowed}
                title={allowed ? undefined : 'دسترسی این بخش برای نقش کاربری شما محدود است'}
                onClick={() => {
                  if (!allowed) return;
                  onSelectModule(item.key);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-start gap-3 px-3.5 py-2.5 rounded-2xl text-right transition-all group relative ${
                  !allowed
                    ? 'opacity-45 cursor-not-allowed text-slate-500'
                    : isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20 cursor-pointer'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 font-medium cursor-pointer'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 mt-0.5 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-emerald-700 shadow-2xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-xs font-extrabold truncate flex items-center gap-1">
                      {item.label}
                      {!allowed && <Lock className="w-3 h-3 shrink-0" />}
                    </span>
                    {item.badge && allowed && (
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                          isActive
                            ? 'bg-emerald-800 text-emerald-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      isActive ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Brand & Regulatory Badge */}
        <div className="mt-4 p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl border border-emerald-200/70 text-xs text-slate-700">
          <div className="flex items-center justify-between font-extrabold text-emerald-900 mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>هلدینگ سیلانه سبز</span>
            </span>
            <span className="text-[9px] bg-emerald-200/70 px-1.5 py-0.5 rounded text-emerald-950">
              قانون کار ۱۴۰۳
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            پایش یکپارچه کارخانجات تولیدی اشتهارد، دفاتر وزرا و برندهای دافی، کامان، میس‌ویک و کاپوت.
          </p>
        </div>
      </aside>
    </>
  );
};
