import type {
  CourseArea,
  CourseExamFile,
  CourseLessonsFile,
  CourseLevel,
  CourseMeta,
  CourseProjectFile,
  CourseQuizzesFile,
  InterviewQA,
} from '../types/course';

// Auto-discover every course folder under src/content/courses/<slug>/
// Adding a new course folder with meta.json, lessons.json, quizzes.json, exam.json, and project.json
// registers it automatically with zero code changes.
const metaModules = import.meta.glob<{ default: CourseMeta }>(
  './courses/*/meta.json',
  { eager: true }
);

const lessonsModules = import.meta.glob<{ default: CourseLessonsFile }>(
  './courses/*/lessons.json'
);

const quizzesModules = import.meta.glob<{ default: CourseQuizzesFile }>(
  './courses/*/quizzes.json'
);

const examModules = import.meta.glob<{ default: CourseExamFile }>(
  './courses/*/exam.json'
);

const projectModules = import.meta.glob<{ default: CourseProjectFile }>(
  './courses/*/project.json'
);

export const COURSE_AREAS: CourseArea[] = [
  'Web',
  'Languages',
  'Databases',
  'Backend & Cloud',
  'Mobile',
];

export const COURSE_LEVELS: CourseLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

export const AREA_STYLES: Record<
  CourseArea,
  {
    colorText: string;
    colorBgSoft: string;
    colorBorder: string;
    accentHex: string;
    iconName: 'Globe' | 'Terminal' | 'Database' | 'Server' | 'Smartphone';
    description: string;
  }
> = {
  Web: {
    colorText: 'text-indigo-600 dark:text-indigo-400',
    colorBgSoft: 'bg-indigo-50 dark:bg-indigo-950/50',
    colorBorder: 'border-indigo-200 dark:border-indigo-900/60',
    accentHex: '#4F46E5',
    iconName: 'Globe',
    description: 'Frontend standards, modern JavaScript, React, Node.js, and server-side PHP.',
  },
  Languages: {
    colorText: 'text-amber-700 dark:text-amber-400',
    colorBgSoft: 'bg-amber-50 dark:bg-amber-950/50',
    colorBorder: 'border-amber-200 dark:border-amber-900/60',
    accentHex: '#D97706',
    iconName: 'Terminal',
    description: 'Systems, object-oriented, and general-purpose programming from C to Python.',
  },
  Databases: {
    colorText: 'text-emerald-700 dark:text-emerald-400',
    colorBgSoft: 'bg-emerald-50 dark:bg-emerald-950/50',
    colorBorder: 'border-emerald-200 dark:border-emerald-900/60',
    accentHex: '#059669',
    iconName: 'Database',
    description: 'Relational design, query optimization, transactions, and production SQL engines.',
  },
  'Backend & Cloud': {
    colorText: 'text-sky-700 dark:text-sky-400',
    colorBgSoft: 'bg-sky-50 dark:bg-sky-950/50',
    colorBorder: 'border-sky-200 dark:border-sky-900/60',
    accentHex: '#0284C7',
    iconName: 'Server',
    description: 'BaaS platforms, MVC architecture, and enterprise .NET application engineering.',
  },
  Mobile: {
    colorText: 'text-rose-700 dark:text-rose-400',
    colorBgSoft: 'bg-rose-50 dark:bg-rose-950/50',
    colorBorder: 'border-rose-200 dark:border-rose-900/60',
    accentHex: '#E11D48',
    iconName: 'Smartphone',
    description: 'Cross-platform Android app engineering with Dart 3 and Flutter.',
  },
};

const allCoursesCache: CourseMeta[] = Object.values(metaModules)
  .map((mod) => mod.default)
  .sort((a, b) => a.order - b.order);

const courseMetaBySlug: Record<string, CourseMeta> = {};
for (const c of allCoursesCache) {
  courseMetaBySlug[c.slug] = c;
}

export function getAllCourses(): CourseMeta[] {
  return allCoursesCache;
}

export function getCourseMeta(slug: string): CourseMeta | undefined {
  return courseMetaBySlug[slug];
}

export function getCourseMetaMap(): Record<string, CourseMeta> {
  return courseMetaBySlug;
}

// In-memory promise caches for lazy-loaded course files
const lessonsCache = new Map<string, Promise<CourseLessonsFile | null>>();
const quizzesCache = new Map<string, Promise<CourseQuizzesFile | null>>();
const examCache = new Map<string, Promise<CourseExamFile | null>>();
const projectCache = new Map<string, Promise<CourseProjectFile | null>>();

export function loadCourseLessons(slug: string): Promise<CourseLessonsFile | null> {
  if (!lessonsCache.has(slug)) {
    const loader = lessonsModules[`./courses/${slug}/lessons.json`];
    const p = loader
      ? loader().then((m) => m.default).catch(() => null)
      : Promise.resolve(null);
    lessonsCache.set(slug, p);
  }
  return lessonsCache.get(slug)!;
}

export function loadCourseQuizzes(slug: string): Promise<CourseQuizzesFile | null> {
  if (!quizzesCache.has(slug)) {
    const loader = quizzesModules[`./courses/${slug}/quizzes.json`];
    const p = loader
      ? loader().then((m) => m.default).catch(() => null)
      : Promise.resolve(null);
    quizzesCache.set(slug, p);
  }
  return quizzesCache.get(slug)!;
}

export function loadCourseExam(slug: string): Promise<CourseExamFile | null> {
  if (!examCache.has(slug)) {
    const loader = examModules[`./courses/${slug}/exam.json`];
    const p = loader
      ? loader().then((m) => m.default).catch(() => null)
      : Promise.resolve(null);
    examCache.set(slug, p);
  }
  return examCache.get(slug)!;
}

export function loadCourseProject(slug: string): Promise<CourseProjectFile | null> {
  if (!projectCache.has(slug)) {
    const loader = projectModules[`./courses/${slug}/project.json`];
    const p = loader
      ? loader().then((m) => m.default).catch(() => null)
      : Promise.resolve(null);
    projectCache.set(slug, p);
  }
  return projectCache.get(slug)!;
}

export interface GlobalInterviewItem extends InterviewQA {
  id: string;
  courseSlug: string;
  courseTitle: string;
  courseArea: CourseArea;
  lessonId: string;
}

let interviewBankPromise: Promise<GlobalInterviewItem[]> | null = null;

export function loadAllInterviewQuestions(): Promise<GlobalInterviewItem[]> {
  if (!interviewBankPromise) {
    interviewBankPromise = Promise.all(
      allCoursesCache.map(async (meta) => {
        const lessonsFile = await loadCourseLessons(meta.slug);
        if (!lessonsFile) return [] as GlobalInterviewItem[];
        const items: GlobalInterviewItem[] = [];
        for (const section of lessonsFile.sections) {
          for (const lesson of section.lessons) {
            lesson.interviewQA.forEach((qa, idx) => {
              items.push({
                id: `${meta.slug}:${lesson.id}:qa${idx + 1}`,
                courseSlug: meta.slug,
                courseTitle: meta.title,
                courseArea: meta.area,
                lessonId: lesson.id,
                level: lesson.level,
                topic: section.title,
                question: qa.question,
                answer: qa.answer,
              });
            });
          }
        }
        return items;
      })
    ).then((nested) => nested.flat());
  }
  return interviewBankPromise;
}
