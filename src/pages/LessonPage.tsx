import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  HelpCircle,
  List,
  Lock,
  X,
} from 'lucide-react';
import { COURSE_LEVELS, getCourseMeta, loadCourseLessons } from '../content/loader';
import type { CourseLessonsFile, Lesson } from '../types/course';
import { useApp } from '../context/AppContext';
import { CodeBlock } from '../components/CodeBlock';
import { ProgressBar } from '../components/ProgressRing';
import { PageLoadingSkeleton } from '../components/ErrorBoundary';
import {
  calculateCourseCompletionPercent,
  isSectionUnlocked,
} from '../utils/progress';

export const LessonPage: React.FC = () => {
  const { slug = '', lessonId = '' } = useParams<{
    slug: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const meta = getCourseMeta(slug);
  const { state, markLessonComplete, recordLessonVisit, notify } = useApp();

  const [lessonsData, setLessonsData] = useState<CourseLessonsFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [revealedQA, setRevealedQA] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadCourseLessons(slug).then((data) => {
      if (!mounted) return;
      setLessonsData(data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const flatLessons = useMemo(() => {
    if (!lessonsData) return [] as { lesson: Lesson; sectionIndex: number; sectionTitle: string }[];
    return lessonsData.sections.flatMap((sec) =>
      sec.lessons.map((lesson) => ({
        lesson,
        sectionIndex: sec.index,
        sectionTitle: sec.title,
      }))
    );
  }, [lessonsData]);

  const currentIdx = flatLessons.findIndex((item) => item.lesson.id === lessonId);
  const currentEntry = currentIdx >= 0 ? flatLessons[currentIdx] : flatLessons[0];
  const currentLesson = currentEntry?.lesson;

  const progress = state.courses[slug];

  useEffect(() => {
    if (meta && currentLesson) {
      recordLessonVisit(meta.slug, currentLesson.id);
      setRevealedQA({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [meta, currentLesson, recordLessonVisit]);

  if (!meta) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Course not found
        </h1>
        <Link to="/courses" className="mt-4 inline-block text-sm font-semibold text-indigo-600">
          Return to catalog
        </Link>
      </div>
    );
  }

  if (loading || !lessonsData || !currentLesson) {
    return <PageLoadingSkeleton label={`Loading ${meta.title} lesson`} />;
  }

  const currentSection = lessonsData.sections.find(
    (s) => s.id === currentLesson.sectionId
  )!;
  const sectionUnlocked = isSectionUnlocked(
    currentSection.index,
    lessonsData.sections,
    progress
  );

  if (!sectionUnlocked) {
    const prevSection = lessonsData.sections[currentSection.index - 1];
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Section locked
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Pass the Section {currentSection.index} quiz ({prevSection?.title}) with 70% or
          higher to unlock Section {currentSection.index + 1}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {prevSection && (
            <Link
              to={`/courses/${meta.slug}/quiz/${prevSection.id}`}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Take Section {currentSection.index} Quiz
            </Link>
          )}
          <Link
            to={`/courses/${meta.slug}`}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200"
          >
            Back to syllabus
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = Boolean(progress?.completedLessons.includes(currentLesson.id));
  const completionPct = calculateCourseCompletionPercent(meta, progress);

  const prevEntry = currentIdx > 0 ? flatLessons[currentIdx - 1] : null;
  const nextEntry =
    currentIdx >= 0 && currentIdx < flatLessons.length - 1
      ? flatLessons[currentIdx + 1]
      : null;

  const isLastLessonInSection =
    currentSection.lessons[currentSection.lessons.length - 1]?.id === currentLesson.id;

  const nextSectionUnlocked = nextEntry
    ? isSectionUnlocked(nextEntry.sectionIndex, lessonsData.sections, progress)
    : false;

  const handleMarkComplete = () => {
    markLessonComplete(meta.slug, currentLesson.id);
    if (!isCompleted) {
      notify('Lesson marked complete', 'success');
    }
  };

  const handleCompleteAndContinue = () => {
    markLessonComplete(meta.slug, currentLesson.id);
    if (isLastLessonInSection) {
      navigate(`/courses/${meta.slug}/quiz/${currentSection.id}`);
    } else if (nextEntry && nextSectionUnlocked) {
      navigate(`/courses/${meta.slug}/lesson/${nextEntry.lesson.id}`);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <Link
          to={`/courses/${meta.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{meta.title} Overview</span>
        </Link>
        <div className="mt-3 flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
          <span>Course Progress</span>
          <span className="font-mono tabular-nums">{completionPct}%</span>
        </div>
        <ProgressBar percent={completionPct} className="mt-1.5" />
      </div>

      <nav
        aria-label="Course outline"
        className="flex-1 overflow-y-auto p-3 space-y-5"
      >
        {COURSE_LEVELS.map((lvl) => {
          const secs = lessonsData.sections.filter((s) => s.level === lvl);
          return (
            <div key={lvl}>
              <p className="px-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                {lvl}
              </p>
              <div className="mt-2 space-y-3">
                {secs.map((sec) => {
                  const unlocked = isSectionUnlocked(
                    sec.index,
                    lessonsData.sections,
                    progress
                  );
                  const quizPassed = Boolean(progress?.quizResults[sec.id]?.passed);
                  return (
                    <div key={sec.id}>
                      <div className="flex items-center justify-between gap-2 px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        <span className="truncate">
                          {sec.index + 1}. {sec.title}
                        </span>
                        {!unlocked && (
                          <Lock className="h-3 w-3 shrink-0 text-slate-400" />
                        )}
                      </div>
                      <ul className="mt-1 space-y-0.5">
                        {sec.lessons.map((l) => {
                          const active = l.id === currentLesson.id;
                          const done = progress?.completedLessons.includes(l.id);
                          return (
                            <li key={l.id}>
                              {unlocked ? (
                                <Link
                                  to={`/courses/${meta.slug}/lesson/${l.id}`}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                                    active
                                      ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300'
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                                  }`}
                                >
                                  <CheckCircle2
                                    className={`h-3.5 w-3.5 shrink-0 ${
                                      done
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-slate-300 dark:text-slate-700'
                                    }`}
                                  />
                                  <span className="truncate">{l.title}</span>
                                </Link>
                              ) : (
                                <span className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 dark:text-slate-600">
                                  <Lock className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{l.title}</span>
                                </span>
                              )}
                            </li>
                          );
                        })}
                        <li>
                          {unlocked ? (
                            <Link
                              to={`/courses/${meta.slug}/quiz/${sec.id}`}
                              onClick={() => setSidebarOpen(false)}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50/70 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                            >
                              <ClipboardCheck className="h-3.5 w-3.5 shrink-0" />
                              <span>
                                Section {sec.index + 1} Quiz{' '}
                                {quizPassed ? '(Passed)' : ''}
                              </span>
                            </Link>
                          ) : null}
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block dark:border-slate-800 dark:bg-slate-950">
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{sidebarContent}</div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/50"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex w-80 max-w-[85vw] flex-col bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Course Outline
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close outline"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </aside>
        </div>
      )}

      {/* Main Lesson Reading Pane */}
      <article className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 lg:py-12">
          {/* Mobile outline trigger + breadcrumb */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {currentLesson.level}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Section {currentSection.index + 1}: {currentSection.title}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{currentLesson.durationMin} min read</span>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <List className="h-4 w-4" />
              <span>Outline</span>
            </button>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {currentLesson.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {currentLesson.summary}
          </p>

          {/* Explanation prose */}
          <div className="mt-8 space-y-4 text-[15.5px] leading-7 text-slate-700 dark:text-slate-300">
            {currentLesson.explanation.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Syntax-highlighted Code Example */}
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-white">
              Code Example
            </h2>
            <CodeBlock
              title={currentLesson.codeExample.title}
              language={currentLesson.codeExample.language}
              code={currentLesson.codeExample.code}
              output={currentLesson.codeExample.output}
            />
          </section>

          {/* Key Points */}
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Key Points to Remember
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {currentLesson.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Common Mistakes */}
          <section className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <AlertTriangle
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
                aria-hidden="true"
              />
              <h2>Common Mistakes &amp; Fixes</h2>
            </div>
            <div className="mt-4 space-y-4">
              {currentLesson.commonMistakes.map((item, i) => (
                <div
                  key={i}
                  className="border-t border-amber-200/60 pt-3 first:border-0 first:pt-0 dark:border-amber-900/40"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Pitfall: {item.mistake}
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    Fix: {item.fix}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Interview Q&A */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <HelpCircle
                className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                aria-hidden="true"
              />
              <h2>Interview Q&amp;A for This Topic</h2>
            </div>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {currentLesson.interviewQA.map((qa, idx) => {
                const open = revealedQA[idx] ?? true;
                return (
                  <div key={idx} className="py-3.5 first:pt-1 last:pb-0">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedQA((prev) => ({ ...prev, [idx]: !open }))
                      }
                      aria-expanded={open}
                      className="flex w-full items-start justify-between gap-4 text-left text-sm font-semibold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400 cursor-pointer"
                    >
                      <span>{qa.question}</span>
                      <ChevronDown
                        className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                          open ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {open && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {qa.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lesson Action Bar */}
          <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
            <div className="flex items-center gap-3">
              {prevEntry && (
                <Link
                  to={`/courses/${meta.slug}/lesson/${prevEntry.lesson.id}`}
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Previous</span>
                </Link>
              )}
              <button
                type="button"
                onClick={handleMarkComplete}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isCompleted
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300'
                    : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>{isCompleted ? 'Completed' : 'Mark complete'}</span>
              </button>
            </div>

            {isLastLessonInSection ? (
              <button
                type="button"
                onClick={handleCompleteAndContinue}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                <span>Take Section {currentSection.index + 1} Quiz</span>
              </button>
            ) : nextEntry ? (
              <button
                type="button"
                onClick={handleCompleteAndContinue}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Complete &amp; Next Lesson</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
};
