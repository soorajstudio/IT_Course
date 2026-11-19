export type CourseArea =
  | 'Web'
  | 'Languages'
  | 'Databases'
  | 'Backend & Cloud'
  | 'Mobile';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface CourseMeta {
  slug: string;
  order: number;
  title: string;
  shortTitle: string;
  area: CourseArea;
  tagline: string;
  description: string;
  codeLanguage: string;
  estimatedHours: number;
  prerequisites: string[];
  whatYoullLearn: string[];
  levelSummaries: Record<CourseLevel, string>;
  sectionCount: number;
  lessonCount: number;
  examQuestionCount: number;
  projectTitle: string;
}

export interface InterviewQA {
  question: string;
  answer: string;
  level: CourseLevel;
  topic: string;
}

export interface Lesson {
  id: string;
  sectionId: string;
  level: CourseLevel;
  order: number;
  title: string;
  durationMin: number;
  summary: string;
  explanation: string[];
  codeExample: {
    title: string;
    language: string;
    code: string;
    output?: string;
  };
  keyPoints: string[];
  commonMistakes: {
    mistake: string;
    fix: string;
  }[];
  interviewQA: {
    question: string;
    answer: string;
  }[];
}

export interface CourseSection {
  id: string;
  index: number; // 0 to 11 across the 3 levels
  level: CourseLevel;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface CourseLessonsFile {
  courseSlug: string;
  sections: CourseSection[];
}

export interface QuizQuestion {
  id: string;
  type: 'concept' | 'output';
  level?: CourseLevel;
  topic?: string;
  prompt: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface SectionQuiz {
  sectionId: string;
  sectionTitle: string;
  level: CourseLevel;
  passMark: number; // 70
  questions: QuizQuestion[];
}

export interface CourseQuizzesFile {
  courseSlug: string;
  quizzes: SectionQuiz[];
}

export interface CourseExamFile {
  courseSlug: string;
  title: string;
  durationMinutes: number;
  passMark: number; // 70
  questions: QuizQuestion[];
}

export interface ProjectFileSolution {
  filename: string;
  language: string;
  code: string;
}

export interface CourseProjectFile {
  courseSlug: string;
  title: string;
  estimatedHours: number;
  difficulty: string;
  brief: string;
  requirements: {
    id: string;
    text: string;
  }[];
  steps: {
    stepNumber: number;
    title: string;
    details: string;
  }[];
  referenceSolution: ProjectFileSolution[];
}

export interface QuizAttempt {
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: string;
}

export interface CourseProgress {
  courseSlug: string;
  completedLessons: string[];
  quizResults: Record<string, QuizAttempt>; // keyed by sectionId
  examResult?: QuizAttempt & {
    timeSpentSeconds: number;
    levelBreakdown: Record<CourseLevel, { correct: number; total: number }>;
  };
  projectChecklist: string[]; // ticked requirement IDs
  projectDone: boolean;
  projectDoneAt?: string;
  lastVisitedLessonId?: string;
  startedAt: string;
  updatedAt: string;
}

export interface CertificateRecord {
  id: string; // e.g. ITC-2026-HTML-8F4A
  courseSlug: string;
  courseTitle: string;
  courseArea: CourseArea;
  learnerName: string;
  levelLabel: string;
  finalScore: number; // combined or exam score
  issuedAt: string; // ISO date
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isGuest: boolean;
}

export interface LearnerState {
  profile: UserProfile | null;
  courses: Record<string, CourseProgress>;
  certificates: Record<string, CertificateRecord>; // keyed by courseSlug
  solvedDsaIds: string[];
  dsaDrafts: Record<string, Record<string, string>>; // problemId -> lang -> code
  flashcardMastered: string[]; // Q&A ids
  activityDates: string[]; // YYYY-MM-DD unique sorted dates
  studyMinutes: number;
  lastActiveCourseSlug?: string;
  lastActiveLessonId?: string;
}

export interface WeakTopic {
  courseSlug: string;
  courseTitle: string;
  sectionId: string;
  sectionTitle: string;
  scorePercent: number;
  firstLessonId?: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  category: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  statement: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints: string[];
  starterCode: Record<'javascript' | 'python' | 'java' | 'cpp', string>;
  solutions: Record<'javascript' | 'python' | 'java' | 'cpp', string>;
  timeComplexity: string;
  spaceComplexity: string;
  approachNotes: string;
}
