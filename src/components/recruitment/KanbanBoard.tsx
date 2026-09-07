import React, { useState } from 'react';
import { Candidate, CandidateStage, CandidateCategory } from '../../types';
import { toPersianDigits } from '../../utils/jalali';
import {
  FileText,
  Phone,
  Calendar,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Quote,
  Star,
  UserCheck,
  UserX,
  Mail,
} from 'lucide-react';

interface KanbanBoardProps {
  candidates: Candidate[];
  onMoveStage: (candidateId: string, nextStage: CandidateStage) => void;
  onScheduleInterview: (candidate: Candidate) => void;
  onDraftEmail: (candidate: Candidate, type: 'INVITATION' | 'REJECTION') => void;
  onToggleTalentPool: (candidateId: string, inPool: boolean) => void;
  onSelectCompare: (candidate: Candidate) => void;
  selectedCompareIds: string[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  candidates,
  onMoveStage,
  onScheduleInterview,
  onDraftEmail,
  onToggleTalentPool,
  onSelectCompare,
  selectedCompareIds,
}) => {
  const [selectedCandidateForDetails, setSelectedCandidateForDetails] = useState<Candidate | null>(null);

  const stages: { key: CandidateStage; title: string; color: string; icon: React.ElementType }[] = [
    { key: CandidateStage.INITIAL_SCREENING, title: 'بررسی اولیه', color: 'border-blue-400 bg-blue-50/50', icon: Clock },
    { key: CandidateStage.PHONE_INTERVIEW, title: 'مصاحبه تلفنی', color: 'border-amber-400 bg-amber-50/50', icon: Phone },
    { key: CandidateStage.IN_PERSON_INTERVIEW, title: 'مصاحبه حضوری/فنی', color: 'border-purple-400 bg-purple-50/50', icon: Calendar },
    { key: CandidateStage.OFFER, title: 'پیشنهاد همکاری (آفر)', color: 'border-teal-400 bg-teal-50/50', icon: Award },
    { key: CandidateStage.HIRED, title: 'استخدام شده', color: 'border-emerald-500 bg-emerald-50/50', icon: CheckCircle2 },
    { key: CandidateStage.REJECTED, title: 'رد شده', color: 'border-rose-400 bg-rose-50/50', icon: XCircle },
  ];

  const getCategoryBadge = (category?: CandidateCategory) => {
    switch (category) {
      case CandidateCategory.INTERVIEW_PRIORITY:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            اولویت مصاحبه (+۷)
          </span>
        );
      case CandidateCategory.NEEDS_REVIEW:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
            نیازمند بررسی (۵-۷)
          </span>
        );
      case CandidateCategory.INITIAL_REJECTION:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
            رد اولیه (&lt;۵)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Kanban Columns horizontal scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {stages.map((stg) => {
          const Icon = stg.icon;
          const stageCandidates = candidates.filter((c) => c.stage === stg.key);

          return (
            <div
              key={stg.key}
              className={`rounded-2xl border-t-4 bg-slate-50/80 border p-3 min-h-[480px] flex flex-col shadow-2xs ${stg.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-900">{stg.title}</span>
                </div>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {toPersianDigits(stageCandidates.length)}
                </span>
              </div>

              {/* Candidates List in Column */}
              <div className="space-y-2.5 flex-1">
                {stageCandidates.map((cand) => {
                  const isSelectedForCompare = selectedCompareIds.includes(cand.id);

                  return (
                    <div
                      key={cand.id}
                      className={`bg-white rounded-xl p-3 border shadow-xs transition-all hover:shadow-md relative ${
                        isSelectedForCompare
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top row: Name & Score */}
                      <div className="flex items-start justify-between gap-1.5 mb-1.5">
                        <div className="font-bold text-xs text-slate-900 line-clamp-1">{cand.fullName}</div>
                        {cand.overallScore !== undefined && (
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold shrink-0">
                            <Star className="w-3 h-3 text-emerald-600 fill-emerald-500" />
                            <span>{toPersianDigits(cand.overallScore)}</span>
                          </div>
                        )}
                      </div>

                      {/* Job Title & Category */}
                      <div className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                        {cand.jobTitle || 'کارشناس تخصصی'}
                      </div>

                      <div className="mb-2">{getCategoryBadge(cand.category)}</div>

                      {/* Evidence quote preview */}
                      {cand.resumeQuotes && cand.resumeQuotes.length > 0 && (
                        <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-2 italic line-clamp-2">
                          {cand.resumeQuotes[0]}
                        </div>
                      )}

                      {/* Scheduled interview badge if set */}
                      {cand.interviewJalali && (
                        <div className="text-[10px] font-medium text-purple-800 bg-purple-50 px-2 py-1 rounded-md border border-purple-200 mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-600 shrink-0" />
                          <span className="truncate">{cand.interviewJalali}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidateForDetails(cand)}
                          className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                        >
                          مشاهده شواهد
                        </button>

                        <div className="flex items-center gap-1">
                          {/* Add to compare toggle */}
                          <button
                            type="button"
                            onClick={() => onSelectCompare(cand)}
                            className={`p-1 rounded-md transition-colors ${
                              isSelectedForCompare
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title="انتخاب جهت مقایسه رادار"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>

                          {/* Schedule interview */}
                          <button
                            type="button"
                            onClick={() => onScheduleInterview(cand)}
                            className="p-1 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                            title="تنظیم جلسه مصاحبه"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>

                          {/* Draft email */}
                          <button
                            type="button"
                            onClick={() =>
                              onDraftEmail(
                                cand,
                                cand.category === CandidateCategory.INITIAL_REJECTION ? 'REJECTION' : 'INVITATION'
                              )
                            }
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="تنظیم پیش‌نویس ایمیل"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Stage transition arrows */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        {stg.key !== CandidateStage.INITIAL_SCREENING ? (
                          <button
                            type="button"
                            onClick={() => {
                              const currIdx = stages.findIndex((s) => s.key === stg.key);
                              if (currIdx > 0) onMoveStage(cand.id, stages[currIdx - 1].key);
                            }}
                            className="flex items-center gap-0.5 text-slate-500 hover:text-slate-900"
                          >
                            <ArrowRight className="w-3 h-3" />
                            <span>مرحله قبل</span>
                          </button>
                        ) : <span />}

                        {stg.key !== CandidateStage.REJECTED && stg.key !== CandidateStage.HIRED && (
                          <button
                            type="button"
                            onClick={() => {
                              const currIdx = stages.findIndex((s) => s.key === stg.key);
                              if (currIdx < stages.length - 2) onMoveStage(cand.id, stages[currIdx + 1].key);
                            }}
                            className="flex items-center gap-0.5 text-emerald-700 hover:text-emerald-900 font-bold"
                          >
                            <span>مرحله بعد</span>
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {stageCandidates.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl p-3 text-center">
                    <span>موردی در این مرحله وجود ندارد</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Details & Evidence Modal */}
      {selectedCandidateForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedCandidateForDetails.fullName}
                  </h3>
                  {selectedCandidateForDetails.overallScore !== undefined && (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                      امتیاز هوش مصنوعی: {toPersianDigits(selectedCandidateForDetails.overallScore)} از ۱۰
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedCandidateForDetails.email} • تلفن: {toPersianDigits(selectedCandidateForDetails.phone)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidateForDetails(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Category & Status */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">دسته‌بندی ارزیابی:</span>
                {getCategoryBadge(selectedCandidateForDetails.category)}
              </div>

              {/* Strengths */}
              {selectedCandidateForDetails.strengths?.length > 0 && (
                <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>نقاط قوت اصلی (ارزیابی Gemini):</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {selectedCandidateForDetails.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {selectedCandidateForDetails.weaknesses?.length > 0 && (
                <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-200">
                  <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>زمینه‌های نیازمند بررسی و نقاط بهبود:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {selectedCandidateForDetails.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quoted textual evidence from resume */}
              {selectedCandidateForDetails.resumeQuotes?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-slate-500" />
                    <span>شواهد متنی مستند استخراج‌شده از رزومه:</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-700">
                    {selectedCandidateForDetails.resumeQuotes.map((q, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 font-serif italic text-slate-800">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full resume excerpt */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>متن استخراج‌شده رزومه ({selectedCandidateForDetails.resumeFileName}):</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans max-h-36 overflow-y-auto">
                  {selectedCandidateForDetails.resumeText}
                </p>
              </div>

              {/* Talent pool toggle */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onToggleTalentPool(
                      selectedCandidateForDetails.id,
                      !selectedCandidateForDetails.inTalentPool
                    );
                    setSelectedCandidateForDetails({
                      ...selectedCandidateForDetails,
                      inTalentPool: !selectedCandidateForDetails.inTalentPool,
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
                    selectedCandidateForDetails.inTalentPool
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>
                    {selectedCandidateForDetails.inTalentPool
                      ? 'ذخیره شده در استخر استعدادها'
                      : 'انتقال به استخر استعدادهای آینده'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCandidateForDetails(null)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
