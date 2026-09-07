import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../../types';
import { getTodayJalali, formatJalaliDateReadable, toPersianDigits } from '../../utils/jalali';
import {
  Shield,
  Calendar as CalendarIcon,
  Briefcase,
  Mic,
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenJobGenerator?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenVoiceAssistant,
  onOpenJobGenerator,
  onOpenCommandPalette,
}) => {
  const today = getTodayJalali();
  const dateStr = formatJalaliDateReadable(today);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: '1',
      title: 'رزومه جدید واجد شرایط برای R&D دافی',
      desc: 'کارجو سارا راد با امتیاز ۹.۲ از غربالگری هوش مصنوعی عبور کرد.',
      time: '۱۰ دقیقه پیش',
      icon: Sparkles,
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      id: '2',
      title: 'درخواست مرخصی استحقاقی پرسنل',
      desc: 'مهندس رضایی (تولید کامان) درخواست مرخصی ۲ روزه ثبت کرده است.',
      time: '۳۵ دقیقه پیش',
      icon: Clock,
      color: 'text-sky-700 bg-sky-50',
    },
    {
      id: '3',
      title: 'اتمام دوره آزمایشی ان‌بوردینگ',
      desc: 'چک‌لیست ۳۰ روزه ۴ همکار جدید واحد لجستیک کامل شد.',
      time: '۲ ساعت پیش',
      icon: UserCheck,
      color: 'text-amber-700 bg-amber-50',
    },
  ];

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
              <span className="hidden sm:inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                دافی • کامان • میس‌ویک • کاپوت
              </span>
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

        {/* Right Side: Quick AI Actions, Notifications, Persian Date, Role & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile search button */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="جستجوی سریع"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* AI Voice Assistant Trigger */}
          {onOpenVoiceAssistant && (
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs shadow-emerald-600/30 cursor-pointer transition-all transform active:scale-95"
              title="گفتگوی صوتی هوشمند با دستیار منابع انسانی"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span>دستیار صوتی</span>
            </button>
          )}

          {/* AI Job Ad Trigger */}
          {onOpenJobGenerator && (
            <button
              type="button"
              onClick={onOpenJobGenerator}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white font-bold text-xs shadow-2xs cursor-pointer transition-all border border-slate-800"
              title="تولید شرح شغل و آگهی استخدامی با هوش مصنوعی"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>تولید آگهی شغل</span>
            </button>
          )}

          {/* Jalali Date Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{dateStr}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (unreadCount > 0) setUnreadCount(0);
              }}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 transition-colors cursor-pointer"
              title="اعلانات سامانه"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-bounce">
                  {toPersianDigits(unreadCount)}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-[calc(100vw-32px)] max-w-sm sm:w-88 bg-white rounded-3xl shadow-xl border border-slate-200 p-3 z-50 text-right"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-900">مرکز اعلانات هوشمند</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      امروز
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className="flex items-start gap-2.5 p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${notif.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900 leading-tight">
                              {notif.title}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">
                              {notif.desc}
                            </div>
                            <div className="text-[9px] text-slate-400 mt-1 font-semibold">
                              {notif.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-slate-800 font-bold py-1.5 px-2.5 rounded-lg focus:outline-none cursor-pointer text-xs"
            >
              <option value={UserRole.HR_DIRECTOR}>مدیر ارشد منابع انسانی</option>
              <option value={UserRole.DEPT_MANAGER}>مدیر واحد دپارتمان</option>
              <option value={UserRole.EMPLOYEE}>کارمند همکار</option>
            </select>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-r border-slate-200 pr-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-2xs border border-emerald-900 shrink-0">
              کس
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
