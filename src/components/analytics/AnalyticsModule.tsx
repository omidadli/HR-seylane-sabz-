import React from 'react';
import { HRMetrics } from '../../types';
import { toPersianDigits, formatToman } from '../../utils/jalali';
import {
  BarChart3,
  TrendingDown,
  Clock,
  DollarSign,
  Users,
  Download,
  Award,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface AnalyticsModuleProps {
  metrics: HRMetrics;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({ metrics }) => {
  const handleExportData = () => {
    const jsonStr = JSON.stringify(metrics, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kara_HRMS_Analytics_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            داشبورد مدیریتی شاخص‌های کلیدی منابع انسانی (HR KPI Metrics)
          </h2>
          <p className="text-xs text-slate-500">
            پایش نرخ گردش شغلی، هزینه جذب، زمان پر کردن ردیف‌های شغلی و بازدهی سرمایه‌های انسانی
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportData}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>خروجی استاندارد شاخص‌ها (JSON/Excel)</span>
        </button>
      </div>

      {/* 4 Core Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Turnover Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>نرخ خروج پرسنل (Turnover)</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {toPersianDigits(metrics.turnoverRatePct)}٪
          </div>
          <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            ۲.۱٪ کمتر از میانگین صنعت IT
          </div>
        </div>

        {/* Time to Hire */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>میانگین زمان استخدام (Time to Hire)</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {toPersianDigits(metrics.averageTimeToHireDays)} روز
          </div>
          <div className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md inline-block">
            تسریع ۵۰٪ با هوش مصنوعی Gemini
          </div>
        </div>

        {/* Cost per Hire */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>میانگین هزینه هر جذب (Cost per Hire)</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {formatToman(metrics.costPerHireToman)}
          </div>
          <div className="text-[10px] text-slate-400">آگهی‌ها، پلتفرم‌ها و ساعات مصاحبه</div>
        </div>

        {/* Total Employees */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>تعداد پرسنل فعال (Headcount)</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {toPersianDigits(metrics.totalActiveEmployees)} نفر
          </div>
          <div className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            رشد ۱۲٪ در سال جاری
          </div>
        </div>
      </div>

      {/* Recruitment Funnel Breakdown */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">قیف جذب و استخدام (Recruitment Funnel)</h3>
          <span className="text-xs text-slate-500">دوره ۳ ماهه اخیر</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>۱. کل رزومه‌های دریافتی (ورودی قیف)</span>
              <span>۲۵۰ رزومه (۱۰۰٪)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>۲. احراز حد نصاب در غربالگری هوشمند Gemini (امتیاز بالای ۷)</span>
              <span>۶۵ رزومه (۲۶٪)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '26%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>۳. حضور در مصاحبه تخصصی و فنی</span>
              <span>۲۴ نفر (۹.۶٪)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-purple-500 h-3 rounded-full" style={{ width: '9.6%' }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>۴. استخدام نهایی و عقد قرارداد</span>
              <span>۸ نفر (۳.۲٪)</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-teal-600 h-3 rounded-full" style={{ width: '3.2%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
