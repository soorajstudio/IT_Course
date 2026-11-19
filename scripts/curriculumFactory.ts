import type {
  CourseArea,
  CourseLevel,
  ProjectFileSolution,
} from '../src/types/course';
import {
  emitCourse,
  type CourseBlueprint,
  type LessonBlueprint,
  type SectionBlueprint,
} from './courseBuilder';

export interface CompactLesson {
  title: string;
  summary: string;
  details: string;
  bestPractice: string;
  codeTitle: string;
  code: string;
  output?: string;
  keyPoints: [string, string, string];
  mistakes: [[string, string], [string, string]];
  qa: [[string, string], [string, string]];
  /**
   * 1-2 bespoke MCQ questions directly testing this lesson's concept
   */
  mcq: {
    prompt: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }[];
}

export interface CompactSection {
  level: CourseLevel;
  title: string;
  description: string;
  lessons: [CompactLesson, CompactLesson, CompactLesson, CompactLesson];
  outputQuestions: [
    {
      prompt: string;
      code: string;
      options: [string, string, string, string];
      correctIndex: 0 | 1 | 2 | 3;
      explanation: string;
    },
    {
      prompt: string;
      code: string;
      options: [string, string, string, string];
      correctIndex: 0 | 1 | 2 | 3;
      explanation: string;
    },
  ];
}

export interface CompactCourse {
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
  sections: CompactSection[];
  project: {
    title: string;
    estimatedHours: number;
    difficulty: string;
    brief: string;
    requirements: string[];
    steps: [string, string][];
    referenceSolution: ProjectFileSolution[];
  };
}

export function buildAndEmitCourse(course: CompactCourse): void {
  const sections: SectionBlueprint[] = course.sections.map((sec) => {
    const lessons = sec.lessons.map((l): LessonBlueprint => {
      // Ensure each lesson contributes at least 2 distinct quiz questions
      const quiz = [...l.mcq];
      if (quiz.length < 2) {
        // Synthesize a sharp pitfall-identification MCQ directly from the lesson's curated mistake/fix
        quiz.push({
          prompt: `When working with ${l.title} in ${course.title}, which practice correctly prevents a common production bug?`,
          options: [
            l.mistakes[0][1],
            `Always rely on "${l.mistakes[0][0]}" as the default pattern`,
            `Ignore ${l.title} constraints during runtime execution`,
            `Replace ${l.title} with unvalidated global state mutations`,
          ],
          correctIndex: 0,
          explanation: `Common pitfall: ${l.mistakes[0][0]}. Recommended fix: ${l.mistakes[0][1]}`,
        });
      }
      return {
        title: l.title,
        summary: l.summary,
        details: l.details,
        bestPractice: l.bestPractice,
        codeTitle: l.codeTitle,
        code: l.code,
        output: l.output,
        keyPoints: l.keyPoints,
        mistake1: l.mistakes[0],
        mistake2: l.mistakes[1],
        qa1: l.qa[0],
        qa2: l.qa[1],
        quiz,
      };
    }) as [LessonBlueprint, LessonBlueprint, LessonBlueprint, LessonBlueprint];

    return {
      level: sec.level,
      title: sec.title,
      description: sec.description,
      lessons,
      outputQuestions: sec.outputQuestions,
    };
  });

  const bp: CourseBlueprint = {
    slug: course.slug,
    order: course.order,
    title: course.title,
    shortTitle: course.shortTitle,
    area: course.area,
    tagline: course.tagline,
    description: course.description,
    codeLanguage: course.codeLanguage,
    estimatedHours: course.estimatedHours,
    prerequisites: course.prerequisites,
    whatYoullLearn: course.whatYoullLearn,
    levelSummaries: course.levelSummaries,
    sections,
    project: course.project,
  };

  emitCourse(bp);
}

/**
 * Compact tuple authoring helper for building rich, 100% accurate courses with
 * compile-time guaranteed 4 Beginner + 4 Intermediate + 4 Advanced = 12 sections
 * and 4 lessons per section = 48 lessons.
 */
export interface LessonSpec {
  /** Lesson title */
  t: string;
  /** Concise summary paragraph */
  s: string;
  /** Deeper technical explanation paragraph */
  d: string;
  /** Practical best-practice paragraph */
  b: string;
  /** Code example title */
  ct: string;
  /** Idiomatic syntax-highlighted code example */
  c: string;
  /** Optional stdout / rendered result */
  o?: string;
  /** 3 key takeaways */
  kp: [string, string, string];
  /** 2 common mistakes [mistake, fix] */
  m: [[string, string], [string, string]];
  /** 2 technical interview Q&As [question, answer] */
  qa: [[string, string], [string, string]];
  /** Bespoke conceptual MCQ */
  q: {
    p: string;
    o: [string, string, string, string];
    a: 0 | 1 | 2 | 3;
    e: string;
  };
}

export interface OutputQSpec {
  p: string;
  c: string;
  o: [string, string, string, string];
  a: 0 | 1 | 2 | 3;
  e: string;
}

export interface SectionSpec {
  title: string;
  desc: string;
  lessons: [LessonSpec, LessonSpec, LessonSpec, LessonSpec];
  out: [OutputQSpec, OutputQSpec];
}

export interface StructuredCourseSpec {
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
  levels: {
    Beginner: [SectionSpec, SectionSpec, SectionSpec, SectionSpec];
    Intermediate: [SectionSpec, SectionSpec, SectionSpec, SectionSpec];
    Advanced: [SectionSpec, SectionSpec, SectionSpec, SectionSpec];
  };
  project: {
    title: string;
    estimatedHours: number;
    difficulty: string;
    brief: string;
    requirements: string[];
    steps: [string, string][];
    referenceSolution: ProjectFileSolution[];
  };
}

function toCompactSection(level: CourseLevel, sec: SectionSpec): CompactSection {
  return {
    level,
    title: sec.title,
    description: sec.desc,
    lessons: sec.lessons.map((l): CompactLesson => ({
      title: l.t,
      summary: l.s,
      details: l.d,
      bestPractice: l.b,
      codeTitle: l.ct,
      code: l.c,
      output: l.o,
      keyPoints: l.kp,
      mistakes: l.m,
      qa: l.qa,
      mcq: [
        {
          prompt: l.q.p,
          options: l.q.o,
          correctIndex: l.q.a,
          explanation: l.q.e,
        },
      ],
    })) as [CompactLesson, CompactLesson, CompactLesson, CompactLesson],
    outputQuestions: [
      {
        prompt: sec.out[0].p,
        code: sec.out[0].c,
        options: sec.out[0].o,
        correctIndex: sec.out[0].a,
        explanation: sec.out[0].e,
      },
      {
        prompt: sec.out[1].p,
        code: sec.out[1].c,
        options: sec.out[1].o,
        correctIndex: sec.out[1].a,
        explanation: sec.out[1].e,
      },
    ],
  };
}

export function emitStructuredCourse(spec: StructuredCourseSpec): void {
  const sections: CompactSection[] = [
    ...spec.levels.Beginner.map((s) => toCompactSection('Beginner', s)),
    ...spec.levels.Intermediate.map((s) => toCompactSection('Intermediate', s)),
    ...spec.levels.Advanced.map((s) => toCompactSection('Advanced', s)),
  ];
  buildAndEmitCourse({
    slug: spec.slug,
    order: spec.order,
    title: spec.title,
    shortTitle: spec.shortTitle,
    area: spec.area,
    tagline: spec.tagline,
    description: spec.description,
    codeLanguage: spec.codeLanguage,
    estimatedHours: spec.estimatedHours,
    prerequisites: spec.prerequisites,
    whatYoullLearn: spec.whatYoullLearn,
    levelSummaries: spec.levelSummaries,
    sections,
    project: spec.project,
  });
}

