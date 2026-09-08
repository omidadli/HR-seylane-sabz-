/**
 * Payroll module — audit fixes PAY-02/PAY-04/PAY-10/PAY-11, MOD-02:
 * - period (year+month) selector actually filters the table and KPI totals
 * - only years with a verified statutory circular are offered (fetched from
 *   the server, defaults to the real current Jalali year/month)
 * - real DRAFT → FINALIZED → PAID lifecycle actions with a locked period state
 * - real printing (opens a print view instead of a fake "PDF ready" alert)
 * - HR-only generation (the module itself is role-gated in App/Sidebar too)
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Employee, PayrollSlip, PayrollStatus, UserRole } from '../../types';
import { toPersianDigits, formatToman } from '../../utils/jalali';
import {
  Calculator,
  Download,
  Eye,
  Lock,
  CheckCircle2,
  FileCheck2,
  Banknote,
} from 'lucide-react';

const MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
];

const STATUS_META: Record<PayrollStatus, { label: string; className: string }> = {
  [PayrollStatus.DRAFT]: { label: 'پیش‌نویس', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  [PayrollStatus.FINALIZED]: { label: 'نهایی‌شده', className: 'bg-blue-50 text-blue-800 border-blue-200' },
  [PayrollStatus.PAID]: { label: 'پرداخت‌شده (قفل)', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
};

interface PayrollModuleProps {
  payrollSlips: PayrollSlip[];
  currentRole: UserRole;
  employees: Employee[];
  onGeneratePayroll: (monthJalali: number, yearJalali: number) => void;
  onFinalizePayroll: (yearJalali: number, monthJalali: number) => void;
  onMarkPaid: (yearJalali: number, monthJalali: number) => void;
}

/** Opens a real browser print view of one payslip (audit fix PAY-11). */
function printSlip(slip: PayrollSlip) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${label}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:700;text-align:left">${value}</td></tr>`;
  const html = `<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="utf-8">
<title>فیش حقوقی ${slip.employeeName} - ${slip.monthName} ${slip.yearJalali}</title>
<style>body{font-family:Tahoma,sans-serif;padding:24px;color:#111}h1{font-size:16px}h2{font-size:13px;color:#444}table{width:100%;border-collapse:collapse;font-size:12px;margin-top:12px}.total{background:#f0fdf4}</style>
</head><body>
<h1>فیش رسمی حقوق و دستمزد — هلدینگ سیلانه سبز</h1>
<h2>${slip.employeeName} (کد پرسنلی ${slip.personnelCode || '—'}) | دوره کارکرد: ${slip.monthName} ${slip.yearJalali} | وضعیت: ${STATUS_META[slip.status]?.label || slip.status}${slip.paidAtJalali ? ` | تاریخ پرداخت: ${slip.paidAtJalali}` : ''}</h2>
<table>
<tr><th colspan="2" style="text-align:right;padding:8px;background:#f8fafc">حقوق و مزایا (تومان)</th></tr>
${row('حقوق پایه', formatToman(slip.baseSalaryToman))}
${row('حق مسکن مصوب', formatToman(slip.housingAllowanceToman))}
${row('بن خواربار', formatToman(slip.bonKargariToman))}
${slip.seniorityBaseToman ? row('پایه سنوات', formatToman(slip.seniorityBaseToman)) : ''}
${slip.marriageAllowanceToman ? row('حق تأهل', formatToman(slip.marriageAllowanceToman)) : ''}
${row('حق اولاد (ماده ۸۶)', formatToman(slip.childAllowanceToman))}
${row('ایاب و ذهاب', formatToman(slip.commuteAllowanceToman))}
${row(`اضافه‌کاری${slip.overtimeHours ? ` (${slip.overtimeHours} ساعت × ۱.۴)` : ''}`, formatToman(slip.overtimePayToman))}
<tr class="total"><td style="padding:8px;font-weight:900">جمع ناخالص</td><td style="padding:8px;font-weight:900;text-align:left">${formatToman(slip.grossSalaryToman)}</td></tr>
<tr><th colspan="2" style="text-align:right;padding:8px;background:#fff1f2">کسورات قانونی</th></tr>
${row('بیمه تامین اجتماعی (۷٪ سهم کارگر)', formatToman(slip.ssoInsurance7PctToman))}
${row('مالیات بر حقوق (پله‌ای)', formatToman(slip.incomeTaxToman))}
<tr class="total"><td style="padding:8px;font-weight:900">خالص قابل پرداخت</td><td style="padding:8px;font-weight:900;text-align:left">${formatToman(slip.netSalaryToman)}</td></tr>
<tr><th colspan="2" style="text-align:right;padding:8px;background:#f8fafc">ذخایر قانونی</th></tr>
${row('ذخیره سنوات ماهانه', formatToman(slip.sanavatReserveToman))}
${row('ذخیره عیدی (با سقف قانونی ۹۰ روز حداقل دستمزد)', formatToman(slip.eidiReserveToman))}
</table>
<p style="font-size:10px;color:#666;margin-top:16px">${slip.statutoryYearNote || ''}${slip.payableDays !== undefined && slip.payableDays !== 31 && slip.payableDays !== 30 ? ` | روزهای قابل پرداخت دوره: ${slip.payableDays}` : ''}${slip.unpaidLeaveDays ? ` | کسر مرخصی بدون حقوق: ${slip.unpaidLeaveDays} روز` : ''}${slip.generatedAtJalali ? ` | تولید: ${slip.generatedAtJalali}` : ''}</p>
<script>window.onload=()=>window.print()</script>
</body></html>`;
  const w = window.open('', '_blank', 'width=800,height=900');
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

export const PayrollModule: React.FC<PayrollModuleProps> = ({
  payrollSlips,
  currentRole,
  onGeneratePayroll,
  onFinalizePayroll,
  onMarkPaid,
}) => {
  const isHR = currentRole === UserRole.HR_DIRECTOR;
  const [selectedSlip, setSelectedSlip] = useState<PayrollSlip | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(6);
  const [selectedYear, setSelectedYear] = useState(1404);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Years that have a verified statutory circular + the real current period.
  useEffect(() => {
    let alive = true;
    fetch('/api/payroll/years')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d) return;
        setAvailableYears(d.availableYears || []);
        if (d.currentYearJalali) setSelectedYear(d.currentYearJalali);
        if (d.currentMonthJalali) setSelectedMonth(d.currentMonthJalali);
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);

  // The period selector actually filters (audit fix MOD-02: it was decorative).
  const periodSlips = useMemo(
    () => payrollSlips.filter((s) => s.yearJalali === selectedYear && s.monthJalali === selectedMonth),
    [payrollSlips, selectedYear, selectedMonth]
  );

  const totalGross = periodSlips.reduce((sum, s) => sum + s.grossSalaryToman, 0);
  const totalNet = periodSlips.reduce((sum, s) => sum + s.netSalaryToman, 0);
  const totalSSO = periodSlips.reduce((sum, s) => sum + s.ssoInsurance7PctToman, 0);
  const totalTax = periodSlips.reduce((sum, s) => sum + s.incomeTaxToman, 0);

  const draftCount = periodSlips.filter((s) => s.status === PayrollStatus.DRAFT).length;
  const finalizedCount = periodSlips.filter((s) => s.status === PayrollStatus.FINALIZED).length;
  const paidCount = periodSlips.filter((s) => s.status === PayrollStatus.PAID).length;
  const periodLocked = periodSlips.length > 0 && paidCount === periodSlips.length;

  const handleGenerate = () => {
    setIsGenerating(true);
    try {
      onGeneratePayroll(selectedMonth, selectedYear);
    } finally {
      setTimeout(() => setIsGenerating(false), 600);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Summary KPIs — computed for the SELECTED period only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">کل ناخالص دوره انتخابی</div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900">{formatToman(totalGross)}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {MONTH_NAMES[selectedMonth - 1]} {toPersianDigits(selectedYear)} • {toPersianDigits(periodSlips.length)} فیش
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">خالص پرداختی به کارکنان</div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-800">{formatToman(totalNet)}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-bold">قابل واریز به حساب بانکی</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">بیمه تامین اجتماعی (۷٪ سهم کارگر)</div>
          <div className="text-base sm:text-lg font-extrabold text-blue-800">{formatToman(totalSSO)}</div>
          <div className="text-[10px] text-blue-600 mt-0.5">حق اولاد از مبنای بیمه مستثنی است</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">مالیات بر حقوق (پله‌ای)</div>
          <div className="text-base sm:text-lg font-extrabold text-purple-800">{formatToman(totalTax)}</div>
          <div className="text-[10px] text-purple-600 mt-0.5">بر مبنای جدول مالیاتی سال {toPersianDigits(selectedYear)}</div>
        </div>
      </div>

      {/* Generation + Lifecycle Bar */}
      <div className="flex flex-col gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                محاسبه مکانیزه حقوق بر اساس بخشنامه دستمزد سال انتخابی
              </h3>
              <p className="text-[11px] text-slate-500">
                فقط سال‌های دارای بخشنامه ثبت‌شده قابل محاسبه‌اند • پایه سنوات و حق تأهل اعمال می‌شود • عیدی با سقف قانونی ۹۰ روز حداقل دستمزد
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              aria-label="ماه دوره"
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              aria-label="سال دوره"
            >
              {(availableYears.length ? availableYears : [selectedYear]).map((y) => (
                <option key={y} value={y}>{toPersianDigits(y)}</option>
              ))}
            </select>

            {isHR && (
              <button
                type="button"
                disabled={isGenerating || periodLocked}
                onClick={handleGenerate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'در حال محاسبه...' : periodLocked ? 'دوره قفل شده' : 'تولید فیش‌های دوره'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Lifecycle actions (real DRAFT → FINALIZED → PAID flow) */}
        {periodSlips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500">
              وضعیت دوره: {toPersianDigits(draftCount)} پیش‌نویس • {toPersianDigits(finalizedCount)} نهایی • {toPersianDigits(paidCount)} پرداخت‌شده
            </span>
            {isHR && draftCount > 0 && (
              <button
                type="button"
                onClick={() => onFinalizePayroll(selectedYear, selectedMonth)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                نهایی‌سازی {toPersianDigits(draftCount)} فیش پیش‌نویس
              </button>
            )}
            {isHR && finalizedCount > 0 && (
              <button
                type="button"
                onClick={() => onMarkPaid(selectedYear, selectedMonth)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Banknote className="w-3.5 h-3.5" />
                ثبت پرداخت و قفل دوره
              </button>
            )}
            {periodLocked && (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-bold flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                این دوره پرداخت و قفل شده است — فیش‌ها غیرقابل تغییرند
              </span>
            )}
          </div>
        )}
      </div>

      {/* Slips Table (selected period only) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto touch-scroll">
        {periodSlips.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500 font-bold">
            برای {MONTH_NAMES[selectedMonth - 1]} {toPersianDigits(selectedYear)} فیشی وجود ندارد.
            {isHR ? ' با «تولید فیش‌های دوره» محاسبه را آغاز کنید.' : ''}
          </div>
        ) : (
          <table className="w-full min-w-[760px] text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">نام و کد پرسنلی</th>
                <th className="p-3.5">وضعیت</th>
                <th className="p-3.5">حقوق پایه (تومان)</th>
                <th className="p-3.5">مزایا و بن</th>
                <th className="p-3.5">بیمه سهم کارگر (۷٪)</th>
                <th className="p-3.5">مالیات پله‌ای</th>
                <th className="p-3.5">خالص پرداختی (تومان)</th>
                <th className="p-3.5 text-center">فیش</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {periodSlips.map((slip) => {
                const meta = STATUS_META[slip.status] || STATUS_META[PayrollStatus.DRAFT];
                const benefits =
                  slip.housingAllowanceToman +
                  slip.bonKargariToman +
                  slip.childAllowanceToman +
                  slip.commuteAllowanceToman +
                  (slip.seniorityBaseToman || 0) +
                  (slip.marriageAllowanceToman || 0) +
                  slip.overtimePayToman;
                return (
                  <tr key={slip.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{slip.employeeName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">کد: {toPersianDigits(slip.personnelCode)}</div>
                      {slip.payableDays !== undefined && slip.payableDays < 28 && (
                        <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                          تناسب‌سازی: {toPersianDigits(slip.payableDays)} روز کارکرد
                          {slip.unpaidLeaveDays ? ` (کسر ${toPersianDigits(slip.unpaidLeaveDays)} روز مرخصی بدون حقوق)` : ''}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block text-[10px] font-black px-2 py-1 rounded-lg border ${meta.className}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{formatToman(slip.baseSalaryToman)}</td>
                    <td className="p-3.5 text-slate-600">{formatToman(benefits)}</td>
                    <td className="p-3.5 text-blue-700 font-bold">{formatToman(slip.ssoInsurance7PctToman)}</td>
                    <td className="p-3.5 text-purple-700 font-bold">{formatToman(slip.incomeTaxToman)}</td>
                    <td className="p-3.5 font-extrabold text-emerald-800 text-sm">{formatToman(slip.netSalaryToman)}</td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedSlip(slip)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="مشاهده جزئیات فیش رسمی"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Detailed Payslip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  فیش رسمی حقوق و دستمزد - {selectedSlip.monthName} {toPersianDigits(selectedSlip.yearJalali)}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedSlip.employeeName} (کد پرسنلی: {toPersianDigits(selectedSlip.personnelCode)})
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-lg border ${(STATUS_META[selectedSlip.status] || STATUS_META[PayrollStatus.DRAFT]).className}`}>
                    {(STATUS_META[selectedSlip.status] || STATUS_META[PayrollStatus.DRAFT]).label}
                  </span>
                  {selectedSlip.paidAtJalali && (
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      پرداخت در {selectedSlip.paidAtJalali}
                    </span>
                  )}
                </div>
              </div>
              <button type="button" onClick={() => setSelectedSlip(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-sm cursor-pointer">
                ✕
              </button>
            </div>

            {/* Incomes & Allowances */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 pb-1 border-b border-emerald-200 flex items-center justify-between">
                <span>ردیف‌های حقوق و مزایا</span>
                <span className="text-[10px] text-emerald-700">مبالغ به تومان</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="flex justify-between"><span>حقوق پایه ماهانه:</span><span className="font-bold">{formatToman(selectedSlip.baseSalaryToman)}</span></div>
                <div className="flex justify-between"><span>کمک هزینه مسکن (حق مسکن مصوب):</span><span className="font-bold">{formatToman(selectedSlip.housingAllowanceToman)}</span></div>
                <div className="flex justify-between"><span>بن خواربار:</span><span className="font-bold">{formatToman(selectedSlip.bonKargariToman)}</span></div>
                {selectedSlip.seniorityBaseToman ? (
                  <div className="flex justify-between"><span>پایه سنوات (≥۱ سال سابقه):</span><span className="font-bold">{formatToman(selectedSlip.seniorityBaseToman)}</span></div>
                ) : null}
                {selectedSlip.marriageAllowanceToman ? (
                  <div className="flex justify-between"><span>حق تأهل:</span><span className="font-bold">{formatToman(selectedSlip.marriageAllowanceToman)}</span></div>
                ) : null}
                <div className="flex justify-between"><span>حق اولاد (ماده ۸۶ تامین اجتماعی):</span><span className="font-bold">{formatToman(selectedSlip.childAllowanceToman)}</span></div>
                <div className="flex justify-between"><span>حق ایاب و ذهاب:</span><span className="font-bold">{formatToman(selectedSlip.commuteAllowanceToman)}</span></div>
                <div className="flex justify-between">
                  <span>فوق‌العاده اضافه‌کاری{selectedSlip.overtimeHours ? ` (${toPersianDigits(selectedSlip.overtimeHours)} ساعت × ۱.۴)` : ''}:</span>
                  <span className="font-bold">{formatToman(selectedSlip.overtimePayToman)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-200 flex justify-between font-extrabold text-emerald-900">
                <span>جمع ناخالص حقوق و مزایا:</span>
                <span>{formatToman(selectedSlip.grossSalaryToman)} تومان</span>
              </div>
            </div>

            {/* Deductions (SSO & Tax) */}
            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200 space-y-2 text-xs">
              <div className="font-bold text-rose-950 pb-1 border-b border-rose-200 flex items-center justify-between">
                <span>کسورات قانونی ماهانه</span>
                <span className="text-[10px] text-rose-700">مبالغ به تومان</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="flex justify-between">
                  <span>حق بیمه تامین اجتماعی (۷٪ سهم کارگر):</span>
                  <span className="font-bold text-blue-800">{formatToman(selectedSlip.ssoInsurance7PctToman)}</span>
                </div>
                <div className="flex justify-between">
                  <span>مالیات بر درآمد حقوق (پله‌ای):</span>
                  <span className="font-bold text-purple-800">{formatToman(selectedSlip.incomeTaxToman)}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-rose-200 flex justify-between font-extrabold text-rose-900">
                <span>جمع کل کسورات:</span>
                <span>{formatToman(selectedSlip.ssoInsurance7PctToman + selectedSlip.incomeTaxToman)} تومان</span>
              </div>
            </div>

            {/* Reserves: Sanavat & Eidi */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:justify-between gap-1">
              <div>
                <span className="font-bold text-slate-700">ذخیره سنوات ماهانه: </span>
                <span>{formatToman(selectedSlip.sanavatReserveToman)} تومان</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">ذخیره عیدی (سقف قانونی ۹۰ روز حداقل دستمزد): </span>
                <span>{formatToman(selectedSlip.eidiReserveToman)} تومان</span>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-xl flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-emerald-100">مبلغ خالص قابل پرداخت به حساب بانکی:</div>
                <div className="text-xl font-black">{formatToman(selectedSlip.netSalaryToman)} تومان</div>
                {selectedSlip.statutoryYearNote && (
                  <div className="text-[10px] text-emerald-100 mt-1 max-w-sm leading-4">{selectedSlip.statutoryYearNote}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => printSlip(selectedSlip)}
                className="px-4 py-2 bg-white text-emerald-800 font-bold rounded-xl text-xs flex items-center gap-1 shadow-md hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>چاپ فیش</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
