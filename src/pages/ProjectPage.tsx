import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Eye,
  EyeOff,
  FolderGit2,
} from 'lucide-react';
import { getCourseMeta, loadCourseProject } from '../content/loader';
import type { CourseProjectFile } from '../types/course';
import { useApp } from '../context/AppContext';
import { CodeBlock } from '../components/CodeBlock';
import { ProgressBar } from '../components/ProgressRing';
import { PageLoadingSkeleton } from '../components/ErrorBoundary';

export const ProjectPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const meta = getCourseMeta(slug);
  const { state, toggleProjectRequirement, markProjectDone } = useApp();

  const [project, setProject] = useState<CourseProjectFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadCourseProject(slug).then((data) => {
      if (!mounted) return;
      setProject(data);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

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

  if (loading || !project) {
    return <PageLoadingSkeleton label={`Loading ${meta.title} mini project`} />;
  }

  const progress = state.courses[meta.slug];
  const checkedIds = progress?.projectChecklist ?? [];
  const totalReqs = project.requirements.length;
  const checkedPct = totalReqs > 0 ? Math.round((checkedIds.length / totalReqs) * 100) : 0;
  const isDone = Boolean(progress?.projectDone);
  const allChecked = checkedIds.length >= totalReqs;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to={`/courses/${meta.slug}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to {meta.title}</span>
      </Link>

      {/* Brief Header */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <FolderGit2 className="h-4 w-4" aria-hidden="true" />
            <span>{meta.title} Capstone Mini Project</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              ·
            </span>
            <span className="text-slate-500 dark:text-slate-400 tabular-nums">
              Est. {project.estimatedHours}h · {project.difficulty}
            </span>
          </div>
          {isDone && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed</span>
            </span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {project.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {project.brief}
        </p>
      </div>

      {/* Requirements Checklist */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Requirements Checklist
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tick off each deliverable as you implement and test it locally.
            </p>
          </div>
          <span className="font-mono text-sm font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
            {checkedIds.length}/{totalReqs} ({checkedPct}%)
          </span>
        </div>

        <ProgressBar
          percent={checkedPct}
          className="mt-4"
          label={`Project checklist ${checkedPct}% complete`}
        />

        <ul className="mt-6 space-y-3">
          {project.requirements.map((req) => {
            const checked = checkedIds.includes(req.id);
            return (
              <li key={req.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200/80 p-3.5 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/60">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleProjectRequirement(meta.slug, req.id)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span
                    className={`text-sm leading-relaxed ${
                      checked
                        ? 'text-slate-400 line-through dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {req.text}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Step-by-Step Guide */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Step-by-Step Implementation Guide
        </h2>
        <ol className="mt-6 space-y-5">
          {project.steps.map((step) => (
            <li
              key={step.stepNumber}
              className="flex items-start gap-4 border-t border-slate-100 pt-5 first:border-0 first:pt-0 dark:border-slate-800"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                {step.stepNumber}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {step.details}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Revealable Reference Solution */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Reference Solution
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Attempt the implementation first, then reveal the reference architecture to
              compare patterns and edge-case handling.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowSolution((prev) => !prev)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 cursor-pointer whitespace-nowrap shrink-0"
          >
            {showSolution ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide Reference Solution</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Reveal Reference Solution</span>
              </>
            )}
          </button>
        </div>

        {showSolution && (
          <div className="mt-6 space-y-5">
            {project.referenceSolution.map((file) => (
              <CodeBlock
                key={file.filename}
                title={file.filename}
                language={file.language}
                code={file.code}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mark as Done CTA */}
      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isDone ? 'Project Verified as Done' : 'Ready to complete this project?'}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isDone
              ? 'This requirement is satisfied toward your official course certificate.'
              : allChecked
                ? 'All checklist items are ticked. Mark the project as done to record completion.'
                : 'Tick off the checklist requirements above (or mark done when your build passes).'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {state.certificates[meta.slug] && (
            <Link
              to="/certificates"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 whitespace-nowrap shrink-0"
            >
              <Award className="h-4 w-4" />
              <span>View Certificate</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => markProjectDone(meta.slug)}
            disabled={isDone}
            className={`inline-flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isDone
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 cursor-default'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isDone ? 'Marked as Done' : 'Mark as Done'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
