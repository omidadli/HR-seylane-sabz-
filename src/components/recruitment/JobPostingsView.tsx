import React, { useState } from 'react';
import { JobPosting, JobCriteria } from '../../types';
import { toPersianDigits, getTodayJalali, formatJalaliDate } from '../../utils/jalali';
import { JalaliDatePicker } from '../common/JalaliDatePicker';
import {
  Briefcase,
  Plus,
  MapPin,
  Building,
  Users,
  Calendar,
  CheckCircle,
  Archive,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface JobPostingsViewProps {
  jobs: JobPosting[];
  activeJobId: string;
  onSelectJob: (id: string) => void;
  onCreateJob: (newJob: Partial<JobPosting>) => void;
}

export const JobPostingsView: React.FC<JobPostingsViewProps> = ({
  jobs,
  activeJobId,
  onSelectJob,
  onCreateJob,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('فناوری اطلاعات');
  const [employmentType, setEmploymentType] = useState('تمام‌وقت');
  const [location, setLocation] = useState('تهران');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [dateJalali, setDateJalali] = useState(formatJalaliDate(getTodayJalali(), true));

  const [criteriaList, setCriteriaList] = useState<{ title: string; weight: number }[]>([
    { title: 'مهارت فنی تخصصی و معماری کد', weight: 40 },
    { title: 'سابقه کار و پروژه‌های مشابه', weight: 35 },
    { title: 'مهارت‌های ارتباطی و کار تیمی', weight: 25 },
  ]);

  const handleAddCriterion = () => {
    setCriteriaList([...criteriaList, { title: 'شاخص ارزیابی جدید', weight: 10 }]);
  };

  const handleRemoveCriterion = (idx: number) => {
    setCriteriaList(criteriaList.filter((_, i) => i !== idx));
  };

  const handleUpdateCriterion = (idx: number, field: 'title' | 'weight', val: any) => {
    const next = [...criteriaList];
    next[idx] = { ...next[idx], [field]: val };
    setCriteriaList(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateJob({
      title,
      department,
      employmentType,
      location,
      description,
      requirements,
      createdAtJalali: dateJalali,
      criteria: criteriaList.map((c, i) => ({
        id: `c-custom-${Date.now()}-${i}`,
        title: c.title,
        weight: c.weight,
      })),
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
    setRequirements('');
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">موقعیت‌های شغلی فعال و بایگانی</h2>
          <p className="text-xs text-slate-500">
            مدیریت ردیف‌های استخدامی و تنظیم وزن معیارهای ارزیابی هوش مصنوعی
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف موقعیت شغلی جدید</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => {
          const isSelected = activeJobId === job.id;

          return (
            <div
              key={job.id}
              onClick={() => onSelectJob(job.id)}
              className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-2xs relative ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{job.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {job.status === 'ACTIVE' ? 'فعال' : 'بایگانی'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{job.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{job.location} • {job.employmentType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>تاریخ ایجاد: {toPersianDigits(job.createdAtJalali)}</span>
                </div>
              </div>

              {/* Evaluation criteria preview */}
              {job.criteria && job.criteria.length > 0 && (
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                  <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>شاخص‌های وزنی هوش مصنوعی ({toPersianDigits(job.criteria.length)} معیار):</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.criteria.map((c) => (
                      <span
                        key={c.id}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {c.title} ({toPersianDigits(c.weight)}٪)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-600 font-medium">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{toPersianDigits(job.applicationsCount)} رزومه دریافت شده</span>
                </div>

                <span
                  className={`text-[11px] font-bold ${
                    isSelected ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {isSelected ? 'موقعیت انتخاب‌شده' : 'انتخاب جهت بررسی'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Job Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200 mb-4">
              تعریف ردیف شغلی جدید با معیارهای ارزیابی Gemini
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    عنوان شغل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: مهندس ارشد دواپس و زیرساخت"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    واحد سازمانی / دپارتمان
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    نوع همکاری
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="تمام‌وقت">تمام‌وقت</option>
                    <option value="پاره‌وقت">پاره‌وقت</option>
                    <option value="پروژه‌ای / قراردادی">پروژه‌ای / قراردادی</option>
                    <option value="دورکاری">دورکاری</option>
                  </select>
                </div>

                <div>
                  <JalaliDatePicker
                    label="تاریخ انتشار آگهی"
                    value={dateJalali}
                    onChange={(v) => setDateJalali(v)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  شرح موقعیت شغلی و ماموریت‌ها
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="شرح انتظارات و وظایف اصلی موقعیت..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Evaluation criteria & weights */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>شاخص‌های وزنی ارزیابی هوش مصنوعی (مجموع وزن‌ها ۱۰۰٪):</span>
                  </span>

                  <button
                    type="button"
                    onClick={handleAddCriterion}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>افزودن معیار</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {criteriaList.map((crit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={crit.title}
                        onChange={(e) => handleUpdateCriterion(idx, 'title', e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-500 font-medium">وزن:</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={crit.weight}
                          onChange={(e) =>
                            handleUpdateCriterion(idx, 'weight', parseInt(e.target.value, 10) || 10)
                          }
                          className="w-14 px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg text-center font-bold text-emerald-800"
                        />
                        <span className="text-[11px] text-slate-500">٪</span>
                      </div>
                      {criteriaList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCriterion(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  ثبت و فعال‌سازی آگهی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
