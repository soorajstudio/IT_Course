import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FolderGit2,
  Lock,
  PlayCircle,
  Unlock,
} from 'lucide-react';
import {
  AREA_STYLES,
  COURSE_LEVELS,
  getCourseMeta,
  loadCourseLessons,
  loadCourseProject,
} from '../content/loader';
import type { CourseLessonsFile, CourseLevel, CourseProjectFile } from '../types/course';
import { useApp } from '../context/AppContext';
import { AreaIcon } from '../components/AreaIcon';
import { ProgressRing } from '../components/ProgressRing';
import { PageLoadingSkeleton } from '../components/ErrorBoundary';
import {
  calculateCourseCompletionPercent,
  getPassedSectionCount,
  isCertificateEligible,
  isSectionUnlocked,
} from '../utils/progress';

export const CourseDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const meta = getCourseMeta(slug);
  const { state } = useApp();

  const [lessonsData, setLessonsData] = useState<CourseLessonsFile | null>(null);
  const [projectData, setProjectData] = useState<CourseProjectFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState<CourseLevel>('Beginner');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([loadCourseLessons(slug), loadCourseProject(slug)]).then(
      ([lessons, project]) => {
        if (!mounted) return;
        setLessonsData(lessons);
        setProjectData(project);
        setLoading(false);
      }
    );
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (!meta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Course not found
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          The requested course slug &ldquo;{slug}&rdquo; does not exist in the catalog.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to catalog</span>
        </Link>
      </div>
    );
  }

  if (loading || !lessonsData) {
    return <PageLoadingSkeleton label={`Loading ${meta.title} syllabus`} />;
  }

  const progress = state.courses[meta.slug];
  const completionPct = calculateCourseCompletionPercent(meta, progress);
  const passedSections = getPassedSectionCount(progress);
  const certEligible = isCertificateEligible(meta.sectionCount, progress);
  const cert = state.certificates[meta.slug];
  const areaStyle = AREA_STYLES[meta.area];

  const firstLessonId =
    progress?.lastVisitedLessonId || lessonsData.sections[0]?.lessons[0]?.id;

  const levelSections = lessonsData.sections.filter((s) => s.level === activeLevel);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>All courses</span>
      </Link>

      {/* Course Overview Header */}
      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3">
            <AreaIcon area={meta.area} size="lg" />
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className={`font-semibold ${areaStyle.colorText}`}>{meta.area}</span>
              <span aria-hidden="true">·</span>
              <span>Beginner to Advanced</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{meta.lessonCount} lessons</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{meta.estimatedHours} hours</span>
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {meta.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {meta.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {firstLessonId && (
              <Link
                to={`/courses/${meta.slug}/lesson/${firstLessonId}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap shrink-0"
              >
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                <span>{progress ? 'Continue course' : 'Start Section 1'}</span>
              </Link>
            )}
            <Link
              to={`/courses/${meta.slug}/project`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <FolderGit2 className="h-4 w-4" aria-hidden="true" />
              <span>Mini Project</span>
            </Link>
            <Link
              to={`/courses/${meta.slug}/exam`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              <span>Final Exam ({meta.examQuestionCount} Qs)</span>
            </Link>
          </div>
        </div>

        {/* Progress & Certificate Status Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Track Progress
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Complete all 3 criteria for certificate
              </p>
            </div>
            <ProgressRing
              percent={completionPct}
              label={`${meta.title} completion`}
            />
          </div>

          <ul className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
            <li className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">
                Sections passed (70%+)
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums text-slate-900 dark:text-white">
                {passedSections}/{meta.sectionCount}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">
                Final exam (70%+)
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums text-slate-900 dark:text-white">
                {progress?.examResult
                  ? `${progress.examResult.scorePercent}% (${progress.examResult.passed ? 'Passed' : 'Retry'})`
                  : 'Not taken'}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300">Mini project</span>
              <span
                className={`text-xs font-semibold ${
                  progress?.projectDone
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {progress?.projectDone ? 'Completed' : 'In progress'}
              </span>
            </li>
          </ul>

          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            {cert || certEligible ? (
              <Link
                to="/certificates"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>View &amp; Download Certificate</span>
              </Link>
            ) : (
              <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  Certificate unlocks once all 12 quizzes, final exam, and project are
                  complete.
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* What you'll learn */}
      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          What you&apos;ll learn
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {meta.whatYoullLearn.map((point) => (
            <div key={point} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400"
                aria-hidden="true"
              />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Full 3-Level Syllabus */}
      <section className="mt-12">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Course Syllabus
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              3 levels · 12 sections · 48 lessons. Pass each section quiz (70%+) to unlock
              the next section.
            </p>
          </div>

          <div
            className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1 dark:bg-slate-800/80"
            role="tablist"
            aria-label="Course syllabus levels"
          >
            {COURSE_LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                role="tab"
                aria-selected={activeLevel === lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeLevel === lvl
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          {meta.levelSummaries[activeLevel]}
        </p>

        <div className="mt-6 space-y-5">
          {levelSections.map((section) => {
            const unlocked = isSectionUnlocked(
              section.index,
              lessonsData.sections,
              progress
            );
            const quizAttempt = progress?.quizResults[section.id];
            const completedInSec = section.lessons.filter((l) =>
              progress?.completedLessons.includes(l.id)
            ).length;

            return (
              <div
                key={section.id}
                className={`rounded-2xl border bg-white p-6 dark:bg-slate-900 ${
                  unlocked
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-slate-200/70 opacity-80 dark:border-slate-800/70'
                }`}
              >
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-medium">
                        Section {String(section.index + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{section.level}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {completedInSec}/{section.lessons.length} lessons done
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {section.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {unlocked ? (
                      <Link
                        to={`/courses/${meta.slug}/quiz/${section.id}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                          quizAttempt?.passed
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {quizAttempt?.passed ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Quiz passed ({quizAttempt.scorePercent}%)</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3.5 w-3.5" />
                            <span>
                              {quizAttempt
                                ? `Retry quiz (${quizAttempt.scorePercent}%)`
                                : 'Take section quiz'}
                            </span>
                          </>
                        )}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Pass Section {section.index} quiz to unlock</span>
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800/70">
                  {section.lessons.map((lesson, idx) => {
                    const done = progress?.completedLessons.includes(lesson.id);
                    return (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between gap-4 py-3 first:pt-1 last:pb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {done ? (
                            <CheckCircle2
                              className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                              aria-label="Completed"
                            />
                          ) : unlocked ? (
                            <BookOpen
                              className="h-4 w-4 shrink-0 text-slate-400"
                              aria-hidden="true"
                            />
                          ) : (
                            <Lock
                              className="h-4 w-4 shrink-0 text-slate-400"
                              aria-hidden="true"
                            />
                          )}
                          <div className="min-w-0">
                            {unlocked ? (
                              <Link
                                to={`/courses/${meta.slug}/lesson/${lesson.id}`}
                                className="block truncate text-sm font-medium text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                              >
                                {idx + 1}. {lesson.title}
                              </Link>
                            ) : (
                              <span className="block truncate text-sm text-slate-500 dark:text-slate-400">
                                {idx + 1}. {lesson.title}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {lesson.durationMin}m
                          </span>
                          {unlocked && (
                            <Link
                              to={`/courses/${meta.slug}/lesson/${lesson.id}`}
                              className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                            >
                              {done ? 'Review' : 'Read'}
                            </Link>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mini Project & Final Exam Preview */}
      {projectData && (
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <FolderGit2 className="h-4 w-4" aria-hidden="true" />
              <span>Capstone Mini Project</span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
              {projectData.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {projectData.brief}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span>{projectData.requirements.length} checklist requirements</span>
              <span aria-hidden="true">·</span>
              <span>{projectData.steps.length}-step guide</span>
              <span aria-hidden="true">·</span>
              <span>Reference solution included</span>
            </div>
            <Link
              to={`/courses/${meta.slug}/project`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Open project workspace</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              <span>Timed Final Examination</span>
            </div>
            <h3 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
              {meta.title} Comprehensive Exam
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Test your end-to-end mastery across Beginner, Intermediate, and Advanced
              topics with {meta.examQuestionCount} mixed conceptual and code-reading
              questions under a 45-minute timer.
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span>{meta.examQuestionCount} questions</span>
              <span aria-hidden="true">·</span>
              <span>45 minutes</span>
              <span aria-hidden="true">·</span>
              <span>70% pass mark</span>
            </div>
            <Link
              to={`/courses/${meta.slug}/exam`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>
                {progress?.examResult ? 'View or retake final exam' : 'Start final exam'}
              </span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
