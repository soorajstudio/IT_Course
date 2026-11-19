import type { CertificateRecord, LearnerState } from '../types/course';
import { createEmptyLearnerState, getTodayIsoDate } from '../utils/progress';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'it_courses_learner_state_v1';
const THEME_KEY = 'it_courses_theme_v1';

let syncTimer: number | null = null;

/**
 * StorageAdapter decouples UI persistence from localStorage so a Supabase
 * adapter (auth + Postgres progress tables + public certificate verification)
 * can be swapped or synced in without modifying UI components.
 */
export interface StorageAdapter {
  loadState(): LearnerState;
  saveState(state: LearnerState): void;
  findCertificateById(certId: string): CertificateRecord | null;
  clearState(): void;
}

/**
 * Asynchronously syncs state to Supabase when configured and user is signed in.
 * Debounced to avoid excessive DB writes.
 */
export async function syncStateToSupabase(state: LearnerState): Promise<void> {
  if (!isSupabaseConfigured() || !supabase || !state.profile?.id || state.profile.isGuest) {
    return;
  }

  try {
    const { error: stateError } = await supabase.from('learner_state').upsert(
      {
        user_id: state.profile.id,
        courses: state.courses,
        certificates: state.certificates,
        solved_dsa_ids: state.solvedDsaIds,
        dsa_drafts: state.dsaDrafts,
        flashcard_mastered: state.flashcardMastered,
        activity_dates: state.activityDates,
        study_minutes: state.studyMinutes,
        last_active_course_slug: state.lastActiveCourseSlug ?? null,
        last_active_lesson_id: state.lastActiveLessonId ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (stateError) {
      console.warn('Supabase learner_state sync warning:', stateError.message);
    }

    // Sync any earned certificates to public_certificates for public lookup
    const certList = Object.values(state.certificates);
    if (certList.length > 0) {
      for (const cert of certList) {
        await supabase.from('public_certificates').upsert(
          {
            id: cert.id.toUpperCase(),
            user_id: state.profile.id,
            course_slug: cert.courseSlug,
            course_title: cert.courseTitle,
            course_area: cert.courseArea,
            learner_name: cert.learnerName,
            level_label: cert.levelLabel,
            final_score: cert.finalScore,
            issued_at: cert.issuedAt,
          },
          { onConflict: 'id' }
        );
      }
    }
  } catch (err) {
    console.warn('Failed to sync state to Supabase:', err);
  }
}

/**
 * Loads learner state from Supabase for a given authenticated user ID.
 */
export async function loadStateFromSupabase(userId: string): Promise<Partial<LearnerState> | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('learner_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      courses: data.courses ?? {},
      certificates: data.certificates ?? {},
      solvedDsaIds: Array.isArray(data.solved_dsa_ids) ? data.solved_dsa_ids : [],
      dsaDrafts: data.dsa_drafts ?? {},
      flashcardMastered: Array.isArray(data.flashcard_mastered) ? data.flashcard_mastered : [],
      activityDates: Array.isArray(data.activity_dates) ? data.activity_dates : [],
      studyMinutes: typeof data.study_minutes === 'number' ? data.study_minutes : 0,
      lastActiveCourseSlug: data.last_active_course_slug,
      lastActiveLessonId: data.last_active_lesson_id,
    };
  } catch (err) {
    console.warn('Failed to load state from Supabase:', err);
    return null;
  }
}

/**
 * Asynchronously looks up a certificate in local storage first, then checks Supabase.
 */
export async function fetchCertificateById(certId: string): Promise<CertificateRecord | null> {
  const localMatch = storageAdapter.findCertificateById(certId);
  if (localMatch) return localMatch;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('public_certificates')
        .select('*')
        .eq('id', certId.trim().toUpperCase())
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          courseSlug: data.course_slug,
          courseTitle: data.course_title,
          courseArea: data.course_area,
          learnerName: data.learner_name,
          levelLabel: data.level_label,
          finalScore: Number(data.final_score),
          issuedAt: data.issued_at,
        };
      }
    } catch (err) {
      console.warn('Error fetching certificate from Supabase:', err);
    }
  }

  return null;
}

class LocalStorageAdapter implements StorageAdapter {
  loadState(): LearnerState {
    if (typeof window === 'undefined') return createEmptyLearnerState();
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return createEmptyLearnerState();
      const parsed = JSON.parse(raw) as Partial<LearnerState>;
      return {
        ...createEmptyLearnerState(),
        ...parsed,
        courses: parsed.courses ?? {},
        certificates: parsed.certificates ?? {},
        solvedDsaIds: Array.isArray(parsed.solvedDsaIds) ? parsed.solvedDsaIds : [],
        dsaDrafts: parsed.dsaDrafts ?? {},
        flashcardMastered: Array.isArray(parsed.flashcardMastered)
          ? parsed.flashcardMastered
          : [],
        activityDates: Array.isArray(parsed.activityDates)
          ? parsed.activityDates
          : [],
        studyMinutes: typeof parsed.studyMinutes === 'number' ? parsed.studyMinutes : 0,
      };
    } catch {
      return createEmptyLearnerState();
    }
  }

  saveState(state: LearnerState): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors cleanly
    }

    // Debounced sync to Supabase if signed in
    if (isSupabaseConfigured() && supabase && state.profile?.id && !state.profile.isGuest) {
      if (syncTimer) window.clearTimeout(syncTimer);
      syncTimer = window.setTimeout(() => {
        void syncStateToSupabase(state);
      }, 1500);
    }
  }

  findCertificateById(certId: string): CertificateRecord | null {
    const state = this.loadState();
    const target = certId.trim().toUpperCase();
    for (const cert of Object.values(state.certificates)) {
      if (cert.id.toUpperCase() === target) {
        return cert;
      }
    }
    return null;
  }

  clearState(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const storageAdapter: StorageAdapter = new LocalStorageAdapter();

export function loadSavedTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(THEME_KEY, theme);
}

/**
 * Generates deterministic sample progress when a learner explicitly clicks
 * "Load Sample Progress" on the Dashboard to inspect a populated state.
 */
export function buildSampleProgressState(existingName?: string): LearnerState {
  const today = getTodayIsoDate();
  const d1 = new Date();
  d1.setDate(d1.getDate() - 1);
  const d2 = new Date();
  d2.setDate(d2.getDate() - 2);
  const d3 = new Date();
  d3.setDate(d3.getDate() - 3);
  const isoDates = [
    getTodayIsoDate(d3),
    getTodayIsoDate(d2),
    getTodayIsoDate(d1),
    today,
  ];

  const learnerName = existingName?.trim() || 'Jordan Patel';
  const issuedAt = new Date().toISOString();

  // Complete HTML course across all 12 sections so a real certificate is ready
  const htmlQuizzes: Record<
    string,
    {
      scorePercent: number;
      correctCount: number;
      totalQuestions: number;
      passed: boolean;
      completedAt: string;
    }
  > = {};
  const htmlLessons: string[] = [];
  for (let s = 1; s <= 12; s++) {
    const secId = `html-s${s}`;
    htmlQuizzes[secId] = {
      scorePercent: s === 9 ? 75 : s % 3 === 0 ? 100 : 88,
      correctCount: s === 9 ? 6 : s % 3 === 0 ? 8 : 7,
      totalQuestions: 8,
      passed: true,
      completedAt: issuedAt,
    };
    for (let l = 1; l <= 4; l++) {
      htmlLessons.push(`html-s${s}-l${l}`);
    }
  }

  return {
    profile: {
      id: 'local-sample-user',
      name: learnerName,
      email: 'jordan.patel@example.dev',
      createdAt: issuedAt,
      isGuest: false,
    },
    courses: {
      html: {
        courseSlug: 'html',
        completedLessons: htmlLessons,
        quizResults: htmlQuizzes,
        examResult: {
          scorePercent: 93,
          correctCount: 28,
          totalQuestions: 30,
          passed: true,
          completedAt: issuedAt,
          timeSpentSeconds: 1420,
          levelBreakdown: {
            Beginner: { correct: 10, total: 10 },
            Intermediate: { correct: 9, total: 10 },
            Advanced: { correct: 9, total: 10 },
          },
        },
        projectChecklist: ['req-1', 'req-2', 'req-3', 'req-4', 'req-5', 'req-6'],
        projectDone: true,
        projectDoneAt: issuedAt,
        lastVisitedLessonId: 'html-s12-l4',
        startedAt: issuedAt,
        updatedAt: issuedAt,
      },
      javascript: {
        courseSlug: 'javascript',
        completedLessons: [
          'javascript-s1-l1',
          'javascript-s1-l2',
          'javascript-s1-l3',
          'javascript-s1-l4',
          'javascript-s2-l1',
          'javascript-s2-l2',
        ],
        quizResults: {
          'javascript-s1': {
            scorePercent: 88,
            correctCount: 7,
            totalQuestions: 8,
            passed: true,
            completedAt: issuedAt,
          },
          'javascript-s2': {
            scorePercent: 63,
            correctCount: 5,
            totalQuestions: 8,
            passed: false,
            completedAt: issuedAt,
          },
        },
        projectChecklist: ['req-1', 'req-2'],
        projectDone: false,
        lastVisitedLessonId: 'javascript-s2-l2',
        startedAt: issuedAt,
        updatedAt: issuedAt,
      },
      python: {
        courseSlug: 'python',
        completedLessons: [
          'python-s1-l1',
          'python-s1-l2',
          'python-s1-l3',
          'python-s1-l4',
        ],
        quizResults: {
          'python-s1': {
            scorePercent: 75,
            correctCount: 6,
            totalQuestions: 8,
            passed: true,
            completedAt: issuedAt,
          },
        },
        projectChecklist: [],
        projectDone: false,
        lastVisitedLessonId: 'python-s2-l1',
        startedAt: issuedAt,
        updatedAt: issuedAt,
      },
    },
    certificates: {
      html: {
        id: 'ITC-2026-HTML-9C4E21',
        courseSlug: 'html',
        courseTitle: 'HTML',
        courseArea: 'Web',
        learnerName,
        levelLabel: 'Complete Track (Beginner to Advanced)',
        finalScore: 91,
        issuedAt,
      },
    },
    solvedDsaIds: ['two-sum', 'valid-parentheses', 'best-time-to-buy-sell-stock'],
    dsaDrafts: {},
    flashcardMastered: [],
    activityDates: isoDates,
    studyMinutes: 265,
    lastActiveCourseSlug: 'javascript',
    lastActiveLessonId: 'javascript-s2-l2',
  };
}
