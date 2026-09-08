import React, { useState } from 'react';
import { Employee, UserRole } from '../../types';
import { toPersianDigits, formatToman, getTodayJalali, formatJalaliDate } from '../../utils/jalali';
import { JalaliDatePicker } from '../common/JalaliDatePicker';
import {
  Users,
  Plus,
  Search,
  Network,
  List,
  Building,
  CreditCard,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  DollarSign,
} from 'lucide-react';

interface EmployeesModuleProps {
  employees: Employee[];
  currentRole?: UserRole;
  onCreateEmployee: (newEmp: Partial<Employee>) => void;
}

export const EmployeesModule: React.FC<EmployeesModuleProps> = ({
  employees,
  currentRole = UserRole.HR_DIRECTOR,
  onCreateEmployee,
}) => {
  // Salary / national-id columns are HR-confidential (audit fix SEC-02); the
  // server also strips these fields for other roles, this keeps the UI honest.
  const canSeeSensitive = currentRole === UserRole.HR_DIRECTOR;
  const [viewMode, setViewMode] = useState<'list' | 'org_chart'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [personnelCode, setPersonnelCode] = useState('');
  const [department, setDepartment] = useState('فناوری اطلاعات');
  const [jobTitle, setJobTitle] = useState('');
  const [baseSalaryToman, setBaseSalaryToman] = useState(32000000);
  const [hireDateJalali, setHireDateJalali] = useState(formatJalaliDate(getTodayJalali(), true));
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [childrenCount, setChildrenCount] = useState(0);

  const filtered = employees.filter(
    (e) =>
      e.fullName.includes(searchTerm) ||
      (e.personnelCode || '').includes(searchTerm) ||
      (canSeeSensitive && (e.nationalId || '').includes(searchTerm)) ||
      e.jobTitle.includes(searchTerm) ||
      e.department.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No fabricated identity data (audit fix SEC-03): national id, phone and
    // email are required and validated server-side (10-digit checksum, format,
    // uniqueness) instead of being filled with placeholders.
    if (!fullName || !jobTitle || !nationalId || !phone || !email) return;

    onCreateEmployee({
      fullName,
      nationalId,
      personnelCode: personnelCode || undefined,
      department,
      jobTitle,
      baseSalaryToman: Number(baseSalaryToman) || 0,
      hireDateJalali,
      phone,
      email,
      childrenCount: Number(childrenCount) || 0,
      status: 'ACTIVE',
    });

    setIsModalOpen(false);
    setFullName('');
    setJobTitle('');
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900">پرونده پرسنلی و چارت سازمانی</h2>
          <p className="text-xs text-slate-500">
            مدیریت مشخصات هویتی، قراردادها، شماره ملی، تاریخ استخدام و ساختار درختی سازمان
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>جدول پرسنلی</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('org_chart')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                viewMode === 'org_chart'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>چارت سلسله‌مراتبی</span>
            </button>
          </div>

          {canSeeSensitive && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت همکار جدید</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-3">
          {/* Search box */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو بر اساس نام، کدملی، کد پرسنلی یا سمت شغلی..."
              className="w-full text-xs text-slate-800 focus:outline-none font-sans"
            />
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto touch-scroll">
            <table className="w-full min-w-[680px] text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">نام و نام خانوادگی</th>
                  <th className="p-3.5">کد پرسنلی</th>
                  {canSeeSensitive && <th className="p-3.5">کد ملی</th>}
                  <th className="p-3.5">واحد و سمت</th>
                  <th className="p-3.5">تاریخ استخدام</th>
                  {canSeeSensitive && <th className="p-3.5">حقوق پایه (تومان)</th>}
                  <th className="p-3.5 text-center">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-400">{emp.email}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">
                      {toPersianDigits(emp.personnelCode)}
                    </td>
                    {canSeeSensitive && (
                      <td className="p-3.5 text-slate-600 font-mono">
                        {emp.nationalId ? toPersianDigits(emp.nationalId) : '— (در حال تکمیل)'}
                      </td>
                    )}
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{emp.jobTitle}</div>
                      <div className="text-[11px] text-slate-500">{emp.department}</div>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {toPersianDigits(emp.hireDateJalali)}
                    </td>
                    {canSeeSensitive && (
                      <td className="p-3.5 font-extrabold text-emerald-800">
                        {typeof emp.baseSalaryToman === 'number' && emp.baseSalaryToman > 0
                          ? formatToman(emp.baseSalaryToman)
                          : '— (ثبت‌نشده)'}
                      </td>
                    )}
                    <td className="p-3.5 text-center">
                      {emp.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>شاغل فعال</span>
                        </span>
                      ) : emp.status === 'RESIGNED' ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                          قطع همکاری
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                          در مرخصی
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Hierarchical Organizational Chart */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="text-center max-w-sm mx-auto p-4 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-md">
            <div className="w-10 h-10 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center font-bold">
              مدیر
            </div>
            <div className="font-extrabold text-sm">مهندس کیوان سهرابی</div>
            <div className="text-xs text-emerald-100 mt-0.5">مدیر ارشد منابع انسانی و تحول سازمانی</div>
          </div>

          <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

          {/* Department managers level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 mx-auto mb-1 flex items-center justify-center font-bold text-xs">
                فنی
              </div>
              <div className="font-bold text-xs text-slate-900">مهندس سارا رفیعی</div>
              <div className="text-[11px] text-slate-500">مدیر تیم توسعه نرم‌افزار</div>
              <div className="mt-2 text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full inline-block font-semibold">
                ۳ زیرمجموعه مستقیم
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 mx-auto mb-1 flex items-center justify-center font-bold text-xs">
                مالی
              </div>
              <div className="font-bold text-xs text-slate-900">علی اصغر نوروزی</div>
              <div className="text-[11px] text-slate-500">مدیر امور مالی و حقوق دستمزد</div>
              <div className="mt-2 text-[10px] bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full inline-block font-semibold">
                ۲ زیرمجموعه مستقیم
              </div>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

          {/* Specialists level */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {employees.map((e) => (
              <div
                key={e.id}
                className="p-3 bg-white rounded-xl border border-slate-200 text-center shadow-2xs"
              >
                <div className="font-bold text-xs text-slate-800 line-clamp-1">{e.fullName}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{e.jobTitle}</div>
                <div className="text-[9px] text-emerald-700 font-medium mt-1">
                  کد: {toPersianDigits(e.personnelCode)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200 mb-4">
              ثبت پرونده پرسنلی همکار جدید
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  نام و نام خانوادگی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثلاً: پوریا شریفی"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    کد ملی (۱۰ رقم) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="۰۰۱۲۳۴۵۶۷۸"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">کد پرسنلی</label>
                  <input
                    type="text"
                    value={personnelCode}
                    onChange={(e) => setPersonnelCode(e.target.value)}
                    placeholder="۱۰۰۴۵"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    واحد سازمانی
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    عنوان و سمت شغلی <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="مثلاً: توسعه‌دهنده ارشد فرانت‌اند"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    حقوق پایه ماهانه (تومان)
                  </label>
                  <input
                    type="number"
                    value={baseSalaryToman}
                    onChange={(e) => setBaseSalaryToman(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <JalaliDatePicker
                    label="تاریخ استخدام"
                    value={hireDateJalali}
                    onChange={(v) => setHireDateJalali(v)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تعداد اولاد (ماده ۸۶)</label>
                  <input
                    type="number"
                    min={0}
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    شماره تماس <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رایانامه سازمانی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.ir"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono"
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
                  ثبت پرونده پرسنلی
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
