import React from 'react';
import { Candidate } from '../../types';
import { toPersianDigits } from '../../utils/jalali';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { Sparkles, X, CheckCircle, Award, Star, Quote, Mail } from 'lucide-react';

interface CandidateCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onDraftEmail: (candidate: Candidate, type: 'INVITATION' | 'REJECTION') => void;
}

export const CandidateCompareModal: React.FC<CandidateCompareModalProps> = ({
  isOpen,
  onClose,
  candidates,
  onDraftEmail,
}) => {
  if (!isOpen || candidates.length === 0) return null;

  // Extract all distinct criteria
  const allCriteria = new Set<string>();
  candidates.forEach((c) => {
    if (c.criteriaScores) {
      Object.keys(c.criteriaScores).forEach((crit) => allCriteria.add(crit));
    }
  });

  const criteriaList = Array.from(allCriteria);
  if (criteriaList.length === 0) {
    criteriaList.push('تسلط فنی و معماری', 'تایپ‌اسکریپت', 'طراحی واکنش‌گرا و RTL', 'کار تیمی و تعامل');
  }

  const radarData = criteriaList.map((crit) => {
    const row: any = { criterion: crit };
    candidates.forEach((c) => {
      row[c.fullName] = c.criteriaScores?.[crit] || c.overallScore || 7.0;
    });
    return row;
  });

  const radarColors = ['#059669', '#2563eb', '#d97706', '#9333ea', '#dc2626'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                مقایسه تطبیقی چندمحوره کارجویان (Radar Chart & Matrix)
              </h3>
              <p className="text-xs text-slate-500">
                بررسی هم‌زمان شاخص‌های شایستگی، شواهد متنی رزومه و پیشنهاد مدل Gemini
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="criterion"
                  tick={{ fill: '#334155', fontSize: 11, fontFamily: 'Vazirmatn' }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#cbd5e1" />
                {candidates.map((cand, idx) => (
                  <Radar
                    key={cand.id}
                    name={cand.fullName}
                    dataKey={cand.fullName}
                    stroke={radarColors[idx % radarColors.length]}
                    fill={radarColors[idx % radarColors.length]}
                    fillOpacity={0.25}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '12px', fontFamily: 'Vazirmatn', paddingTop: '12px' }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side-by-side Detailed Matrix Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">معیار ارزیابی / شایستگی</th>
                {candidates.map((c, idx) => (
                  <th key={c.id} className="p-3 text-center">
                    <div className="font-extrabold text-slate-900">{c.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{c.jobTitle}</div>
                    <div className="mt-1 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      <Star className="w-3 h-3 text-emerald-600 fill-emerald-500" />
                      <span>امتیاز کل: {toPersianDigits(c.overallScore || '-')}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {criteriaList.map((crit) => (
                <tr key={crit} className="hover:bg-slate-50/70">
                  <td className="p-3 font-semibold text-slate-800">{crit}</td>
                  {candidates.map((c) => {
                    const score = c.criteriaScores?.[crit] || c.overallScore || 7;
                    return (
                      <td key={c.id} className="p-3 text-center font-bold">
                        <span
                          className={`px-2 py-1 rounded-lg ${
                            score >= 8
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : score >= 6
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {toPersianDigits(score)} از ۱۰
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Textual Quote evidence comparison */}
              <tr className="bg-slate-50/50">
                <td className="p-3 font-semibold text-slate-800">شاهد متنی مستند رزومه</td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-3 text-xs italic font-serif text-slate-600">
                    {c.resumeQuotes?.[0] || '«سابقه کار در پروژه‌های تیمی»'}
                  </td>
                ))}
              </tr>

              {/* Actions row */}
              <tr>
                <td className="p-3 font-semibold text-slate-800">عملیات پیشنهادی</td>
                {candidates.map((c) => (
                  <td key={c.id} className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => onDraftEmail(c, 'INVITATION')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Mail className="w-3 h-3" />
                      <span>تنظیم دعوت‌نامه</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl"
          >
            بستن پنجره مقایسه
          </button>
        </div>
      </div>
    </div>
  );
};
