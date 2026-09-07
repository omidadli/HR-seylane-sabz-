import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  Calendar,
  Award,
  CheckSquare,
  Search,
  Phone,
  Mail,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Briefcase,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Employee, LeaveRequest, PayrollSlip } from '../../types';

interface MobilePersonnelPortalProps {
  employees: Employee[];
  leaves: LeaveRequest[];
  payrollSlips: PayrollSlip[];
  onBack?: () => void;
}

export const MobilePersonnelPortal: React.FC<MobilePersonnelPortalProps> = ({
  employees,
  leaves,
  payrollSlips,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'leaves' | 'onboarding'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlip, setSelectedSlip] = useState<PayrollSlip | null>(null);

  const filteredEmployees = employees.filter(
    (e) =>
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-14">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/25"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-sm sm:text-base font-black flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-300" />
                کارتابل جامع امور اداری و پرسنلی
              </h1>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                مدیریت احکام، تردد، مرخصی و فیش حقوقی مطابق قانون کار ۱۴۰۳
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
            activeTab === 'employees'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          👥 لیست پرسنل
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
            activeTab === 'payroll'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💰 فیش‌های حقوقی
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
            activeTab === 'leaves'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🏖️ مرخصی و تردد
        </button>
        <button
          onClick={() => setActiveTab('onboarding')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap text-center ${
            activeTab === 'onboarding'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 ورود همکاران جدید
        </button>
      </div>

      {/* TAB 1: EMPLOYEES DIRECTORY */}
      {activeTab === 'employees' && (
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی همکار بر اساس نام، شغل یا دپارتمان..."
              className="w-full pr-9 pl-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          <div className="space-y-2">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{emp.fullName}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {emp.jobTitle} • {emp.department}
                    </span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono mt-0.5 inline-block">
                      کد پرسنلی: {emp.personnelCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${emp.mobile}`}
                    className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                    title="تماس تلفنی"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`mailto:${emp.email}`}
                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    title="ارسال ایمیل"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PAYROLL SLIPS */}
      {activeTab === 'payroll' && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <span className="font-bold block">دوره مالی جاری: شهریور ۱۴۰۳</span>
              <span className="text-[10px] text-emerald-700">
                بر اساس مصوبات شورای عالی کار و کسر ۷٪ بیمه تامین اجتماعی
              </span>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold">
              نهایی‌شده
            </span>
          </div>

          <div className="space-y-2">
            {payrollSlips.map((slip) => (
              <div
                key={slip.id}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{slip.employeeName}</span>
                    <span className="text-[10px] text-slate-500">
                      کد پرسنلی: {slip.personnelCode} • دوره {slip.periodMonthJalali}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">خالص پرداختی:</span>
                    <span className="text-xs font-black text-emerald-700 font-mono">
                      {(slip.netPayRials / 10).toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                {/* Detailed breakdown breakdown */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500">جمع ناخالص مزایا: </span>
                    <span className="font-bold text-slate-700 font-mono">
                      {(slip.grossPayRials / 10).toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">کسورات قانونی: </span>
                    <span className="font-bold text-rose-600 font-mono">
                      {(slip.totalDeductionsRials / 10).toLocaleString('fa-IR')} ت
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEAVES & ATTENDANCE */}
      {activeTab === 'leaves' && (
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">مانده مرخصی استحقاقی قانونی:</span>
              <span className="text-xs font-bold text-emerald-800">
                ۲۶ روز کاری در سال (۲.۱۶ روز در هر ماه)
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              سیستم اتوماتیک
            </span>
          </div>

          <div className="space-y-2">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{leave.employeeName}</span>
                    <span className="text-[10px] text-slate-500">
                      نوع: {leave.type === 'DAILY' ? 'روزانه استحقاقی' : 'ساعتی'} • {leave.daysCount} روز
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      leave.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {leave.status === 'APPROVED' ? 'تایید شده' : 'در انتظار تایید'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">
                  علت: {leave.reason}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>از {leave.startDateJalali} تا {leave.endDateJalali}</span>
                  <span>تاریخ ثبت: {leave.createdAtJalali}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ONBOARDING */}
      {activeTab === 'onboarding' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
          <span className="font-bold text-slate-800 block">
            بسته خوش‌آمدگویی و ان‌بوردینگ همکاران جدید هلدینگ سیلانه سبز:
          </span>

          <div className="space-y-2">
            {[
              { title: 'تحویل پکیج محصولات خوش‌آمدگویی (برندهای دافی و کامان)', done: true },
              { title: 'ثبت پرونده طب کار و آزمایشات بدو استخدام', done: true },
              { title: 'صدور کارت تردد الکترونیکی و ثبت انگشت در کارخانجات اشتهارد', done: true },
              { title: 'معرفی به مدیر مستقیم دپارتمان و همکاران تیم', done: true },
              { title: 'افتتاح حساب بانکی حقوق و عضویت در بیمه تکمیلی سامان', done: false },
              { title: 'گذراندن دوره آشنایی با ارزش‌ها و استانداردهای کیفی سیلانه سبز', done: false },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between bg-slate-50"
              >
                <span className="text-slate-800 text-[11px] flex-1">{item.title}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                    item.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.done ? 'تکمیل شد' : 'در دست اقدام'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
