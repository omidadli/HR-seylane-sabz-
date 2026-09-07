/**
 * In-memory repository with comprehensive Iranian seed data for all 8 HR modules
 * Provides live CRUD operations and serves as the active data layer
 */

import {
  JobPosting,
  Candidate,
  CandidateStage,
  CandidateCategory,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveType,
  LeaveStatus,
  PayrollSlip,
  PayrollStatus,
  PerformanceGoal,
  TrainingCourse,
  SkillMatrixItem,
  ChecklistItem,
  HRDashboardMetrics,
  UserRole,
} from '../src/types';

export class HRMSStore {
  public currentUserRole: UserRole = UserRole.HR_DIRECTOR;

  public jobs: JobPosting[] = [
    {
      id: 'job-1',
      title: 'کارشناس ارشد توسعه فرانت‌اند (React / TypeScript)',
      department: 'فناوری اطلاعات و مهندسی نرم‌افزار',
      employmentType: 'تمام‌وقت (حضوری / منعطف)',
      location: 'تهران، پارک فناوری پردیس / ستاد مرکزی',
      description: 'ما در جستجوی یک توسعه‌دهنده باتجربه فرانت‌اند با تسلط عمیق بر اکوسیستم مدرن React، تایپ‌اسکریپت و اصول طراحی رابط کاربری RTL هستیم.',
      requirements: 'تسلط بر React 19، TypeScript، Tailwind CSS، مدیریت وضعیت، معماری Clean و بهینه‌سازی عملکرد وب اپلیکیشن‌های سازمانی.',
      status: 'ACTIVE',
      createdAtJalali: '۱۴۰۳/۰۵/۱۰',
      applicationsCount: 8,
      criteria: [
        { id: 'c1', title: 'تسلط بر React و معماری کلاینت', weight: 30, description: 'تجربه کامپوننت‌نویسی تمیز و هوک‌های اختصاصی' },
        { id: 'c2', title: 'تایپ‌اسکریپت پیشرفته و مدیریت خطا', weight: 25, description: 'طراحی تایپ‌های ایزوله و Type-Safety کامل' },
        { id: 'c3', title: 'طراحی واکنش‌گرا و سازگاری کامل RTL', weight: 20, description: 'پیاده‌سازی روان قالب‌های راست‌چین فارسی' },
        { id: 'c4', title: 'روحیه کار تیمی و مهارت‌های ارتباطی', weight: 15, description: 'مشارکت فعال در بررسی کد و متدولوژی چابک' },
        { id: 'c5', title: 'سابقه کار با تست‌نویسی و ابزارهای CI/CD', weight: 10, description: 'آشنایی با تست واحد و ابزارهای بیلد مدرن' },
      ],
    },
    {
      id: 'job-2',
      title: 'مدیر محصول ارشد (Senior Product Manager)',
      department: 'مدیریت محصول و نوآوری',
      employmentType: 'تمام‌وقت',
      location: 'تهران، ونک',
      description: 'هدایت نقشه راه محصولات سازمانی، کشف نیازهای مشتریان B2B ایرانی و هماهنگی میان تیم‌های بازاریابی، طراحی و مهندسی.',
      requirements: 'حداقل ۴ سال سابقه مدیریت محصول در شرکت‌های مقیاس‌بالا، تسلط بر چارچوب اسکرام، تحلیل داده با SQL و مصاحبه با کاربران.',
      status: 'ACTIVE',
      createdAtJalali: '۱۴۰۳/۰۶/۰۱',
      applicationsCount: 5,
      criteria: [
        { id: 'c21', title: 'تفکر محصولی و استراتژی بازار ایران', weight: 35, description: 'شناخت نیازمندی‌های سازمانی و رگولاتوری داخلی' },
        { id: 'c22', title: 'تحلیل داده و شاخص‌های کلیدی (KPIs)', weight: 25, description: 'توانایی کار با سنجه‌های نگهداشت و رشد کاربر' },
        { id: 'c23', title: 'رهبری تیم متقاطع و ارتباط با ذینفعان', weight: 25, description: 'مذاکره اثربخش و حل تعارضات تیمی' },
        { id: 'c24', title: 'آشنایی با تجربه کاربری (UX Research)', weight: 15, description: 'طراحی سفر کاربر و پروتوتایپ سریع' },
      ],
    },
    {
      id: 'job-3',
      title: 'کارشناس منابع انسانی و جذب استعداد (Tech Recruiter)',
      department: 'منابع انسانی',
      employmentType: 'تمام‌وقت',
      location: 'تهران، میدان ونک',
      description: 'مدیریت فرایند سرچ، غربالگری رزومه‌ها، مصاحبه‌های اولیه و توسعه برند کارفرمایی سازمان در حوزه فناوری.',
      requirements: 'تسلط بر فنون مصاحبه مبتنی بر شایستگی، شبکه‌سازی فعال در لینکدین و آشنایی با قوانین کار و تامین اجتماعی.',
      status: 'ACTIVE',
      createdAtJalali: '۱۴۰۳/۰۶/۱۲',
      applicationsCount: 3,
      criteria: [
        { id: 'c31', title: 'تکنیک‌های مصاحبه مبتنی بر شایستگی', weight: 35, description: 'ارزیابی مدل رفتاری STAR و صلاحیت‌های نرم' },
        { id: 'c32', title: 'استعدادیابی در حوزه IT و مهندسی', weight: 30, description: 'درک اصطلاحات فنی و کانال‌های جذب متخصصین' },
        { id: 'c33', title: 'آشنایی با قانون کار و قراردادهای استخدامی', weight: 20, description: 'قرارداد کار معین، آزمایشی و الزامات قانونی' },
        { id: 'c34', title: 'انرژی مثبت و مهارت‌های ارتباطی قوی', weight: 15, description: 'تجربه تعامل همدلانه با متقاضیان' },
      ],
    },
  ];

  public candidates: Candidate[] = [
    {
      id: 'cand-1',
      jobId: 'job-1',
      jobTitle: 'کارشناس ارشد توسعه فرانت‌اند (React / TypeScript)',
      fullName: 'نیلوفر رضوانی',
      email: 'n.rezvani@example.com',
      phone: '09123456789',
      resumeFileName: 'Niloufar_Rezvani_Resume.pdf',
      resumeText: `سوابق تحصیلی: کارشناسی ارشد مهندسی نرم‌افزار دانشگاه صنعتی شریف.
سوابق شغلی:
- توسعه‌دهنده ارشد فرانت‌اند در شرکت داده‌پردازی آریا (۱۴۰۰ تاکنون): بازطراحی داشبورد سازمانی با React 18 و TypeScript، کاهش زمان لود صفحه به میزان ۴۰٪، هدایت تیم ۴ نفره فرانت‌اند.
- برنامه‌نویس وب در استارتاپ پیشرو (۱۳۹۸ تا ۱۴۰۰): پیاده‌سازی سیستم دیزاین سیستم کامل با Tailwind CSS و طراحی ریسپانسیو RTL.
مهارت‌ها: React, TypeScript, Next.js, Redux Toolkit, Tailwind CSS, Jest, RTL UI/UX.`,
      overallScore: 9.2,
      category: CandidateCategory.INTERVIEW_PRIORITY,
      stage: CandidateStage.IN_PERSON_INTERVIEW,
      strengths: [
        'تسلط عمیق و اثبات‌شده بر React و تایپ‌اسکریپت در مقیاس‌های سازمانی بالا',
        'سابقه رهبری فنی و بازطراحی سیستم دیزاین با تمرکز بر RTL فارسی',
        'تحصیلات ممتاز مهندسی از دانشگاه شریف با پایه علمی مستحکم',
      ],
      weaknesses: [
        'تجربه کمتر در تست‌های End-to-End پیشرفته با Cypress نسبت به سایر بخش‌ها',
      ],
      resumeQuotes: [
        '«بازطراحی داشبورد سازمانی با React 18 و TypeScript، کاهش زمان لود صفحه به میزان ۴۰٪»',
        '«پیاده‌سازی سیستم دیزاین سیستم کامل با Tailwind CSS و طراحی ریسپانسیو RTL»',
      ],
      criteriaScores: {
        'تسلط بر React و معماری کلاینت': 9.5,
        'تایپ‌اسکریپت پیشرفته و مدیریت خطا': 9.2,
        'طراحی واکنش‌گرا و سازگاری کامل RTL': 9.8,
        'روحیه کار تیمی و مهارت‌های ارتباطی': 9.0,
        'سابقه کار با تست‌نویسی و ابزارهای CI/CD': 8.0,
      },
      inTalentPool: false,
      scheduledInterview: '2026-09-12T10:00:00Z',
      interviewJalali: '۱۴۰۳/۰۶/۲۲ ساعت ۱۰:۰۰',
      interviewType: 'مصاحبه فنی و کدنویسی زنده (حضوری)',
      interviewNotes: 'تسلط عالی روی مفاهیم همزمانی و معماری هوک‌ها دارد. آماده ارزیابی نهایی در جلسه حضوری.',
      appliedAtJalali: '۱۴۰۳/۰۶/۰۵',
    },
    {
      id: 'cand-2',
      jobId: 'job-1',
      jobTitle: 'کارشناس ارشد توسعه فرانت‌اند (React / TypeScript)',
      fullName: 'امیرحسین کاظمی',
      email: 'a.kazemi@example.com',
      phone: '09351234567',
      resumeFileName: 'Amirhossein_Kazemi_CV.pdf',
      resumeText: `سوابق: کارشناسی فناوری اطلاعات دانشگاه تهران.
۳ سال سابقه برنامه‌نویسی React و جاوااسکریپت در شرکت فناوران نوین.
پروژه‌ها: پنل فروشگاهی، وب‌اپلیکیشن سفارش آنلاین غذا.
مهارت‌ها: React, JavaScript ES6+, HTML5, CSS3, Bootstrap, REST APIs.
علاقه‌مند به یادگیری عمیق‌تر تایپ‌اسکریپت و اصول مهندسی نرم‌افزار.`,
      overallScore: 6.4,
      category: CandidateCategory.NEEDS_REVIEW,
      stage: CandidateStage.PHONE_INTERVIEW,
      strengths: [
        'تجربه خوب کار عملی با React و پیاده‌سازی رابط کاربری فروشگاهی',
        'آشنایی با نیازهای روزمره فرانت‌اند و کار با APIهای RESTful',
      ],
      weaknesses: [
        'سابقه کار با تایپ‌اسکریپت محدود است و به تازگی شروع به یادگیری کرده',
        'آشنایی کم با ابزارهای تست‌نویسی خودکار و استانداردهای اینترپرایز',
      ],
      resumeQuotes: [
        '«۳ سال سابقه برنامه‌نویسی React و جاوااسکریپت در شرکت فناوران نوین»',
        '«علاقه‌مند به یادگیری عمیق‌تر تایپ‌اسکریپت و اصول مهندسی نرم‌افزار»',
      ],
      criteriaScores: {
        'تسلط بر React و معماری کلاینت': 7.0,
        'تایپ‌اسکریپت پیشرفته و مدیریت خطا': 5.0,
        'طراحی واکنش‌گرا و سازگاری کامل RTL': 7.5,
        'روحیه کار تیمی و مهارت‌های ارتباطی': 7.2,
        'سابقه کار با تست‌نویسی و ابزارهای CI/CD': 4.5,
      },
      inTalentPool: false,
      scheduledInterview: '2026-09-14T14:30:00Z',
      interviewJalali: '۱۴۰۳/۰۶/۲۴ ساعت ۱۴:۳۰',
      interviewType: 'مصاحبه غربالگری تلفنی',
      interviewNotes: 'برای موقعیت ارشد شاید نیاز به تسلط بیشتر در TS داشته باشد، برای موقعیت Mid-Level بسیار مستعد است.',
      appliedAtJalali: '۱۴۰۳/۰۶/۰۷',
    },
    {
      id: 'cand-3',
      jobId: 'job-1',
      jobTitle: 'کارشناس ارشد توسعه فرانت‌اند (React / TypeScript)',
      fullName: 'سارا مهدی‌پور',
      email: 'sara.mehdipour@example.com',
      phone: '09198765432',
      resumeFileName: 'Sara_Mehdipour_Resume.pdf',
      resumeText: `سوابق: فارغ‌التحصیل رشته گرافیک رایانه.
۶ ماه کارآموزی طراحی رابط کاربری با فیگما و ساخت قالب‌های وردپرسی ساده با HTML و کدهای جی‌کوئری (jQuery).
بدون سابقه کار با React سازمانی یا تایپ‌اسکریپت.`,
      overallScore: 3.8,
      category: CandidateCategory.INITIAL_REJECTION,
      stage: CandidateStage.REJECTED,
      strengths: [
        'تسلط خوب بر ابزارهای طراحی بصری مانند Figma و سلیقه بصری مناسب',
      ],
      weaknesses: [
        'عدم تسلط بر React و عدم سابقه کار با زبان TypeScript',
        'فاصله زیاد با نیازمندی‌های عنوان شغلی کارشناس ارشد مهندسی نرم‌افزار',
      ],
      resumeQuotes: [
        '«۶ ماه کارآموزی طراحی رابط کاربری با فیگما و ساخت قالب‌های وردپرسی»',
        '«بدون سابقه کار با React سازمانی یا تایپ‌اسکریپت»',
      ],
      criteriaScores: {
        'تسلط بر React و معماری کلاینت': 3.0,
        'تایپ‌اسکریپت پیشرفته و مدیریت خطا': 2.0,
        'طراحی واکنش‌گرا و سازگاری کامل RTL': 6.0,
        'روحیه کار تیمی و مهارت‌های ارتباطی': 6.5,
        'سابقه کار با تست‌نویسی و ابزارهای CI/CD': 2.0,
      },
      inTalentPool: true,
      talentPoolNotes: 'برای موقعیت‌های آینده در زمینه طراحی رابط کاربری (UI/UX Junior) یا کارآموزی بسیار مناسب است.',
      appliedAtJalali: '۱۴۰۳/۰۶/۰۲',
      emailDraft: {
        type: 'REJECTION',
        subject: 'نتیجه ارزیابی اولیه رزومه شما برای فرصت شغلی توسعه فرانت‌اند - هلدینگ سیلانه سبز',
        body: `سرکار خانم سارا مهدی‌پور گرامی،

با سلام و احترام،
از اینکه وقت ارزشمند خود را صرف ارسال رزومه برای موقعیت «کارشناس ارشد توسعه فرانت‌اند» در مجموعه ما نمودید، صمیمانه سپاسگزاریم.

پس از بررسی کارشناسی سوابق تحصیلی و تجربیات ارزنده شما در زمینه طراحی گرافیک و رابط کاربری، به اطلاع می‌رسانیم که با توجه به نیازمندی‌های فنی فوری این موقعیت به تسلط عمیق بر معماری React و زبان TypeScript، در این مقطع امکان ادامه فرایند ارزیابی مقدور نمی‌باشد.

با این وجود، با توجه به استعداد و ذوق هنری مشهود در نمونه‌کارهای شما، رزومه شما با کمال افتخار در «استخر استعدادهای سازمانی ما» محفوظ خواهد ماند تا در صورت گشایش موقعیت‌های متناسب با زمینه طراحی UI، بی‌درنگ با شما تماس حاصل نماییم.

با آرزوی توفیق و بهروزی روزافزون برای شما،
تیم جذب و استخدام منابع انسانی`,
        status: 'DRAFT_ONLY',
        createdAtJalali: '۱۴۰۳/۰۶/۰۳',
      },
    },
    {
      id: 'cand-4',
      jobId: 'job-1',
      jobTitle: 'کارشناس ارشد توسعه فرانت‌اند (React / TypeScript)',
      fullName: 'محمدرضا سلطانی',
      email: 'm.soltani@example.com',
      phone: '09121112233',
      resumeFileName: 'Mohammadreza_Soltani.pdf',
      resumeText: `سوابق: مهندسی کامپیوتر دانشگاه علم و صنعت.
۵ سال سابقه در توسعه وب‌سرویس‌ها و برنامه‌های تحت وب بزرگ.
مسلط بر React, TypeScript, Next.js App Router, TanStack Query, Docker.
سوابق کاری در شرکت داده‌ورزی سدید و زرین‌پال.`,
      overallScore: 8.8,
      category: CandidateCategory.INTERVIEW_PRIORITY,
      stage: CandidateStage.OFFER,
      strengths: [
        'تسلط عالی بر اکوسیستم مدرن React، Next.js و State Management',
        'سابقه درخشان در سیستم‌های پرترافیک فین‌تک و پرداخت الکترونیک',
      ],
      weaknesses: [
        'درخواست حقوق پیشنهادی بالاتر از میانگین بودجه پیش‌بینی‌شده',
      ],
      resumeQuotes: [
        '«۵ سال سابقه در توسعه وب‌سرویس‌ها و برنامه‌های تحت وب بزرگ»',
        '«سوابق کاری در شرکت داده‌ورزی سدید و زرین‌پال»',
      ],
      criteriaScores: {
        'تسلط بر React و معماری کلاینت': 9.0,
        'تایپ‌اسکریپت پیشرفته و مدیریت خطا': 9.0,
        'طراحی واکنش‌گرا و سازگاری کامل RTL': 8.5,
        'روحیه کار تیمی و مهارت‌های ارتباطی': 8.8,
        'سابقه کار با تست‌نویسی و ابزارهای CI/CD': 8.5,
      },
      inTalentPool: false,
      appliedAtJalali: '۱۴۰۳/۰۵/۲۵',
    },
    {
      id: 'cand-5',
      jobId: 'job-2',
      jobTitle: 'مدیر محصول ارشد (Senior Product Manager)',
      fullName: 'پریسا اعتمادی',
      email: 'parisa.etemadi@example.com',
      phone: '09129998877',
      resumeFileName: 'Parisa_Etemadi_CV.pdf',
      resumeText: `کارشناسی ارشد مدیریت کسب‌وکار (MBA) از دانشگاه تهران.
۴ سال تجربه به عنوان مدیر محصول در شرکت اسنپ‌فود و دیجی‌کالا.
تسلط بر OKR، آنالیز متریک‌های CAC و LTV، طراحی داستان‌های کاربر و تحلیل عمیق داده با SQL و Tableau.`,
      overallScore: 9.0,
      category: CandidateCategory.INTERVIEW_PRIORITY,
      stage: CandidateStage.INITIAL_SCREENING,
      strengths: [
        'تجربه عملی در دو تا از بزرگ‌ترین پلتفرم‌های دیجیتال مقیاس‌بالای کشور',
        'تسلط هم‌زمان بر زبان فنی، نیازمندی‌های بیزنس و زبان مشتریان',
      ],
      weaknesses: [
        'سابقه کار کمتر در محصولات تخصصی سازمانی (B2B Enterprise) نسبت به B2C',
      ],
      resumeQuotes: [
        '«۴ سال تجربه به عنوان مدیر محصول در شرکت اسنپ‌فود و دیجی‌کالا»',
        '«تسلط بر OKR، آنالیز متریک‌های CAC و LTV و تحلیل عمیق داده»',
      ],
      criteriaScores: {
        'تفکر محصولی و استراتژی بازار ایران': 9.2,
        'تحلیل داده و شاخص‌های کلیدی (KPIs)': 9.5,
        'رهبری تیم متقاطع و ارتباط با ذینفعان': 8.8,
        'آشنایی با تجربه کاربری (UX Research)': 8.5,
      },
      inTalentPool: false,
      appliedAtJalali: '۱۴۰۳/۰۶/۱۰',
    },
  ];

  // ---------------- Module 2: Employees ----------------
  public employees: Employee[] = [
    {
      id: 'emp-1',
      personnelCode: '۱۰۰۲۴',
      nationalId: '۰۰۱۸۲۳۴۵۶۷',
      fullName: 'مهندس کیوان سهرابی',
      fatherName: 'احمد',
      birthDateJalali: '۱۳۶۵/۰۴/۱۸',
      phone: '09121114455',
      email: 'k.sohrabi@company.ir',
      department: 'منابع انسانی',
      jobTitle: 'مدیر ارشد منابع انسانی',
      hireDateJalali: '۱۴۰۰/۰۱/۱۵',
      baseSalaryToman: 48000000,
      maritalStatus: 'MARRIED',
      childrenCount: 2,
      bankIban: 'IR550120000000001234567890',
      status: 'ACTIVE',
      documents: [
        { id: 'doc-1', title: 'قرارداد کار معین سال ۱۴۰۳', fileType: 'PDF', fileUrl: '#', uploadedAtJalali: '۱۴۰۳/۰۱/۱۰' },
        { id: 'doc-2', title: 'تصویر شناسنامه و کارت ملی', fileType: 'PDF', fileUrl: '#', uploadedAtJalali: '۱۴۰۰/۰۱/۱۵' },
      ],
      jobHistories: [
        { id: 'jh-1', changeType: 'PROMOTION', previousTitle: 'سرپرست جذب و استخدام', newTitle: 'مدیر ارشد منابع انسانی', effectiveDateJalali: '۱۴۰۲/۰۱/۰۱', description: 'ارتقای سازمانی پس از ارزیابی سالانه' },
      ],
    },
    {
      id: 'emp-2',
      personnelCode: '۱۰۱۵۵',
      nationalId: '۰۴۵۱۱۲۳۴۸۹',
      fullName: 'مریم فتاحی',
      fatherName: 'رضا',
      birthDateJalali: '۱۳۷۱/۰۸/۲۲',
      phone: '09367778899',
      email: 'm.fattahi@company.ir',
      department: 'فناوری اطلاعات',
      jobTitle: 'معمار ارشد نرم‌افزار',
      hireDateJalali: '۱۴۰۱/۰۳/۰۱',
      baseSalaryToman: 42000000,
      maritalStatus: 'MARRIED',
      childrenCount: 1,
      bankIban: 'IR120170000000009876543210',
      directManagerId: 'emp-1',
      status: 'ACTIVE',
      documents: [
        { id: 'doc-3', title: 'قرارداد کار تمام‌وقت', fileType: 'PDF', fileUrl: '#', uploadedAtJalali: '۱۴۰۱/۰۳/۰۱' },
      ],
      jobHistories: [],
    },
    {
      id: 'emp-3',
      personnelCode: '۱۰۲۴۰',
      nationalId: '۰۰۷۹۹۸۸۷۷۱',
      fullName: 'علی مرادی',
      fatherName: 'حسین',
      birthDateJalali: '۱۳۷۴/۱۱/۰۴',
      phone: '09193332211',
      email: 'a.moradi@company.ir',
      department: 'فناوری اطلاعات',
      jobTitle: 'کارشناس دواپس و زیرساخت',
      hireDateJalali: '۱۴۰۲/۰۶/۰۱',
      baseSalaryToman: 34000000,
      maritalStatus: 'SINGLE',
      childrenCount: 0,
      bankIban: 'IR890560000000005544332211',
      directManagerId: 'emp-2',
      status: 'ACTIVE',
      documents: [],
      jobHistories: [],
    },
  ];

  // ---------------- Module 3: Attendance & Leave ----------------
  public attendances: AttendanceRecord[] = [
    {
      id: 'att-1',
      employeeId: 'emp-2',
      employeeName: 'مریم فتاحی',
      dateJalali: '۱۴۰۳/۰۶/۱۵',
      checkIn: '۰۷:۵۸',
      checkOut: '۱۷:۰۲',
      delayMinutes: 0,
      overtimeHours: 1.0,
      status: 'PRESENT',
    },
    {
      id: 'att-2',
      employeeId: 'emp-3',
      employeeName: 'علی مرادی',
      dateJalali: '۱۴۰۳/۰۶/۱۵',
      checkIn: '۰۸:۲۵',
      checkOut: '۱۶:۴۵',
      delayMinutes: 25,
      overtimeHours: 0,
      status: 'PRESENT',
    },
  ];

  public leaveRequests: LeaveRequest[] = [
    {
      id: 'leave-1',
      employeeId: 'emp-3',
      employeeName: 'علی مرادی',
      leaveType: LeaveType.ANNUAL,
      startDateJalali: '۱۴۰۳/۰۶/۲۵',
      endDateJalali: '۱۴۰۳/۰۶/۲۷',
      daysCount: 2,
      reason: 'سفر خانوادگی و امور شخصی',
      status: LeaveStatus.PENDING_MANAGER,
      createdAtJalali: '۱۴۰۳/۰۶/۱۴',
    },
    {
      id: 'leave-2',
      employeeId: 'emp-2',
      employeeName: 'مریم فتاحی',
      leaveType: LeaveType.SICK,
      startDateJalali: '۱۴۰۳/۰۶/۰۵',
      endDateJalali: '۱۴۰۳/۰۶/۰۶',
      daysCount: 1,
      reason: 'گواهی پزشک معتمد تامین اجتماعی (سرماخوردگی شدید)',
      status: LeaveStatus.APPROVED,
      managerApproved: true,
      hrApproved: true,
      createdAtJalali: '۱۴۰۳/۰۶/۰۴',
    },
  ];

  // ---------------- Module 4: Payroll ----------------
  public payrollSlips: PayrollSlip[] = [
    {
      id: 'pay-1',
      employeeId: 'emp-2',
      employeeName: 'مریم فتاحی',
      personnelCode: '۱۰۱۵۵',
      monthJalali: 5,
      monthName: 'مرداد',
      yearJalali: 1403,
      baseSalaryToman: 42000000,
      housingAllowanceToman: 900000,      // مصوب حق مسکن
      bonKargariToman: 1400000,          // بن خواربار و اقلام مصرفی
      childAllowanceToman: 716618,       // حق ۱ اولاد
      commuteAllowanceToman: 2000000,
      overtimePayToman: 3500000,
      grossSalaryToman: 50516618,
      ssoInsurance7PctToman: 3088163,    // سهم بیمه شده (۷٪ از آیتم‌های مشمول)
      incomeTaxToman: 3820000,           // مالیات بر حقوق طبق پله‌های مصوب
      otherDeductionsToman: 0,
      netSalaryToman: 43608455,
      sanavatReserveToman: 3500000,      // ذخیره سنوات (یک ماه به ازای سال)
      eidiReserveToman: 7000000,         // ذخیره عیدی و پاداش (دو برابر پایه ماهانه)
      status: PayrollStatus.FINALIZED,
      paidAtJalali: '۱۴۰۳/۰۵/۳۱',
    },
  ];

  // ---------------- Module 5: Performance ----------------
  public performanceGoals: PerformanceGoal[] = [
    {
      id: 'goal-1',
      employeeId: 'emp-2',
      employeeName: 'مریم فتاحی',
      title: 'معماری مجدد میکروسرویس‌های پرداخت با پایداری ۹۹.۹٪',
      targetMetric: 'Uptime > 99.9%',
      currentProgress: 85,
      weight: 35,
      deadlineJalali: '۱۴۰۳/۰۷/۳۰',
    },
    {
      id: 'goal-2',
      employeeId: 'emp-3',
      employeeName: 'علی مرادی',
      title: 'استقرار پایپ‌لاین اتوماتیک تست و بیلد با ابزارهای بومی',
      targetMetric: 'زمان بیلد زیر ۵ دقیقه',
      currentProgress: 60,
      weight: 25,
      deadlineJalali: '۱۴۰۳/۰۸/۱۵',
    },
  ];

  // ---------------- Module 6: Training ----------------
  public trainingCourses: TrainingCourse[] = [
    {
      id: 'train-1',
      title: 'دوره جامع امنیت وب در ابعاد سازمانی (OWASP Top 10)',
      instructor: 'دکتر علیرضا کاوشگر',
      durationHours: 24,
      department: 'فناوری اطلاعات و شبکه',
      status: 'IN_PROGRESS',
      participantsCount: 14,
      completionRate: 68,
    },
    {
      id: 'train-2',
      title: 'کارگاه آشنایی با تغییرات جدید قانون کار و تامین اجتماعی',
      instructor: 'استاد فریدون حسینی (مشاور ارشد اداره کار)',
      durationHours: 8,
      department: 'منابع انسانی و اداری',
      status: 'COMPLETED',
      participantsCount: 9,
      completionRate: 100,
    },
  ];

  public skillMatrix: SkillMatrixItem[] = [
    { skillName: 'React & Front-End Architecture', category: 'تخصصی IT', requiredLevel: 4.5, teamAverageLevel: 4.2 },
    { skillName: 'TypeScript & Type Safety', category: 'تخصصی IT', requiredLevel: 4.0, teamAverageLevel: 3.8 },
    { skillName: 'قانون کار و محاسبات دستمزد', category: 'منابع انسانی', requiredLevel: 4.8, teamAverageLevel: 4.6 },
    { skillName: 'مهارت‌های مذاکره و مدیریت تعارض', category: 'مهارت‌های نرم', requiredLevel: 4.0, teamAverageLevel: 3.5 },
  ];

  // ---------------- Module 7: Checklists ----------------
  public checklistItems: ChecklistItem[] = [
    {
      id: 'chk-1',
      employeeId: 'emp-3',
      employeeName: 'علی مرادی',
      type: 'ONBOARDING',
      title: 'تحویل سیستم کاری، مانیتور دوم و هدست اداری',
      department: 'پشتیبانی فناوری اطلاعات',
      dueDateJalali: '۱۴۰۲/۰۶/۰۲',
      isCompleted: true,
      completedAtJalali: '۱۴۰۲/۰۶/۰۱',
    },
    {
      id: 'chk-2',
      employeeId: 'emp-3',
      employeeName: 'علی مرادی',
      type: 'ONBOARDING',
      title: 'ایجاد حساب کاربری ایمیل سازمانی و دسترسی Gitlab',
      department: 'امنیت و شبکه',
      dueDateJalali: '۱۴۰۲/۰۶/۰۲',
      isCompleted: true,
      completedAtJalali: '۱۴۰۲/۰۶/۰۲',
    },
    {
      id: 'chk-3',
      employeeId: 'emp-3',
      employeeName: 'علی مرادی',
      type: 'ONBOARDING',
      title: 'جلسه معارفه فرهنگ سازمانی با مدیر منابع انسانی',
      department: 'منابع انسانی',
      dueDateJalali: '۱۴۰۲/۰۶/۰۷',
      isCompleted: true,
      completedAtJalali: '۱۴۰۲/۰۶/۰۶',
    },
  ];

  // ---------------- Module 8: Metrics ----------------
  public metrics: HRDashboardMetrics = {
    turnoverRatePct: 3.8,                // نرخ خروج پرسنل (درصد سالانه)
    averageTimeToHireDays: 16,           // میانگین زمان استخدام (روز)
    costPerHireToman: 6800000,           // هزینه هر استخدام (تومان)
    activeHeadcount: 1350,               // پرسنل کل هلدینگ سیلانه سبز
    openPositionsCount: 39,              // ردیف‌های شغلی باز دپارتمان‌ها
    pendingLeavesCount: 7,               // مرخصی‌های در انتظار بررسی
    monthlyPayrollTotalToman: 42500000000,// مجموع حقوق پرداختی هلدینگ (تومان)
  };

  // ---------------- Seilaneh Sabz Holding Departments ----------------
  public departments: any[] = [
    {
      id: 'dept-mfg',
      name: 'کارخانجات و صنایع تولیدی اشتهارد و سیمین‌دشت',
      englishName: 'Manufacturing & Industrial Plant',
      category: 'MANUFACTURING',
      headName: 'مهندس بهروز یزدانی',
      headTitle: 'مدیر ارشد کارخانجات و خطوط تولید',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      headcount: 420,
      vacancies: 6,
      brands: ['دافی (Dafi)', 'کامان (Comeon)', 'میس‌ویک (Misswake)', 'کاپوت (Kapoot)', 'زنون (Zenon)'],
      location: 'البرز، شهرک صنعتی اشتهارد، بلوار ملاصدرا غربی',
      kpiScore: 96,
      pendingLeaves: 3,
      shiftType: '۳ نوبت کاری چرخشی (صبح، عصر، شب)',
      colorTheme: 'emerald',
      activeProjects: ['اتوماسیون خط تولید دستمال مرطوب دافی', 'توسعه سالن فرمولاسیون کرم‌های تخصصی کامان'],
      description: 'مرکز اصلی تولید و بسته‌بندی مکانیزه محصولات بهداشتی، آرایشی و سلولزی هلدینگ سیلانه سبز مجهز به جدیدترین ماشین‌آلات استاندارد GMP.',
    },
    {
      id: 'dept-rnd',
      name: 'لابراتوارهای تحقیق، توسعه و فرمولاسیون (R&D)',
      englishName: 'R&D and Formulation Labs',
      category: 'R_AND_D',
      headName: 'دکتر مونا کاظمی',
      headTitle: 'دکترای داروسازی و مدیر ارشد تحقیق و فرمولاسیون',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      headcount: 34,
      vacancies: 2,
      brands: ['کامان تخصصی', 'میس‌ویک دهان و دندان', 'آمبرلا (Umbrella)'],
      location: 'آزمایشگاه جامع فرمولاسیون - مجتمع صنعتی البرز',
      kpiScore: 98,
      pendingLeaves: 1,
      shiftType: 'تخصصی روزکار (۸:۰۰ الی ۱۶:۳۰)',
      colorTheme: 'teal',
      activeProjects: ['فرمولاسیون لاین ضدآفتاب ضدآلودگی کامان', 'خمیردندان نانوهیدروکسی آپاتیت میس‌ویک'],
      description: 'طراحی، تست و توسعه فرمولاسیون‌های اختصاصی پوست، مو و دهان و دندان منطبق با استاندارد بین‌المللی فارماکوپه.',
    },
    {
      id: 'dept-mkt',
      name: 'مارکتینگ، روابط عمومی و مدیریت برندها (PR & Brands)',
      englishName: 'Marketing, Branding & PR',
      category: 'MARKETING',
      headName: 'سرکار خانم صدف آریافر',
      headTitle: 'معاونت مارکتینگ و توسعه برندهای هلدینگ',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      headcount: 68,
      vacancies: 5,
      brands: ['دافی', 'کامان', 'میس‌ویک', 'زنون', 'کدکس'],
      location: 'ستاد مرکزی تهران، خیابان ولیعصر',
      kpiScore: 92,
      pendingLeaves: 2,
      shiftType: 'تمام‌وقت شناور',
      colorTheme: 'indigo',
      activeProjects: ['کمپین سراسری ۳۶۰ درجه تابستانه دافی', 'ری‌برندینگ بسته‌بندی‌های صادراتی کامان'],
      description: 'مدیریت کمپین‌های رسانه‌ای، تبلیغات محیطی، رسانه‌های دیجیتال، برندسازی و سنجش رضایت مصرف‌کنندگان نهایی.',
    },
    {
      id: 'dept-sales',
      name: 'فروش سراسری، زنجیره‌ای و توزیع مویرگی (FMCG Sales)',
      englishName: 'National Sales & Distribution',
      category: 'SALES',
      headName: 'مهندس محمدرضا شایگان',
      headTitle: 'معاونت فروش سازمانی و شعب مویرگی کشور',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      headcount: 580,
      vacancies: 14,
      brands: ['سبد کامل محصولات هلدینگ سیلانه سبز'],
      location: 'شعبه مرکزی تهران و ۳۱ شعبه استانی فعال سراسر ایران',
      kpiScore: 95,
      pendingLeaves: 4,
      shiftType: 'تیم‌های میدانی و شیفت فروشگاهی',
      colorTheme: 'amber',
      activeProjects: ['طرح یکپارچه‌سازی ویزیتوری دیجیتال داروخانه‌ها', 'توسعه شلف محصولات در هایپرمی و افق کوروش'],
      description: 'بزرگترین ناوگان ویزیتوری و توزیع مویرگی صنعت بهداشتی به بیش از ۳۵ هزار داروخانه و فروشگاه زنجیره‌ای.',
    },
    {
      id: 'dept-scm',
      name: 'زنجیره تامین، بازرگانی خارجی و لجستیک (Supply Chain)',
      englishName: 'Supply Chain, Logistics & Procurement',
      category: 'SUPPLY_CHAIN',
      headName: 'مهندس کامران جمشیدی',
      headTitle: 'مدیر ارشد بازرگانی، تدارکات و لجستیک',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      headcount: 95,
      vacancies: 3,
      brands: ['تامین کلیه مواد اولیه و بسته‌بندی هلدینگ'],
      location: 'انبار مکانیزه مرکزی شورآباد و گمرکات ورودی',
      kpiScore: 91,
      pendingLeaves: 1,
      shiftType: 'نوبت‌کاری انبارداری و اداری',
      colorTheme: 'blue',
      activeProjects: ['خرید اسانس‌های معطر طبیعی سوئیسی', 'راه‌اندازی سیستم WMS هوشمند انبار شورآباد'],
      description: 'تامین پیوسته مواد اولیه وارداتی و داخلی، ترخیص گمرکی، مدیریت موجودی انبارها و ناوگان لجستیک هلدینگ.',
    },
    {
      id: 'dept-qc',
      name: 'کنترل کیفیت و تضمین کیفیت (QA & QC)',
      englishName: 'Quality Assurance & Quality Control',
      category: 'QUALITY',
      headName: 'مهندس شیما رستمی',
      headTitle: 'مدیر تضمین کیفیت و تاییدیه غذا و دارو',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      headcount: 45,
      vacancies: 2,
      brands: ['تمامی محصولات و خطوط تولید'],
      location: 'آزمایشگاه میکروبیولوژی و شیمیایی اشتهارد',
      kpiScore: 99,
      pendingLeaves: 0,
      shiftType: 'شیفت تطبیق با ساعات تولید',
      colorTheme: 'emerald',
      activeProjects: ['ممیزی سالانه استاندارد ISO 22716 آرایشی', 'پایش پیوسته آلودگی‌های بار میکروبی آب دیونیزه'],
      description: 'تضمین سلامت، بهداشت و انطباق فرمولاسیون با بالاترین الزامات وزارت بهداشت و سازمان غذا و داروی ایران.',
    },
    {
      id: 'dept-hr',
      name: 'مدیریت منابع انسانی، آموزش و فرهنگ سازمانی (People Ops)',
      englishName: 'Human Resources & People Operations',
      category: 'HR',
      headName: 'مهندس کیوان سهرابی',
      headTitle: 'معاونت منابع انسانی و توسعه سرمایه انسانی هلدینگ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      headcount: 24,
      vacancies: 2,
      brands: ['حمایت از بیش از ۱۳۵۰ همکار در تمامی واحدهای هلدینگ'],
      location: 'ستاد مرکزی هلدینگ سیلانه سبز - طبقه ۴',
      kpiScore: 97,
      pendingLeaves: 0,
      shiftType: 'روزکار ستادی',
      colorTheme: 'rose',
      activeProjects: ['استقرار سوپراپ موبایلی هوشمند منابع انسانی', 'آکادمی آموزش تخصصی فروش ویزیتوری سیلانه'],
      description: 'جذب استعدادهای نخبه، آموزش مداوم، جبران خدمات منصفانه، سنجش رضایت شغلی و تسهیلات رفاهی کارکنان.',
    },
    {
      id: 'dept-fin',
      name: 'امور مالی، بهای تمام‌شده و حسابداری صنعتی',
      englishName: 'Finance, Costing & Accounting',
      category: 'FINANCE',
      headName: 'حمیدرضا نیک‌بین',
      headTitle: 'مدیر ارشد مالی و حسابداری صنعتی کارخانجات',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      headcount: 38,
      vacancies: 1,
      brands: ['کلیه واحدهای تابعه هلدینگ سیلانه سبز'],
      location: 'ستاد مرکزی تهران',
      kpiScore: 94,
      pendingLeaves: 1,
      shiftType: 'روزکار',
      colorTheme: 'amber',
      activeProjects: ['سیستم لحظه‌ای بهای تمام‌شده بر اساس نوسان ارز', 'تسویه صورت‌حساب‌های پخش سراسری'],
      description: 'مدیریت جریان وجوه نقد، کنترل هزینه‌های تولید و بهای تمام‌شده، پرداخت حقوق و صورت‌های مالی حسابرسی‌شده.',
    },
    {
      id: 'dept-it',
      name: 'فناوری اطلاعات، زیرساخت و تحول دیجیتال (IT & Digital)',
      englishName: 'IT Infrastructure & Digital Transformation',
      category: 'IT',
      headName: 'مهندس پوریا راد',
      headTitle: 'مدیر ارشد فناوری اطلاعات و تحول دیجیتال',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      headcount: 31,
      vacancies: 3,
      brands: ['پشتیبانی فنی ستاد، کارخانجات و شعب استانی'],
      location: 'ستاد مرکزی تهران - واحد فناوری',
      kpiScore: 96,
      pendingLeaves: 1,
      shiftType: 'روزکار و آماده‌باش شیفت کارخانجات',
      colorTheme: 'cyan',
      activeProjects: ['اتصال فیبر نوری بین کارخانجات اشتهارد و ستاد', 'توسعه اپلیکیشن سفارش‌گیری ویزیتورها'],
      description: 'پشتیبانی زیرساخت ابری، توسعه نرم‌افزارهای داخلی، امنیت سایبری داده‌های هلدینگ و هدایت تحول هوشمند.',
    },
    {
      id: 'dept-legal',
      name: 'امور حقوقی، قراردادها و رگولاتوری غذا و دارو',
      englishName: 'Legal, Contracts & Regulatory Affairs',
      category: 'LEGAL',
      headName: 'دکتر علیرضا معتمد',
      headTitle: 'مشاور ارشد حقوقی و مدیر قراردادهای تجاری',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
      headcount: 14,
      vacancies: 1,
      brands: ['حفظ مالکیت معنوی و پروانه‌های بهداشتی'],
      location: 'ستاد مرکزی تهران',
      kpiScore: 98,
      pendingLeaves: 0,
      shiftType: 'روزکار',
      colorTheme: 'violet',
      activeProjects: ['تمدید پروانه‌های بهداشتی سالانه محصولات دافی', 'تنظیم قراردادهای نمایندگی انحصاری صادرات'],
      description: 'حمایت از حقوق معنوی برندها، تنظیم قراردادهای پرسنلی و تامین‌کنندگان و دریافت پروانه‌های ساخت وزارت بهداشت.',
    },
  ];

  // ---------------- Automated HR Tasks ----------------
  public automationTasks: any[] = [
    {
      id: 'auto-payroll',
      title: 'صدور خودکار و ارسال فیش‌های حقوقی ماهیانه',
      category: 'PAYROLL',
      description: 'محاسبه مکانیزه ساعات کارکرد، اضافه کار، کسورات بیمه تامین اجتماعی و مالیات پلکانی با ارسال آنی به پنل پرسنل.',
      estimatedTimeSaved: '۲۸ ساعت در ماه',
      status: 'IDLE',
      lastRunJalali: '۱۴۰۳/۰۶/۰۱',
      successCount: 1350,
      badge: 'مالی و حقوق',
    },
    {
      id: 'auto-screening',
      title: 'غربالگری هوشمند دسته‌جمعی رزومه‌ها با هوش مصنوعی',
      category: 'SCREENING',
      description: 'استخراج هوشمند مشخصات ۲۰۰+ رزومه ورودی، تطبیق با شایستگی‌های نقش و نمره‌دهی تفکیکی به تفکیک مهارت‌ها.',
      estimatedTimeSaved: '۴۵ ساعت در ماه',
      status: 'IDLE',
      lastRunJalali: '۱۴۰۳/۰۶/۱۵',
      successCount: 240,
      badge: 'جذب و استخدام',
    },
    {
      id: 'auto-contracts',
      title: 'تنظیم خودکار پیش‌نویس قراردادهای کار قانونی',
      category: 'CONTRACT',
      description: 'تولید قرارداد رسمی قانون کار ایران برای نیروهای کارخانجات و ستاد با درج شروط محرمانگی و سفته ضمانت.',
      estimatedTimeSaved: '۱۸ ساعت در ماه',
      status: 'IDLE',
      lastRunJalali: '۱۴۰۳/۰۶/۱۰',
      successCount: 18,
      badge: 'امور اداری',
    },
    {
      id: 'auto-leaves',
      title: 'بررسی و تایید هوشمند مرخصی‌های روزانه پرسنل',
      category: 'LEAVES',
      description: 'بررسی سقف ۲۶ روز مرخصی سالانه و عدم همزمانی با شیفت سایر اعضای کلیدی خط تولید و تایید سیستمی.',
      estimatedTimeSaved: '۱۲ ساعت در ماه',
      status: 'IDLE',
      lastRunJalali: 'امروز - ۱۰:۳۰',
      successCount: 14,
      badge: 'تردد و مرخصی',
    },
    {
      id: 'auto-onboarding',
      title: 'تخصیص مکانیزه چک‌لیست و بسته ان‌بوردینگ سیلانه سبز',
      category: 'ONBOARDING',
      description: 'هماهنگی خودکار تحویل پکیج محصولات بهداشتی، تجهیزات IT، سیم‌کارت سازمانی و زمان‌بندی جلسه معارفه.',
      estimatedTimeSaved: '۱۵ ساعت در ماه',
      status: 'IDLE',
      lastRunJalali: '۱۴۰۳/۰۶/۰۸',
      successCount: 9,
      badge: 'جامعه‌پذیری',
    },
    {
      id: 'auto-alerts',
      title: 'پایش خودکار انقضای قراردادها، تولدها و معاینات طب کار',
      category: 'ALERTS',
      description: 'هشدار ۳۰ روز قبل از اتمام قراردادهای پرسنلی کارخانجات و ثبت پیام تبریک سالگرد همکاری و معاینات ادواری.',
      estimatedTimeSaved: '۱۰ ساعت در ماه',
      status: 'IDLE',
      lastRunJalali: 'امروز - ۰۸:۰۰',
      successCount: 32,
      badge: 'هشدارهای هوشمند',
    },
  ];
}

export const dbStore = new HRMSStore();

