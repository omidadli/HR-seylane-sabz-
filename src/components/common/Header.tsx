import React from 'react';
import { UserRole } from '../../types';
import { getTodayJalali, formatJalaliDateReadable, toPersianDigits } from '../../utils/jalali';
import { Shield, Calendar as CalendarIcon, Briefcase, Mic, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenJobGenerator?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenVoiceAssistant,
  onOpenJobGenerator,
}) => {
  const today = getTodayJalali();
  const dateStr = formatJalaliDateReadable(today);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
                سامانه منابع انسانی سیلانه سبز
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                دافی • کامان • میس‌ویک • کاپوت
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              سیستم جامع و هوشمند مدیریت سرمایه‌های انسانی هلدینگ سیلانه سبز
            </p>
          </div>
        </div>

        {/* Right Side: Quick AI Actions, Persian Date, Live Role Switcher, Profile */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
          {/* AI Voice Assistant Trigger */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 cursor-pointer transition-all transform active:scale-95"
              title="گفتگوی صوتی هوشمند با دستیار منابع انسانی"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>دستیار صوتی</span>
            </button>
          )}

          {/* AI Job Ad Trigger */}
          {onOpenJobGenerator && (
            <button
              onClick={onOpenJobGenerator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white font-bold text-xs shadow-sm cursor-pointer transition-all border border-slate-700"
              title="تولید شرح شغل و آگهی استخدامی با هوش مصنوعی"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>تولید آگهی استخدامی</span>
            </button>
          )}

          {/* Jalali Date Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>امروز: {dateStr}</span>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 px-2 flex items-center gap-1 font-medium">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>نقش:</span>
            </span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-white text-slate-800 font-bold py-1 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs text-xs"
            >
              <option value={UserRole.HR_DIRECTOR}>مدیر ارشد منابع انسانی (HR Director)</option>
              <option value={UserRole.DEPT_MANAGER}>مدیر واحد (Dept Manager)</option>
              <option value={UserRole.EMPLOYEE}>کارمند (Employee)</option>
            </select>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pr-2 border-r border-slate-200">
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800">مهندس کیوان سهرابی</div>
              <div className="text-[10px] text-slate-500 font-medium">کد: {toPersianDigits('۱۰۰۲۴')}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs border border-emerald-800">
              کس
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

