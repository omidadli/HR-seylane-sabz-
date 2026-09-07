import React, { useState, useRef, useEffect } from 'react';
import {
  JalaliDate,
  getTodayJalali,
  getJalaliMonthDays,
  getJalaliMonthStartWeekday,
  JALALI_MONTH_NAMES,
  JALALI_WEEK_DAYS,
  toPersianDigits,
  formatJalaliDate,
} from '../../utils/jalali';
import { Calendar, ChevronRight, ChevronLeft, X, RotateCcw } from 'lucide-react';

interface JalaliDatePickerProps {
  value?: string; // Standard format like "1403/06/15" or "۱۴۰۳/۰۶/۱۵"
  onChange: (jalaliStr: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const JalaliDatePicker: React.FC<JalaliDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'انتخاب تاریخ شمسی...',
  required = false,
  disabled = false,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const today = getTodayJalali();

  // Parse initial view year and month
  const parseVal = (): JalaliDate => {
    if (value) {
      // Remove any non-digit chars except slash
      const clean = value.replace(/[۰-۹]/g, (d) =>
        String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
      );
      const parts = clean.split(/[-/]/);
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return { year: y, month: m, day: d };
        }
      }
    }
    return today;
  };

  const selectedDate = value ? parseVal() : null;
  const [viewYear, setViewYear] = useState<number>(selectedDate?.year || today.year);
  const [viewMonth, setViewMonth] = useState<number>(selectedDate?.month || today.month);

  useEffect(() => {
    if (value) {
      const p = parseVal();
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const daysInMonth = getJalaliMonthDays(viewYear, viewMonth);
  const startWeekday = getJalaliMonthStartWeekday(viewYear, viewMonth); // 0 = Shanbeh

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewYear(viewYear - 1);
      setViewMonth(12);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewYear(viewYear + 1);
      setViewMonth(1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const chosen: JalaliDate = { year: viewYear, month: viewMonth, day };
    onChange(formatJalaliDate(chosen, true));
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    setViewYear(today.year);
    setViewMonth(today.month);
    onChange(formatJalaliDate(today, true));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Input button */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl shadow-xs transition-all cursor-pointer ${
          disabled
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
            : isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-500/10'
            : 'border-slate-300 hover:border-slate-400 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className={value ? 'font-medium text-slate-800' : 'text-slate-400'}>
            {value ? toPersianDigits(value) : placeholder}
          </span>
        </div>

        {value && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            title="پاک کردن"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
        )}
      </div>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-xl w-76 right-0 sm:right-auto sm:left-0 sm:origin-top-left animate-in fade-in zoom-in-95 duration-150">
          {/* Header Month / Year controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="ماه قبل"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>{JALALI_MONTH_NAMES[viewMonth - 1]}</span>
              <span className="text-emerald-700">{toPersianDigits(viewYear)}</span>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="ماه بعد"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
            {JALALI_WEEK_DAYS.map((wd) => (
              <div key={wd.key} className="py-1" title={wd.name}>
                {wd.short}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Empty slots for month start offset */}
            {Array.from({ length: startWeekday }).map((_, i) => (
              <div key={`empty-${i}`} className="py-2" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const isSelected =
                selectedDate &&
                selectedDate.year === viewYear &&
                selectedDate.month === viewMonth &&
                selectedDate.day === dayNum;
              const isCurrentDay =
                today.year === viewYear &&
                today.month === viewMonth &&
                today.day === dayNum;

              return (
                <button
                  type="button"
                  key={dayNum}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`py-2 rounded-xl font-medium transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : isCurrentDay
                      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-300'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {toPersianDigits(dayNum)}
                </button>
              );
            })}
          </div>

          {/* Footer with Today shortcut */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSelectToday}
              className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-medium py-1 px-2 rounded-md hover:bg-emerald-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>برو به امروز ({toPersianDigits(today.day)} {JALALI_MONTH_NAMES[today.month - 1]})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
