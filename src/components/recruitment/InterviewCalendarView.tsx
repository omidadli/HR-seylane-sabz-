import React, { useState } from 'react';
import { Candidate, CandidateStage } from '../../types';
import { toPersianDigits, getTodayJalali, formatJalaliDate } from '../../utils/jalali';
import { JalaliDatePicker } from '../common/JalaliDatePicker';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Video,
  MapPin,
  Plus,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface InterviewCalendarViewProps {
  candidates: Candidate[];
  onScheduleInterview: (
    candidateId: string,
    interviewJalali: string,
    interviewType: string,
    notes?: string
  ) => void;
}

export const InterviewCalendarView: React.FC<InterviewCalendarViewProps> = ({
  candidates,
  onScheduleInterview,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || '');
  const [interviewDate, setInterviewDate] = useState(formatJalaliDate(getTodayJalali(), true));
  const [interviewTime, setInterviewTime] = useState('۱۰:۳۰');
  const [interviewType, setInterviewType] = useState('مصاحبه فنی حضوری');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Candidates that have an interview scheduled
  const scheduledList = candidates.filter((c) => c.interviewJalali);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateId) return;

    const fullScheduleStr = `${interviewDate} ساعت ${interviewTime}`;
    onScheduleInterview(selectedCandidateId, fullScheduleStr, interviewType, interviewNotes);
    setIsModalOpen(false);
    setInterviewNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">تقویم جلسات مصاحبه و ارزیابی شایستگی</h2>
          <p className="text-xs text-slate-500">
            برنامه‌ریزی جلسات ارزیابی با تقویم شمسی و ارسال یادآوری به داوطلبان
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تنظیم زمان مصاحبه جدید</span>
        </button>
      </div>

      {/* Scheduled interviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduledList.map((cand) => (
          <div
            key={cand.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div>
                <div className="font-bold text-sm text-slate-900">{cand.fullName}</div>
                <div className="text-xs text-slate-500">{cand.jobTitle}</div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                {cand.interviewType || 'مصاحبه فنی'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-purple-900 font-bold bg-purple-50/70 p-2 rounded-xl border border-purple-100">
                <Calendar className="w-4 h-4 text-purple-700 shrink-0" />
                <span>زمان جلسه: {cand.interviewJalali}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>تلفن تماس: {toPersianDigits(cand.phone)}</span>
              </div>

              {cand.interviewNotes && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-700 mb-0.5">یادداشت مصاحبه‌کننده:</div>
                  <p className="line-clamp-2">{cand.interviewNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>هماهنگ‌شده با کارجو</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  setSelectedCandidateId(cand.id);
                  setIsModalOpen(true);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
              >
                تغییر زمان
              </button>
            </div>
          </div>
        ))}

        {scheduledList.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center text-slate-500 text-xs">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>در حال حاضر هیچ مصاحبه‌ای زمان‌بندی نشده است.</p>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200 mb-4">
              برنامه‌ریزی جلسه مصاحبه استخدامی (تقویم جلالی)
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  انتخاب کارجو <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} - {c.jobTitle} (امتیاز: {toPersianDigits(c.overallScore || '-')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <JalaliDatePicker
                  label="تاریخ جلسه مصاحبه (شمسی)"
                  value={interviewDate}
                  onChange={(v) => setInterviewDate(v)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ساعت جلسه</label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع مصاحبه</label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="مصاحبه فنی حضوری">مصاحبه فنی حضوری</option>
                    <option value="مصاحبه تلفنی اولیه">مصاحبه تلفنی اولیه</option>
                    <option value="مصاحبه آنلاین ویدیویی">مصاحبه آنلاین ویدیویی</option>
                    <option value="مصاحبه منابع انسانی و فرهنگ سازمانی">منابع انسانی و فرهنگ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ملاحظات و اعضای پنل مصاحبه
                </label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="مثلاً: هماهنگی با مدیر تیم فرانت‌اند جهت ارزیابی معماری کد..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  ثبت قطعی در تقویم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
