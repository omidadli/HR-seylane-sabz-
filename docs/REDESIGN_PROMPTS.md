# 🎨 پرامپت‌های ریدیزاین «کارا» در Google AI Studio

> بسته پرامپت مهندسی‌شده برای ریدیزاین سامانه منابع انسانی سیلانه سبز
> سبک: **دو تم روشن + تیره از روز اول** · محدوده: **فقط لایه ظاهری، بدون دست زدن به منطق سرور و APIها**

---

## 📌 نحوه استفاده (حتماً بخوانید)

1. بروید به **[aistudio.google.com/app](https://aistudio.google.com/app)** (قابلیت Build apps with Gemini) و یک پروژه جدید بسازید.
2. **ریپازیتوری را به‌صورت ZIP آپلود کنید** (یا فایل‌های `src/` را اضافه کنید) تا Gemini کد واقعی را ببیند، نه حدس.
3. مدل را روی **آخرین نسخه Gemini Pro** بگذارید.
4. پرامپت‌ها را **به ترتیب فازها** اجرا کنید — نه همه را یکجا. بعد از هر فاز، خروجی را با `npm run dev` ببینید و اسکرین‌شات مشکلات را به چت بفرستید.
5. پرامپت‌ها به **انگلیسی** نوشته شده‌اند چون خروجی کد بهتری می‌دهد؛ متن اپ همچنان کاملاً فارسی و RTL باقی می‌ماند. (یک نسخه فارسی «مگا پرامپت» هم در انتها هست.)
6. قانون طلایی: **هر پرامپت = یک فاز، با لیست صریح فایل‌هایی که اجازه تغییر دارند.** این مهم‌ترین ترفند برای جلوگیری از خراب شدن منطق توسط مدل است.

---

## 🧱 فاز ۰ — پرامپت زمینه (Context)

> این بلوک را **اول هر چت جدید** یا ابتدای هر فاز پیست کنید. به مدل می‌گوید پروژه چیست و چه خطوط قرمزی دارد.

```
PROJECT CONTEXT — read carefully before writing any code.

This is "Seilane Sabz HRMS" (سامانه منابع انسانی سیلانه سبز / "Kara"), an enterprise HR
system for an Iranian holding company (brands: Dafi, Common, Misswik).

Stack: React 19 + Vite + Tailwind CSS v4 + Express backend + Gemini AI integration.
The UI is 100% PERSIAN and RIGHT-TO-LEFT (RTL). Font: Vazirmatn.
All dates are JALALI (Solar Hijri). All numbers, dates and currency amounts must render
with Persian digits (use fa-IR Intl formatting, e.g. ۱۴۰۴/۰۶/۱۸ and ۱۲٬۵۰۰٬۰۰۰).

There are 3 roles: HR Director (full access), Department Manager (own department only),
Employee (personal data only). The UI must honestly reflect these permissions.

HARD CONSTRAINTS — never violate any of these:
1. Do NOT modify anything under `server/`, `server.ts`, `scripts/`, `prisma/`. Do NOT
   change any API endpoint URL, HTTP method, request/response payload, or status-code
   handling. Iranian labor-law logic (tax, bonuses, leave quotas, payroll period locks,
   RBAC) must remain untouched.
2. Keep every existing fetch() call, state variable and data flow exactly as-is.
   This is a VISUAL/UX redesign of the presentation layer only.
3. NEVER invent, hardcode or fake data. Null/undefined values (e.g. financial metrics
   hidden from non-HR roles) must render as an em-dash "—" placeholder.
4. Keep all UI copy in Persian. Do not translate labels to English.
5. Keep every existing feature, button and interaction working. Redesign ≠ remove.

Confirm you understand these constraints before generating code.
```

---

## 🎨 فاز ۱ — دیزاین سیستم و معماری تم (روشن/تیره)

> مهم‌ترین پرامپت کل فرایند. همه فازهای بعدی به این توکن‌ها وابسته‌اند.

```
Following the project constraints above, build a complete DESIGN SYSTEM for this HRMS
with full LIGHT + DARK theme support, implemented for Tailwind CSS v4.

Requirements:
1. In `src/index.css`, define CSS custom properties under `:root` (light) and
   `.dark` (dark) using a semantic naming scheme:
   --surface-0 (page bg), --surface-1 (cards), --surface-2 (elevated/hover),
   --border-default, --border-strong,
   --text-1 (primary), --text-2 (secondary), --text-3 (muted),
   --brand (primary action), --brand-hover, --brand-soft (tinted bg),
   --success, --warning, --danger, --info + a "-soft" tinted variant for each.
2. Light theme: clean enterprise look — cool off-white bg (#f7f8fa), white cards,
   emerald/green brand ramp (primary ≈ #0e9f6e) as a nod to the "Seilane Sabz"
   (Green Flow) brand. Dark theme: deep neutral bg (#0b0f13), elevated surfaces
   (#12181f), borders at ~8% white opacity, brand shifts lighter (≈ #34d399)
   for contrast. Both themes must pass WCAG AA contrast for text.
3. Register the tokens in Tailwind v4 via `@theme` so utilities like `bg-surface-1`,
   `text-2`, `border-default`, `bg-brand-soft` exist. Replace ad-hoc slate/emerald
   color usages in shared components with these semantic tokens.
4. Typography: Vazirmatn only. Scale: 12/13/14(body)/16/18/20/24/30. Line-height ≥1.6
   for Persian readability. Persian digits everywhere via `Intl.NumberFormat('fa-IR')`
   and `toLocaleDateString('fa-IR')`; keep the existing Jalali utilities as the source
   of truth for dates.
5. Radius: cards 14px, inputs/buttons 10px, pills 999px. Soft layered shadows in light;
   rely mostly on borders in dark mode.
6. Motion: 150–240ms, cubic-bezier(0.16, 1, 0.3, 1), respect `prefers-reduced-motion`.
7. Create `src/components/ui/theme.tsx`: a ThemeProvider with light/dark/system modes,
   persisted to localStorage, toggling the `.dark` class on <html>. Add a theme toggle
   control in the header.
8. Create reusable primitives in `src/components/ui/`: Button (primary/secondary/ghost/
   danger, sizes sm/md/lg, loading spinner state), Input & Select (with label + error
   message), Badge/StatusChip, Card, Modal, Drawer, Tabs, Tooltip, Skeleton, EmptyState
   (with a subtle inline SVG illustration and action slot), and Alert/Toast variants.
   All must work in both themes and in RTL.

Files you may change: `src/index.css`, `src/components/ui/*` (new),
`src/main.tsx` (wrap with ThemeProvider). Do NOT touch module components yet.
```

---

## 🧭 فاز ۲ — پوسته اصلی اپ (Shell)

```
Using the design system tokens from the previous step, redesign the application shell:

1. `Sidebar.tsx` — RTL sidebar pinned to the RIGHT edge. Width 264px, collapsible to a
   72px icon rail on desktop with a smooth width transition. Group the 10 modules into
   sections (e.g. "پیشخوان", "سرمایه انسانی", "عملیات", "هوش مصنوعی"). Show the existing
   role-based MODULE_ACCESS logic as-is: hidden items stay hidden; keep the lock icon for
   inaccessible items. Active item: brand-tinted background + a 3px rounded indicator bar.
   Add tooltips in collapsed mode. Keep Persian labels and descriptions.
2. `Header.tsx` — 64px sticky header with translucent backdrop blur: breadcrumb/page
   title on the right, global search trigger, theme toggle, Jalali "today" date chip,
   notifications, and role switcher (demo) styled as a segmented control.
3. `CommandPalette.tsx` — modern ⌘K palette: centered overlay, fuzzy search, keyboard
   navigation, grouped results, both themes.
4. `FloatingQuickActions.tsx` + `BottomNav.tsx` — restyle with the token system;
   bottom nav only on mobile, with active-state brand tint.
5. `Toast.tsx` — stack top-left (RTL-aware) with success/error/warning/info variants,
   auto-dismiss progress bar, slide-in animation.
6. Global loading: full-page branded loader with subtle pulse, not a raw spinner.

Only change the files listed. Preserve every existing prop, callback and behavior.
```

---

## 📊 فاز ۳ — داشبورد مدیریتی

```
Redesign `ExecutiveDashboard.tsx` only, keeping all data sources, props and role-based
visibility logic (financial card hidden for non-HR roles → render "—" when null):

- Open with a personalized greeting row: Persian greeting by time of day + Jalali date
  + up to 4 KPI stat cards (headcount, open positions, pending leaves, turnover).
  Each KPI card: icon in a brand-soft tile, big Persian-digit number, delta chip
  (▲/▼ with success/danger tint), and a subtle sparkline.
- Below: a responsive grid of chart cards (use existing recharts usage but restyle axes,
  gridlines and tooltips for both themes; brand-color series).
- "Needs attention" panel: pending leave approvals, draft payrolls, expiring contracts —
  as actionable rows with one-click shortcuts to the related module.
- Density toggle is NOT needed; instead use comfortable 16px card padding and clear
  13px secondary text. Skeleton loaders for every card while data fetches.
- Empty states for roles with limited data must look intentional (EmptyState component),
  never broken.
```

---

## 🎯 فاز ۴ — ماژول استخدام (کانبان)

```
Redesign the recruitment module UI ONLY (files under src/components/recruitment/),
preserving every API call, stage-transition rule and the server-validated pipeline
(no skipping stages — the UI must show disabled/locked states, not hide them):

1. `KanbanBoard.tsx` — horizontal RTL-scrollable board. Each stage column: header with
   Persian title, count chip, colored top accent per stage. Candidate cards: avatar with
   initials, name, role, AI score badge (color-graded: high=success, mid=warning,
   low=danger) with an explicit source label when scored by the local engine
   ("موتور محلی (بدون Gemini)"), and drag affordance. Cards lift on hover with shadow.
   Highlight the drop target column with a brand-tinted outline; if a move is invalid,
   animate a shake + error toast instead of silently failing.
2. `RecruitmentModule.tsx` — toolbar with search, filters as multi-select chips,
   and primary CTA "افزودن کارجو".
3. `BulkUploadModal.tsx` — drag-and-drop zone with dashed brand border, per-file status
   rows (icon, name, parse status: success/failure reason), progress bar, RTL-correct.
4. `AIAgentChat.tsx` — modern chat surface: message bubbles (assistant = surface-2,
   user = brand), timestamp in Jalali, typing indicator with 3 pulsing dots, always
   visible transparency note about the scoring source.
5. Modals (`CandidateCompareModal`, `EvaluationCriteriaManager`, etc.): consistent
   Modal primitive, radar chart restyled with brand colors for both themes.
Do not change any fetch URL, payload or validation logic.
```

---

## 👥 فاز ۵ — پرونده پرسنلی و چارت سازمانی

```
Redesign `EmployeesModule.tsx` only, preserving national-ID validation, uniqueness
checks, salary history and delete-protection behavior (409 → friendly Persian error toast):

- View switcher: table view / org chart view as a segmented control.
- Table: sticky header, row hover, avatars with initials and deterministic pastel,
  Persian-digit phone/salary formatting, column visibility control, sensitive columns
  (national ID, salary) shown masked with a reveal action only for authorized roles.
- Filters as composable chips above the table; instant client-side search with
  highlighted matches.
- Employee profile: full-page drawer from the side (RTL: slides from the left edge of
  content) with header (avatar, name, role, department chip, status badge), tabbed
  sections (مشخصات، قرارداد، تاریخچه حقوق، عملکرد). Salary history as a vertical
  timeline with Persian-digit amounts.
- Add/edit form: two-column responsive grid, inline validation messages in Persian,
  required-field markers, clear cancel/save footer.
- Org chart: card nodes with connector lines, department color coding, zoom-to-fit.
```

---

## ⏰ فاز ۶ — تردد و مرخصی

```
Redesign `AttendanceModule.tsx` and the shared `JalaliDatePicker.tsx`:

- Attendance view: weekly grid/heatmap of check-in–check-out records; late arrivals in
  warning tint, absences in danger tint, on-time in success tint. Legend below.
  Daily summary cards with Persian-digit hour totals.
- Leave requests: status chips (در انتظار = warning-soft, تأیید = success-soft,
  رد = danger-soft), approval flow buttons visible only per role, and a balance meter
  (progress ring or bar) showing used/remaining annual leave with the 9-day carryover
  rule surfaced as helper text.
- Leave request form in a modal with the Jalali date range picker, live "working days"
  count computed as the user picks dates, and an inline warning when the request exceeds
  quota (server still enforces; UI pre-warns).
- `JalaliDatePicker.tsx`: redesign as a polished RTL calendar — month/year dropdowns,
  today ring, selected-range brand tint, weekend/holiday distinction, keyboard navigation.
Keep all date math going through existing Jalali utilities and server "today" (Tehran).
```

---

## 💰 فاز ۷ — حقوق و دستمزد

```
Redesign `PayrollModule.tsx` only. Never touch payroll calculation logic, period locks,
or status transitions:

- Period selector as a Jalali month picker; locked periods (finalized/paid) show a lock
  icon and disabled actions with an explanatory tooltip.
- Payslip list: table with employee, gross/net in Persian digits, status lifecycle chips
  (پیش‌نویس = neutral, نهایی = info-soft, پرداخت‌شده = success-soft) and per-row actions
  gated by status and role.
- Payslip detail: a document-style card that looks like a real فیش حقوقی — company
  header, two-column layout of مزایا vs کسورات with a highlighted net line, print/PDF
  friendly styling (works in both themes), Persian-digit amounts throughout.
- Batch actions toolbar appears only when rows are selected; destructive actions require
  the confirm modal pattern.
```

---

## 🧩 فاز ۸ — ماژول‌های کوچک (عملکرد، آموزش، چک‌لیست، حاکمیت بات)

```
Redesign these four modules with one shared visual language, keeping all logic:
- `PerformanceModule.tsx`: OKR/KPI cards with progress bars toward targets, quarter
  selector chips, owner avatars, status chips.
- `TrainingModule.tsx`: course cards grid (cover icon tile, title, duration, capacity
  bar), enrolled state shown as success badge; duplicate-registration error as toast.
- `ChecklistsModule.tsx`: checklist cards with satisfying animated checkboxes
  (check stroke animation), Jalali date stamps per completed item, progress summary
  per checklist.
- `AIBotGovernanceModule.tsx`: governance console look — automation task rows with
  enable toggles, last-run Jalali timestamps, run buttons that always open the explicit
  confirmation dialog first; audit log as a monospaced-ish timeline.
Use the ui primitives (Card, Badge, Button, EmptyState, Skeleton) consistently.
```

---

## 📈 فاز ۹ — تحلیل و داشبورد تحلیلی

```
Redesign `AnalyticsModule.tsx` (HR-Director-only; keep that restriction):
- KPI ribbon across the top (Persian digits, deltas).
- Chart cards in a responsive grid: headcount trend, hiring funnel (real candidate data),
  turnover, leave usage by department. Restyle all recharts components for both themes:
  subtle gridlines, rounded bars, brand-color palette, RTL-aware axis labels, themed
  tooltips.
- Every chart card gets an export-style header (title + period) and a skeleton while
  loading. Metrics that are null for the role render "—", never 0, never fake numbers.
```

---

## 📱 فاز ۱۰ — نمای موبایل و دستیار صوتی

```
Redesign the mobile experience (files under src/components/mobile/):
- `MobileAppShell.tsx` + `MobileHome.tsx`: app-like feel — greeting header, quick-action
  grid (2×2 tiles with icons), horizontal snap-scrolling cards, bottom nav with
  brand-tinted active state. Safe-area padding for notched phones.
- `MobileVoiceCall.tsx`: full-screen voice assistant — animated pulsing orb while
  listening, live transcript bubble, explicit confirmation card BEFORE any action is
  executed (approve/reject buttons), haptic-feel button press animations.
- `MobileJobAdGenerator.tsx`: step wizard with progress dots, generated ad preview in a
  clean document card, copy-to-clipboard action with toast.
- Thumb-zone ergonomics: primary actions in the bottom 40% of the screen. Touch targets
  ≥44px. Both themes supported.
```

---

## ✨ فاز ۱۱ — پولیش نهایی (این فاز را انجام بده، کیفیت را همین تعیین می‌کند)

```
Final polish pass across the whole app, without changing any logic:
1. Loading: replace every remaining raw spinner with Skeleton layouts matching final
   component shapes.
2. Empty states: every list/table/grid gets an EmptyState with a helpful action
   (e.g. "هنوز کارجویی ثبت نشده — افزودن اولین کارجو").
3. Error handling: API errors surface as danger toasts with the server's Persian error
   message; form errors inline next to the field.
4. Focus & keyboard: visible focus-visible rings (2px brand) on all interactive
   elements; full keyboard operability for sidebar, palette, tables, modals
   (Escape closes, focus trap inside modals).
5. Micro-interactions: button press scale(0.98), card hover lift, list item staggered
   fade-in (max 5 items animated), animated number counting on KPI cards. All
   150–240ms, disabled under prefers-reduced-motion.
6. RTL audit: no `left/right` hardcoding where logical properties fit; icons and
   chevrons mirrored correctly; horizontal scroll areas start from the right.
7. Dark-mode audit: no white flashes, no pure-black surfaces, no low-contrast gray
   text below 4.5:1, charts and shadows re-checked.
8. Typography pass: consistent use of the scale; no mixed English/Persian digits
   anywhere; currency labels unified.
```

---

## 🔍 پرامپت‌های ممیزی (بعد از هر فاز استفاده کنید)

### الف) نقد UX روی اسکرین‌شات
> اسکرین‌شات صفحه را در چت آپلود کنید و بنویسید:

```
You are a senior product designer auditing a Persian RTL enterprise HR app.
Critique this screenshot brutally: list the top 7 issues in visual hierarchy,
spacing rhythm, contrast, alignment, and RTL correctness. For each issue give the
exact fix as a CSS/Tailwind change. Then implement the fixes in code.
```

### ب) ممیزی دسترسی‌پذیری

```
Run an accessibility audit of the current UI code: contrast ratios in both themes,
missing aria-labels (in Persian), keyboard traps, focus order in RTL, form labels.
Fix everything you find and list the changes.
```

### ج) ممیزی یکپارچگی

```
Scan all components for design-system drift: hard-coded hex colors outside the token
system, inconsistent radii/shadows/font sizes, buttons not using the Button primitive,
tables not sharing the same row styling. Report a table of violations, then fix them.
```

---

## 🩹 پرامپت‌های کوتاه رفع مشکلات رایج

| مشکل | پرامپت |
|---|---|
| فونت وزیرمتن لود نمی‌شود | `Ensure Vazirmatn is loaded for BOTH themes and weights 300–800, with a font-display: swap fallback stack. Verify no Latin font renders Persian text.` |
| اعداد انگلیسی در خروجی | `Find every place numbers, dates or currency render without Persian digits and route them through Intl fa-IR formatting or the existing Jalali utilities.` |
| جدول‌ها در موبایل می‌شکنند | `Make all data tables responsive: horizontal RTL scroll with sticky first column, or switch to stacked card layouts under 768px. No clipped content.` |
| کنتراست بد در دارک‌مود | `Audit the dark theme: list every text/background pair under 4.5:1 contrast and fix them using the semantic tokens only.` |
| انیمیشن زیاد/گیج‌کننده | `Reduce motion to essentials: keep micro-interactions ≤240ms, remove decorative loops, honor prefers-reduced-motion everywhere.` |
| به‌هم‌ریختگی RTL | `Audit this component for RTL issues: physical left/right positioning, icon direction, text alignment, scroll start position. Fix using logical properties (inset-inline-start, etc.).` |

---

## 🚀 مگا پرامپت (اگر خواستید یکجا شروع کنید)

> نسخه فارسی برای شروع سریع — همین را در ابتدای چت جدید پیست کنید:

```
تو یک طراح محصول ارشد و مهندس فرانت‌اند هستی. این ریپازیتوری یک سامانه منابع انسانی
فارسی و راست‌به‌چپ به نام «کارا» برای هلدینگ سیلانه سبز است (React + Tailwind v4).

می‌خواهم فقط لایه ظاهری را بازطراحی کنی، با این شرایط:

خط قرمزها:
- هیچ تغییری در پوشه server/ ، فایل server.ts ، اسکریپت‌ها، آدرس/پی‌لود هیچ API و هیچ
  قانون کسب‌وکار (قانون کار، مرخصی، قفل دوره حقوق، RBAC) نده.
- هیچ داده‌ای نساز یا جعل نکن؛ مقدارهای null با «—» نمایش داده شوند.
- همه متن‌ها فارسی، همه اعداد و تاریخ‌ها با ارقام فارسی و تقویم جلالی بمانند.
- فونت فقط وزیرمتن.

هدف طراحی:
- یک دیزاین‌سیستم با توکن‌های معنایی (سطح، متن، برند، وضعیت‌ها) با دو تم کامل
  روشن و تیره + سوییچر تم با ذخیره در localStorage.
- تم روشن: سازمانیِ تمیز، پس‌زمینه خاکستری بسیار روشن، کارت‌های سفید، رنگ برند
  سبز زمردی. تم تیره: پس‌زمینه تیره عمیق با سطوح لایه‌ای و حاشیه‌های ظریف.
- سایدبار سمت راست با گروه‌بندی ماژول‌ها و حالت جمع‌شونده، هدر چسبان با بلور،
  کارت‌های KPI با ارقام فارسی، جدول‌ها با هدر چسبان، مودال و توست و اسکلت بارگذاری
  و حالت خالی برای همه فهرست‌ها.
- میکرواینترکشن‌های ظریف ۱۵۰ تا ۲۴۰ میلی‌ثانیه و احترام به prefers-reduced-motion.
- کنتراست حداقل AA و ناوبری کامل با کیبورد.

ابتدا فقط دیزاین‌سیستم (توکن‌ها در index.css + کامپوننت‌های پایه در src/components/ui)
و پوسته اصلی (سایدبار و هدر و سوییچر تم) را بساز و خلاصه تغییراتت را فهرست کن.
بعد از تأیید من، ماژول‌ها را یکی‌یکی ادامه می‌دهیم.
```

---

## ✅ چک‌لیست تحویل نهایی

- [ ] هر دو تم روشن/تیره در همه ۱۰ ماژول بدون ناهنجاری رنگی
- [ ] صفر عدد انگلیسی، صفر تاریخ میلادی، صفر داده جعلی
- [ ] فونت وزیرمتن در همه وزن‌ها لود می‌شود
- [ ] هر سه نقش (مدیر منابع انسانی / مدیر واحد / کارمند) را دستی چک کردید
- [ ] خطاهای سرور (۴۰۰/۴۰۳/۴۰۹) به‌صورت توست فارسی درست نمایش داده می‌شوند
- [ ] کیبورد: ⌘K، Tab، Escape همه کار می‌کنند
- [ ] موبایل: ناوبری پایین، اهداف لمسی ≥۴۴ پیکسل
- [ ] `npm run lint` (tsc) بدون خطا · همه ۴۷ آزمون رگرسیون هنوز سبز:
      `node scripts/product_fix_verification.cjs`
