import React, { useState, useRef } from 'react';
import { JobPosting } from '../../types';
import { toPersianDigits } from '../../utils/jalali';
import JSZip from 'jszip';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
  FolderArchive,
  Plus,
  Trash2,
  FileCode,
  Building2,
  MapPin,
  Check,
  ChevronDown,
  Layers,
  ArrowRight,
} from 'lucide-react';

export interface StagedResumeFile {
  id: string;
  name: string;
  size: number;
  type: string;
  sourceZip?: string;
  text?: string;
}

// All holding departments across Seilaneh Sabz (Plants, R&D, Brands, Sales, SCM, etc.)
export const ALL_SEILANEH_DEPARTMENTS = [
  'کارخانجات و صنایع تولیدی اشتهارد و سیمین‌دشت',
  'لابراتوارهای تحقیق، توسعه و فرمولاسیون (R&D)',
  'کنترل کیفیت و تضمین کیفیت (QA & QC)',
  'مارکتینگ، روابط عمومی و مدیریت برندها (PR & Brands)',
  'فروش سراسری، زنجیره‌ای و توزیع مویرگی (FMCG Sales)',
  'زنجیره تامین، بازرگانی خارجی و لجستیک (Supply Chain)',
  'مدیریت منابع انسانی، آموزش و فرهنگ سازمانی',
  'امور مالی، بهای تمام‌شده و حسابداری صنعتی',
  'فناوری اطلاعات، زیرساخت و تحول دیجیتال',
  'امور حقوقی، قراردادها و رگولاتوری غذا و دارو',
  'مهندسی، تاسیسات و نگهداری و تعمیرات (نت صنعتی - PM)',
  'بهداشت، ایمنی و محیط زیست (HSE کارخانجات)',
  'خدمات مشتریان، امور نمایندگی‌ها و صدای مشتری (CRM)',
];

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobPosting[];
  activeJobId: string;
  onUploadComplete: (result: any) => void;
  onJobCreated?: (newJob: JobPosting) => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  jobs: initialJobs,
  activeJobId,
  onUploadComplete,
  onJobCreated,
}) => {
  const [localJobs, setLocalJobs] = useState<JobPosting[]>(initialJobs);
  const [selectedJobId, setSelectedJobId] = useState(activeJobId || initialJobs[0]?.id || 'job-1');

  // File states
  const [stagedFiles, setStagedFiles] = useState<StagedResumeFile[]>([]);
  const [fileCount, setFileCount] = useState<number>(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExtractingZip, setIsExtractingZip] = useState(false);
  const [zipMessage, setZipMessage] = useState<{ name: string; count: number } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStageText, setProgressStageText] = useState('');
  const [processMode, setProcessMode] = useState<'exact' | 'batch'>('exact');

  // Inline New Job Creation State
  const [isAddingNewJob, setIsAddingNewJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState(ALL_SEILANEH_DEPARTMENTS[0]);
  const [newJobType, setNewJobType] = useState('تمام‌وقت');
  const [newJobLocation, setNewJobLocation] = useState('البرز، شهرک صنعتی اشتهارد');
  const [isCreatingJobSubmitting, setIsCreatingJobSubmitting] = useState(false);

  // Results State
  const [processedStats, setProcessedStats] = useState<{
    total: number;
    priority: number;
    review: number;
    rejected: number;
    sampleCandidates?: any[];
  } | null>(null);

  // Refs for file inputs
  const manualFileInputRef = useRef<HTMLInputElement>(null);
  const zipFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '۰ بایت';
    const k = 1024;
    if (bytes < k) return `${toPersianDigits(bytes)} بایت`;
    if (bytes < k * k) return `${toPersianDigits(Math.round(bytes / k))} کیلوبایت`;
    return `${toPersianDigits((bytes / (k * k)).toFixed(1))} مگابایت`;
  };

  // Group jobs by department
  const groupedJobs = localJobs.reduce((acc, job) => {
    const dept = job.department || 'سایر واحدها';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(job);
    return acc;
  }, {} as Record<string, JobPosting[]>);

  // Handle Quick Job Creation inside Modal
  const handleCreateNewJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    setIsCreatingJobSubmitting(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobTitle.trim(),
          department: newJobDept,
          employmentType: newJobType,
          location: newJobLocation,
          description: `موقعیت شغلی استخدامی برای دپارتمان ${newJobDept} در هلدینگ سیلانه سبز.`,
          requirements: 'تسلط بر شایستگی‌های عمومی و تخصصی متناسب با شاخص‌های کیفیت و عملکرد هلدینگ.',
          criteria: [
            { id: `c-${Date.now()}-1`, title: 'شایستگی و تخصص فنی', weight: 40 },
            { id: `c-${Date.now()}-2`, title: 'سابقه کار و پروژه‌های مرتبط', weight: 35 },
            { id: `c-${Date.now()}-3`, title: 'روحیه کار تیمی و مهارت‌های ارتباطی', weight: 25 },
          ],
        }),
      });

      const created: JobPosting = await res.json();
      setLocalJobs((prev) => [created, ...prev]);
      setSelectedJobId(created.id);
      if (onJobCreated) {
        onJobCreated(created);
      }
      setIsAddingNewJob(false);
      setNewJobTitle('');
    } catch (err) {
      console.error('Error creating job:', err);
    } finally {
      setIsCreatingJobSubmitting(false);
    }
  };

  // Unpack and extract files from a ZIP archive using JSZip
  const handleExtractZip = async (zipFile: File) => {
    setIsExtractingZip(true);
    try {
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(zipFile);

      const extracted: StagedResumeFile[] = [];

      for (const [relativePath, entry] of Object.entries(loadedZip.files)) {
        if (entry.dir) continue;
        // Ignore system hidden files
        if (
          relativePath.startsWith('__MACOSX') ||
          relativePath.includes('/.') ||
          relativePath.endsWith('.DS_Store') ||
          relativePath.endsWith('Thumbs.db')
        ) {
          continue;
        }

        const fileName = relativePath.split('/').pop() || relativePath;
        const ext = fileName.split('.').pop()?.toLowerCase() || '';

        // Read text if markdown/txt
        let textContent: string | undefined = undefined;
        if (['txt', 'md', 'json', 'csv'].includes(ext)) {
          textContent = await entry.async('string');
        }

        const blob = await entry.async('blob');

        extracted.push({
          id: `zip-item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: fileName,
          size: blob.size,
          type: ext || 'pdf',
          sourceZip: zipFile.name,
          text: textContent,
        });
      }

      if (extracted.length > 0) {
        setStagedFiles((prev) => [...extracted, ...prev]);
        setZipMessage({ name: zipFile.name, count: extracted.length });
        setFileCount(extracted.length);
        setProcessMode('exact');
      } else {
        alert('فایل فشرده خالی است یا فایل رزومه معتبری در آن یافت نشد.');
      }
    } catch (err) {
      console.error('Failed to unpack zip:', err);
      alert('خطا در اکسترکت فایل فشرده ZIP. لطفاً از سالم بودن فایل اطمینان حاصل فرمایید.');
    } finally {
      setIsExtractingZip(false);
    }
  };

  // Handle files (manual selection or drag-drop)
  const processIncomingFiles = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const regularFiles: StagedResumeFile[] = [];
    const zipFiles: File[] = [];

    filesArray.forEach((file) => {
      const isZip =
        file.name.toLowerCase().endsWith('.zip') ||
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed';

      if (isZip) {
        zipFiles.push(file);
      } else {
        regularFiles.push({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          size: file.size,
          type: file.name.split('.').pop()?.toLowerCase() || 'pdf',
        });
      }
    });

    if (regularFiles.length > 0) {
      setStagedFiles((prev) => [...regularFiles, ...prev]);
      if (stagedFiles.length === 0 && zipFiles.length === 0) {
        setFileCount(regularFiles.length);
        setProcessMode('exact');
      }
    }

    // Process any zip files
    zipFiles.forEach((zipFile) => {
      handleExtractZip(zipFile);
    });
  };

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  // Remove individual staged file
  const handleRemoveFile = (id: string) => {
    setStagedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      if (updated.length > 0 && processMode === 'exact') {
        setFileCount(updated.length);
      }
      return updated;
    });
  };

  // Clear all staged files
  const handleClearAllFiles = () => {
    setStagedFiles([]);
    setZipMessage(null);
    setFileCount(200);
    setProcessMode('batch');
  };

  // Start processing
  const handleStartBulkProcessing = async () => {
    setIsProcessing(true);
    setProgress(5);
    setProgressStageText('در حال خواندن ساختار فایل‌ها و استخراج متون رزومه...');
    setProcessedStats(null);

    const stages = [
      { p: 25, text: 'استخراج متون رزومه‌ها و تشخیص نام، مهارت‌ها و سوابق کارجویان...' },
      { p: 55, text: 'ارزیابی هوشمند شایستگی‌ها و تطبیق با الزامات موقعیت شغلی در Gemini...' },
      { p: 85, text: 'محاسبه امتیاز نهایی، رتبه‌بندی اولویت‌ها و تولید بازخوردهای غربالگری...' },
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const next = prev + Math.floor(Math.random() * 12) + 6;
        if (stageIdx < stages.length && next >= stages[stageIdx].p) {
          setProgressStageText(stages[stageIdx].text);
          stageIdx++;
        }
        return next;
      });
    }, 200);

    const actualCountToProcess =
      stagedFiles.length > 0 && processMode === 'exact'
        ? stagedFiles.length
        : Math.max(stagedFiles.length || 10, fileCount);

    try {
      const res = await fetch('/api/candidates/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJobId,
          filesCount: actualCountToProcess,
          files: stagedFiles.map((f) => ({
            name: f.name,
            size: f.size,
            text: f.text,
            sourceZip: f.sourceZip,
          })),
          mode: processMode,
        }),
      });

      clearInterval(interval);
      setProgress(100);
      setProgressStageText('ارزیابی و غربالگری هوشمند با موفقیت به پایان رسید.');

      const data = await res.json();
      setProcessedStats({
        total: data.processedCount || actualCountToProcess,
        priority: data.interviewPriorityCount || Math.round(actualCountToProcess * 0.25),
        review: data.needsReviewCount || Math.round(actualCountToProcess * 0.45),
        rejected: data.initialRejectionCount || Math.round(actualCountToProcess * 0.3),
        sampleCandidates: data.sampleCandidates || [],
      });

      onUploadComplete(data);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedJob = localJobs.find((j) => j.id === selectedJobId) || localJobs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[95vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shadow-2xs border border-emerald-100">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>بارگذاری گروهی رزومه‌ها و اکسترکت هوشمند ZIP</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  هلدینگ سیلانه سبز
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                انتخاب دستی فایل‌ها، بازگشایی خودکار آرشیو فشرده ZIP و غربالگری سریع با مدل هوش مصنوعی
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Destination Job Section */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span>سکشن موقعیت شغلی مقصد (تمامی دپارتمان‌های هلدینگ):</span>
              </label>

              {!isAddingNewJob && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setIsAddingNewJob(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن موقعیت شغلی جدید</span>
                </button>
              )}
            </div>

            {/* Select Destination Job with Department grouping */}
            {!isAddingNewJob ? (
              <div className="space-y-1.5">
                <div className="relative">
                  <select
                    value={selectedJobId}
                    onChange={(e) => {
                      if (e.target.value === '__CREATE_NEW_JOB__') {
                        setIsAddingNewJob(true);
                      } else {
                        setSelectedJobId(e.target.value);
                      }
                    }}
                    disabled={isProcessing}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 shadow-2xs cursor-pointer appearance-none pl-8"
                  >
                    {/* Render jobs grouped by all Seilaneh Holding departments */}
                    {ALL_SEILANEH_DEPARTMENTS.map((deptName) => {
                      const deptJobs = groupedJobs[deptName] || [];
                      return (
                        <optgroup key={deptName} label={`🏢 ${deptName}`}>
                          {deptJobs.length > 0 ? (
                            deptJobs.map((j) => (
                              <option key={j.id} value={j.id}>
                                {j.title} — ({j.location} • {j.employmentType})
                              </option>
                            ))
                          ) : (
                            <option disabled value={`empty-${deptName}`}>
                              (ردیف شغلی باز در این دپارتمان تعریف نشده است)
                            </option>
                          )}
                        </optgroup>
                      );
                    })}

                    {/* Other departments not in predefined list */}
                    {Object.keys(groupedJobs)
                      .filter((dept) => !ALL_SEILANEH_DEPARTMENTS.includes(dept))
                      .map((dept) => (
                        <optgroup key={dept} label={`🏢 ${dept}`}>
                          {groupedJobs[dept].map((j) => (
                            <option key={j.id} value={j.id}>
                              {j.title} — ({j.location} • {j.employmentType})
                            </option>
                          ))}
                        </optgroup>
                      ))}

                    {/* "+ افزودن موقعیت شغلی" at the very end of the list */}
                    <option
                      value="__CREATE_NEW_JOB__"
                      className="font-bold text-emerald-700 bg-emerald-50 py-1"
                    >
                      ➕ + افزودن موقعیت شغلی جدید برای هلدینگ...
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>

                {selectedJob && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 px-1">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-semibold text-slate-700">{selectedJob.department}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedJob.location}</span>
                    </span>
                    <span>•</span>
                    <span>{selectedJob.employmentType}</span>
                  </div>
                )}
              </div>
            ) : (
              /* Inline Form for Adding New Job Position */
              <form
                onSubmit={handleCreateNewJob}
                className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-2xs space-y-3 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <span>تعریف ردیف شغلی جدید در هلدینگ سیلانه سبز</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewJob(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      عنوان موقعیت شغلی <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      placeholder="مثلاً: کارشناس فرمولاسیون آرایشی دافی"
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      دپارتمان سازمانی
                    </label>
                    <select
                      value={newJobDept}
                      onChange={(e) => setNewJobDept(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {ALL_SEILANEH_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      نوع همکاری
                    </label>
                    <select
                      value={newJobType}
                      onChange={(e) => setNewJobType(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="تمام‌وقت">تمام‌وقت</option>
                      <option value="۳ نوبت کاری چرخشی">۳ نوبت کاری چرخشی (کارخانجات)</option>
                      <option value="پاره‌وقت">پاره‌وقت</option>
                      <option value="پروژه‌ای / قراردادی">پروژه‌ای / قراردادی</option>
                      <option value="دورکاری / هیبریدی">دورکاری / هیبریدی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      محل خدمت
                    </label>
                    <select
                      value={newJobLocation}
                      onChange={(e) => setNewJobLocation(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="البرز، شهرک صنعتی اشتهارد">البرز، شهرک صنعتی اشتهارد (کارخانجات)</option>
                      <option value="البرز، شهرک صنعتی سیمین‌دشت">البرز، شهرک صنعتی سیمین‌دشت</option>
                      <option value="ستاد مرکزی تهران، خیابان ولیعصر">ستاد مرکزی تهران، خیابان ولیعصر</option>
                      <option value="انبار مکانیزه مرکزی شورآباد">انبار مکانیزه مرکزی شورآباد</option>
                      <option value="شعبه مرکزی تهران و شعب سراسر کشور">شعبه مرکزی و ۳۱ شعبه استانی فروش</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNewJob(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingJobSubmitting || !newJobTitle.trim()}
                    className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {isCreatingJobSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>ثبت و انتخاب این موقعیت شغلی</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Drag & Drop and Manual File Selection Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all ${
              dragActive
                ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
                : 'border-emerald-300/80 bg-emerald-50/20 hover:bg-emerald-50/40'
            }`}
          >
            {/* Hidden file inputs */}
            <input
              ref={manualFileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.rtf,.zip"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processIncomingFiles(e.target.files);
                  e.target.value = '';
                }
              }}
            />

            <input
              ref={zipFileInputRef}
              type="file"
              accept=".zip,application/zip,application/x-zip-compressed"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processIncomingFiles(e.target.files);
                  e.target.value = '';
                }
              }}
            />

            {isExtractingZip ? (
              <div className="py-6 space-y-2">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                <div className="text-sm font-bold text-slate-800">
                  در حال استخراج و بازگشایی محتوای فایل فشرده ZIP...
                </div>
                <div className="text-xs text-slate-500">
                  اپلیکیشن به صورت خودکار فایل‌های رزومه داخل آرشیو را تفکیک و آماده‌سازی می‌کند.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-800">
                    رزومه‌ها یا فایل فشرده ZIP را اینجا رها کنید
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    پشتیبانی کامل از فایل‌های PDF، Word (DOCX)، فایل‌های متنی و فایل فشرده ZIP با اکسترکت خودکار
                  </p>
                </div>

                {/* Upload Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => manualFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>انتخاب دستی فایل‌های رزومه</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => zipFileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100/70 text-teal-800 rounded-xl border border-teal-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FolderArchive className="w-4 h-4 text-teal-600" />
                    <span>آپلود فایل فشرده ZIP (اکسترکت خودکار)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ZIP Extraction Success Banner */}
          {zipMessage && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-teal-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  فایل فشرده «{zipMessage.name}» با موفقیت اکسترکت شد (تعداد{' '}
                  {toPersianDigits(zipMessage.count)} فایل رزومه تفکیک گردید).
                </span>
              </div>
              <button
                type="button"
                onClick={() => setZipMessage(null)}
                className="text-teal-600 hover:text-teal-800 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Staged / Extracted Files List Preview */}
          {stagedFiles.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    فایل‌های آماده پردازش:
                  </span>
                  <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {toPersianDigits(stagedFiles.length)} رزومه
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleClearAllFiles}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>حذف همه</span>
                </button>
              </div>

              {/* Scrollable files container */}
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {stagedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-slate-700 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {file.sourceZip ? (
                        <FolderArchive className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-medium truncate text-xs text-slate-800 max-w-[280px]">
                        {file.name}
                      </span>
                      {file.sourceZip && (
                        <span className="text-[9px] bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.2 rounded shrink-0">
                          اکسترکت از ZIP
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400">
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mode Selection / File Count Controls */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="processMode"
                      checked={processMode === 'exact'}
                      onChange={() => {
                        setProcessMode('exact');
                        setFileCount(stagedFiles.length);
                      }}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700 font-medium text-[11px]">
                      ارزیابی دقیق همین {toPersianDigits(stagedFiles.length)} رزومه انتخاب‌شده
                    </span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="processMode"
                      checked={processMode === 'batch'}
                      onChange={() => setProcessMode('batch')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-700 font-medium text-[11px]">
                      شبیه‌سازی ابعاد بالا (حداقل ۲۰۰ رزومه)
                    </span>
                  </label>
                </div>

                {processMode === 'batch' && (
                  <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-500 text-[11px]">حجم شبیه‌سازی:</span>
                    <input
                      type="number"
                      min={10}
                      max={250}
                      step={10}
                      value={fileCount}
                      disabled={isProcessing}
                      onChange={(e) =>
                        setFileCount(Math.max(10, parseInt(e.target.value, 10) || 10))
                      }
                      className="w-14 px-1.5 py-0.5 bg-slate-50 border border-slate-300 rounded text-center font-bold text-emerald-800 text-xs"
                    />
                    <span className="text-slate-400 text-[11px]">فایل</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Simulation Counter when no files selected yet */}
          {stagedFiles.length === 0 && (
            <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">
                یا پردازش دسته‌ای مقیاس بزرگ رزومه‌های ورودی را تنظیم نمایید:
              </span>
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-500 text-[11px]">تعداد پیش‌فرض:</span>
                <input
                  type="number"
                  min={10}
                  max={250}
                  step={10}
                  value={fileCount}
                  disabled={isProcessing}
                  onChange={(e) =>
                    setFileCount(Math.max(10, parseInt(e.target.value, 10) || 10))
                  }
                  className="w-16 px-2 py-0.5 bg-slate-50 border border-slate-300 rounded-lg text-center font-bold text-emerald-800 text-xs"
                />
                <span className="text-slate-400 font-medium">رزومه</span>
              </div>
            </div>
          )}

          {/* Real-time Progress Bar */}
          {isProcessing && (
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>{progressStageText || 'در حال ارزیابی شایستگی‌ها و تطبیق رزومه‌ها...'}</span>
                </span>
                <span className="text-emerald-700 font-extrabold">
                  {toPersianDigits(progress)}٪
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                سیستم در حال ارزیابی متون رزومه‌ها، استخراج شایستگی‌ها و رتبه‌بندی منطبق با شرح شغل «
                {selectedJob?.title}» است.
              </div>
            </div>
          )}

          {/* Processed Results Summary Card */}
          {processedStats && (
            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    پردازش گروهی {toPersianDigits(processedStats.total)} رزومه برای «
                    {selectedJob?.title}» با موفقیت پایان یافت
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 mb-0.5">اولویت مصاحبه (+۷)</div>
                  <div className="text-base font-extrabold text-emerald-700">
                    {toPersianDigits(processedStats.priority)}
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 mb-0.5">نیازمند بررسی (۵-۷)</div>
                  <div className="text-base font-extrabold text-amber-700">
                    {toPersianDigits(processedStats.review)}
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-2xs">
                  <div className="text-[10px] text-slate-500 mb-0.5">رد اولیه (&lt;۵)</div>
                  <div className="text-base font-extrabold text-rose-700">
                    {toPersianDigits(processedStats.rejected)}
                  </div>
                </div>
              </div>

              {processedStats.sampleCandidates && processedStats.sampleCandidates.length > 0 && (
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 text-xs">
                  <div className="text-[11px] font-bold text-emerald-900 mb-1.5">
                    نمونه کارجویان وارد شده به پایپ‌لاین:
                  </div>
                  <div className="space-y-1">
                    {processedStats.sampleCandidates.slice(0, 3).map((c: any) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between text-[11px] text-slate-700 py-0.5 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-semibold text-slate-900">{c.fullName}</span>
                        <span className="text-slate-500 truncate max-w-[200px]">
                          {c.resumeFileName}
                        </span>
                        <span className="font-bold text-emerald-700">
                          امتیاز: {toPersianDigits(c.overallScore)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between shrink-0 mt-3">
          <div className="text-[11px] text-slate-500">
            {stagedFiles.length > 0 ? (
              <span>
                {toPersianDigits(stagedFiles.length)} فایل رزومه آماده بارگذاری و تطبیق
              </span>
            ) : (
              <span>حالت شبیه‌سازی ۲۰۰+ رزومه فعال است</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={isProcessing}
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              انصراف
            </button>

            <button
              type="button"
              disabled={isProcessing || isExtractingZip}
              onClick={handleStartBulkProcessing}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال ارزیابی...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {stagedFiles.length > 0 && processMode === 'exact'
                      ? `شروع ارزیابی ${toPersianDigits(stagedFiles.length)} رزومه انتخاب‌شده`
                      : `شروع پردازش ${toPersianDigits(fileCount)} رزومه`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
