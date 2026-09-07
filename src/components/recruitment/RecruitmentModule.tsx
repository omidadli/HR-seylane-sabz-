import React, { useState, useMemo } from 'react';
import { Candidate, CandidateStage, JobPosting, UserRole } from '../../types';
import { toPersianDigits } from '../../utils/jalali';
import { KanbanBoard } from './KanbanBoard';
import { AIAgentChat } from './AIAgentChat';
import { BulkUploadModal } from './BulkUploadModal';
import { JobPostingsView } from './JobPostingsView';
import { InterviewCalendarView } from './InterviewCalendarView';
import { TalentPoolView } from './TalentPoolView';
import { CandidateCompareModal } from './CandidateCompareModal';
import { EvaluationCriteriaManager } from './EvaluationCriteriaManager';
import { HireVueVideoStudio } from './HireVueVideoStudio';
import { EightfoldTalentIntelligence } from './EightfoldTalentIntelligence';
import { ZipRecruiterSmartSourcing } from './ZipRecruiterSmartSourcing';
import {
  LayoutDashboard,
  Bot,
  Briefcase,
  Calendar,
  Award,
  UploadCloud,
  Sparkles,
  Users,
  CheckCircle2,
  Filter,
  SlidersHorizontal,
  Video,
  Network,
  Zap,
} from 'lucide-react';

interface RecruitmentModuleProps {
  currentRole: UserRole;
  jobs: JobPosting[];
  candidates: Candidate[];
  onUpdateCandidateStage: (candidateId: string, nextStage: CandidateStage) => void;
  onScheduleInterview: (
    candidateId: string,
    interviewJalali: string,
    interviewType: string,
    notes?: string
  ) => void;
  onToggleTalentPool: (candidateId: string, inPool: boolean) => void;
  onCreateJob: (newJob: Partial<JobPosting>) => void;
  onBulkUploadSuccess: (data: any) => void;
  onDraftEmail: (candidate: Candidate, type: 'INVITATION' | 'REJECTION') => void;
  onJobUpdated?: (updatedJob: JobPosting) => void;
}

export type RecruitmentTab =
  | 'kanban'
  | 'hirevue_video'
  | 'eightfold_skills'
  | 'ziprecruiter_sourcing'
  | 'ai_agent'
  | 'evaluation_criteria'
  | 'jobs'
  | 'interviews'
  | 'talent_pool';

export const RecruitmentModule: React.FC<RecruitmentModuleProps> = ({
  currentRole,
  jobs,
  candidates,
  onUpdateCandidateStage,
  onScheduleInterview,
  onToggleTalentPool,
  onCreateJob,
  onBulkUploadSuccess,
  onDraftEmail,
  onJobUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<RecruitmentTab>('kanban');
  const [activeJobId, setActiveJobId] = useState<string>(jobs[0]?.id || 'job-1');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const activeJob = jobs.find((j) => j.id === activeJobId) || jobs[0];

  // Candidates filtered by selected job (or all)
  const filteredCandidates = useMemo(
    () => candidates.filter((c) => (activeJobId ? c.jobId === activeJobId : true)),
    [candidates, activeJobId]
  );

  const handleToggleCompare = (candidate: Candidate) => {
    if (selectedCompareIds.includes(candidate.id)) {
      setSelectedCompareIds(selectedCompareIds.filter((id) => id !== candidate.id));
    } else {
      if (selectedCompareIds.length >= 4) {
        alert('امکان مقایسه همزمان حداکثر ۴ کارجو در نمودار رادار وجود دارد.');
        return;
      }
      setSelectedCompareIds([...selectedCompareIds, candidate.id]);
    }
  };

  const selectedCompareCandidates = candidates.filter((c) => selectedCompareIds.includes(c.id));

  // Quick stat counters
  const totalResumes = candidates.length;
  const inInterviewCount = candidates.filter(
    (c) =>
      c.stage === CandidateStage.PHONE_INTERVIEW || c.stage === CandidateStage.IN_PERSON_INTERVIEW
  ).length;
  const hiredCount = candidates.filter((c) => c.stage === CandidateStage.HIRED).length;
  const talentPoolCount = candidates.filter((c) => c.inTalentPool).length;

  return (
    <div className="space-y-5">
      {/* Top Banner & KPI Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">موقعیت‌های فعال</div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">
              {toPersianDigits(jobs.filter((j) => j.status === 'ACTIVE').length)}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
              در حال جذب
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">کل رزومه‌های پردازش‌شده</div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">
              {toPersianDigits(totalResumes)}
            </span>
            <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
              امتیازدهی هوشمند
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">در جریان مصاحبه‌ها</div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">
              {toPersianDigits(inInterviewCount)}
            </span>
            <span className="text-[11px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
              تقویم فعال
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium mb-1">استخر استعدادها</div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900">
              {toPersianDigits(talentPoolCount)}
            </span>
            <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
              ذخیره آتی
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Sub-Tabs & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'kanban'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>پایپ‌لاین استخدامی (کانبان)</span>
          </button>

          {/* Competitor 1: HireVue AI Video Studio */}
          <button
            type="button"
            onClick={() => setActiveTab('hirevue_video')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'hirevue_video'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Video className="w-4 h-4 text-emerald-500" />
            <span>مصاحبه ویدیویی هوشمند (HireVue)</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-black">
              استودیو AI
            </span>
          </button>

          {/* Competitor 2: Eightfold AI Deep Skill Graph & Internal Mobility */}
          <button
            type="button"
            onClick={() => setActiveTab('eightfold_skills')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'eightfold_skills'
                ? 'bg-gradient-to-r from-teal-600 to-slate-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Network className="w-4 h-4 text-teal-500" />
            <span>گراف مهارت‌ها و ارتقای داخلی (Eightfold)</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 font-black">
              هوش استعداد
            </span>
          </button>

          {/* Competitor 3: ZipRecruiter Smart Sourcing & Syndication */}
          <button
            type="button"
            onClick={() => setActiveTab('ziprecruiter_sourcing')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'ziprecruiter_sourcing'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>جذب آنی و انتشار همزمان (ZipRecruiter)</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-black">
              سورسینگ ۱ کلیک
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai_agent')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'ai_agent'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>دستیار هوشمند استخدام (Gemini)</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-black">
              AI
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('evaluation_criteria')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'evaluation_criteria'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
            <span>ماتریس شاخص‌ها و وزن‌دهی AI</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-black">
              جدید
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'jobs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>موقعیت‌های شغلی ({toPersianDigits(jobs.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('interviews')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'interviews'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>تقویم مصاحبه‌ها</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('talent_pool')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'talent_pool'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>استخر استعدادها</span>
          </button>
        </div>

        {/* Right action group: Bulk Upload & Compare */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Job Filter Dropdown for Kanban */}
          {activeTab === 'kanban' && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={activeJobId}
                onChange={(e) => setActiveJobId(e.target.value)}
                className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Candidate Compare Button (active when 2+ selected) */}
          {selectedCompareIds.length >= 2 && (
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs animate-bounce"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>مقایسه رادار ({toPersianDigits(selectedCompareIds.length)} کارجو)</span>
            </button>
          )}

          {/* Bulk Upload Button */}
          <button
            type="button"
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>بارگذاری گروهی رزومه‌ها (۲۰۰+ فایل)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div>
        {activeTab === 'kanban' && (
          <KanbanBoard
            candidates={filteredCandidates}
            onMoveStage={onUpdateCandidateStage}
            onScheduleInterview={(cand) => {
              setActiveTab('interviews');
            }}
            onDraftEmail={onDraftEmail}
            onToggleTalentPool={onToggleTalentPool}
            onSelectCompare={handleToggleCompare}
            selectedCompareIds={selectedCompareIds}
          />
        )}

        {/* Competitor 1: HireVue AI Video Studio */}
        {activeTab === 'hirevue_video' && (
          <HireVueVideoStudio
            jobs={jobs}
            activeJobId={activeJobId}
          />
        )}

        {/* Competitor 2: Eightfold AI Talent Intelligence & Skill Graph */}
        {activeTab === 'eightfold_skills' && (
          <EightfoldTalentIntelligence
            jobs={jobs}
            activeJobId={activeJobId}
          />
        )}

        {/* Competitor 3: ZipRecruiter Smart Sourcing & Syndication */}
        {activeTab === 'ziprecruiter_sourcing' && (
          <ZipRecruiterSmartSourcing
            jobs={jobs}
            activeJobId={activeJobId}
          />
        )}

        {activeTab === 'ai_agent' && (
          <AIAgentChat
            candidates={candidates}
            jobs={jobs}
            activeJobId={activeJobId}
            onApproveEmailDraft={(draft) => {
              alert(`پیش‌نویس ایمیل برای ${draft.candidateName} تایید و در کارتابل ذخیره شد.`);
            }}
          />
        )}

        {activeTab === 'evaluation_criteria' && (
          <EvaluationCriteriaManager
            jobs={jobs}
            activeJobId={activeJobId}
            onSelectJob={(id) => setActiveJobId(id)}
            onJobUpdated={(updatedJob) => {
              if (onJobUpdated) onJobUpdated(updatedJob);
            }}
          />
        )}

        {activeTab === 'jobs' && (
          <JobPostingsView
            jobs={jobs}
            activeJobId={activeJobId}
            onSelectJob={(id) => {
              setActiveJobId(id);
              setActiveTab('kanban');
            }}
            onCreateJob={onCreateJob}
            onConfigureCriteria={(id) => {
              setActiveJobId(id);
              setActiveTab('evaluation_criteria');
            }}
          />
        )}

        {activeTab === 'interviews' && (
          <InterviewCalendarView
            candidates={candidates}
            onScheduleInterview={onScheduleInterview}
          />
        )}

        {activeTab === 'talent_pool' && (
          <TalentPoolView
            candidates={candidates}
            onReactivateCandidate={(candId) => {
              onToggleTalentPool(candId, false);
              onUpdateCandidateStage(candId, CandidateStage.INITIAL_SCREENING);
              setActiveTab('kanban');
            }}
            onDraftEmail={onDraftEmail}
          />
        )}
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        jobs={jobs}
        activeJobId={activeJobId}
        onUploadComplete={(result) => {
          onBulkUploadSuccess(result);
        }}
        onJobCreated={(newJob) => {
          onCreateJob(newJob);
        }}
      />

      {/* Candidate Compare Modal */}
      <CandidateCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        candidates={selectedCompareCandidates}
        onDraftEmail={onDraftEmail}
      />
    </div>
  );
};
