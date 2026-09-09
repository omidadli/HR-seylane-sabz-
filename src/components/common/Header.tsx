import React from 'react';
import { UserRole } from '../../types';
import { Briefcase, Search } from 'lucide-react';

interface HeaderProps {
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenJobGenerator?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-7 py-3 transition-all">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                سامانه منابع انسانی سیلانه سبز
              </h1>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 font-medium">
              سیستم هوشمند مدیریت سرمایه‌های انسانی و کارخانجات اشتهارد
            </p>
          </div>
        </div>

        {/* Center: Global 3-Click Command Palette Trigger */}
        {onOpenCommandPalette && (
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200 text-slate-500 text-xs font-medium transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                <span>جستجوی سریع در رزومه‌ها، فیش‌ها، بخش‌ها...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-white rounded border border-slate-200 shadow-2xs">
                  Ctrl
                </kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 bg-white rounded border border-slate-200 shadow-2xs">
                  K
                </kbd>
              </div>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
