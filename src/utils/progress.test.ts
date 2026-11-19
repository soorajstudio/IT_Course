import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAverageQuizScore,
  calculateCertificateScore,
  calculateCourseCompletionPercent,
  calculateLearningStreak,
  computeEarnedBadges,
  createEmptyLearnerState,
  generateCertificateId,
  getWeakTopics,
  isCertificateEligible,
  isSectionUnlocked,
} from './progress';
import type { CourseMeta, CourseProgress } from '../types/course';

const mockSections = Array.from({ length: 12 }, (_, idx) => ({
  id: `sec-${idx + 1}`,
  index: idx,
}));

const mockMeta: CourseMeta = {
  slug: 'html',
  order: 1,
  title: 'HTML',
  shortTitle: 'HTML5',
  area: 'Web',
  tagline: 'Semantic web markup',
  description: 'Complete HTML course',
  codeLanguage: 'html',
  estimatedHours: 18,
  prerequisites: [],
  whatYoullLearn: [],
  levelSummaries: {
    Beginner: 'Basics',
    Intermediate: 'Forms & media',
    Advanced: 'Accessibility & SEO',
  },
  sectionCount: 12,
  lessonCount: 48,
  examQuestionCount: 30,
  projectTitle: 'Accessible Portfolio',
};

function makeProgress(overrides: Partial<CourseProgress> = {}): CourseProgress {
  return {
    courseSlug: 'html',
    completedLessons: [],
    quizResults: {},
    projectChecklist: [],
    projectDone: false,
    startedAt: '2026-11-01T10:00:00.000Z',
    updatedAt: '2026-11-01T10:00:00.000Z',
    ...overrides,
  };
}

test('section 0 is always unlocked and section N requires passing section N-1', () => {
  assert.equal(isSectionUnlocked(0, mockSections, undefined), true);
  assert.equal(isSectionUnlocked(1, mockSections, undefined), false);

  const failedFirst = makeProgress({
    quizResults: {
      'sec-1': {
        scorePercent: 62,
        correctCount: 5,
        totalQuestions: 8,
        passed: false,
        completedAt: '2026-11-01T10:00:00.000Z',
      },
    },
  });
  assert.equal(isSectionUnlocked(1, mockSections, failedFirst), false);

  const passedFirst = makeProgress({
    quizResults: {
      'sec-1': {
        scorePercent: 75,
        correctCount: 6,
        totalQuestions: 8,
        passed: true,
        completedAt: '2026-11-01T10:00:00.000Z',
      },
    },
  });
  assert.equal(isSectionUnlocked(1, mockSections, passedFirst), true);
  assert.equal(isSectionUnlocked(2, mockSections, passedFirst), false);
});

test('certificate unlocks ONLY when all 12 sections, final exam, and mini project are done', () => {
  const allQuizzes: CourseProgress['quizResults'] = {};
  for (let i = 1; i <= 12; i++) {
    allQuizzes[`sec-${i}`] = {
      scorePercent: 88,
      correctCount: 7,
      totalQuestions: 8,
      passed: true,
      completedAt: '2026-11-02T10:00:00.000Z',
    };
  }

  const missingProject = makeProgress({
    quizResults: allQuizzes,
    examResult: {
      scorePercent: 90,
      correctCount: 27,
      totalQuestions: 30,
      passed: true,
      completedAt: '2026-11-03T10:00:00.000Z',
      timeSpentSeconds: 900,
      levelBreakdown: {
        Beginner: { correct: 10, total: 10 },
        Intermediate: { correct: 9, total: 10 },
        Advanced: { correct: 8, total: 10 },
      },
    },
    projectDone: false,
  });
  assert.equal(isCertificateEligible(12, missingProject), false);

  const missingExam = makeProgress({
    quizResults: allQuizzes,
    projectDone: true,
  });
  assert.equal(isCertificateEligible(12, missingExam), false);

  const fullyComplete = { ...missingProject, projectDone: true };
  assert.equal(isCertificateEligible(12, fullyComplete), true);
  assert.equal(calculateCertificateScore(fullyComplete), 89);
});

test('course completion percentage weights lessons, quizzes, exam, and project accurately', () => {
  const halfLessons = makeProgress({
    completedLessons: Array.from({ length: 24 }, (_, i) => `l-${i}`),
  });
  assert.equal(calculateCourseCompletionPercent(mockMeta, halfLessons), 23);

  const allQuizzes: CourseProgress['quizResults'] = {};
  for (let i = 1; i <= 12; i++) {
    allQuizzes[`sec-${i}`] = {
      scorePercent: 100,
      correctCount: 8,
      totalQuestions: 8,
      passed: true,
      completedAt: '2026-11-02T10:00:00.000Z',
    };
  }
  const complete = makeProgress({
    completedLessons: Array.from({ length: 48 }, (_, i) => `l-${i}`),
    quizResults: allQuizzes,
    examResult: {
      scorePercent: 100,
      correctCount: 30,
      totalQuestions: 30,
      passed: true,
      completedAt: '2026-11-03T10:00:00.000Z',
      timeSpentSeconds: 600,
      levelBreakdown: {
        Beginner: { correct: 10, total: 10 },
        Intermediate: { correct: 10, total: 10 },
        Advanced: { correct: 10, total: 10 },
      },
    },
    projectDone: true,
  });
  assert.equal(calculateCourseCompletionPercent(mockMeta, complete), 100);
});

test('learning streak counts consecutive active days up to today or yesterday', () => {
  assert.equal(calculateLearningStreak([], '2026-11-18'), 0);
  assert.equal(
    calculateLearningStreak(['2026-11-16', '2026-11-17', '2026-11-18'], '2026-11-18'),
    3
  );
  // Active yesterday still maintains streak
  assert.equal(
    calculateLearningStreak(['2026-11-15', '2026-11-16', '2026-11-17'], '2026-11-18'),
    3
  );
  // Gap breaks streak
  assert.equal(
    calculateLearningStreak(['2026-11-14', '2026-11-18'], '2026-11-18'),
    1
  );
});

test('weak topics, average score, certificate ID, and badges compute deterministically', () => {
  const state = createEmptyLearnerState();
  state.courses.html = makeProgress({
    completedLessons: ['l1'],
    quizResults: {
      'sec-1': {
        scorePercent: 62,
        correctCount: 5,
        totalQuestions: 8,
        passed: false,
        completedAt: '2026-11-18T10:00:00.000Z',
      },
      'sec-2': {
        scorePercent: 100,
        correctCount: 8,
        totalQuestions: 8,
        passed: true,
        completedAt: '2026-11-18T11:00:00.000Z',
      },
    },
  });
  state.solvedDsaIds = ['two-sum', 'valid-parentheses', 'merge-intervals'];

  assert.equal(calculateAverageQuizScore(state), 81);
  const weak = getWeakTopics(state, { html: mockMeta });
  assert.equal(weak.length, 1);
  assert.equal(weak[0].sectionId, 'sec-1');

  const badges = computeEarnedBadges(state, '2026-11-18');
  assert.equal(badges.find((b) => b.id === 'first-lesson')?.earned, true);
  assert.equal(badges.find((b) => b.id === 'quiz-ace')?.earned, true);
  assert.equal(badges.find((b) => b.id === 'dsa-solver')?.earned, true);
  assert.equal(badges.find((b) => b.id === 'certified-dev')?.earned, false);

  const certId = generateCertificateId('html', 'Alex Rivera', '2026-11-18T12:00:00.000Z');
  assert.match(certId, /^ITC-2026-HTML-[0-9A-F]{6}$/);
});
