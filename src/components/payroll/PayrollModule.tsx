import React, { useState } from 'react';
import { PayrollSlip, PayrollStatus } from '../../types';
import { toPersianDigits, formatToman } from '../../utils/jalali';
import {
  Wallet,
  FileText,
  Calculator,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface PayrollModuleProps {
  payrollSlips: PayrollSlip[];
  onGeneratePayroll: (monthJalali: number, yearJalali: number) => void;
}

export const PayrollModule: React.FC<PayrollModuleProps> = ({
  payrollSlips,
  onGeneratePayroll,
}) => {
  const [selectedSlip, setSelectedSlip] = useState<PayrollSlip | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(6); // شهریور
  const [selectedYear, setSelectedYear] = useState(1403);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGeneratePayroll(selectedMonth, selectedYear);
      setIsGenerating(false);
    }, 500);
  };

  const totalGross = payrollSlips.reduce((sum, s) => sum + s.grossSalaryToman, 0);
  const totalNet = payrollSlips.reduce((sum, s) => sum + s.netSalaryToman, 0);
  const totalSSO = payrollSlips.reduce((sum, s) => sum + s.ssoInsurance7PctToman, 0);
  const totalTax = payrollSlips.reduce((sum, s) => sum + s.incomeTaxToman, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner & Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">کل ناخالص حقوق ماهانه</div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900">
            {formatToman(totalGross)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">شامل مزایای انگیزشی و اضافه کار</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">خالص پرداختی به کارکنان</div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-800">
            {formatToman(totalNet)}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-bold">قابل واریز به حساب بانکی</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">بیمه تامین اجتماعی (۷٪ سهم کارگر)</div>
          <div className="text-base sm:text-lg font-extrabold text-blue-800">
            {formatToman(totalSSO)}
          </div>
          <div className="text-[10px] text-blue-600 mt-0.5">لیست دیسکت بیمه ماهانه</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">مالیات بر حقوق (پله‌ای)</div>
          <div className="text-base sm:text-lg font-extrabold text-purple-800">
            {formatToman(totalTax)}
          </div>
          <div className="text-[10px] text-purple-600 mt-0.5">کسر و تسویه با دارایی</div>
        </div>
      </div>

      {/* Generation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              محاسبه مکانیزه حقوق و دستمزد بر اساس بخشنامه ۱۴۰۳
            </h3>
            <p className="text-[11px] text-slate-500">
              حق مسکن ۹۰۰ هزار تومان • بن کارگری ۱.۴ میلیون تومان • حق اولاد ماده ۸۶
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
          >
            <option value={1}>فروردین</option>
            <option value={2}>اردیبهشت</option>
            <option value={3}>خرداد</option>
            <option value={4}>تیر</option>
            <option value={5}>مرداد</option>
            <option value={6}>شهریور</option>
            <option value={7}>مهر</option>
            <option value={8}>آبان</option>
            <option value={9}>آذر</option>
            <option value={10}>دی</option>
            <option value={11}>بهمن</option>
            <option value={12}>اسفند</option>
          </select>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'در حال محاسبه...' : 'محاسبه مجدد فیش‌ها'}</span>
          </button>
        </div>
      </div>

      {/* Slips Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto touch-scroll">
        <table className="w-full min-w-[700px] text-right text-xs">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="p-3.5">نام و کد پرسنلی</th>
              <th className="p-3.5">ماه کارکرد</th>
              <th className="p-3.5">حقوق پایه (تومان)</th>
              <th className="p-3.5">مزایا و بن</th>
              <th className="p-3.5">بیمه سهم کارگر (۷٪)</th>
              <th className="p-3.5">مالیات پله‌ای</th>
              <th className="p-3.5">خالص پرداختی (تومان)</th>
              <th className="p-3.5 text-center">مشاهده فیش</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {payrollSlips.map((slip) => (
              <tr key={slip.id} className="hover:bg-slate-50/70">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{slip.employeeName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    کد: {toPersianDigits(slip.personnelCode)}
                  </div>
                </td>
                <td className="p-3.5 font-semibold text-slate-700">
                  {slip.monthName} {toPersianDigits(slip.yearJalali)}
                </td>
                <td className="p-3.5 font-bold text-slate-800">
                  {formatToman(slip.baseSalaryToman)}
                </td>
                <td className="p-3.5 text-slate-600">
                  {formatToman(
                    slip.housingAllowanceToman +
                      slip.bonKargariToman +
                      slip.childAllowanceToman +
                      slip.commuteAllowanceToman
                  )}
                </td>
                <td className="p-3.5 text-blue-700 font-bold">
                  {formatToman(slip.ssoInsurance7PctToman)}
                </td>
                <td className="p-3.5 text-purple-700 font-bold">
                  {formatToman(slip.incomeTaxToman)}
                </td>
                <td className="p-3.5 font-extrabold text-emerald-800 text-sm">
                  {formatToman(slip.netSalaryToman)}
                </td>
                <td className="p-3.5 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedSlip(slip)}
                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="مشاهده جزئیات فیش رسمی"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              </div>

              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {/* Incomes & Allowances */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 pb-1 border-b border-emerald-200 flex items-center justify-between">
                <span>ردیف‌های حقوق و مزایای انگیزشی</span>
                <span className="text-[10px] text-emerald-700">مبالغ به تومان</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div className="flex justify-between">
                  <span>حقوق پایه ماهانه:</span>
                  <span className="font-bold">{formatToman(selectedSlip.baseSalaryToman)}</span>
                </div>
                <div className="flex justify-between">
                  <span>کمک هزینه مسکن (حق مسکن مصوب):</span>
                  <span className="font-bold">{formatToman(selectedSlip.housingAllowanceToman)}</span>
                </div>
                <div className="flex justify-between">
                  <span>بن خواربار (کمک‌هزینه اقلام مصرفی):</span>
                  <span className="font-bold">{formatToman(selectedSlip.bonKargariToman)}</span>
                </div>
                <div className="flex justify-between">
                  <span>حق اولاد (ماده ۸۶ تامین اجتماعی):</span>
                  <span className="font-bold">{formatToman(selectedSlip.childAllowanceToman)}</span>
                </div>
                <div className="flex justify-between">
                  <span>حق ایاب و ذهاب:</span>
                  <span className="font-bold">{formatToman(selectedSlip.commuteAllowanceToman)}</span>
                </div>
                <div className="flex justify-between">
                  <span>فوق‌العاده اضافه‌کاری:</span>
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
                  <span className="font-bold text-blue-800">
                    {formatToman(selectedSlip.ssoInsurance7PctToman)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>مالیات بر درآمد حقوق (پله‌ای):</span>
                  <span className="font-bold text-purple-800">
                    {formatToman(selectedSlip.incomeTaxToman)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-rose-200 flex justify-between font-extrabold text-rose-900">
                <span>جمع کل کسورات:</span>
                <span>
                  {formatToman(selectedSlip.ssoInsurance7PctToman + selectedSlip.incomeTaxToman)} تومان
                </span>
              </div>
            </div>

            {/* Reserves: Sanavat & Eidi */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between">
              <div>
                <span className="font-bold text-slate-700">ذخیره سنوات ماهانه: </span>
                <span>{formatToman(selectedSlip.sanavatReserveToman)} تومان</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">ذخیره عیدی پایان سال: </span>
                <span>{formatToman(selectedSlip.eidiReserveToman)} تومان</span>
              </div>
            </div>

            {/* Net Salary Highlight */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-100">مبلغ خالص قابل پرداخت به حساب بانکی:</div>
                <div className="text-xl font-black">{formatToman(selectedSlip.netSalaryToman)} تومان</div>
              </div>
              <button
                type="button"
                onClick={() => alert('نسخه PDF رسمی فیش حقوقی آماده چاپ می‌باشد.')}
                className="px-4 py-2 bg-white text-emerald-800 font-bold rounded-xl text-xs flex items-center gap-1 shadow-md hover:bg-emerald-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>چاپ فیش (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
