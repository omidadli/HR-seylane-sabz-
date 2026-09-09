/**
 * Phase 2 of the Supabase persistence work: real Prisma-backed CRUD for
 * Candidate, mapped to the app's `Candidate` shape (src/types/index.ts).
 * Same pattern as employeeRepo.ts. Bulk resume-upload writes use
 * createMany so N resumes cost one round-trip, not N.
 */
import { prisma } from './db';
import type { Candidate, EmailDraft } from '../src/types';

function assertDb() {
  if (!prisma) throw new Error('DATABASE_URL is not configured — Supabase persistence is unavailable');
}

export function toCandidate(row: any): Candidate {
  const emailDraft: EmailDraft | undefined = row.emailDraftSubject != null
    ? {
      type: row.emailDraftType,
      subject: row.emailDraftSubject,
      body: row.emailDraftBody ?? '',
      status: 'DRAFT_ONLY',
      createdAtJalali: row.emailDraftCreatedAtJalali ?? '',
    }
    : undefined;

  return {
    id: row.id,
    jobId: row.jobId,
    jobTitle: row.job?.title,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    resumeFileName: row.resumeFileName,
    resumeText: row.resumeText,
    overallScore: row.overallScore ?? undefined,
    category: row.category ?? undefined,
    stage: row.stage,
    strengths: row.strengths ?? [],
    weaknesses: row.weaknesses ?? [],
    resumeQuotes: row.resumeQuotes ?? [],
    criteriaScores: row.criteriaScores ?? undefined,
    criteriaFeedback: row.criteriaFeedback ?? undefined,
    executiveSummary: row.executiveSummary ?? undefined,
    aiAvailable: row.aiAvailable,
    inTalentPool: row.inTalentPool,
    talentPoolNotes: row.talentPoolNotes ?? undefined,
    scheduledInterview: row.scheduledInterview ? row.scheduledInterview.toISOString() : undefined,
    interviewJalali: row.interviewJalali ?? undefined,
    interviewType: row.interviewType ?? undefined,
    interviewNotes: row.interviewNotes ?? undefined,
    emailDraft,
    appliedAtJalali: row.appliedAtJalali,
  };
}

function toFlatData(c: Partial<Candidate>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(c)) {
    if (value === undefined) continue;
    if (key === 'emailDraft') {
      const d = value as EmailDraft;
      data.emailDraftType = d.type;
      data.emailDraftSubject = d.subject;
      data.emailDraftBody = d.body;
      data.emailDraftCreatedAtJalali = d.createdAtJalali;
    } else if (key === 'jobTitle') {
      continue; // derived from the job relation, not a column
    } else if (key === 'scheduledInterview') {
      data.scheduledInterview = value ? new Date(value as string) : null;
    } else {
      data[key] = value;
    }
  }
  return data;
}

const include = { job: { select: { title: true } } } as const;

export async function loadAllCandidates(): Promise<Candidate[]> {
  assertDb();
  const rows = await prisma!.candidate.findMany({ include, orderBy: { createdAt: 'desc' } });
  return rows.map(toCandidate);
}

export async function countCandidates(): Promise<number> {
  assertDb();
  return prisma!.candidate.count();
}

export async function seedCandidates(candidates: Candidate[]): Promise<void> {
  assertDb();
  if (candidates.length === 0) return;
  await prisma!.candidate.createMany({
    data: candidates.map(c => ({ id: c.id, ...toFlatData(c) } as any)),
  });
}

export async function createCandidateInDb(c: Candidate): Promise<void> {
  assertDb();
  await prisma!.candidate.create({ data: { id: c.id, ...toFlatData(c) } as any });
}

/** Efficient batch insert for bulk resume uploads — one round trip for N candidates. */
export async function bulkCreateCandidatesInDb(candidates: Candidate[]): Promise<void> {
  assertDb();
  if (candidates.length === 0) return;
  await prisma!.candidate.createMany({
    data: candidates.map(c => ({ id: c.id, ...toFlatData(c) } as any)),
  });
}

export async function updateCandidateInDb(id: string, patch: Partial<Candidate>): Promise<void> {
  assertDb();
  await prisma!.candidate.update({ where: { id }, data: toFlatData(patch) });
}

export async function deleteCandidateInDb(id: string): Promise<void> {
  assertDb();
  await prisma!.candidate.delete({ where: { id } });
}
