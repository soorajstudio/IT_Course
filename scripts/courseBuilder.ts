import fs from 'node:fs';
import path from 'node:path';
import type {
  CourseArea,
  CourseExamFile,
  CourseLessonsFile,
  CourseLevel,
  CourseMeta,
  CourseProjectFile,
  CourseQuizzesFile,
  CourseSection,
  Lesson,
  ProjectFileSolution,
  QuizQuestion,
  SectionQuiz,
} from '../src/types/course';

export interface LessonBlueprint {
  title: string;
  durationMin?: number;
  summary: string;
  details: string;
  bestPractice: string;
  codeTitle: string;
  code: string;
  output?: string;
  keyPoints: [string, string, string];
  mistake1: [string, string];
  mistake2: [string, string];
  qa1: [string, string];
  qa2: [string, string];
  /**
   * Two topic-accurate quiz questions for this lesson (at least 1 conceptual + 1 practical/edge case)
   */
  quiz: {
    prompt: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
    type?: 'concept' | 'output';
    codeSnippet?: string;
  }[];
}

export interface SectionBlueprint {
  level: CourseLevel;
  title: string;
  description: string;
  lessons: [LessonBlueprint, LessonBlueprint, LessonBlueprint, LessonBlueprint];
  /**
   * At least 2 code output-prediction questions for this section
   */
  outputQuestions: {
    prompt: string;
    code: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }[];
  /**
   * Extra conceptual MCQs for this section so every quiz has >= 8 rich unique questions
   */
  extraQuestions?: {
    prompt: string;
    options: [string, string, string, string];
    correctIndex: 0 | 1 | 2 | 3;
    explanation: string;
  }[];
}

export interface CourseBlueprint {
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
  sections: SectionBlueprint[]; // Must be 12 (4 Beginner, 4 Intermediate, 4 Advanced)
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

export function emitCourse(blueprint: CourseBlueprint): void {
  if (blueprint.sections.length !== 12) {
    throw new Error(
      `Course "${blueprint.slug}" must have 12 sections, found ${blueprint.sections.length}`
    );
  }

  const outDir = path.resolve(process.cwd(), 'src/content/courses', blueprint.slug);
  fs.mkdirSync(outDir, { recursive: true });

  const sections: CourseSection[] = [];
  const quizzes: SectionQuiz[] = [];
  const examPoolByLevel: Record<CourseLevel, QuizQuestion[]> = {
    Beginner: [],
    Intermediate: [],
    Advanced: [],
  };

  blueprint.sections.forEach((secBp, sIdx) => {
    const sectionId = `${blueprint.slug}-s${sIdx + 1}`;
    const builtLessons: Lesson[] = secBp.lessons.map((lBp, lIdx) => {
      const lessonId = `${sectionId}-l${lIdx + 1}`;
      return {
        id: lessonId,
        sectionId,
        level: secBp.level,
        order: lIdx + 1,
        title: lBp.title,
        durationMin: lBp.durationMin ?? (secBp.level === 'Beginner' ? 12 : secBp.level === 'Intermediate' ? 16 : 20),
        summary: lBp.summary,
        explanation: [lBp.summary, lBp.details, lBp.bestPractice],
        codeExample: {
          title: lBp.codeTitle,
          language: blueprint.codeLanguage,
          code: lBp.code,
          ...(lBp.output ? { output: lBp.output } : {}),
        },
        keyPoints: [...lBp.keyPoints],
        commonMistakes: [
          { mistake: lBp.mistake1[0], fix: lBp.mistake1[1] },
          { mistake: lBp.mistake2[0], fix: lBp.mistake2[1] },
        ],
        interviewQA: [
          { question: lBp.qa1[0], answer: lBp.qa1[1] },
          { question: lBp.qa2[0], answer: lBp.qa2[1] },
        ],
      };
    });

    sections.push({
      id: sectionId,
      index: sIdx,
      level: secBp.level,
      title: secBp.title,
      description: secBp.description,
      lessons: builtLessons,
    });

    // Build at least 8 distinct quiz questions per section
    const sectionQuestions: QuizQuestion[] = [];
    let qCounter = 1;

    // 1) Add bespoke lesson quiz questions
    secBp.lessons.forEach((lBp) => {
      lBp.quiz.forEach((q) => {
        sectionQuestions.push({
          id: `${sectionId}-q${qCounter++}`,
          type: q.type ?? (q.codeSnippet ? 'output' : 'concept'),
          level: secBp.level,
          topic: secBp.title,
          prompt: q.prompt,
          ...(q.codeSnippet
            ? {
                codeSnippet: {
                  language: blueprint.codeLanguage,
                  code: q.codeSnippet,
                },
              }
            : {}),
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        });
      });
    });

    // 2) Add section output-prediction questions
    secBp.outputQuestions.forEach((oq) => {
      sectionQuestions.push({
        id: `${sectionId}-q${qCounter++}`,
        type: 'output',
        level: secBp.level,
        topic: secBp.title,
        prompt: oq.prompt,
        codeSnippet: {
          language: blueprint.codeLanguage,
          code: oq.code,
        },
        options: oq.options,
        correctIndex: oq.correctIndex,
        explanation: oq.explanation,
      });
    });

    // 3) Add any extra conceptual questions
    (secBp.extraQuestions ?? []).forEach((eq) => {
      sectionQuestions.push({
        id: `${sectionId}-q${qCounter++}`,
        type: 'concept',
        level: secBp.level,
        topic: secBp.title,
        prompt: eq.prompt,
        options: eq.options,
        correctIndex: eq.correctIndex,
        explanation: eq.explanation,
      });
    });

    if (sectionQuestions.length < 8) {
      throw new Error(
        `Section "${sectionId}" only has ${sectionQuestions.length} quiz questions (minimum 8 required).`
      );
    }

    quizzes.push({
      sectionId,
      sectionTitle: secBp.title,
      level: secBp.level,
      passMark: 70,
      questions: sectionQuestions,
    });

    // Pick 3 strong questions per section for the 30-question exam pool (2 concept + 1 output)
    const outputs = sectionQuestions.filter((q) => q.type === 'output');
    const concepts = sectionQuestions.filter((q) => q.type === 'concept');
    const picked: QuizQuestion[] = [];
    if (outputs[0]) picked.push(outputs[0]);
    if (concepts[0]) picked.push(concepts[0]);
    if (concepts[2]) picked.push(concepts[2]);
    else if (concepts[1]) picked.push(concepts[1]);

    for (const q of picked) {
      examPoolByLevel[secBp.level].push(q);
    }
  });

  // Assemble a balanced 30-question final exam (10 Beginner, 10 Intermediate, 10 Advanced)
  const examQuestions: QuizQuestion[] = [];
  (['Beginner', 'Intermediate', 'Advanced'] as CourseLevel[]).forEach((lvl) => {
    const pool = examPoolByLevel[lvl].slice(0, 10);
    pool.forEach((q, idx) => {
      examQuestions.push({
        ...q,
        id: `${blueprint.slug}-exam-${lvl.toLowerCase()}-${idx + 1}`,
        level: lvl,
      });
    });
  });

  if (examQuestions.length < 30) {
    throw new Error(
      `Course "${blueprint.slug}" exam has only ${examQuestions.length} questions (minimum 30 required).`
    );
  }

  const meta: CourseMeta = {
    slug: blueprint.slug,
    order: blueprint.order,
    title: blueprint.title,
    shortTitle: blueprint.shortTitle,
    area: blueprint.area,
    tagline: blueprint.tagline,
    description: blueprint.description,
    codeLanguage: blueprint.codeLanguage,
    estimatedHours: blueprint.estimatedHours,
    prerequisites: blueprint.prerequisites,
    whatYoullLearn: blueprint.whatYoullLearn,
    levelSummaries: blueprint.levelSummaries,
    sectionCount: sections.length,
    lessonCount: sections.reduce((sum, s) => sum + s.lessons.length, 0),
    examQuestionCount: examQuestions.length,
    projectTitle: blueprint.project.title,
  };

  const lessonsFile: CourseLessonsFile = {
    courseSlug: blueprint.slug,
    sections,
  };

  const quizzesFile: CourseQuizzesFile = {
    courseSlug: blueprint.slug,
    quizzes,
  };

  const examFile: CourseExamFile = {
    courseSlug: blueprint.slug,
    title: `${blueprint.title} Final Certification Exam`,
    durationMinutes: 45,
    passMark: 70,
    questions: examQuestions,
  };

  const projectFile: CourseProjectFile = {
    courseSlug: blueprint.slug,
    title: blueprint.project.title,
    estimatedHours: blueprint.project.estimatedHours,
    difficulty: blueprint.project.difficulty,
    brief: blueprint.project.brief,
    requirements: blueprint.project.requirements.map((text, idx) => ({
      id: `req-${idx + 1}`,
      text,
    })),
    steps: blueprint.project.steps.map(([title, details], idx) => ({
      stepNumber: idx + 1,
      title,
      details,
    })),
    referenceSolution: blueprint.project.referenceSolution,
  };

  fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2));
  fs.writeFileSync(path.join(outDir, 'lessons.json'), JSON.stringify(lessonsFile, null, 2));
  fs.writeFileSync(path.join(outDir, 'quizzes.json'), JSON.stringify(quizzesFile, null, 2));
  fs.writeFileSync(path.join(outDir, 'exam.json'), JSON.stringify(examFile, null, 2));
  fs.writeFileSync(path.join(outDir, 'project.json'), JSON.stringify(projectFile, null, 2));
}
