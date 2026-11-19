import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type {
  CertificateRecord,
  CourseLevel,
  CourseProgress,
  LearnerState,
  QuizAttempt,
  UserProfile,
} from '../types/course';
import { getCourseMeta } from '../content/loader';
import {
  buildSampleProgressState,
  loadSavedTheme,
  loadStateFromSupabase,
  saveTheme,
  storageAdapter,
} from '../services/storage';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';
import {
  buildCertificateRecord,
  createEmptyLearnerState,
  getTodayIsoDate,
  isCertificateEligible,
} from '../utils/progress';

interface ToastMessage {
  id: number;
  text: string;
  tone: 'success' | 'info' | 'error';
}

interface AppContextValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  state: LearnerState;
  toasts: ToastMessage[];
  notify: (text: string, tone?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: number) => void;
  signIn: (name: string, email: string, userId?: string) => void;
  signOut: () => void;
  updateLearnerName: (name: string) => void;
  markLessonComplete: (courseSlug: string, lessonId: string) => void;
  recordLessonVisit: (courseSlug: string, lessonId: string) => void;
  recordSectionQuizResult: (
    courseSlug: string,
    sectionId: string,
    attempt: QuizAttempt
  ) => void;
  recordExamResult: (
    courseSlug: string,
    result: QuizAttempt & {
      timeSpentSeconds: number;
      levelBreakdown: Record<CourseLevel, { correct: number; total: number }>;
    }
  ) => void;
  toggleProjectRequirement: (courseSlug: string, requirementId: string) => void;
  markProjectDone: (courseSlug: string) => void;
  toggleDsaSolved: (problemId: string) => void;
  saveDsaDraft: (problemId: string, language: string, code: string) => void;
  toggleFlashcardMastered: (cardId: string) => void;
  loadSampleProgress: () => void;
  resetAllProgress: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function ensureCourseProgress(
  courses: Record<string, CourseProgress>,
  courseSlug: string,
  nowIso: string
): CourseProgress {
  const existing = courses[courseSlug];
  if (existing) return existing;
  return {
    courseSlug,
    completedLessons: [],
    quizResults: {},
    projectChecklist: [],
    projectDone: false,
    startedAt: nowIso,
    updatedAt: nowIso,
  };
}

function addTodayActivity(dates: string[]): string[] {
  const today = getTodayIsoDate();
  if (dates.includes(today)) return dates;
  return [...dates, today].sort();
}

function maybeIssueCertificate(
  nextState: LearnerState,
  courseSlug: string
): { state: LearnerState; newlyIssued?: CertificateRecord } {
  const meta = getCourseMeta(courseSlug);
  const progress = nextState.courses[courseSlug];
  if (!meta || !progress) return { state: nextState };
  if (nextState.certificates[courseSlug]) return { state: nextState };
  if (!isCertificateEligible(meta.sectionCount, progress)) {
    return { state: nextState };
  }
  const learnerName = nextState.profile?.name || 'IT Courses Learner';
  const cert = buildCertificateRecord(meta, progress, learnerName);
  return {
    state: {
      ...nextState,
      certificates: {
        ...nextState.certificates,
        [courseSlug]: cert,
      },
    },
    newlyIssued: cert,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadSavedTheme());
  const [state, setState] = useState<LearnerState>(() => storageAdapter.loadState());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Persist learner state
  useEffect(() => {
    storageAdapter.saveState(state);
  }, [state]);

  // Track study time cleanly once per minute while user is active
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setState((prev) => ({
          ...prev,
          studyMinutes: prev.studyMinutes + 1,
        }));
      }
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Supabase Auth session & remote state hydration
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const syncSessionUser = async (user: { id: string; email?: string; user_metadata?: { name?: string; full_name?: string } }) => {
      const displayName =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Learner';

      const profile: UserProfile = {
        id: user.id,
        name: displayName,
        email: user.email || '',
        createdAt: new Date().toISOString(),
        isGuest: false,
      };

      const remoteState = await loadStateFromSupabase(user.id);
      setState((prev) => {
        const mergedCourses = { ...prev.courses, ...(remoteState?.courses ?? {}) };
        const mergedCerts = { ...prev.certificates, ...(remoteState?.certificates ?? {}) };
        const mergedDsa = Array.from(
          new Set([...prev.solvedDsaIds, ...(remoteState?.solvedDsaIds ?? [])])
        );
        const mergedFlashcards = Array.from(
          new Set([...prev.flashcardMastered, ...(remoteState?.flashcardMastered ?? [])])
        );
        const mergedDates = Array.from(
          new Set([...prev.activityDates, ...(remoteState?.activityDates ?? [])])
        ).sort();

        return {
          ...prev,
          profile,
          courses: mergedCourses,
          certificates: mergedCerts,
          solvedDsaIds: mergedDsa,
          dsaDrafts: { ...prev.dsaDrafts, ...(remoteState?.dsaDrafts ?? {}) },
          flashcardMastered: mergedFlashcards,
          activityDates: mergedDates,
          studyMinutes: Math.max(prev.studyMinutes, remoteState?.studyMinutes ?? 0),
          lastActiveCourseSlug: remoteState?.lastActiveCourseSlug ?? prev.lastActiveCourseSlug,
          lastActiveLessonId: remoteState?.lastActiveLessonId ?? prev.lastActiveLessonId,
        };
      });
    };

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        void syncSessionUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void syncSessionUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const notify = useCallback(
    (text: string, tone: 'success' | 'info' | 'error' = 'info') => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev.slice(-2), { id, text, tone }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const signIn = useCallback(
    (name: string, email: string, userId?: string) => {
      const profile: UserProfile = {
        id: userId || `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        isGuest: false,
      };
      setState((prev) => {
        // Also update learnerName on existing certificates if they had default name
        const updatedCerts = { ...prev.certificates };
        for (const [slug, cert] of Object.entries(updatedCerts)) {
          if (cert.learnerName === 'IT Courses Learner') {
            updatedCerts[slug] = { ...cert, learnerName: profile.name };
          }
        }
        return {
          ...prev,
          profile,
          certificates: updatedCerts,
          activityDates: addTodayActivity(prev.activityDates),
        };
      });
      notify(`Signed in as ${profile.name}`, 'success');
    },
    [notify]
  );

  const signOut = useCallback(() => {
    if (isSupabaseConfigured() && supabase) {
      void supabase.auth.signOut();
    }
    setState((prev) => ({ ...prev, profile: null }));
    notify('Signed out. Your local progress remains saved on this device.', 'info');
  }, [notify]);

  const updateLearnerName = useCallback((name: string) => {
    const clean = name.trim();
    if (!clean) return;
    setState((prev) => {
      const updatedCerts: Record<string, CertificateRecord> = {};
      for (const [slug, cert] of Object.entries(prev.certificates)) {
        updatedCerts[slug] = { ...cert, learnerName: clean };
      }
      return {
        ...prev,
        profile: prev.profile
          ? { ...prev.profile, name: clean }
          : {
              id: `user-${Date.now()}`,
              name: clean,
              email: '',
              createdAt: new Date().toISOString(),
              isGuest: true,
            },
        certificates: updatedCerts,
      };
    });
  }, []);

  const recordLessonVisit = useCallback((courseSlug: string, lessonId: string) => {
    const nowIso = new Date().toISOString();
    setState((prev) => {
      const current = ensureCourseProgress(prev.courses, courseSlug, nowIso);
      if (
        prev.lastActiveCourseSlug === courseSlug &&
        prev.lastActiveLessonId === lessonId &&
        current.lastVisitedLessonId === lessonId
      ) {
        return prev;
      }
      return {
        ...prev,
        lastActiveCourseSlug: courseSlug,
        lastActiveLessonId: lessonId,
        activityDates: addTodayActivity(prev.activityDates),
        courses: {
          ...prev.courses,
          [courseSlug]: {
            ...current,
            lastVisitedLessonId: lessonId,
            updatedAt: nowIso,
          },
        },
      };
    });
  }, []);

  const markLessonComplete = useCallback(
    (courseSlug: string, lessonId: string) => {
      const nowIso = new Date().toISOString();
      setState((prev) => {
        const current = ensureCourseProgress(prev.courses, courseSlug, nowIso);
        const alreadyDone = current.completedLessons.includes(lessonId);
        const completedLessons = alreadyDone
          ? current.completedLessons
          : [...current.completedLessons, lessonId];

        return {
          ...prev,
          lastActiveCourseSlug: courseSlug,
          lastActiveLessonId: lessonId,
          activityDates: addTodayActivity(prev.activityDates),
          courses: {
            ...prev.courses,
            [courseSlug]: {
              ...current,
              completedLessons,
              lastVisitedLessonId: lessonId,
              updatedAt: nowIso,
            },
          },
        };
      });
    },
    []
  );

  const recordSectionQuizResult = useCallback(
    (courseSlug: string, sectionId: string, attempt: QuizAttempt) => {
      const nowIso = new Date().toISOString();
      let issuedCertTitle: string | null = null;
      setState((prev) => {
        const current = ensureCourseProgress(prev.courses, courseSlug, nowIso);
        const prevBest = current.quizResults[sectionId];
        // Keep highest score if already passed, otherwise update
        const bestAttempt =
          prevBest && prevBest.passed && prevBest.scorePercent > attempt.scorePercent
            ? prevBest
            : attempt;

        const draft: LearnerState = {
          ...prev,
          activityDates: addTodayActivity(prev.activityDates),
          courses: {
            ...prev.courses,
            [courseSlug]: {
              ...current,
              quizResults: {
                ...current.quizResults,
                [sectionId]: bestAttempt,
              },
              updatedAt: nowIso,
            },
          },
        };
        const checked = maybeIssueCertificate(draft, courseSlug);
        if (checked.newlyIssued) {
          issuedCertTitle = checked.newlyIssued.courseTitle;
        }
        return checked.state;
      });
      if (issuedCertTitle) {
        notify(`Certificate unlocked for ${issuedCertTitle}!`, 'success');
      }
    },
    [notify]
  );

  const recordExamResult = useCallback(
    (
      courseSlug: string,
      result: QuizAttempt & {
        timeSpentSeconds: number;
        levelBreakdown: Record<CourseLevel, { correct: number; total: number }>;
      }
    ) => {
      const nowIso = new Date().toISOString();
      let issuedCertTitle: string | null = null;
      setState((prev) => {
        const current = ensureCourseProgress(prev.courses, courseSlug, nowIso);
        const prevExam = current.examResult;
        const bestExam =
          prevExam && prevExam.passed && prevExam.scorePercent > result.scorePercent
            ? prevExam
            : result;

        const draft: LearnerState = {
          ...prev,
          activityDates: addTodayActivity(prev.activityDates),
          courses: {
            ...prev.courses,
            [courseSlug]: {
              ...current,
              examResult: bestExam,
              updatedAt: nowIso,
            },
          },
        };
        const checked = maybeIssueCertificate(draft, courseSlug);
        if (checked.newlyIssued) {
          issuedCertTitle = checked.newlyIssued.courseTitle;
        }
        return checked.state;
      });
      if (issuedCertTitle) {
        notify(`Certificate unlocked for ${issuedCertTitle}!`, 'success');
      }
    },
    [notify]
  );

  const toggleProjectRequirement = useCallback(
    (courseSlug: string, requirementId: string) => {
      const nowIso = new Date().toISOString();
      setState((prev) => {
        const current = ensureCourseProgress(prev.courses, courseSlug, nowIso);
        const exists = current.projectChecklist.includes(requirementId);
        const nextList = exists
          ? current.projectChecklist.filter((id) => id !== requirementId)
          : [...current.projectChecklist, requirementId];
        return {
          ...prev,
          activityDates: addTodayActivity(prev.activityDates),
          courses: {
            ...prev.courses,
            [courseSlug]: {
              ...current,
              projectChecklist: nextList,
              updatedAt: nowIso,
            },
          },
        };
      });
    },
    []
  );

  const markProjectDone = useCallback(
    (courseSlug: string) => {
      const nowIso = new Date().toISOString();
      let issuedCertTitle: string | null = null;
      setState((prev) => {
        const current = ensureCourseProgress(prev.courses, courseSlug, nowIso);
        const draft: LearnerState = {
          ...prev,
          activityDates: addTodayActivity(prev.activityDates),
          courses: {
            ...prev.courses,
            [courseSlug]: {
              ...current,
              projectDone: true,
              projectDoneAt: nowIso,
              updatedAt: nowIso,
            },
          },
        };
        const checked = maybeIssueCertificate(draft, courseSlug);
        if (checked.newlyIssued) {
          issuedCertTitle = checked.newlyIssued.courseTitle;
        }
        return checked.state;
      });
      notify(
        issuedCertTitle
          ? `Project marked done and ${issuedCertTitle} certificate unlocked!`
          : 'Mini project marked as completed.',
        'success'
      );
    },
    [notify]
  );

  const toggleDsaSolved = useCallback((problemId: string) => {
    setState((prev) => {
      const exists = prev.solvedDsaIds.includes(problemId);
      const next = exists
        ? prev.solvedDsaIds.filter((id) => id !== problemId)
        : [...prev.solvedDsaIds, problemId];
      return {
        ...prev,
        solvedDsaIds: next,
        activityDates: addTodayActivity(prev.activityDates),
      };
    });
  }, []);

  const saveDsaDraft = useCallback(
    (problemId: string, language: string, code: string) => {
      setState((prev) => ({
        ...prev,
        dsaDrafts: {
          ...prev.dsaDrafts,
          [problemId]: {
            ...(prev.dsaDrafts[problemId] ?? {}),
            [language]: code,
          },
        },
      }));
    },
    []
  );

  const toggleFlashcardMastered = useCallback((cardId: string) => {
    setState((prev) => {
      const exists = prev.flashcardMastered.includes(cardId);
      const next = exists
        ? prev.flashcardMastered.filter((id) => id !== cardId)
        : [...prev.flashcardMastered, cardId];
      return {
        ...prev,
        flashcardMastered: next,
        activityDates: addTodayActivity(prev.activityDates),
      };
    });
  }, []);

  const loadSampleProgress = useCallback(() => {
    setState((prev) => buildSampleProgressState(prev.profile?.name));
    notify('Sample learner progress loaded with a completed HTML certificate.', 'info');
  }, [notify]);

  const resetAllProgress = useCallback(() => {
    storageAdapter.clearState();
    setState(createEmptyLearnerState());
    notify('All local progress cleared.', 'info');
  }, [notify]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        state,
        toasts,
        notify,
        dismissToast,
        signIn,
        signOut,
        updateLearnerName,
        markLessonComplete,
        recordLessonVisit,
        recordSectionQuizResult,
        recordExamResult,
        toggleProjectRequirement,
        markProjectDone,
        toggleDsaSolved,
        saveDsaDraft,
        toggleFlashcardMastered,
        loadSampleProgress,
        resetAllProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
