import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Unlock,
  XCircle,
} from 'lucide-react';
import {
  getCourseMeta,
  loadCourseLessons,
  loadCourseQuizzes,
} from '../content/loader';
import type { CourseLessonsFile, SectionQuiz } from '../types/course';
import { useApp } from '../context/AppContext';
import { CodeBlock } from '../components/CodeBlock';
import { ProgressBar } from '../components/ProgressRing';
import { PageLoadingSkeleton } from '../components/ErrorBoundary';
import { isSectionUnlocked, PASS_MARK_PERCENT } from '../utils/progress';

export const QuizPage: React.FC = () => {
  const { slug = '', sectionId = '' } = useParams<{
    slug: string;
    sectionId: string;
  }>();
  const meta = getCourseMeta(slug);
  const { state, recordSectionQuizResult, notify } = useApp();

  const [quiz, setQuiz] = useState<SectionQuiz | null>(null);
  const [lessonsData, setLessonsData] = useState<CourseLessonsFile | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setCurrentIdx(0);
    setAnswers({});
    setFinished(false);
    Promise.all([loadCourseQuizzes(slug), loadCourseLessons(slug)]).then(
      ([quizzesFile, lessons]) => {
        if (!mounted) return;
        const found =
          quizzesFile?.quizzes.find((q) => q.sectionId === sectionId) ?? null;
        setQuiz(found);
        setLessonsData(lessons);
        setLoading(false);
      }
    );
    return () => {
      mounted = false;
    };
  }, [slug, sectionId]);

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

  if (loading) {
    return <PageLoadingSkeleton label={`Loading ${meta.title} section quiz`} />;
  }

  if (!quiz || !lessonsData) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Quiz not found
        </h1>
        <Link
          to={`/courses/${meta.slug}`}
          className="mt-4 inline-block text-sm font-semibold text-indigo-600"
        >
          Return to {meta.title}
        </Link>
      </div>
    );
  }

  const section = lessonsData.sections.find((s) => s.id === sectionId);
  const sectionIdx = section?.index ?? 0;
  const unlocked = isSectionUnlocked(
    sectionIdx,
    lessonsData.sections,
    state.courses[meta.slug]
  );

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Section quiz locked
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Pass the previous section quiz first to unlock this assessment.
        </p>
        <Link
          to={`/courses/${meta.slug}`}
          className="mt-5 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Return to syllabus
        </Link>
      </div>
    );
  }

  const totalQ = quiz.questions.length;
  const question = quiz.questions[currentIdx];
  const chosen = answers[question.id];
  const hasAnswered = chosen !== undefined;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optIdx: number) => {
    if (hasAnswered) return; // Instant feedback locks the current choice until retry
    setAnswers((prev) => ({ ...prev, [question.id]: optIdx }));
  };

  const handleFinishQuiz = () => {
    const correctCount = quiz.questions.reduce(
      (sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const scorePercent = Math.round((correctCount / totalQ) * 100);
    const passed = scorePercent >= (quiz.passMark || PASS_MARK_PERCENT);

    recordSectionQuizResult(meta.slug, sectionId, {
      scorePercent,
      correctCount,
      totalQuestions: totalQ,
      passed,
      completedAt: new Date().toISOString(),
    });
    setFinished(true);
    notify(
      passed
        ? `Section quiz passed with ${scorePercent}%!`
        : `Scored ${scorePercent}%. You need 70% to unlock the next section.`,
      passed ? 'success' : 'info'
    );
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIdx(0);
    setFinished(false);
  };

  const nextSection = lessonsData.sections[sectionIdx + 1];

  if (finished) {
    const correctCount = quiz.questions.reduce(
      (sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const scorePercent = Math.round((correctCount / totalQ) * 100);
    const passed = scorePercent >= (quiz.passMark || PASS_MARK_PERCENT);

    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {meta.title} · Section {sectionIdx + 1} Quiz Result
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {passed ? 'Section Passed' : 'Pass Mark Not Reached (70% Required)'}
              </h1>
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
                {correctCount} of {totalQ} correct
              </p>
            </div>
          </div>

          {passed && nextSection && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Unlock className="h-4 w-4 shrink-0" />
              <span>
                Section {nextSection.index + 1} ({nextSection.title}) is now unlocked.
              </span>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {passed && nextSection ? (
              <Link
                to={`/courses/${meta.slug}/lesson/${nextSection.lessons[0].id}`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <span>Start Section {nextSection.index + 1}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : passed ? (
              <Link
                to={`/courses/${meta.slug}/exam`}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <span>Proceed to Final Exam</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake quiz</span>
            </button>

            <Link
              to={`/courses/${meta.slug}`}
              className="inline-flex h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300"
            >
              Back to syllabus
            </Link>
          </div>
        </div>

        {/* Review all answers */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Question Review
          </h2>
          {quiz.questions.map((q, idx) => {
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
                      Incorrect
                    </span>
                  )}
                </div>
                {!isCorrect && picked !== undefined && (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                    Your answer: {q.options[picked]}
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/courses/${meta.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{meta.title} Syllabus</span>
        </Link>
        <span className="font-mono text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
          Question {currentIdx + 1} / {totalQ} · Pass mark: 70%
        </span>
      </div>

      <div className="mt-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Section {sectionIdx + 1} Quiz: {quiz.sectionTitle}
        </h1>
        <ProgressBar
          percent={(answeredCount / totalQ) * 100}
          className="mt-4"
          label={`Quiz progress: ${answeredCount} of ${totalQ} answered`}
        />
      </div>

      {/* Question Card */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {question.type === 'output' ? 'Output Prediction' : 'Conceptual Check'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{quiz.level}</span>
        </div>

        <h2 className="text-lg font-semibold leading-snug text-slate-900 dark:text-white">
          {question.prompt}
        </h2>

        {question.codeSnippet && (
          <div className="mt-4">
            <CodeBlock
              language={question.codeSnippet.language}
              code={question.codeSnippet.code}
              title="Trace this code"
            />
          </div>
        )}

        <div className="mt-6 space-y-3" role="radiogroup" aria-label="Answer choices">
          {question.options.map((opt, idx) => {
            const isSelected = chosen === idx;
            const isCorrect = idx === question.correctIndex;

            let styleClass =
              'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-indigo-700';

            if (hasAnswered) {
              if (isCorrect) {
                styleClass =
                  'border-emerald-500 bg-emerald-50/80 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200';
              } else if (isSelected && !isCorrect) {
                styleClass =
                  'border-rose-500 bg-rose-50/80 text-rose-900 dark:border-rose-500 dark:bg-rose-950/40 dark:text-rose-200';
              } else {
                styleClass =
                  'border-slate-200 bg-slate-50/50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors ${styleClass} ${
                  hasAnswered ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-current/25 font-mono text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </div>
                {hasAnswered && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback & Explanation */}
        {hasAnswered && (
          <div
            role="status"
            className={`mt-6 rounded-xl border p-4 text-sm ${
              chosen === question.correctIndex
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                : 'border-rose-200 bg-rose-50/70 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200'
            }`}
          >
            <p className="font-semibold">
              {chosen === question.correctIndex
                ? 'Correct!'
                : `Not quite — Option ${String.fromCharCode(65 + question.correctIndex)} is right.`}
            </p>
            <p className="mt-1 leading-relaxed opacity-90">{question.explanation}</p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-xs font-medium text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          {currentIdx < totalQ - 1 ? (
            <button
              type="button"
              disabled={!hasAnswered}
              onClick={() => setCurrentIdx((i) => i + 1)}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next Question</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={answeredCount < totalQ}
              onClick={handleFinishQuiz}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Finish &amp; Grade Quiz</span>
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
