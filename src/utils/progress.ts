import type {
  BadgeItem,
  CertificateRecord,
  CourseMeta,
  CourseProgress,
  CourseSection,
  LearnerState,
  WeakTopic,
} from '../types/course';

export const PASS_MARK_PERCENT = 70;

export function createEmptyLearnerState(): LearnerState {
  return {
    profile: null,
    courses: {},
    certificates: {},
    solvedDsaIds: [],
    dsaDrafts: {},
    flashcardMastered: [],
    activityDates: [],
    studyMinutes: 0,
  };
}

export function getTodayIsoDate(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSectionUnlocked(
  sectionIndex: number,
  sections: Pick<CourseSection, 'id' | 'index'>[],
  progress?: CourseProgress
): boolean {
  if (sectionIndex <= 0) return true;
  if (!progress) return false;
  const previousSection = sections.find((s) => s.index === sectionIndex - 1);
  if (!previousSection) return false;
  const prevQuiz = progress.quizResults[previousSection.id];
  return Boolean(prevQuiz && prevQuiz.passed);
}

export function getPassedSectionCount(progress?: CourseProgress): number {
  if (!progress) return 0;
  return Object.values(progress.quizResults).filter((q) => q.passed).length;
}

export function calculateCourseCompletionPercent(
  meta: Pick<CourseMeta, 'lessonCount' | 'sectionCount'>,
  progress?: CourseProgress
): number {
  if (!progress) return 0;
  // Weighted completion:
  // Lessons: 45%, Section Quizzes: 30%, Final Exam: 15%, Mini Project: 10%
  const lessonRatio =
    meta.lessonCount > 0
      ? Math.min(1, progress.completedLessons.length / meta.lessonCount)
      : 0;
  const quizRatio =
    meta.sectionCount > 0
      ? Math.min(1, getPassedSectionCount(progress) / meta.sectionCount)
      : 0;
  const examRatio = progress.examResult?.passed ? 1 : 0;
  const projectRatio = progress.projectDone ? 1 : 0;

  return Math.round(
    lessonRatio * 45 + quizRatio * 30 + examRatio * 15 + projectRatio * 10
  );
}

export function isCertificateEligible(
  sectionCount: number,
  progress?: CourseProgress
): boolean {
  if (!progress) return false;
  const passedSections = getPassedSectionCount(progress);
  const examPassed = Boolean(progress.examResult?.passed);
  const projectDone = Boolean(progress.projectDone);
  return passedSections >= sectionCount && examPassed && projectDone;
}

export function calculateCertificateScore(progress: CourseProgress): number {
  const quizScores = Object.values(progress.quizResults).map(
    (r) => r.scorePercent
  );
  const avgQuiz =
    quizScores.length > 0
      ? quizScores.reduce((sum, s) => sum + s, 0) / quizScores.length
      : 0;
  const examScore = progress.examResult?.scorePercent ?? 0;
  if (quizScores.length === 0) return Math.round(examScore);
  return Math.round(avgQuiz * 0.4 + examScore * 0.6);
}

export function generateCertificateId(
  courseSlug: string,
  learnerName: string,
  issuedAtIso: string
): string {
  const year = new Date(issuedAtIso).getFullYear() || 2026;
  const slugCode = courseSlug
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 4)
    .padEnd(3, 'X');
  // Deterministic lightweight hash so IDs are unique & reproducible
  const seed = `${courseSlug}|${learnerName.trim().toLowerCase()}|${issuedAtIso}`;
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const hex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(0, 6);
  return `ITC-${year}-${slugCode}-${hex}`;
}

export function calculateLearningStreak(
  activityDates: string[],
  todayIso: string = getTodayIsoDate()
): number {
  if (activityDates.length === 0) return 0;
  const uniqueSet = new Set(activityDates);

  const parseDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  };

  const dayMs = 86_400_000;
  let cursor = parseDate(todayIso);

  // If no activity today yet, allow streak anchored at yesterday
  if (!uniqueSet.has(todayIso)) {
    const yesterdayDate = new Date(cursor - dayMs);
    const yesterdayIso = yesterdayDate.toISOString().slice(0, 10);
    if (!uniqueSet.has(yesterdayIso)) {
      return 0;
    }
    cursor -= dayMs;
  }

  let streak = 0;
  while (true) {
    const iso = new Date(cursor).toISOString().slice(0, 10);
    if (uniqueSet.has(iso)) {
      streak += 1;
      cursor -= dayMs;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateAverageQuizScore(state: LearnerState): number {
  const scores: number[] = [];
  for (const progress of Object.values(state.courses)) {
    for (const attempt of Object.values(progress.quizResults)) {
      scores.push(attempt.scorePercent);
    }
    if (progress.examResult) {
      scores.push(progress.examResult.scorePercent);
    }
  }
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getWeakTopics(
  state: LearnerState,
  courseMetaMap: Record<string, CourseMeta>,
  sectionTitleMap?: Record<string, { title: string; firstLessonId?: string }>
): WeakTopic[] {
  const weak: WeakTopic[] = [];
  for (const progress of Object.values(state.courses)) {
    const meta = courseMetaMap[progress.courseSlug];
    if (!meta) continue;
    for (const [sectionId, attempt] of Object.entries(progress.quizResults)) {
      if (attempt.scorePercent < 80) {
        const key = `${progress.courseSlug}:${sectionId}`;
        const secInfo = sectionTitleMap?.[key];
        weak.push({
          courseSlug: progress.courseSlug,
          courseTitle: meta.title,
          sectionId,
          sectionTitle:
            secInfo?.title ??
            sectionId
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          scorePercent: attempt.scorePercent,
          firstLessonId: secInfo?.firstLessonId,
        });
      }
    }
  }
  return weak.sort((a, b) => a.scorePercent - b.scorePercent);
}

export function computeEarnedBadges(
  state: LearnerState,
  todayIso: string = getTodayIsoDate()
): BadgeItem[] {
  const courseList = Object.values(state.courses);
  const totalLessons = courseList.reduce(
    (sum, c) => sum + c.completedLessons.length,
    0
  );
  const totalQuizzesPassed = courseList.reduce(
    (sum, c) => sum + getPassedSectionCount(c),
    0
  );
  const hasPerfectQuiz = courseList.some((c) =>
    Object.values(c.quizResults).some((q) => q.scorePercent === 100)
  );
  const projectsCompleted = courseList.filter((c) => c.projectDone).length;
  const certCount = Object.keys(state.certificates).length;
  const streak = calculateLearningStreak(state.activityDates, todayIso);
  const dsaCount = state.solvedDsaIds.length;

  return [
    {
      id: 'first-lesson',
      title: 'First Step',
      description: 'Complete your first structured lesson.',
      earned: totalLessons >= 1,
      category: 'Learning',
    },
    {
      id: 'quiz-ace',
      title: 'Quiz Ace',
      description: 'Score 100% on any section assessment.',
      earned: hasPerfectQuiz,
      category: 'Assessment',
    },
    {
      id: 'section-master',
      title: 'Momentum Builder',
      description: 'Pass at least 4 section quizzes across your courses.',
      earned: totalQuizzesPassed >= 4,
      category: 'Assessment',
    },
    {
      id: 'project-shipper',
      title: 'Project Builder',
      description: 'Complete and verify your first course mini project.',
      earned: projectsCompleted >= 1,
      category: 'Hands-On',
    },
    {
      id: 'dsa-solver',
      title: 'Algorithm Thinker',
      description: 'Solve 3 or more DSA practice challenges.',
      earned: dsaCount >= 3,
      category: 'Interviews',
    },
    {
      id: 'polyglot',
      title: 'Multi-Track Learner',
      description: 'Start learning across 3 different technologies.',
      earned: courseList.length >= 3,
      category: 'Breadth',
    },
    {
      id: 'streak-3',
      title: 'Consistent Habit',
      description: 'Maintain a 3-day learning streak.',
      earned: streak >= 3,
      category: 'Consistency',
    },
    {
      id: 'certified-dev',
      title: 'Certified Developer',
      description: 'Earn an official IT Courses completion certificate.',
      earned: certCount >= 1,
      category: 'Credential',
    },
  ];
}

export function buildCertificateRecord(
  meta: CourseMeta,
  progress: CourseProgress,
  learnerName: string,
  issuedAt: string = new Date().toISOString()
): CertificateRecord {
  const safeName = learnerName.trim() || 'IT Courses Learner';
  return {
    id: generateCertificateId(meta.slug, safeName, issuedAt),
    courseSlug: meta.slug,
    courseTitle: meta.title,
    courseArea: meta.area,
    learnerName: safeName,
    levelLabel: 'Complete Track (Beginner to Advanced)',
    finalScore: calculateCertificateScore(progress),
    issuedAt,
  };
}
