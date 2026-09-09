# ✍️ پرامپت بازنویسی متون — از «مصنوعی» به «ساده و شفاف» (UX Writing Cleanup)

> پرامپت مخصوص پاک‌سازی تمام متن‌های رابط کاربری از لحن ماشینی، کلمات فاخر بی‌معنی و
> اصطلاحات اضافی — برای Google AI Studio

---

## 📌 مشکل دقیقاً چیست؟ (با نمونه از کد فعلی)

| ❌ متن فعلی (مصنوعی) | ✅ چیزی که باید بشود |
|---|---|
| مرکز حاکمیت، آموزش و رفتار هوش مصنوعی (Gemini AI Governance) | تنظیمات دستیار هوشمند |
| هویت، نقش و تنظیمات بنیادین بات | تنظیمات عمومی دستیار |
| پیکربندی لحن، مدل استنتاجی، و نام مستعار دستیار هوش مصنوعی | لحن پاسخ، مدل و نام دستیار |
| مدل باکیفیت جهت استدلال چندبعدی، استخراج نقل‌قول‌های رزومه و خروجی ساختاریافته | مناسب تحلیل دقیق رزومه‌ها |
| فوق‌العاده رسمی، دقیق و فاخر سازمانی | رسمی و دقیق |
| جهت‌دهی به درک بنیادین هوش مصنوعی از موقعیت و هویت کارفرما | معرفی شرکت به دستیار برای پاسخ دقیق‌تر |
| سند جامع دانشی جهت تحلیل تطابق کارجویان با روح سازمانی سیلانه سبز | سند فرهنگ سازمانی برای سنجش تناسب کارجو با شرکت |
| مواردی که در صورت احراز در رزومه، بلافاصله اخطار قرمز وتو صادر می‌شود | موارد رد فوری رزومه |
| نمای ۳۶۰ درجه و پایش لحظه‌ای هلدینگ | وضعیت کلی شرکت در یک نگاه |
| شاخص‌های کلیدی منابع انسانی (HR KPI) | شاخص‌های کلیدی منابع انسانی |

همچنین یک مفهوم با سه کلمه مختلف صدا زده شده: **کارجو (۵۱ مورد)، متقاضی (۵)، داوطلب (۲)**.

---

## 🚀 پرامپت اصلی (در AI Studio پیست کنید)

```
You are a senior Persian UX writer reviewing "Kara HRMS" (سامانه منابع انسانی سیلانه سبز),
a Persian RTL HR system (React + Tailwind). The UI copy across the app was machine-generated
and reads artificial: literary filler words, meaningless jargon, redundant English in
parentheses, and inconsistent terminology. Your job is a FULL UX-WRITING CLEANUP of every
user-facing string, under strict rules.

═══════════════════════════════════════
1. SCOPE — what you may change
═══════════════════════════════════════
CHANGE: every user-facing Persian string in src/ — module titles & subtitles, section
headings, card labels, buttons, placeholders, helper texts, tooltips, toasts, empty states,
error messages, onboarding hints, confirm-dialog texts, aria-labels.
DO NOT CHANGE:
• Any logic, component structure, props, keys, enum values, CSS classes or API calls.
• Strings inside server/ — leave them exactly as they are (they are tested).
• Any factual/legal statement (labor-law articles, tax/insurance numbers, thresholds,
  quotas): you may simplify the surrounding words but NEVER alter the fact or number.
• Dynamic template values ({...}, variables) and Persian-digit formatting.
• The honesty labels «موتور محلی (بدون Gemini)» and all AI-transparency notes — keep
  their meaning verbatim.

═══════════════════════════════════════
2. STYLE RULES (apply to every string)
═══════════════════════════════════════
PLAIN LANGUAGE:
• Write like a calm, professional Iranian HR software — the way a human would explain
  it to a colleague. Short sentences. Common words.
• Replace literary/Arabic-heavy words with everyday equivalents:
  بنیادین→اصلی/پایه · فاخر→(حذف) · جهت‌دهی→(حذف یا بازنویسی) · احراز→مشاهده/وجود
  اغماض→(حذف) · استنتاجی→(حذف) · مبادرت→اقدام · گردید→شد · می‌باشد→است
  در راستای→برای · به منظور→برای · جهت→برای
• BANNED words/patterns anywhere in the UI: فاخر، بنیادین، چندبعدی، استنتاجی، روح سازمانی،
  جهت‌دهی، اغماض، جامع (when decorative), هوشمند (max once per screen unless it's a real
  product name), پایش لحظه‌ای، نمای ۳۶۰ درجه.

LENGTH:
• Page/section titles: 1–4 words. («حقوق و دستمزد», «تردد و مرخصی»)
• Subtitles: ONE sentence, max 10 words, saying what the user can DO here.
  Good: «صدور و پرداخت فیش حقوق کارکنان» — Bad: «صدور فیش بر مبنای بخشنامه سال،
  بیمه ۷٪ و مالیات پله‌ای» (keep facts in body/tooltips, not subtitles, unless essential).
• Helper text & tooltips: only if genuinely needed; max 15 words.
• Buttons: verb-first imperative, 1–3 words: «ذخیره», «افزودن رزومه», «تأیید مرخصی».
• Confirm dialogs: say exactly what will happen, in one line:
  «این فیش نهایی می‌شود و دیگر قابل ویرایش نیست. ادامه می‌دهید؟»

NOISE REMOVAL:
• Remove decorative English in parentheses. Whitelist (keep as-is): Gemini, OKR, KPI,
  GMP, PDF, DOCX, ZIP, FMCG. Everything else goes: (Tone of Voice)→حذف,
  (Gemini AI Governance)→حذف, (HR KPI)→حذف.
• Delete marketing adjectives that add no information: فوق‌العاده، بی‌نظیر، پیشرفته،
  قدرتمند، هوشمندِ اضافی.
• If a description repeats the title, delete the description.

ERRORS, EMPTY & STATUS MESSAGES:
• Errors: state WHAT happened + WHAT to do, politely, no blame, no drama.
  «فایل خوانده نشد. رزومه باید PDF یا Word متنی باشد (نه عکس اسکن‌شده).»
• Empty states: one short line + action. «هنوز رزومه‌ای بارگذاری نشده است.» + دکته
  «افزودن رزومه».
• Success toasts: short fact. «۱۲ رزومه ثبت شد.» — no exclamation-heavy prose.

═══════════════════════════════════════
3. TERMINOLOGY — unify before rewriting
═══════════════════════════════════════
First, output a glossary table and use it consistently across the whole app:
• کارجو — the ONLY word for a job applicant. Replace متقاضی/داوطلب/کاندید (in UI text).
• Use ONE word per concept everywhere: فیش حقوق (not فیش حقوقی/فیش پرداخت),
  تردد (not ورود و خروج در جای جای متن), مرخصی، دپارتمان (not واحد/بخش به‌طور متناوب),
  دستیار (for the AI bot), عنوان شغلی, سهمیه مرخصی, بانک استعدادها.
• Roles: مدیر منابع انسانی / مدیر دپارتمان / کارمند — keep these exact forms.
Present the glossary first and keep it as the single source of truth.

═══════════════════════════════════════
4. METHOD — work in this order
═══════════════════════════════════════
Step 1: Emit the glossary + banned-word list (as above).
Step 2: Rewrite strings module by module in this order, listing changed files each step:
  common (Sidebar/Header/CommandPalette/Toast) → dashboard → ai-governance →
  recruitment → employees → attendance → payroll → performance → training →
  checklists → analytics → mobile.
Step 3: Final consistency sweep: grep the whole src/ for banned words, parentheses
  English, and glossary violations; fix remainders.
Step 4: Report: files changed, count of strings rewritten, any string you deliberately
  kept and why (legal/factual/honesty labels).

═══════════════════════════════════════
5. ACCEPTANCE CHECKLIST
═══════════════════════════════════════
[ ] Zero occurrences of banned words (فاخر، بنیادین، چندبعدی، استنتاجی، روح سازمانی،
    جهت‌دهی، اغماض) in src/.
[ ] No decorative English parentheses beyond the whitelist.
[ ] Every subtitle ≤ 10 words; every button verb-first ≤ 3 words.
[ ] One concept = one word everywhere (کارجو only; فیش حقوق only; etc.).
[ ] All facts, numbers, legal references and honesty labels unchanged.
[ ] Zero logic changes: `npm run lint` passes and
    `node scripts/product_fix_verification.cjs` still passes.
[ ] A new user can read any screen and instantly know what it is and what to do —
    no sentence requires a second read.

Start with Step 1 (glossary), then proceed.
```

---

## 🔁 پرامپت پاس دوم (بعد از اجرای پرامپت اصلی)

```
نسخه فعلی را بازبینی کن: ۱) هر متنی که هنوز با یک بار خواندن فهمیده نمی‌شود را پیدا
و ساده کن؛ ۲) توضیحاتی که حذفشان چیزی را کم نمی‌کند حذف کن؛ ۳) هر جا متن دارد چیزی
را می‌گوید که آیکون یا رنگِ واضح می‌تواند بگوید، متن را حذف و آیکون/رنگ را تقویت کن؛
۴) گزارش بده چه چیزی را حذف کردی و چرا. هیچ منطقی را تغییر نده.
```

## 🇮🇷 نسخه فشرده فارسی (جایگزین)

```
تمام متن‌های رابط کاربری این سامانه منابع انسانی فارسی را از نو بنویس. مشکل فعلی:
لحن ماشینی، کلمات فاخر و بی‌معنی (مثل فاخر، بنیادین، چندبعدی، روح سازمانی)، انگلیسی
اضافه داخل پرانتز، و ناهماهنگی واژه‌ها (کارجو/متقاضی/داوطلب).
قوانین: عنوان‌ها ۱ تا ۴ کلمه؛ زیرعنوان‌ها یک جمله حداکثر ۱۰ کلمه که بگوید کاربر اینجا
چه کاری می‌تواند انجام دهد؛ دکمه‌ها فعل امری کوتاه؛ پیام خطا بگوید چه شد و چه کار کند؛
حالت خالی یک خط + دکمه اقدام. کلمات فاخر و قیدهای تزئینی و انگلیسی‌های داخل پرانتز
(به‌جز Gemini و OKR و GMP و فرمت فایل‌ها) حذف شوند. اول یک جدول واژگان یکپارچه بساز
(فقط «کارجو»، فقط «فیش حقوق»، فقط «تردد» و...) و در کل اپ اعمال کن. به هیچ وجه منطق،
کلاس‌ها، اعداد قانونی، آستانه‌ها و برچسب «موتور محلی (بدون Gemini)» را تغییر نده.
در پایان با جست‌وجو در کد تأیید کن هیچ کلمه ممنوعه‌ای باقی نمانده است.
```
