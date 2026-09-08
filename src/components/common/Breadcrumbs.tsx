import React from 'react';
import {
  ChevronLeft,
  Home,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle,
} from 'lucide-react';
import { ModuleKey, canAccessModule } from './Sidebar';
import { UserRole } from '../../types';

interface BreadcrumbsProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  currentRole?: UserRole;
  isPwaPortalMode: boolean;
  onTogglePwaPortalMode: () => void;
}

const moduleTitles: Record<ModuleKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'پیشخوان هوشمند', subtitle: 'پایش لحظه‌ای و نمای ۳۶۰ درجه هلدینگ' },
  recruitment: { title: 'جذب و استخدام', subtitle: 'کانبان، رزومه‌ها، ارزیابی هوش مصنوعی و مصاحبه‌ها' },
  employees: { title: 'پرونده پرسنلی', subtitle: 'احکام کارگزینی، مشخصات همکاران و چارت سازمانی' },
  attendance: { title: 'تردد و مرخصی‌ها', subtitle: 'ثبت ورود/خروج کارخانجات اشتهارد و سقف ۲۶ روزه' },
  payroll: { title: 'حقوق و دستمزد', subtitle: 'صدور فیش بر مبنای بخشنامه سال، بیمه ۷٪ و مالیات پله‌ای' },
  performance: { title: 'مدیریت عملکرد', subtitle: 'اهداف فصلی OKR، ارزیابی شایستگی و بازخورد' },
  training: { title: 'آموزش و مهارت‌ها', subtitle: 'دوره‌های سازمانی، استانداردهای GMP و ماتریس مهارت' },
  checklists: { title: 'ورود و خروج همکاران', subtitle: 'چک‌لیست‌های ان‌بوردینگ و تسویه‌حساب مرحله‌ای' },
  analytics: { title: 'داشبورد و گزارشات', subtitle: 'شاخص‌های کلیدی منابع انسانی (HR KPI)' },
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  activeModule,
  onSelectModule,
  isPwaPortalMode,
  onTogglePwaPortalMode,
}) => {
  const current = moduleTitles[activeModule] || moduleTitles.dashboard;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-200/80">
      {/* Left: Breadcrumbs trail & current module title */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
          <button
            type="button"
            onClick={() => onSelectModule('dashboard')}
            className="flex items-center gap-1 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>سامانه سیلانه</span>
          </button>
          <ChevronLeft className="w-3 h-3 text-slate-300" />
          <span className="text-slate-700 font-bold">{current.title}</span>
        </nav>
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {current.title}
          </h2>
          <span className="text-[10px] text-slate-500 font-medium hidden md:inline">
            — {current.subtitle}
          </span>
        </div>
      </div>

      {/* Right: Mode Switcher (Enterprise Suite vs Factory PWA Portal) */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={onTogglePwaPortalMode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isPwaPortalMode
              ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
          }`}
          title="تغییر به نمای اختصاصی پرسنلی کارخانجات و موبایل"
        >
          {isPwaPortalMode ? (
            <>
              <Laptop className="w-3.5 h-3.5" />
              <span>بازگشت به نسخه جامع دسکتاپ</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>پورتال موبایل پرسنلی (PWA)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
