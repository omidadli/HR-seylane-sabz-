import React, { useState } from 'react';
import { AttendanceRecord, Employee, LeaveBalance, LeaveRequest, LeaveStatus, LeaveType, UserRole } from '../../types';
import { parseJalaliDateString, countWorkingDaysInclusive } from '../../utils/jalali';
import { toPersianDigits, getTodayJalali, formatJalaliDate } from '../../utils/jalali';
import { JalaliDatePicker } from '../common/JalaliDatePicker';
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  LogIn,
  LogOut,
  AlertCircle,
  ShieldCheck,
  User,
} from 'lucide-react';

interface AttendanceModuleProps {
  currentRole: UserRole;
  attendances: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  /** Statutory balances computed server-side (Art. 64/66) — audit fix LEA-01. */
  leaveBalances: LeaveBalance[];
  employees: Employee[];
  sessionEmployeeId?: string;
  onCheckInOut: (type: 'CHECK_IN' | 'CHECK_OUT') => void;
  onSubmitLeaveRequest: (req: Partial<LeaveRequest>) => void;
  onApproveLeave: (id: string, approved: boolean, comment?: string) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  currentRole,
  attendances,
  leaveRequests,
  leaveBalances,
  employees,
  sessionEmployeeId,
  onCheckInOut,
  onSubmitLeaveRequest,
  onApproveLeave,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'attendance' | 'leaves'>('attendance');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Leave request form states
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.ANNUAL);
  const [startDate, setStartDate] = useState(formatJalaliDate(getTodayJalali(), true));
  const [endDate, setEndDate] = useState(formatJalaliDate(getTodayJalali(), true));
  const [daysCount, setDaysCount] = useState(1);
  const [reason, setReason] = useState('');

  // Real statutory balance (audit fix LEA-01): the card used to show a
  // hardcoded "7 days used" fiction unrelated to any stored request.
  const myBalance = leaveBalances.find((b) => b.employeeId === sessionEmployeeId) || leaveBalances[0];
  const currentYearBalance = myBalance ? myBalance.years[myBalance.currentYear] : undefined;

  // Server-derived working-day preview for the selected range (Fridays excluded).
  const previewDays = (() => {
    const s0 = parseJalaliDateString(startDate);
    const e0 = parseJalaliDateString(endDate);
    if (!s0 || !e0) return null;
    return countWorkingDaysInclusive(s0, e0);
  })();
  const rangeInvalid = previewDays !== null && previewDays < 0;
  const exceedsQuota =
    leaveType === LeaveType.ANNUAL &&
    previewDays !== null &&
    previewDays > 0 &&
    currentYearBalance !== undefined &&
    previewDays > currentYearBalance.remainingDays;

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rangeInvalid) {
      showToastLocal('تاریخ پایان نمی‌تواند پیش از تاریخ شروع باشد');
      return;
    }
    if (exceedsQuota) {
      showToastLocal(
        `مانده مرخصی استحقاقی شما ${currentYearBalance?.remainingDays ?? 0} روز کاری است؛ درخواست بیش از مانده قابل ثبت نیست (ماده ۶۴). در صورت نیاز مرخصی بدون حقوق انتخاب کنید.`
      );
      return;
    }
    if (leaveType === LeaveType.MARRIAGE && previewDays !== null && previewDays > 3) {
      showToastLocal('مرخصی ازدواج مطابق ماده ۷۳ قانون کار حداکثر ۳ روز است');
      return;
    }
    onSubmitLeaveRequest({
      leaveType,
      startDateJalali: startDate,
      endDateJalali: endDate,
      // For hourly leave the fractional input is authoritative; otherwise the
      // server derives the working-day count from the dates.
      daysCount:
        leaveType === LeaveType.HOURLY
          ? Number(daysCount) || 0.5
          : (previewDays ?? (Number(daysCount) || 1)),
      reason: reason || 'مرخصی استحقاقی روزانه',
    });
    setIsLeaveModalOpen(false);
    setReason('');
  };

  const [localNotice, setLocalNotice] = useState<string | null>(null);
  function showToastLocal(msg: string) {
    setLocalNotice(msg);
    setTimeout(() => setLocalNotice(null), 6000);
  }

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>تایید نهایی شده</span>
          </span>
        );
      case LeaveStatus.PENDING_MANAGER:
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
            در انتظار تایید مدیر واحد
          </span>
        );
      case LeaveStatus.PENDING_HR:
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
            در انتظار تایید منابع انسانی
          </span>
        );
      case LeaveStatus.REJECTED:
        return (
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>رد شده</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Quick Check-in/Out & Leave Balance Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Check-In / Out Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>دستگاه ثبت تردد هوشمند</span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              شیفت عادی (۸:۰۰ الی ۱۷:۰۰)
            </span>
          </div>

          <div className="text-xs text-slate-500">
            تردد امروز شما در سامانه ثبت و در محاسبه کارکرد ماهانه منظور می‌گردد.
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onCheckInOut('CHECK_IN')}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <LogIn className="w-4 h-4" />
              <span>ثبت ورود</span>
            </button>

            <button
              type="button"
              onClick={() => onCheckInOut('CHECK_OUT')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <LogOut className="w-4 h-4" />
              <span>ثبت خروج</span>
            </button>
          </div>
        </div>

        {/* Iranian Labor Law 26 Days Leave Balance Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-200 shadow-2xs space-y-2 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>مانده مرخصی استحقاقی (ماده ۶۴ قانون کار جمهوری اسلامی ایران)</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-800">
              سال {myBalance ? toPersianDigits(myBalance.currentYear) : '—'}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            مطابق ماده ۶۴ قانون کار، هر کارگر سالانه مستحق ۲۶ روز کاری مرخصی استحقاقی با حقوق است (با احتساب ۴ جمعه).
            مانده زیر به صورت زنده از درخواست‌های تاییدشده و در انتظار بررسی محاسبه می‌شود؛ انتقال سال قبل حداکثر ۹ روز (ماده ۶۶).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-500">سقف امسال (تناسب استخدام)</div>
              <div className="text-sm font-extrabold text-slate-800">
                {toPersianDigits(currentYearBalance?.entitlementDays ?? 0)} روز
              </div>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-500">انتقال از سال قبل</div>
              <div className="text-sm font-extrabold text-slate-800">
                {toPersianDigits(currentYearBalance?.carryoverDays ?? 0)} روز
              </div>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-500">استفاده‌شده (تاییدشده)</div>
              <div className="text-sm font-extrabold text-amber-700">
                {toPersianDigits(currentYearBalance?.usedDays ?? 0)} روز
              </div>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-500">در انتظار بررسی</div>
              <div className="text-sm font-extrabold text-sky-700">
                {toPersianDigits(currentYearBalance?.pendingDays ?? 0)} روز
              </div>
            </div>
            <div className="bg-white/80 p-2 rounded-xl border border-emerald-200">
              <div className="text-[10px] text-slate-500">مانده قابل استفاده</div>
              <div className="text-sm font-extrabold text-emerald-700">
                {toPersianDigits(currentYearBalance?.remainingDays ?? 0)} روز
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('attendance')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'attendance'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            گزارش تردد روزانه
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('leaves')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'leaves'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            کارتابل درخواست‌های مرخصی ({toPersianDigits(leaveRequests.length)})
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsLeaveModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت درخواست مرخصی جدید</span>
        </button>
      </div>

      {activeSubTab === 'attendance' ? (
        /* Attendance Daily Records Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto touch-scroll">
          <table className="w-full min-w-[660px] text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">نام همکار</th>
                <th className="p-3.5">تاریخ (شمسی)</th>
                <th className="p-3.5">ساعت ورود</th>
                <th className="p-3.5">ساعت خروج</th>
                <th className="p-3.5">تاخیر (دقیقه)</th>
                <th className="p-3.5">اضافه‌کاری (ساعت)</th>
                <th className="p-3.5 text-center">وضعیت حضور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {attendances.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-bold text-slate-900">{rec.employeeName}</td>
                  <td className="p-3.5 text-slate-600">{toPersianDigits(rec.dateJalali)}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-700">
                    {toPersianDigits(rec.checkIn || '-')}
                  </td>
                  <td className="p-3.5 font-mono font-bold text-slate-800">
                    {toPersianDigits(rec.checkOut || '-')}
                  </td>
                  <td className="p-3.5 text-rose-600 font-bold">
                    {rec.delayMinutes ? toPersianDigits(rec.delayMinutes) : '۰'}
                  </td>
                  <td className="p-3.5 text-blue-700 font-bold">
                    {rec.overtimeHours ? toPersianDigits(rec.overtimeHours) : '۰'}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      حاضر در شرکت
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Leave Requests Workflow Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto touch-scroll">
          <table className="w-full min-w-[660px] text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">متقاضی</th>
                <th className="p-3.5">نوع مرخصی</th>
                <th className="p-3.5">بازه زمانی (شمسی)</th>
                <th className="p-3.5">مدت</th>
                <th className="p-3.5">علت</th>
                <th className="p-3.5">وضعیت گردش‌کار</th>
                <th className="p-3.5 text-center">عملیات تایید (RBAC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70">
                  <td className="p-3.5 font-bold text-slate-900">{req.employeeName}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {req.leaveType === LeaveType.ANNUAL
                        ? 'استحقاقی'
                        : req.leaveType === LeaveType.SICK
                        ? 'استعلاجی'
                        : req.leaveType === LeaveType.HOURLY
                        ? 'ساعتی'
                        : req.leaveType === LeaveType.MARRIAGE
                        ? 'ازدواج (ماده ۷۳)'
                        : req.leaveType === LeaveType.MATERNITY
                        ? 'زایمان'
                        : 'بدون حقوق'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    از {toPersianDigits(req.startDateJalali)} تا {toPersianDigits(req.endDateJalali)}
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">
                    {toPersianDigits(req.daysCount)} روز کاری
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs truncate">{req.reason}</td>
                  <td className="p-3.5">{getStatusBadge(req.status)}</td>
                  <td className="p-3.5 text-center">
                    {req.status === LeaveStatus.PENDING_MANAGER &&
                      (currentRole === UserRole.DEPT_MANAGER || currentRole === UserRole.HR_DIRECTOR) && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onApproveLeave(req.id, true, 'موافقت مدیر واحد')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                          >
                            تایید مدیر
                          </button>
                          <button
                            type="button"
                            onClick={() => onApproveLeave(req.id, false, 'عدم موافقت به دلیل ترافیک کاری')}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[11px] font-bold"
                          >
                            رد
                          </button>
                        </div>
                      )}

                    {req.status === LeaveStatus.PENDING_HR && currentRole === UserRole.HR_DIRECTOR && (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onApproveLeave(req.id, true, 'تایید نهایی منابع انسانی')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold"
                        >
                          تایید نهایی HR
                        </button>
                      </div>
                    )}

                    {req.status === LeaveStatus.APPROVED && (
                      <span className="text-[11px] text-emerald-700 font-bold">گردش‌کار تکمیل شده</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leave Request Form Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-200 mb-4">
              ثبت درخواست مرخصی با تاریخ شمسی
            </h3>

            <form onSubmit={handleLeaveSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نوع مرخصی</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value={LeaveType.ANNUAL}>استحقاقی (کسر از مانده ۲۶ روزه)</option>
                  <option value={LeaveType.SICK}>استعلاجی (نیازمند گواهی پزشک)</option>
                  <option value={LeaveType.HOURLY}>ساعتی (کسری از روز کاری)</option>
                  <option value={LeaveType.MARRIAGE}>ازدواج (۳ روز با حقوق — ماده ۷۳)</option>
                  <option value={LeaveType.MATERNITY}>زایمان (مشمول بیمه تامین اجتماعی)</option>
                  <option value={LeaveType.UNPAID}>بدون حقوق (کسر از حقوق دوره)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <JalaliDatePicker
                  label="از تاریخ"
                  value={startDate}
                  onChange={(v) => setStartDate(v)}
                />
                <JalaliDatePicker
                  label="تا تاریخ"
                  value={endDate}
                  onChange={(v) => setEndDate(v)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {leaveType === LeaveType.HOURLY ? 'مدت به کسری از روز کاری (مثلاً ۰.۵)' : 'روزهای کاری بازه (جمعه‌ها خارج — محاسبه خودکار)'}
                </label>
                {leaveType === LeaveType.HOURLY ? (
                  <input
                    type="number"
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={daysCount}
                    onChange={(e) => setDaysCount(parseFloat(e.target.value) || 0.5)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                ) : (
                  <div className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700">
                    {previewDays === null ? '—' : previewDays < 0 ? 'بازه نامعتبر (پایان پیش از شروع)' : `${toPersianDigits(previewDays)} روز کاری`}
                  </div>
                )}
                {exceedsQuota && (
                  <p className="text-[10px] text-rose-700 font-bold mt-1">
                    این درخواست از مانده مرخصی استحقاقی شما ({toPersianDigits(currentYearBalance?.remainingDays ?? 0)} روز) بیشتر است و ثبت نخواهد شد.
                  </p>
                )}
              </div>

              {localNotice && (
                <div className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl p-2.5">
                  {localNotice}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  علت درخواست مرخصی
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="توضیحات و امور مربوط به مرخصی..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  ارسال جهت تایید مدیر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
