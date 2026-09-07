import React, { useState } from 'react';
import { TrainingCourse, SkillMatrixItem } from '../../types';
import { toPersianDigits } from '../../utils/jalali';
import { GraduationCap, BookOpen, Star, Award, Users, CheckCircle, Clock } from 'lucide-react';

interface TrainingModuleProps {
  courses: TrainingCourse[];
  skillMatrix: SkillMatrixItem[];
}

export const TrainingModule: React.FC<TrainingModuleProps> = ({
  courses,
  skillMatrix,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'matrix'>('courses');

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">آموزش و توسعه شایستگی‌ها (L&D)</h2>
          <p className="text-xs text-slate-500">
            برنامه‌ریزی دوره‌های سازمانی و پایش ماتریس مهارت‌های تخصصی تیم
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            تقویم دوره‌های آموزشی
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'matrix'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ماتریس شایستگی‌های تیمی
          </button>
        </div>
      </div>

      {activeTab === 'courses' ? (
        /* Courses Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">{c.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  {toPersianDigits(c.durationHours)} ساعت
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">مدرس دوره: </span>
                  <span className="font-semibold text-slate-800">{c.instructor}</span>
                </div>
                <div>
                  <span className="text-slate-400">تاریخ شروع: </span>
                  <span>{toPersianDigits(c.startDateJalali)}</span>
                </div>
                <div>
                  <span className="text-slate-400">تعداد شرکت‌کنندگان: </span>
                  <span className="font-bold">{toPersianDigits(c.enrolledCount)} نفر</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>همراه با گواهی حضور</span>
                </span>

                <button
                  type="button"
                  onClick={() => alert(`ثبت‌نام شما در دوره ${c.title} با موفقیت انجام شد.`)}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs"
                >
                  ثبت نام در دوره
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Skill Matrix Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">نام همکار</th>
                <th className="p-3.5">مهارت / شایستگی</th>
                <th className="p-3.5">سطح مهارت (۱ تا ۵)</th>
                <th className="p-3.5">تاریخ آخرین ارزیابی</th>
                <th className="p-3.5 text-center">وضعیت تسلط</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {skillMatrix.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-bold text-slate-900">{item.employeeName}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{item.skillName}</td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-4 h-4 rounded-md text-[10px] font-bold flex items-center justify-center ${
                            level <= item.level
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {toPersianDigits(level)}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600">{toPersianDigits(item.lastEvaluatedJalali)}</td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.level >= 4
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.level >= 4 ? 'سطح ارشد و راهنما' : 'سطح میانی'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
