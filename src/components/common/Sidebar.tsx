import React from 'react';
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
} from 'lucide-react';

export type ModuleKey =
  | 'recruitment'
  | 'employees'
  | 'attendance'
  | 'payroll'
  | 'performance'
  | 'training'
  | 'checklists'
  | 'analytics';

interface SidebarProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
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
      key: 'recruitment',
      label: 'جذب و استخدام',
      description: 'رزومه‌ها، کانبان، هوش مصنوعی Gemini',
      icon: UserPlus,
      badge: 'هوشمند (AI)',
      isPrimary: true,
    },
    {
      key: 'employees',
      label: 'پرونده پرسنلی و چارت',
      description: 'مشخصات، احکام و ساختار سازمانی',
      icon: Users,
    },
    {
      key: 'attendance',
      label: 'تردد و مرخصی‌ها',
      description: 'ثبت ورود/خروج و سقف ۲۶ روزه',
      icon: Clock,
    },
    {
      key: 'payroll',
      label: 'حقوق و دستمزد',
      description: 'فیش حقوقی، بیمه ۷٪ و مالیات پله‌ای',
      icon: Wallet,
    },
    {
      key: 'performance',
      label: 'مدیریت عملکرد',
      description: 'اهداف OKR، شاخص‌ها و ارزیابی',
      icon: TrendingUp,
    },
    {
      key: 'training',
      label: 'آموزش و مهارت‌ها',
      description: 'دوره‌های سازمانی و ماتریس شایستگی',
      icon: GraduationCap,
    },
    {
      key: 'checklists',
      label: 'ورود و خروج همکاران',
      description: 'چک‌لیست‌های ان‌بوردینگ و تسویه‌حساب',
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
    <aside
      className={`w-72 bg-white border-l border-slate-200 shrink-0 min-h-[calc(100vh-65px)] flex flex-col justify-between p-3.5 transition-all ${
        isMobileOpen ? 'block' : 'hidden lg:flex'
      }`}
    >
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          ماژول‌های تخصصی سامانه
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;

          return (
            <button
              key={item.key}
              onClick={() => {
                onSelectModule(item.key);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-start gap-3 px-3.5 py-3 rounded-xl text-right transition-all group relative ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-emerald-700'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-sm truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                        isActive
                          ? 'bg-emerald-800 text-emerald-100'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      {item.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] mt-0.5 line-clamp-1 ${
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

      {/* Footer Banner */}
      <div className="mt-6 p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/80 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-emerald-800 mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>پشتیبانی قانون کار ۱۴۰۳</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          محاسبات مرخصی سالانه (۲۶ روز کاری)، بن کارگری، حق مسکن، بیمه تامین اجتماعی و عیدی به روز می‌باشد.
        </p>
      </div>
    </aside>
  );
};
