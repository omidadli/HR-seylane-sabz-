/**
 * Jalali (Shamsi / Persian) Calendar & Formatting Engine
 * Complete implementation for Gregorian-to-Jalali conversion,
 * Persian month days, leap year calculation, Persian numbers, and Rial/Toman formatters.
 */

export const JALALI_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const JALALI_WEEK_DAYS = [
  { key: 6, short: 'ش', name: 'شنبه' },
  { key: 0, short: 'ی', name: 'یکشنبه' },
  { key: 1, short: 'د', name: 'دوشنبه' },
  { key: 2, short: 'س', name: 'سه‌شنبه' },
  { key: 3, short: 'چ', name: 'چهارشنبه' },
  { key: 4, short: 'پ', name: 'پنج‌شنبه' },
  { key: 5, short: 'ج', name: 'جمعه' },
];

export interface JalaliDate {
  year: number;
  month: number; // 1 - 12
  day: number;   // 1 - 31
}

/**
 * Checks if a Jalali year is a leap year (سال کبیسه)
 */
export function isJalaliLeapYear(jy: number): boolean {
  // Leap calculation ported from the well-tested jalCal algorithm
  // (same leap table as the official Iranian calendar:
  // ..., 1395, 1399, 1403, 1408, 1412, 1416, 1420, ...).
  // A year is leap when `leap === 0`.
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  const bl = breaks.length;
  let jp = breaks[0];
  let jump = 0;
  for (let i = 1; i < bl; i += 1) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }
  let n = jy - jp;
  // Find how many years have passed since the last leap year.
  if (jump - n < 6) {
    n = n - jump + Math.floor((jump + 4) / 33) * 33;
  }
  const mod = (a: number, b: number): number => a - Math.trunc(a / b) * b;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }
  return leap === 0;
}

/**
 * Returns the number of days in a given Jalali month
 */
export function getJalaliMonthDays(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

/**
 * Converts Gregorian Date to Jalali Date (Solar Hijri)
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    (365 * gy) +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { year: jy, month: jm, day: jd };
}

/**
 * Converts Jalali Date to Gregorian Date
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): { year: number; month: number; day: number } {
  let jy_adj = jy + 1595;
  let days =
    -355668 +
    (365 * jy_adj) +
    (Math.floor(jy_adj / 33) * 8) +
    Math.floor(((jy_adj % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm: number;
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) {
    gd -= sal_a[gm];
  }
  return { year: gy, month: gm, day: gd };
}

/**
 * Returns current Jalali Date
 */
export function getTodayJalali(): JalaliDate {
  const d = new Date();
  return gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

/**
 * Formats a JalaliDate to standard string (e.g. ۱۴۰۳/۰۶/۱۵ or 1403/06/15)
 */
export function formatJalaliDate(jDate: JalaliDate, toPersian: boolean = true): string {
  const mm = String(jDate.month).padStart(2, '0');
  const dd = String(jDate.day).padStart(2, '0');
  const raw = `${jDate.year}/${mm}/${dd}`;
  return toPersian ? toPersianDigits(raw) : raw;
}

/**
 * Returns human readable Persian date string e.g. "۱۵ شهریور ۱۴۰۳"
 */
export function formatJalaliDateReadable(jDate: JalaliDate): string {
  const monthName = JALALI_MONTH_NAMES[jDate.month - 1] || '';
  return `${toPersianDigits(jDate.day)} ${monthName} ${toPersianDigits(jDate.year)}`;
}

/**
 * Converts English digits to Persian digits (0-9 -> ۰-۹)
 */
export function toPersianDigits(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Converts Persian digits to English digits
 */
export function toEnglishDigits(input: string): string {
  const persianMap: Record<string, string> = {
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  };
  return input.replace(/[۰-۹]/g, (w) => persianMap[w] || w);
}

/**
 * Formats a numeric amount into Persian Toman with thousands separators
 * e.g. 35000000 -> "۳۵,۰۰۰,۰۰۰ تومان"
 */
export function formatToman(amount: number | string | bigint | undefined | null): string {
  if (amount === undefined || amount === null) return '۰ تومان';
  const num = typeof amount === 'bigint' ? Number(amount) : Number(amount);
  if (isNaN(num)) return '۰ تومان';
  const formatted = num.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} تومان`;
}

/**
 * Formats a numeric amount into Persian Rial
 */
export function formatRial(amount: number | string | bigint | undefined | null): string {
  if (amount === undefined || amount === null) return '۰ ریال';
  const num = typeof amount === 'bigint' ? Number(amount) : Number(amount);
  if (isNaN(num)) return '۰ ریال';
  const formatted = num.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} ریال`;
}

/**
 * Calculates start weekday of a Jalali month (0 = Shanbeh, 6 = Jomeh)
 */
export function getJalaliMonthStartWeekday(jy: number, jm: number): number {
  const g = jalaliToGregorian(jy, jm, 1);
  const gDate = new Date(g.year, g.month - 1, g.day);
  const gDay = gDate.getDay(); // 0 = Sunday, 6 = Saturday
  // In Persian calendar: Saturday (6) is index 0
  return (gDay + 1) % 7;
}
