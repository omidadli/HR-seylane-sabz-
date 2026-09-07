import React, { useState } from 'react';
import { Candidate, CandidateStage } from '../../types';
import { toPersianDigits } from '../../utils/jalali';
import { Award, UserCheck, Search, Mail, ArrowRight, Star, FileText } from 'lucide-react';

interface TalentPoolViewProps {
  candidates: Candidate[];
  onReactivateCandidate: (candidateId: string) => void;
  onDraftEmail: (candidate: Candidate, type: 'INVITATION' | 'REJECTION') => void;
}

export const TalentPoolView: React.FC<TalentPoolViewProps> = ({
  candidates,
  onReactivateCandidate,
  onDraftEmail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const poolCandidates = candidates.filter((c) => c.inTalentPool);
  const filtered = poolCandidates.filter(
    (c) =>
      c.fullName.includes(searchTerm) ||
      (c.jobTitle ?? '').includes(searchTerm) ||
      (c.talentPoolNotes?.includes(searchTerm) ?? false)
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-amber-950">استخر نخبگان و استعدادهای آینده (Talent Pool)</h2>
            <p className="text-xs text-amber-800">
              رزومه‌های شایسته‌ای که در مصاحبه‌های قبلی حد نصاب را کسب کرده‌اند جهت موقعیت‌های توسعه‌ای آتی
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی نام یا مهارت..."
            className="w-full pr-9 pl-3 py-1.5 text-xs bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
          />
        </div>
      </div>

      {/* Grid of talent pool candidates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cand) => (
          <div
            key={cand.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div>
                <div className="font-bold text-sm text-slate-900">{cand.fullName}</div>
                <div className="text-xs text-slate-500">{cand.jobTitle}</div>
              </div>

              {cand.overallScore !== undefined && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{toPersianDigits(cand.overallScore)}</span>
                </div>
              )}
            </div>

            {/* Talent pool note */}
            <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900">
              <div className="font-bold text-[11px] mb-1">علت ذخیره در استخر:</div>
              <p className="leading-relaxed font-medium">
                {cand.talentPoolNotes || 'شایستگی فنی بالا در ابزارهای مدرن؛ مناسب برای پروژه‌های توسعه‌ای جدید.'}
              </p>
            </div>

            {/* Strengths tags */}
            {cand.strengths && cand.strengths.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {cand.strengths.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => onDraftEmail(cand, 'INVITATION')}
                className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ارسال دعوت مجدد</span>
              </button>

              <button
                type="button"
                onClick={() => onReactivateCandidate(cand.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>بازگشت به پایپ‌لاین</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-8 border border-dashed border-slate-200 text-center text-slate-500 text-xs">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p>موردی مطابق با جستجوی شما در استخر استعدادها یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
};
