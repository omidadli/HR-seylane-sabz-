import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  UserPlus,
  Users,
  Clock,
  Wallet,
  TrendingUp,
  GraduationCap,
  CheckSquare,
  BarChart3,
  Mic,
  Sparkles,
  Briefcase,
  Building2,
  SlidersHorizontal,
  ChevronLeft,
  ArrowRight,
  Command as CommandIcon,
  CornerDownLeft,
  Video,
  Network,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleKey } from './Sidebar';
import { JobPosting, Candidate } from '../../types';
import { toPersianDigits } from '../../utils/jalali';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: ModuleKey) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenJobGenerator?: () => void;
  jobs?: JobPosting[];
  candidates?: Candidate[];
  onSelectJob?: (jobId: string) => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'اقدامات سریع و هوش مصنوعی' | 'بخش‌های اصلی سامانه' | 'موقعیت‌های شغلی' | 'کارجویان و رزومه‌ها' | 'برندها و مراکز';
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  onOpenVoiceAssistant,
  onOpenJobGenerator,
  jobs = [],
  candidates = [],
  onSelectJob,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered from parent or event
          window.dispatchEvent(new CustomEvent('open-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Construct items
  const allItems: CommandItem[] = useMemo(() => {
    const items: CommandItem[] = [
      // Quick AI & System Actions
      {
        id: 'action-voice',
        title: 'گفتگوی صوتی هوشمند با دستیار منابع انسانی',
        subtitle: 'پرسش درباره قوانین، گزارش کارخانه، صدور حقوق و استخدام',
        category: 'اقدامات سریع و هوش مصنوعی',
        icon: Mic,
        badge: 'هوش مصنوعی Gemini',
        action: () => {
          onClose();
          if (onOpenVoiceAssistant) onOpenVoiceAssistant();
        },
      },
      {
        id: 'action-job-generator',
        title: 'تولید هوشمند شرح شغل و آگهی استخدام',
        subtitle: 'نگارش مارک‌داون رسمی و پست شبکه‌های اجتماعی برای هلدینگ سیلانه سبز',
        category: 'اقدامات سریع و هوش مصنوعی',
        icon: Sparkles,
        badge: 'تولید محتوا AI',
        action: () => {
          onClose();
          if (onOpenJobGenerator) onOpenJobGenerator();
        },
      },
      {
        id: 'action-criteria-matrix',
        title: 'ماتریس شاخص‌ها و وزن‌دهی ارزیابی هوش مصنوعی',
        subtitle: 'تنظیم معیارهای وتویی، حداقل نمرات و دستورالعمل مدیر برای استخدام',
        category: 'اقدامات سریع و هوش مصنوعی',
        icon: SlidersHorizontal,
        badge: 'ماتریس ارزیابی',
        action: () => {
          onClose();
          onSelectModule('recruitment');
        },
      },
      {
        id: 'action-hirevue-video',
        title: 'استودیوی هوشمند مصاحبه ویدیویی (HireVue AI Studio)',
        subtitle: 'مصاحبه غیرهمزمان، آزمون صلاحیت رفتاری و ارزیابی عادلانه بدون سوگیری',
        category: 'اقدامات سریع و هوش مصنوعی',
        icon: Video,
        badge: 'HireVue AI',
        action: () => {
          onClose();
          onSelectModule('recruitment');
        },
      },
      {
        id: 'action-eightfold-skills',
        title: 'گراف مهارت‌ها و جابجایی داخلی استعدادها (Eightfold AI)',
        subtitle: 'شناسایی مهارت‌های مجاور ۳۰ روزه و ترفیع کارمندان دافی، کامان، میس‌ویک و کاپوت',
        category: 'اقدامات سریع و هوش مصنوعی',
        icon: Network,
        badge: 'Eightfold AI',
        action: () => {
          onClose();
          onSelectModule('recruitment');
        },
      },
      {
        id: 'action-ziprecruiter-sourcing',
        title: 'سورسینگ هوشمند و انتشار همزمان آگهی (ZipRecruiter Smart)',
        subtitle: 'شکار استعدادهای برتر، دعوت با ۱ کلیک و انتشار در جابینجا، جاب‌ویژن و لینکدین',
        category: 'اقدامات سریع و هوش مصنوعی',
        icon: Zap,
        badge: 'ZipRecruiter',
        action: () => {
          onClose();
          onSelectModule('recruitment');
        },
      },

      // Navigation Modules
      {
        id: 'nav-recruitment',
        title: 'جذب و استخدام (کانبان و غربالگری هوشمند)',
        subtitle: 'مدیریت رزومه‌ها، ارزیابی چندبعدی هوش مصنوعی و مصاحبه‌ها',
        category: 'بخش‌های اصلی سامانه',
        icon: UserPlus,
        action: () => {
          onClose();
          onSelectModule('recruitment');
        },
      },
      {
        id: 'nav-employees',
        title: 'پرونده پرسنلی و چارت سازمانی',
        subtitle: 'مشخصات کارکنان، قراردادها و ساختار سازمانی برندها',
        category: 'بخش‌های اصلی سامانه',
        icon: Users,
        action: () => {
          onClose();
          onSelectModule('employees');
        },
      },
      {
        id: 'nav-attendance',
        title: 'مدیریت تردد، مرخصی و شیفت‌های کاری',
        subtitle: 'ثبت حضور و غیاب، مرخصی استحقاقی و تردد کارخانجات اشتهارد',
        category: 'بخش‌های اصلی سامانه',
        icon: Clock,
        action: () => {
          onClose();
          onSelectModule('attendance');
        },
      },
      {
        id: 'nav-payroll',
        title: 'حقوق، دستمزد و فیش‌های پرسنلی',
        subtitle: 'محاسبه مکانیزه حقوق، بیمه ۷٪ تأمین اجتماعی و مالیات پله‌ای ۱۴۰۳',
        category: 'بخش‌های اصلی سامانه',
        icon: Wallet,
        action: () => {
          onClose();
          onSelectModule('payroll');
        },
      },
      {
        id: 'nav-performance',
        title: 'مدیریت عملکرد و اهداف سازمانی (OKR)',
        subtitle: 'تعریف اهداف فصلی، شاخص‌های کلیدی عملکرد و ارزیابی شایستگی',
        category: 'بخش‌های اصلی سامانه',
        icon: TrendingUp,
        action: () => {
          onClose();
          onSelectModule('performance');
        },
      },
      {
        id: 'nav-training',
        title: 'آموزش سازمانی و ماتریس مهارت‌ها',
        subtitle: 'دوره‌های تخصصی، استانداردهای GMP و توسعه فردی همکاران',
        category: 'بخش‌های اصلی سامانه',
        icon: GraduationCap,
        action: () => {
          onClose();
          onSelectModule('training');
        },
      },
      {
        id: 'nav-checklists',
        title: 'چک‌لیست‌های ان‌بوردینگ و آف‌بوردینگ',
        subtitle: 'فرآیند ورود نیروهای جدید و تسویه‌حساب مرحله‌ای',
        category: 'بخش‌های اصلی سامانه',
        icon: CheckSquare,
        action: () => {
          onClose();
          onSelectModule('checklists');
        },
      },
      {
        id: 'nav-analytics',
        title: 'داشبورد تحلیل‌ها و شاخص‌های کلیدی (HR KPI)',
        subtitle: 'نرخ گردش، زمان پر شدن موقعیت‌ها، هزینه‌های جذب و گزارشات آماری',
        category: 'بخش‌های اصلی سامانه',
        icon: BarChart3,
        action: () => {
          onClose();
          onSelectModule('analytics');
        },
      },

      // Brands & Facilities
      {
        id: 'brand-dafi',
        title: 'برند دافی (Dafi)',
        subtitle: 'تولید تخصصی دستمال مرطوب و مراقبت از پوست • ۴۲۰ پرسنل فعال',
        category: 'برندها و مراکز',
        icon: Building2,
        badge: 'برند هلدینگ',
        action: () => {
          onClose();
          onSelectModule('employees');
        },
      },
      {
        id: 'brand-comeon',
        title: 'برند کامان (Come\'on)',
        subtitle: 'محصولات لوکس مراقبت پوستی و آرایشی • ۳۸۰ پرسنل فعال',
        category: 'برندها و مراکز',
        icon: Building2,
        badge: 'برند هلدینگ',
        action: () => {
          onClose();
          onSelectModule('employees');
        },
      },
      {
        id: 'brand-factory',
        title: 'مجموعه کارخانجات تولیدی اشتهارد',
        subtitle: 'خطوط تولید دافی و کامان، سالن‌های تمیز (Clean Room) و انبار مرکزی',
        category: 'برندها و مراکز',
        icon: Building2,
        badge: 'سایت تولیدی',
        action: () => {
          onClose();
          onSelectModule('attendance');
        },
      },
    ];

    // Add Job Postings
    jobs.forEach((job) => {
      items.push({
        id: `job-${job.id}`,
        title: job.title,
        subtitle: `${job.department} • ${toPersianDigits(job.applicationsCount)} رزومه دریافت شده`,
        category: 'موقعیت‌های شغلی',
        icon: Briefcase,
        badge: job.status === 'ACTIVE' ? 'فعال' : 'بایگانی',
        action: () => {
          onClose();
          if (onSelectJob) onSelectJob(job.id);
          onSelectModule('recruitment');
        },
      });
    });

    // Add Top Candidates
    candidates.forEach((cand) => {
      items.push({
        id: `cand-${cand.id}`,
        title: `${cand.fullName} — ${cand.jobTitle || 'متقاضی شغلی'}`,
        subtitle: `امتیاز کل هوش مصنوعی: ${toPersianDigits(cand.overallScore ?? '—')} از ۱۰ • تاریخ ثبت: ${toPersianDigits(cand.appliedAtJalali || 'امروز')}`,
        category: 'کارجویان و رزومه‌ها',
        icon: Users,
        badge:
          cand.category === 'INTERVIEW_PRIORITY'
            ? 'اولویت مصاحبه'
            : cand.category === 'NEEDS_REVIEW'
            ? 'نیازمند بررسی'
            : 'رد اولیه',
        action: () => {
          onClose();
          onSelectModule('recruitment');
        },
      });
    });

    return items;
  }, [jobs, candidates, onClose, onSelectModule, onOpenVoiceAssistant, onOpenJobGenerator, onSelectJob]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 15);
    const q = query.toLowerCase().trim();
    return allItems
      .filter((item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [allItems, query]);

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <Search className="w-5 h-5 text-emerald-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="جستجو در تمام بخش‌ها، رزومه‌ها، مشاغل، فیش‌ها و اقدامات هوش مصنوعی..."
              className="w-full bg-transparent border-none text-slate-800 text-sm font-semibold placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-slate-400 bg-white border border-slate-200 rounded-lg shadow-2xs">
              ESC
            </kbd>
          </div>

          {/* List of Results */}
          <div className="overflow-y-auto p-2.5 flex-1 divide-y divide-slate-100/60">
            {filteredItems.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-xs">
                موردی برای جستجوی شما یافت نشد. می‌توانید با جستجوی واژگانی مانند «استخدام»، «حقوق»، «مرخصی»، یا نام کارجویان جستجو کنید.
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-right flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-950 shadow-xs border border-emerald-200/70'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pr-3">
                      <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                        {item.category}
                      </span>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-lg">
                          <span>انتخاب</span>
                          <CornerDownLeft className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer with Shortcuts */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">↑↓</kbd>
                <span>پیمایش</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Enter</kbd>
                <span>انتخاب فوری</span>
              </span>
            </div>
            <div className="text-emerald-700 font-bold">
              دسترسی ۳-کلیکی سامانه منابع انسانی سیلانه سبز
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
