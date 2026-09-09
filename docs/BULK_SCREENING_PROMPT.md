# 🎯 پرامپت جامع «استودیوی غربالگری رزومه» (Bulk Screening Studio)

> پرامپت مهندسی‌شده برای Google AI Studio — بازطراحی کامل بخش «بارگذاری گروهی» در ماژول استخدام
> هدف: بارگذاری تعداد نامحدود رزومه → استخراج با درصد پیشرفت → تحلیل هوش مصنوعی در صفحه اختصاصی انیمیشنی → داشبورد تصمیم‌گیری با نمودار و شواهد

---

## 📌 نحوه استفاده

1. در **[aistudio.google.com/app](https://aistudio.google.com/app)** ریپازیتوری را ZIP و آپلود کنید.
2. پرامپت اصلی (بخش «MASTER PROMPT») را یکجا پیست کنید. اگر خروجی ناقص بود، از «نقشه فازبندی» در انتها استفاده کنید و فاز به فاز بخواهید.
3. بعد از اجرا: `npm run dev` → تست با ۱۰+ فایل واقعی → سپس `node scripts/product_fix_verification.cjs` برای اطمینان از سالم ماندن منطق محصول.

---

## 🧠 طراحی ایده‌آل (معماری تجربه‌ای که پرامپت می‌سازد)

```
┌─ فاز ۱: انتخاب موقعیت ──── پیکر سلسله‌مراتبی: دسته ← دپارتمان ← عنوان شغلی + سرچ + ساخت شغل جدید
├─ فاز ۲: ورودی نامحدود ──── دراپ‌زون بی‌حد + فهرست مجازی‌سازی‌شده + استخراج با حلقه درصد و شمارنده زنده
├─ فاز ۳: ارسال خردمند ───── بچ‌های ۱۰تایی به همان API فعلی + پیشرفت یکپارچه + بازتلاشی بچ خطاخورده
├─ فاز ۴: تئاتر آنالیز ───── صفحه تمام‌صفحه با تایم‌لاین مراحل، کارت‌های زنده، KPIهای شمارشی
└─ فاز ۵: داشبورد تصمیم ─── دونات دسته‌ها، هیستوگرام نمرات، رادار معیارها، ۴ تب (مصاحبه/بررسی/رد/استعدادها)
                               هر کارت: حلقه نمره + خلاصه مدیریتی + «مدرک از دل رزومه» + «چرا این نمره؟»
```

---

## ✅ نکات فنی که در پرامپت لحاظ شده (چرا قابل اتکاست)

- مدل داده فعلی **همه چیز را دارد**: `criteriaScores`، `criteriaFeedback`، `resumeQuotes` (شواهد متنی!)، `executiveSummary`، `aiAvailable` — فقط در جریان بارگذاری گروهی نمایش داده نمی‌شوند. پرامپت همین داده‌های واقعی را به داشبورد می‌آورد؛ هیچ داده ساخته نمی‌شود.
- ارسال **بچ‌بچ (۱۰ فایل در هر درخواست)** به همان `POST /api/candidates/bulk-upload` فعلی → بدون نیاز به تغییر سرور، برای ۲۰۰+ رزومه هم پایدار است (بدنه ۵۰ مگابایتی مجاز است).
- دسته‌بندی‌ها **پیشنهاد** می‌مانند؛ هیچ مرحله‌ای خودکار تغییر نمی‌کند (اصل محصول).

---

---

# 🚀 MASTER PROMPT

> ⬇️ از اینجا به بعد را کامل در Google AI Studio پیست کنید (بهتر است همراه ریپازیتوری آپلودشده):

```
You are a principal product designer + senior full-stack engineer. You are working inside
the uploaded repository: "Kara HRMS" (سامانه منابع انسانی سیلانه سبز) — a Persian, fully
RTL enterprise HR system (React 19 + Vite + Tailwind v4 + Express). Rebuild the
"Bulk Resume Upload" experience of the Recruitment module into a world-class
"Bulk Screening Studio".

═══════════════════════════════════════════
A. PROJECT FACTS — read before coding
═══════════════════════════════════════════
- UI is 100% Persian, RTL, font Vazirmatn, Persian digits everywhere
  (Intl.NumberFormat('fa-IR'); dates via existing Jalali utilities in src/utils/jalali.ts).
- Existing pieces you MUST reuse (do not reinvent):
  • src/components/recruitment/BulkUploadModal.tsx  — current modal to replace.
  • src/utils/resumeTextExtraction.ts — client-side PDF/DOCX/TXT text extraction.
  • POST /api/candidates/bulk-upload — accepts { jobId, files: [{name, size, text, sourceZip}] },
    evaluates every resume against the job's weighted criteria (server concurrency = 5) and returns:
    { success, processedCount, skippedCount, skipped, aiAvailable,
      interviewPriorityCount, needsReviewCount, initialRejectionCount, sampleCandidates, message }.
    Auth: HR Director only. Server JSON body limit is 50mb.
  • GET /api/candidates?jobId=&category=&talentPool= — refetch full evaluated list anytime.
  • PATCH /api/candidates/:id/stage — server enforces legal stage transitions (invalid = 409).
  • PATCH /api/candidates/:id/talent-pool, POST /api/candidates/:id/draft-email,
    POST /api/candidates/compare — existing actions to wire in.
  • Candidate model already contains REAL evaluation data you must surface:
    overallScore (1–10), category (INTERVIEW_PRIORITY | NEEDS_REVIEW | INITIAL_REJECTION),
    strengths[], weaknesses[], resumeQuotes[] (verbatim evidence from the resume),
    criteriaScores{title→score}, criteriaFeedback{title→justification}, executiveSummary,
    aiAvailable (false = scored by labeled local engine, NOT Gemini), inTalentPool
    (true when INITIAL_REJECTION but score ≥ 4.5).
  • Job model: criteria[] {title, weight}, scoringMethod, aiRigor,
    interviewPriorityThreshold (default 7), initialRejectionThreshold (default 5).
- Departments are currently a FLAT array ALL_SEILANEH_DEPARTMENTS inside BulkUploadModal.

═══════════════════════════════════════════
B. HARD CONSTRAINTS — never violate
═══════════════════════════════════════════
1. Do NOT touch payroll, leave, attendance, employees, RBAC, statutory/labor-law code,
   or any endpoint outside recruitment. The screening engine in server/gemini.ts is
   read-only for you — no changes to scoring, thresholds or prompts.
2. Zero fabricated data. Every number, score, quote and chart on screen must come from
   real extraction results or real API responses. Nulls render as "—".
3. If aiAvailable is false, every AI output carries the badge
   «موتور محلی (بدون Gemini)». Never imply Gemini was used when it wasn't.
4. Categories are RECOMMENDATIONS. No automatic stage changes ever; every move is a
   human action; 409/403 server errors surface as Persian toasts.
5. Keep the flow fully working with NO Gemini key (local engine path).

═══════════════════════════════════════════
C. WHAT TO BUILD — 5 PHASES
═══════════════════════════════════════════

── PHASE 1 · Hierarchical Job & Department Picker ──────────────────────────────
Replace the flat department dropdown with a premium 3-level picker component
(new file src/components/recruitment/HierarchicalJobPicker.tsx):
- Level 1 «دسته» → Level 2 «دپارتمان» → Level 3 «عنوان شغلی».
- Seed the tree from the existing 13 departments, grouped into 6 categories, each with
  a lucide icon + accent color, e.g.:
   تولید و مهندسی (کارخانجات اشتهارد و سیمین‌دشت، مهندسی و نت، HSE)
   کیفیت و تحقیق‌وتوسعه (R&D، QA & QC)
   فروش، مارکتینگ و زنجیره تامین (برندها و PR، فروش سراسری، لجستیک، CRM)
   مالی و حقوقی (امور مالی، حقوقی و رگولاتوری)
   فناوری اطلاعات (زیرساخت و تحول دیجیتال)
   سرمایه انسانی (منابع انسانی، آموزش و فرهنگ سازمانی)
- UI: a popover with instant Persian fuzzy search across ALL levels (matches highlight),
  cascading columns or drill-down with breadcrumb of the chosen path, full keyboard
  navigation (↑↓ Enter Esc), each job row shows its criteria count + thresholds as meta.
- «+ عنوان شغلی جدید» inline at level 3: compact form (عنوان، نوع استخدام، شهر،
  توضیح کوتاه) → POST /api/jobs (existing default criteria), then auto-select it.
- Recently used jobs as quick chips (localStorage). Selected job summary card shows
  thresholds (e.g. «مصاحبه ≥ ۷ · رد < ۵») and criteria weights.

── PHASE 2 · Unlimited Intake + Extraction Progress ────────────────────────────
Rebuild the intake step of the modal into a wizard (step 1: موقعیت, step 2: فایل‌ها,
step 3: تأیید و شروع):
- Dropzone accepts UNLIMITED files (multi-select, drag-drop, ZIP auto-unpack — keep the
  existing JSZip logic, skip __MACOSX/.DS_Store/non-resume files).
- Staged list must stay smooth at 500+ rows (windowed rendering or content-visibility).
  Each row: type icon, name, size, live status chip
  (در صف / در حال استخراج / استخراج شد / ناموفق + دلیل).
- Deduplicate by name+size with a notice chip «N فایل تکراری حذف شد».
- Extraction runs client-side via extractResumeText with concurrency ≤ 4.
- Progress area: large radial percentage ring (e.g. ۶۷٪) + segmented linear bar,
  live counters «کل / استخراج‌شده / در حال استخراج / ناموفق» and an ETA estimate.
- Failures list reasons honestly (اسکن تصویری بدون متن / رمزدار / خراب) with
  «حذف همه ناموفق‌ها» action. CTA: «ادامه با N رزومه سالم» (disabled while extracting).

── PHASE 3 · Smart Batched Screening ───────────────────────────────────────────
- Split extracted files into batches of 10 (or ~2MB payload) and call the EXISTING
  POST /api/candidates/bulk-upload per batch, max 2 batches in flight.
  No server changes required.
- One unified progress model across both phases: extraction = 30% of total,
  AI evaluation = 70%; the bar and percentage never move backwards.
- As each batch returns: aggregate counts, remember skipped files, and publish an event
  with that batch's evaluated candidates (refetch GET /api/candidates?jobId=... to be
  exact). A failed batch shows «تلاش مجدد» without losing other batches.
- The moment the FIRST batch completes, auto-open the Analysis Theater (phase 4) and
  keep streaming results in live.

── PHASE 4 · Analysis Theater (full-screen, animated) ──────────────────────────
New component src/components/recruitment/ScreeningTheater.tsx — a full-screen takeover
(NOT a modal) that opens when analysis starts:
- Animated vertical/horizontal stage timeline with 4 steps that check off progressively:
  ۱. دریافت رزومه‌ها  ۲. تطبیق با معیارهای موقعیت  ۳. امتیازدهی چندمعیاره
  ۴. دسته‌بندی و پیشنهاد — steps 2–4 advance proportionally with completed batches.
- Center: count-up KPIs (پردازش‌شده، میانگین نمره، زمان سپری‌شده) in Persian digits.
- Live wall: each completed candidate appears as a card with a flip/slide-in animation —
  name, score chip color-graded by category, tiny engine badge (Gemini / موتور محلی).
- Header shows job title + department breadcrumb and the engine badge of the batch.
- «پرش به گزارش نهایی» button always available; auto-continue to the Decision
  Dashboard when all batches finish (with a brief completion animation).
- Motion: 150–300ms, cubic-bezier(0.16,1,0.3,1), respects prefers-reduced-motion.

── PHASE 5 · Decision Dashboard (گزارش تحلیل) ──────────────────────────────────
New component src/components/recruitment/ScreeningReport.tsx — replaces the tiny
"processedStats" summary with an executive analysis page:
HEADER: job title, department path, engine badge, Jalali date, elapsed time,
  thresholds used («مصاحبه ≥ ۷ · رد < ۵») and criteria weights as small chips.
KPI HERO (4 cards, count-up): کل پردازش‌شده · میانگین نمره · ٪ مناسب مصاحبه ·
  ردشده/ناموفق در استخراج.
CHARTS (recharts, theme-aware, RTL labels, Persian digits):
  • Donut: سهم هر دسته — ۴ برش: اولویت مصاحبه / نیاز به بررسی / رد اولیه / بانک استعدادها
    (talent pool = INITIAL_REJECTION ∧ score ≥ 4.5 ∧ inTalentPool).
  • Histogram: توزیع نمرات ۱ تا ۱۰.
  • Radar: میانگین نمره هر معیار ارزیابی شغل (aggregate criteriaScores).
  • Bar: پرتکرارترین نقاط قوت شناسایی‌شده (frequency of strengths strings).
BUCKET TABS (segmented control with count chips, default = اولویت مصاحبه):
  🎯 اولویت مصاحبه | 🔍 نیاز به بررسی | ❌ رد اولیه | 💎 بانک استعدادها
CANDIDATE CARD (inside each tab, sorted by score desc):
  • Avatar initials, name, resume filename, colored score RING (0–10).
  • executiveSummary paragraph.
  • Top-3 strengths as success chips; weaknesses as muted chips.
  • EVIDENCE block: first resumeQuote rendered as a styled quotation with a «مدرک از
    رزومه» label — this is the trust anchor; if empty show «—».
  • Expandable «چرا این نمره؟» → per-criterion score bars + criteriaFeedback text.
  • Engine badge on every card; checkbox for comparison.
ACTIONS:
  • Per card: انتقال به مرحله بعد (PATCH stage — respect 409), افزودن/حذف بانک استعدادها،
    پیش‌نویس ایمیل, مشاهده رزومه (opens resumeText in a drawer).
  • Compare bar: selecting 2–3 cards opens the existing CandidateCompareModal.
  • Tab-level: «انتخاب همه» + bulk stage move (per-item toasts on 409), and
    «خروجی CSV» of the filtered tab (Persian-digit columns, UTF-8 BOM).
EMPTY STATES: friendly EmptyState per tab; SKELTONS while a batch is still streaming.

═══════════════════════════════════════════
D. VISUAL & QUALITY BAR
═══════════════════════════════════════════
- Enterprise-grade Persian RTL design: consistent 8px spacing rhythm, 12–14px card radii,
  soft shadows, semantic colors (success/warning/danger tinted chips), Vazirmatn only.
- Both light and dark appearance must work (use existing token approach if present,
  otherwise CSS variables).
- Micro-interactions: card hover lift, count-up numbers, staggered card entrances,
  radial progress easing; all ≤300ms; disabled under prefers-reduced-motion.
- Accessibility: keyboard operable picker and tabs, focus-visible rings, Persian
  aria-labels, contrast ≥ 4.5:1.
- Performance: 500 staged files without jank; batches never block UI thread;
  extraction pool concurrency ≤ 4; batches in flight ≤ 2.

═══════════════════════════════════════════
E. ACCEPTANCE CHECKLIST (verify each item)
═══════════════════════════════════════════
[ ] 200 mixed PDF/DOCX/TXT + one ZIP upload → smooth list, correct ٪ extraction progress,
    scanned-image files reported as failures with reasons (never silently dropped).
[ ] Screening of 200 resumes completes via batches; a killed batch can be retried alone.
[ ] Theater opens automatically on first completed batch and animates new results in.
[ ] Report page shows ONLY real data from the API: donut/histogram/radar match the
    actual candidates; switching tabs filters correctly; counts add up to processedCount.
[ ] Every candidate card shows evidence quote + «چرا این نمره؟» justifications.
[ ] Without GEMINI_API_KEY the whole flow works and shows «موتور محلی (بدون Gemini)».
[ ] No automatic stage changes anywhere; 409 responses surface as Persian toasts.
[ ] Picker: search finds a job from any level; creating a new job title works via
    POST /api/jobs and gets selected.
[ ] node scripts/product_fix_verification.cjs still passes; payroll/leave/attendance
    modules untouched.

Start by listing the files you will create/modify, then implement phases 1→5 in order.
```

---

## 🧩 اگر خواستید فازبه‌فاز اجرا کنید

| نوبت | پرامپت کوتاه |
|---|---|
| ۱ | «فقط فاز ۱ (پیکر سلسله‌مراتبی دپارتمان/شغل) را از پرامپت اصلی بساز» |
| ۲ | «فقط فاز ۲ و ۳ (ورودی نامحدود + استخراج با درصد + ارسال بچ‌بچ) را بساز» |
| ۳ | «فقط فاز ۴ (تئاتر آنالیز تمام‌صفحه انیمیشنی) را بساز» |
| ۴ | «فقط فاز ۵ (داشبورد تصمیم با نمودارها و ۴ دسته) را بساز» |
| ۵ | اسکرین‌شات بفرستید: «این خروجی را ممیزی کن: مشکلات چیدمان، RTL، کنتراست و انیمیشن را فهرست و اصلاح کن» |

## 🇮🇷 نسخه فشرده فارسی (در صورت نیاز)

```
این ریپازیتوری سامانه منابع انسانی فارسی/راست‌به‌چپ «کارا» است. بخش «بارگذاری گروهی
رزومه» در ماژول استخدام را به یک «استودیوی غربالگری» پنج‌مرحله‌ای تبدیل کن:
۱) انتخاب موقعیت با پیکر سه‌سطحی دسته←دپارتمان←عنوان شغلی، سرچ فوری و ساخت شغل جدید؛
۲) پذیرش تعداد نامحدود فایل (ZIP هم خودکار باز شود)، استخراج متن همه رزومه‌ها در مرورگر
با حلقه درصد پیشرفت و شمارنده زنده و دلیل برای فایل‌های ناموفق؛
۳) ارسال رزومه‌ها در بچ‌های ده‌تایی به همان آدرس فعلی /api/candidates/bulk-upload با
پیشرفت یکپارچه و امکان تلاش مجدد بچِ خطاخورده؛
۴) باز شدن خودکار صفحه تمام‌صفحه «تئاتر آنالیز» با تایم‌لاین مراحل و کارت‌های زنده‌ای
که با انیمیشن اضافه می‌شوند؛
۵) داشبورد نهایی با آمار واقعی: دونات چهار دسته (اولویت مصاحبه / نیاز به بررسی /
رد اولیه / بانک استعدادها)، هیستوگرام نمرات، رادار معیارها، و کارت هر کارجو با حلقه
نمره، خلاصه تحلیلی، «مدرک از دل رزومه» و بخش بازشونده «چرا این نمره؟».
قوانین: هیچ داده‌ای ساخته نشود؛ بدون کلید Gemini برچسب «موتور محلی (بدون Gemini)»
نمایش داده شود؛ هیچ تغییر مرحله‌ای خودکار انجام نشود؛ به هیچ ماژول دیگری (حقوق، مرخصی،
تردد، RBAC) دست نزن؛ همه اعداد فارسی و تقویم جلالی بماند.
```
