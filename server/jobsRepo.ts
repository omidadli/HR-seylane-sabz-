/**
 * Phase 2 of the Supabase persistence work: real Prisma-backed CRUD for
 * JobPosting, mapped to the app's `JobPosting` shape (src/types/index.ts).
 * Same pattern as employeeRepo.ts.
 */
import { prisma } from './db';
import type { JobPosting, JobCriteria } from '../src/types';

function assertDb() {
  if (!prisma) throw new Error('DATABASE_URL is not configured — Supabase persistence is unavailable');
}

function toCriteria(c: any): JobCriteria {
  return { id: c.id, title: c.title, weight: c.weight, description: c.description ?? undefined };
}

export function toJobPosting(row: any): JobPosting {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    employmentType: row.employmentType,
    location: row.location,
    description: row.description,
    requirements: row.requirements,
    status: row.status,
    criteria: (row.criteria ?? []).map(toCriteria),
    createdAtJalali: row.createdAtJalali,
    applicationsCount: row.applicationsCount,
    scoringMethod: row.scoringMethod ?? undefined,
    aiRigor: row.aiRigor ?? undefined,
    interviewPriorityThreshold: row.interviewPriorityThreshold ?? undefined,
    initialRejectionThreshold: row.initialRejectionThreshold ?? undefined,
    evaluationInstructions: row.evaluationInstructions ?? undefined,
  };
}

const include = { criteria: true } as const;

export async function loadAllJobs(): Promise<JobPosting[]> {
  assertDb();
  const rows = await prisma!.jobPosting.findMany({ include, orderBy: { createdAt: 'desc' } });
  return rows.map(toJobPosting);
}

export async function countJobs(): Promise<number> {
  assertDb();
  return prisma!.jobPosting.count();
}

export async function seedJobs(jobs: JobPosting[]): Promise<void> {
  assertDb();
  for (const j of jobs) {
    await prisma!.jobPosting.create({
      data: {
        id: j.id,
        title: j.title,
        department: j.department,
        employmentType: j.employmentType,
        location: j.location,
        description: j.description,
        requirements: j.requirements,
        status: j.status,
        createdAtJalali: j.createdAtJalali,
        applicationsCount: j.applicationsCount,
        scoringMethod: j.scoringMethod,
        aiRigor: j.aiRigor,
        interviewPriorityThreshold: j.interviewPriorityThreshold,
        initialRejectionThreshold: j.initialRejectionThreshold,
        evaluationInstructions: j.evaluationInstructions,
        criteria: {
          create: (j.criteria ?? []).map(c => ({ id: c.id, title: c.title, weight: c.weight, description: c.description })),
        },
      },
    });
  }
}

export async function createJobInDb(j: JobPosting): Promise<void> {
  assertDb();
  await prisma!.jobPosting.create({
    data: {
      id: j.id,
      title: j.title,
      department: j.department,
      employmentType: j.employmentType,
      location: j.location,
      description: j.description,
      requirements: j.requirements,
      status: j.status,
      createdAtJalali: j.createdAtJalali,
      applicationsCount: j.applicationsCount,
      criteria: {
        create: (j.criteria ?? []).map(c => ({ id: c.id, title: c.title, weight: c.weight, description: c.description })),
      },
    },
  });
}

/** Applies a partial patch. If `criteria` is included, it fully replaces the job's criteria set. */
export async function updateJobInDb(id: string, patch: Partial<JobPosting>): Promise<void> {
  assertDb();
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (key === 'criteria') continue; // handled below
    data[key] = value;
  }
  if (patch.criteria) {
    data.criteria = {
      deleteMany: {},
      create: patch.criteria.map(c => ({ id: c.id, title: c.title, weight: c.weight, description: c.description })),
    };
  }
  await prisma!.jobPosting.update({ where: { id }, data });
}

export async function incrementJobApplications(id: string, by: number): Promise<void> {
  assertDb();
  await prisma!.jobPosting.update({ where: { id }, data: { applicationsCount: { increment: by } } });
}

export async function deleteJobInDb(id: string): Promise<void> {
  assertDb();
  await prisma!.jobPosting.delete({ where: { id } });
}
