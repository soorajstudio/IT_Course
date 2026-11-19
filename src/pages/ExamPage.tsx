import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Flag,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { COURSE_LEVELS, getCourseMeta, loadCourseExam } from '../content/loader';
import type { CourseExamFile, CourseLevel } from '../types/course';
import { useApp } from '../context/AppContext';
import { CodeBlock } from '../components/CodeBlock';
import { PageLoadingSkeleton } from '../components/ErrorBoundary';

function formatClock(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const ExamPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const meta = getCourseMeta(slug);
  const { state, recordExamResult, notify } = useApp();

  const [exam, setExam] = useState<CourseExamFile | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<'intro' | 'active' | 'report'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadCourseExam(slug).then((data) => {
      if (!mounted) return;
      setExam(data);
      if (data) setSecondsLeft(data.durationMinutes * 60);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const submitExam = useCallback(() => {
    if (!exam || !meta) return;
    const total = exam.questions.length;
    let correctCount = 0;
    const levelBreakdown: Record<CourseLevel, { correct: number; total: number }> = {
      Beginner: { correct: 0, total: 0 },
      Intermediate: { correct: 0, total: 0 },
      Advanced: { correct: 0, total: 0 },
    };

    for (const q of exam.questions) {
      const lvl: CourseLevel = q.level ?? 'Intermediate';
      levelBreakdown[lvl].total += 1;
      if (answers[q.id] === q.correctIndex) {
        correctCount += 1;
        levelBreakdown[lvl].correct += 1;
      }
    }

    const scorePercent = Math.round((correctCount / total) * 100);
    const passed = scorePercent >= exam.passMark;
    const elapsed = exam.durationMinutes * 60 - secondsLeft;
    setTimeSpent(elapsed);

    recordExamResult(meta.slug, {
      scorePercent,
      correctCount,
      totalQuestions: total,
      passed,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: elapsed,
      levelBreakdown,
    });

    setPhase('report');
    notify(
      passed
        ? `Final exam passed with ${scorePercent}%!`
        : `Final exam scored ${scorePercent}%. 70% required to pass.`,
      passed ? 'success' : 'info'
    );
  }, [exam, meta, answers, secondsLeft, recordExamResult, notify]);

  // Countdown timer when active
  useEffect(() => {
    if (phase !== 'active') return;
    if (secondsLeft <= 0) {
      submitExam();
      return;
    }
    const id = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, secondsLeft, submitExam]);

  if (!meta) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Course not found
        </h1>
        <Link to="/courses" className="mt-4 inline-block text-sm font-semibold text-indigo-600">
          Back to catalog
        </Link>
      </div>
    );
  }

  if (loading || !exam) {
    return <PageLoadingSkeleton label={`Loading ${meta.title} final exam`} />;
  }

  const startExam = () => {
    setAnswers({});
    setFlagged({});
    setCurrentIdx(0);
    setSecondsLeft(exam.durationMinutes * 60);
    setPhase('active');
  };

  const previousResult = state.courses[meta.slug]?.examResult;

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to={`/courses/${meta.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {meta.title}</span>
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Timed Final Examination
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {exam.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            This timed assessment evaluates conceptual understanding, edge cases, and
            code-reading proficiency across Beginner, Intermediate, and Advanced modules
            of {meta.title}.
          </p>

          <div className="mt-6 grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-3 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Questions</p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {exam.questions.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Time Limit</p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {exam.durationMinutes} min
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pass Mark</p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-slate-900 dark:text-white">
                {exam.passMark}%
              </p>
            </div>
          </div>

          {previousResult && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/60">
              <p className="font-semibold text-slate-900 dark:text-white">
                Best recorded attempt:{' '}
                <span className="font-mono tabular-nums">
                  {previousResult.scorePercent}% ({previousResult.correctCount}/
                  {previousResult.totalQuestions})
                </span>{' '}
                — {previousResult.passed ? 'Passed' : 'Not passed'}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startExam}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 cursor-pointer"
            >
              <Play className="h-4 w-4" />
              <span>{previousResult ? 'Retake Timed Exam' : 'Start Timed Exam'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'report') {
    const total = exam.questions.length;
    const correctCount = exam.questions.reduce(
      (sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const scorePercent = Math.round((correctCount / total) * 100);
    const passed = scorePercent >= exam.passMark;

    const breakdown: Record<CourseLevel, { correct: number; total: number }> = {
      Beginner: { correct: 0, total: 0 },
      Intermediate: { correct: 0, total: 0 },
      Advanced: { correct: 0, total: 0 },
    };
    for (const q of exam.questions) {
      const lvl = q.level ?? 'Intermediate';
      breakdown[lvl].total += 1;
      if (answers[q.id] === q.correctIndex) breakdown[lvl].correct += 1;
    }

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {meta.title} Final Exam Score Report
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {passed ? 'Examination Passed' : 'Pass Threshold Not Met'}
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Time elapsed: {formatClock(timeSpent)} · Required: {exam.passMark}%
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-mono text-4xl font-extrabold tabular-nums ${
                  passed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {scorePercent}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {correctCount} / {total} correct
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-3 dark:border-slate-800">
            {COURSE_LEVELS.map((lvl) => {
              const b = breakdown[lvl];
              const pct = b.total > 0 ? Math.round((b.correct / b.total) * 100) : 0;
              return (
                <div key={lvl}>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lvl} Tier
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                    {pct}% ({b.correct}/{b.total})
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {state.certificates[meta.slug] && (
              <Link
                to="/certificates"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Award className="h-4 w-4" />
                <span>Download Certificate</span>
              </Link>
            )}
            <button
              type="button"
              onClick={startExam}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake exam</span>
            </button>
            <Link
              to={`/courses/${meta.slug}`}
              className="inline-flex h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Return to {meta.title}
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Detailed Answer Breakdown
          </h2>
          {exam.questions.map((q, idx) => {
            const picked = answers[q.id];
            const isCorrect = picked === q.correctIndex;
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {idx + 1}. {q.prompt}
                  </p>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                      Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 shrink-0">
                      <XCircle className="h-4 w-4" />
                      {picked === undefined ? 'Unanswered' : 'Incorrect'}
                    </span>
                  )}
                </div>
                {!isCorrect && picked !== undefined && (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                    Your choice: {q.options[picked]}
                  </p>
                )}
                <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Correct answer: {q.options[q.correctIndex]}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active timed exam view
  const question = exam.questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const lowTime = secondsLeft < 300;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top sticky exam bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white">
            {exam.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Answered {answeredCount} of {exam.questions.length}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-sm font-bold tabular-nums ${
              lowTime
                ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                : 'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
            }`}
            aria-label={`Time remaining ${formatClock(secondsLeft)}`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{formatClock(secondsLeft)}</span>
          </div>

          <button
            type="button"
            onClick={submitExam}
            className="inline-flex h-10 items-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            Submit Exam
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Question Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                Question {currentIdx + 1} of {exam.questions.length}
              </span>
              <span aria-hidden="true">·</span>
              <span>{question.level || 'Mixed'}</span>
              {question.topic && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{question.topic}</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                setFlagged((prev) => ({
                  ...prev,
                  [question.id]: !prev[question.id],
                }))
              }
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                flagged[question.id]
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Flag className="h-3.5 w-3.5" />
              <span>{flagged[question.id] ? 'Flagged' : 'Flag'}</span>
            </button>
          </div>

          <h2 className="mt-4 text-lg font-semibold leading-snug text-slate-900 dark:text-white">
            {question.prompt}
          </h2>

          {question.codeSnippet && (
            <div className="mt-4">
              <CodeBlock
                language={question.codeSnippet.language}
                code={question.codeSnippet.code}
                title="Code snippet"
              />
            </div>
          )}

          <div className="mt-6 space-y-3" role="radiogroup" aria-label="Exam choices">
            {question.options.map((opt, idx) => {
              const selected = answers[question.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [question.id]: idx }))
                  }
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-100'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-600'
                  }`}
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-current/25 font-mono text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-xs font-medium text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {currentIdx < exam.questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx((i) => i + 1)}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submitExam}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-emerald-600 px-5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
              >
                <span>Submit &amp; View Score Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Grid Navigator */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Question Navigator
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Jump to any question before submitting.
          </p>

          <div className="mt-4 grid grid-cols-6 gap-2">
            {exam.questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = Boolean(flagged[q.id]);

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  aria-label={`Jump to question ${idx + 1}${isAnswered ? ', answered' : ''}${isFlagged ? ', flagged' : ''}`}
                  className={`relative flex h-9 items-center justify-center rounded-lg border font-mono text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                    isCurrent
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : isFlagged
                        ? 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : isAnswered
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>Answered: {answeredCount}</span>
            <span>Remaining: {exam.questions.length - answeredCount}</span>
            <span>Flagged: {Object.values(flagged).filter(Boolean).length}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};
