# پرامپت‌های فازی برای کلاد (Claude) — رفع باگ‌های سامانه HR سیلانه سبز

این فایل شامل پرامپت‌های آمادهٔ کپی‌پیست برای **Claude** است که در چند فاز مجزا، باگ‌های شناسایی‌شده در `BUG_REPORT_FE_BE.md` را برطرف کند.

> **نحوهٔ استفاده:** هر فاز را جداگانه و به‌ترتیب به کلاد بدهید. بعد از هر فاز، `npx tsc --noEmit` و `npm run build` و در صورت نیاز `node scripts/product_fix_verification.cjs` را اجرا کنید و قبل از فاز بعدی تأیید بگیرید. هر پرامپت به‌صورت مستقل (self-contained) نوشته شده است.

---

## فاز ۱ — حذف داده‌های جعلی/تصادفی از بک‌اند (HireVue، ZipRecruiter، متریک‌های تحلیل)

**پرامپت (کپی کنید):**

```
تو پروژهٔ HR سیلانه سبز (ریپوی فعلی) کار می‌کنی. فقط روی این فایل بک‌اند کار کن: server.ts و در صورت نیاز server/store.ts.

هدف این فاز: حذف کامل هر عدد تصادفی/جعلی که به‌صورت «دادهٔ واقعی» به کلاینت برگردانده می‌شود، و جایگزینی با رفتار صادقانه.

سه باگ زیر را برطرف کن:

1) ارزیابی ویدیویی HireVue (endpoint: POST /api/competitor/hirevue/evaluate-submission، حدود خطوط 737-739):
   - الان overallScore / confidenceScore / clarityScore با Math.random ساخته می‌شوند و aiRecommendation همیشه 'STRONG_RECOMMEND' است.
   - رفتار جدید: دیگر هیچ نمرهٔ تصادفی تولید نکن. اگر متن transcript موجود است و GEMINI_API_KEY تنظیم شده، آن را واقعاً به Gemini بفرست و نمرهٔ واقعی استخراج کن. اگر کلید نیست یا transcript خالی است، پاسخ صادقانه با فیلد `source: 'simulation'` و `aiAvailable: false` برگردان (نه عدد ساختگی) و aiRecommendation را null یا 'NOT_AVAILABLE' بگذار.

2) سندیکیشن ZipRecruiter (endpoint: POST /api/competitor/ziprecruiter/toggle-syndication، حدود خط 797):
   - الان impressionsCount با Math.random افزایش می‌یابد. این افزایش تصادفی را حذف کن. فقط تغییر وضعیت کانال و به‌روزرسانی lastSyncJalali با تاریخ واقعی تهران انجام شود.

3) متریک‌های تحلیل (endpoint: GET /api/analytics/metrics، حدود خطوط 1728-1729):
   - الان averageTimeToHireDays و costPerHireToman از مقادیر ثابت seed (16 و 6800000) خوانده می‌شوند ولی پاسخ computed:true دارد.
   - رفتار جدید: یا این دو مقدار را واقعاً از دادهٔ زنده محاسبه کن (مثلاً time-to-hire از فاصلهٔ appliedAtJalali تا رسیدن به stage=HIRED؛ و costPerHire در صورت وجود دادهٔ هزینه) یا اگر منطق معتبری نداری، برای هر دو مقدار null برگردان و کامنت بگذار که هنوز محاسبه نمی‌شود.

محدودیت‌های سخت (این‌ها را تغییر نده):
- رفتار RBAC و سایر endpoint ها را دست نزن.
- فرمت پاسخ و نام فیلدهای موجود در بقیهٔ endpoint ها را تغییر نده.
- همهٔ توابع تولید تاریخ باید همچنان از tehranNow() / Asia/Tehran استفاده کنند.

معیار پذیرش:
- دیگر هیچ Math.random در server.ts در مسیرهای HireVue و ZipRecruiter نباشد.
- npx tsc --noEmit بدون خطا باشد و سرور بالا بیاید و /api/health 200 بدهد.
```

---

## فاز ۲ — تصمیم‌گیری دربارهٔ ماژول «حاکمیت هوش مصنوعی» (شکاف FE/BE)

**پرامپت (کپی کنید):**

```
تو پروژهٔ HR سیلانه سبز (ریپوی فعلی) کار می‌کنی.

زمینه: کامپوننت فرانت‌اند `src/components/ai-governance/AIBotGovernanceModule.tsx` چهار endpoint را صدا می‌زند که هیچ‌کدام در بک‌اند (server.ts) وجود ندارند:
  - GET /api/ai-governance/config
  - PUT /api/ai-governance/config
  - POST /api/ai-governance/test-connection
  - POST /api/ai-governance/test-evaluate

علاوه بر آن، این ماژول از مسیر Command Palette قابل دسترسی است در حالی که در Sidebar با comingSoon غیرفعال شده. یعنی کاربر به یک ماژول شکسته با 404 های متعدد می‌رسد.

مأموریت (گزینهٔ B را پیاده‌سازی کن، چون ماژول از قبل کامل نوشته شده):

1) در server.ts چهار endpoint بالا را پیاده‌سازی کن:
   - config: در حافظه (و ترجیحاً در snapshot ذخیره‌سازی موجود در store.ts) نگه‌دار، با GET/PUT.
   - test-connection: تست واقعی اتصال به Gemini (در صورت وجود GEMINI_API_KEY) و برگرداندن {connected, model, latencyMs, apiKeyPresent}.
   - test-evaluate: اجرای ارزیابی رزومه با استفاده از تابع موجود evaluateCandidateWithCriteria در server/gemini.ts (نه منطق جدید و نه عدد تصادفی).

2) هماهنگ‌سازی دسترسی ماژول:
   - پرچم comingSoon آیتم ai-governance در Sidebar را بردار (چون حالا واقعی است).
   - فیلتر Command Palette و selectModule در App.tsx را طوری کنار هم بیاور که یک منبع واحد حقیقت برای دسترسی ماژول‌ها وجود داشته باشد (نقش + در دسترس بودن).

محدودیت‌های سخت:
- از sanitize/safeJsonParse موجود در gemini.ts برای هر خروجی JSON از Gemini استفاده کن.
- در نبود کلید Gemini، test-connection باید صادقانه connected:false برگرداند و test-evaluate باید از fallback محلی برچسب‌دار (aiAvailable:false) موجود استفاده کند؛ هیچ عدد تصادفی تولید نکن.
- RBAC: این endpoints باید فقط برای HR_DIRECTOR و DEPT_MANAGER قابل دسترسی باشند (از requireRole موجود استفاده کن).

معیار پذیرش:
- هر چهار endpoint پاسخ درست بدهند (نه 404).
- npx tsc --noEmit و npm run build بدون خطا.
- ماژول از Sidebar باز شود و «دریافت تنظیمات» بدون خطا باشد و «تست اتصال» پاسخ منطقی بدهد.
```

---

## فاز ۳ — رفع همگام‌سازی state پرسنل بین ماژول و App

**پرامپت (کپی کنید):**

```
تو پروژهٔ HR سیلانه سبز (ریپوی فعلی) کار می‌کنی.

زمینه: در src/App.tsx فقط onCreateEmployee به ماژول پرونده پرسنلی پاس داده می‌شود. اما EmployeesModule عملیات ویرایش (PATCH /api/employees/:id) و حذف (DELETE /api/employees/:id) را مستقیم با fetch انجام می‌دهد و فقط state محلی خودش (localEmployees) را به‌روز می‌کند. نتیجه: بعد از ویرایش/حذف، آرایهٔ employees در سطح App کهنه می‌ماند و داشبورد/تحلیل/تردد/پورتال موبایل دادهٔ قدیمی نشان می‌دهند.

مأموریت:
1) در App.tsx دو handler جدید بساز:
   - handleUpdateEmployee(id, patch) که PATCH را با apiFetch انجام دهد و state مرکزی employees را به‌روز کند.
   - handleDeleteEmployee(id) که DELETE را انجام دهد و پرسنل را از state مرکزی حذف کند.
   (هر دو باید خطاهای واقعی سرور مثل 409 را با showToast نمایش دهند.)
2) این دو handler را به EmployeesModule پاس بده و در EmployeesModule به‌جای fetch مستقیم برای ویرایش/حذف از همین propها استفاده کن.
3) بعد از ویرایش/حذف، اگر لازم است سایر داده‌های وابسته هم به‌روز شوند، از fetchData موجود در App استفاده کن (یا state مرکزی را به‌شکل سازگار به‌روز کن).

محدودیت‌های سخت:
- پروتکل API و قواعد سرور (اعتبارسنجی کد ملی، مسدودیت حذف 409 به‌دلیل سوابق قانونی) را تغییر نده؛ فقط لایهٔ کلاینت را اصلاح کن.
- تجربهٔ UX موجود در EmployeesModule (مودال ویرایش، دیالوگ حذف، نمایش 409 با پیشنهاد تغییر وضعیت به RESIGNED) حفظ شود.

معیار پذیرش:
- بعد از ویرایش نام/حقوق/دپارتمان یا حذف یک پرسنل در ماژول پرونده پرسنلی، داشبورد و سایر ماژول‌ها بلافاصله مقدار جدید را نشان دهند (بدون reload دستی).
- npx tsc --noEmit بدون خطا.
```

---

## فاز ۴ — رفع باگ‌های UI (نوار پیشرفت جعلی، سال پیش‌فرض حقوق، تاریخ‌های hardcoded، برچسب‌ها)

**پرامپت (کپی کنید):**

```
تو پروژهٔ HR سیلانه سبز (ریپوی فعلی) کار می‌کنی. فقط روی فایل‌های فرانت‌اند زیر کار کن.

چهار باگ UI را برطرف کن:

1) نوار پیشرفت جعلی در بارگذاری گروهی رزومه — src/components/recruitment/BulkUploadModal.tsx (حدود خط 542):
   - الان پیشرفت با setInterval و Math.random بالا می‌رود. این را حذف کن.
   - به‌جای آن، نوار را به حالت‌های واقعی گره بزن: «در حال ارسال فایل‌ها» (۰-۳۰٪) → «در حال پردازش سرور» (۳۰-۹۰٪ indeterminate) → «انجام شد» (۱۰۰٪) یا «خطا» (توقف).
   - متن مرحله را با فیلد aiAvailable واقعی که سرور برمی‌گرداند هماهنگ کن (وقتی موتور محلی است، ادعای «در Gemini» نکن).

2) سال پیش‌فرض ماژول حقوق — src/components/payroll/PayrollModule.tsx (حدود خط 222):
   - useState(1404) را طوری تغییر بده که بعد از دریافت GET /api/payroll/years، سال انتخابی روی currentYearJalali تنظیم شود (با fallback امن در صورت خطای fetch).

3) دادهٔ fallback ساختگی در تحلیل‌ها — src/components/analytics/AnalyticsModule.tsx:
   - آرایهٔ defaultDepts با اعداد ثابت (48/32/26/18/15/12) را حذف کن. اگر دادهٔ واقعی مرخصی برای یک دپارتمان نبود، صفر یا حالت «داده ناکافی» نشان بده، نه عدد ساختگی.
   - تاریخ fallback '۱۴۰۳/۰۶/۱۸' را با مقدار واقعی از metrics.computedAtJalali یا تاریخ تهران جایگزین کن.

4) تاریخ‌های hardcoded و برچسب سال:
   - src/components/checklists/ChecklistsModule.tsx (خط 121): fallback '۱۴۰۳/۰۶/۱۵' را حذف/اصلاح کن.
   - src/components/common/Sidebar.tsx (خط 416): برچسب «قانون کار ۱۴۰۳» را به سال جاری یا بدون عدد سال به‌روز کن.

محدودیت‌های سخت:
- منطق بک‌اند را دست نزن.
- استایل/چیدمان کلی را حفظ کن؛ فقط مقادیر و رفتار را اصلاح کن.

معیار پذیرش:
- npx tsc --noEmit بدون خطا.
- هیچ Math.random در BulkUploadModal برای پیشرفت نماند.
- هیچ تاریخ hardcoded ۱۴۰۳ در این فایل‌ها نماند.
```

---

## فاز ۵ — پاک‌سازی نهایی (alert→Toast، کد پرسنلی، اسناد، تردد HR)

**پرامپت (کپی کنید):**

```
تو پروژهٔ HR سیلانه سبز (ریپوی فعلی) کار می‌کنی.

چهار مورد باقی‌مانده با اولویت پایین‌تر را تمیز کن:

1) جایگزینی alert() با سیستم Toast در این نقاط (از showToast در src/components/common/Toast.tsx استفاده کن):
   - src/components/ai-governance/AIBotGovernanceModule.tsx (خطوط 169 و 190)
   - src/components/employees/EmployeeProfileDrawer.tsx (خط 457)
   - src/components/recruitment/BulkUploadModal.tsx (خطوط 372 و 376)
   - src/components/recruitment/EvaluationCriteriaManager.tsx (خط 285)
   - src/components/recruitment/RecruitmentModule.tsx (خط 167)
   (برای پیام‌های خطا از showToast('...','error') و برای هشدار از 'info'/'warning' استفاده کن.)

2) تولید کد پرسنلی در server.ts (خطوط 455 و 1039):
   - به‌جای تولید تصادفی ۳ رقمی در بازهٔ محدود، تولید ترتیبی بر اساس بیشینهٔ کد پرسنلی موجود انجام بده و حلقهٔ while را با سقف تکرار امن کن.

3) ثبت تردد برای دیگران توسط HR:
   - در src/App.tsx تابع handleCheckInOut را طوری گسترش بده که employeeId اختیاری بپذیرد و در صورت وجود، به /api/attendance/check-in-out بفرستد.
   - در src/components/attendance/AttendanceModule.tsx برای نقش HR یک انتخاب‌کنندهٔ پرسنل (یا حداقل ارسال employeeId صحیح) فراهم کن تا مدیر بتواند تردد سایر همکاران را ثبت کند. اگر نمی‌خواهی UI بزرگ بسازی، حداقل مسیر API را درست کن و UI را شفاف کن.

4) اسناد پرسنلی غیرعملیاتی:
   - در src/components/employees/EmployeeProfileDrawer.tsx دکمهٔ مشاهدهٔ سند که فقط alert می‌دهد را اصلاح کن: اگر fileUrl برابر '#' یا خالی است، دکمه غیرفعال و با عنوان «سندی بارگذاری نشده» نمایش داده شود به‌جای alert.

محدودیت‌های سخت:
- قواعد سرور (RBAC، اعتبارسنجی، مسدودیت‌های 409) را تغییر نده.
- هیچ دادهٔ جعلی/تصادفی جدید معرفی نکن.

معیار پذیرش:
- npx tsc --noEmit بدون خطا و npm run build موفق.
- دیگر alert() در این فایل‌ها نباشد (به‌جز در مواردی که واقعاً تأیید کاربر لازم است، که باید از مودال تأیید استفاده شود).
```

---

## فاز ۶ (اختیاری) — اجرای رگرسیون کامل و مستندسازی

**پرامپت (کپی کنید):**

```
تو پروژهٔ HR سیلانه سبز (ریپوی فعلی) کار می‌کنی.

بعد از اعمال تمام اصلاحات فازهای قبلی، این کارها را انجام بده:

1) اجرای کامل آزمون‌ها و رفع هر شکست:
   - سرور را اجرا کن (npm run dev) و مطمئن شو /api/health 200 برمی‌گرداند.
   - data/hrms-store.json را موقتاً حذف کن و node scripts/product_fix_verification.cjs را اجرا کن؛ همهٔ ۴۷ آزمون باید سبز باشند.
   - node scripts/strict_e2e_test.cjs را اجرا کن؛ همهٔ ۷ آزمون باید سبز باشند.
   - npx tsc --noEmit و npm run build باید بدون خطا باشند.

2) اگر آزمونی شکست خورد، علت را پیدا و برطرف کن (بدون تضعیف سایر آزمون‌ها).

3) در پایان یک خلاصهٔ کوتاه از تغییرات (فایل‌های تغییرکرده و دلیل) بنویس و در پاسخ ارائه بده.

محدودیت سخت: هیچ باگ/محدودیتی را که در فازهای قبلی برطرف شد دوباره معرفی نکن.
```

---

## راهنمای ترتیب و کنترل کیفیت

| فاز | موضوع | ریسک | بعد از فاز چک کنید |
|---|---|---|---|
| ۱ | دادهٔ جعلی بک‌اند | کم | `tsc` + `grep Math.random server.ts` |
| ۲ | ماژول حاکمیت AI (FE/BE) | متوسط | باز شدن ماژول از Sidebar بدون 404 |
| ۳ | همگام‌سازی state پرسنل | متوسط | ویرایش/حذف پرسنل → به‌روزرسانی داشبورد |
| ۴ | باگ‌های UI | کم | `tsc` + عدم وجود ۱۴۰۳ hardcoded |
| ۵ | پاک‌سازی نهایی | کم | `tsc` + `build` + نبود alert |
| ۶ | رگرسیون کامل | — | هر دو سوئیت سبز |
