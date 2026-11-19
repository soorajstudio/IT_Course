import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Eye,
  EyeOff,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  Search,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { DSA_PROBLEMS, DSA_TOPICS } from '../data/dsaProblems';
import {
  COURSE_LEVELS,
  getAllCourses,
  loadAllInterviewQuestions,
  loadCourseExam,
  type GlobalInterviewItem,
} from '../content/loader';
import type { CourseLevel, QuizQuestion } from '../types/course';
import { useApp } from '../context/AppContext';
import { CodeEditor } from '../components/CodeEditor';
import { CodeBlock } from '../components/CodeBlock';

type PracticeTab = 'dsa' | 'bank' | 'mock';
type EditorLang = 'javascript' | 'python' | 'java' | 'cpp';

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PracticePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as PracticeTab) || 'dsa';
  const [activeTab, setActiveTab] = useState<PracticeTab>(
    ['dsa', 'bank', 'mock'].includes(initialTab) ? initialTab : 'dsa'
  );

  const switchTab = (tab: PracticeTab) => {
    setActiveTab(tab);
    setSearchParams({ tab }, { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Technical Interview Practice
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Train algorithms in a live code editor, drill interview flashcards across all
            23 courses, and run timed mock interviews tailored to your target stack.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Practice modes"
          className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1 self-start dark:bg-slate-800"
        >
          {[
            { id: 'dsa' as const, label: 'DSA Problems' },
            { id: 'bank' as const, label: 'Interview Q&A' },
            { id: 'mock' as const, label: 'Mock Interview' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => switchTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'dsa' && <DsaWorkspace />}
        {activeTab === 'bank' && <InterviewBankWorkspace />}
        {activeTab === 'mock' && <MockInterviewWorkspace />}
      </div>
    </div>
  );
};

/* ---------------- 1. DSA Practice Workspace ---------------- */
const DsaWorkspace: React.FC = () => {
  const { state, toggleDsaSolved, saveDsaDraft, notify } = useApp();
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<
    'All' | 'Easy' | 'Medium' | 'Hard'
  >('All');
  const [selectedId, setSelectedId] = useState<string>(DSA_PROBLEMS[0].id);
  const [lang, setLang] = useState<EditorLang>('javascript');
  const [hintsShown, setHintsShown] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS.filter((p) => {
      if (topicFilter !== 'All' && p.topic !== topicFilter) return false;
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [topicFilter, difficultyFilter]);

  const problem =
    DSA_PROBLEMS.find((p) => p.id === selectedId) ?? DSA_PROBLEMS[0];

  useEffect(() => {
    setHintsShown(0);
    setShowSolution(false);
  }, [problem.id]);

  const codeValue =
    state.dsaDrafts[problem.id]?.[lang] ?? problem.starterCode[lang];
  const isSolved = state.solvedDsaIds.includes(problem.id);

  const handleResetCode = () => {
    saveDsaDraft(problem.id, lang, problem.starterCode[lang]);
    notify('Starter code restored.', 'info');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Problem list sidebar */}
      <aside className="space-y-4 lg:col-span-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              Problems ({filteredProblems.length})
            </span>
            <span className="font-mono tabular-nums">
              Solved: {state.solvedDsaIds.length}/{DSA_PROBLEMS.length}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="dsa-topic" className="sr-only">
                Filter by topic
              </label>
              <select
                id="dsa-topic"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="All">All Topics</option>
                {DSA_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dsa-diff" className="sr-only">
                Filter by difficulty
              </label>
              <select
                id="dsa-diff"
                value={difficultyFilter}
                onChange={(e) =>
                  setDifficultyFilter(
                    e.target.value as 'All' | 'Easy' | 'Medium' | 'Hard'
                  )
                }
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <ul className="mt-4 max-h-[560px] space-y-1.5 overflow-y-auto pr-1">
            {filteredProblems.map((p) => {
              const solved = state.solvedDsaIds.includes(p.id);
              const active = p.id === problem.id;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(p.id)}
                    className={`w-full rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-indigo-500 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/50'
                        : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {p.title}
                      </span>
                      {solved && (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-label="Solved"
                        />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{p.topic}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          p.difficulty === 'Easy'
                            ? 'font-medium text-emerald-700 dark:text-emerald-400'
                            : p.difficulty === 'Medium'
                              ? 'font-medium text-amber-700 dark:text-amber-400'
                              : 'font-medium text-rose-700 dark:text-rose-400'
                        }
                      >
                        {p.difficulty}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* Active DSA Problem + CodeMirror Editor */}
      <div className="space-y-6 lg:col-span-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {problem.topic}
                </span>
                <span aria-hidden="true">·</span>
                <span>{problem.difficulty}</span>
              </div>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {problem.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => toggleDsaSolved(problem.id)}
              className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isSolved
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSolved ? 'Marked Solved' : 'Mark as Solved'}</span>
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {problem.statement}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 font-mono text-xs dark:border-slate-800 dark:bg-slate-950/70"
              >
                <p className="text-slate-500 dark:text-slate-400">Example {i + 1}</p>
                <p className="mt-1 text-slate-800 dark:text-slate-200">
                  Input: {ex.input}
                </p>
                <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                  Output: {ex.output}
                </p>
                {ex.explanation && (
                  <p className="mt-1 font-sans text-slate-600 dark:text-slate-400">
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Constraints:
            </span>
            {problem.constraints.map((c) => (
              <span key={c} className="font-mono">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* CodeMirror Editor Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Solution Scratchpad
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="dsa-editor-lang" className="sr-only">
                Editor language
              </label>
              <select
                id="dsa-editor-lang"
                value={lang}
                onChange={(e) => setLang(e.target.value as EditorLang)}
                className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>

              <button
                type="button"
                onClick={handleResetCode}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <CodeEditor
            value={codeValue}
            onChange={(val) => saveDsaDraft(problem.id, lang, val)}
            language={lang}
            minHeight="280px"
          />

          {/* Hints + Solution controls */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={hintsShown >= problem.hints.length}
              onClick={() => setHintsShown((h) => Math.min(problem.hints.length, h + 1))}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-45 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer disabled:cursor-not-allowed"
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>
                {hintsShown === 0
                  ? 'Reveal Hint 1'
                  : hintsShown < problem.hints.length
                    ? `Reveal Hint ${hintsShown + 1}`
                    : 'All Hints Shown'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowSolution((s) => !s)}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 cursor-pointer"
            >
              {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showSolution ? 'Hide Solution & Complexity' : 'Show Solution & Complexity'}</span>
            </button>
          </div>

          {hintsShown > 0 && (
            <div className="mt-4 space-y-2 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
              {problem.hints.slice(0, hintsShown).map((hint, idx) => (
                <p
                  key={idx}
                  className="text-xs leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    Hint {idx + 1}:
                  </strong>{' '}
                  {hint}
                </p>
              ))}
            </div>
          )}

          {showSolution && (
            <div className="mt-5 space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Time Complexity
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-900 dark:text-slate-100">
                    {problem.timeComplexity}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Space Complexity
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-900 dark:text-slate-100">
                    {problem.spaceComplexity}
                  </p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Key insight:</strong>{' '}
                {problem.approachNotes}
              </p>
              <CodeBlock
                title={`Optimal ${lang} Solution`}
                language={lang}
                code={problem.solutions[lang]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- 2. Interview Q&A Bank + Flashcard Mode ---------------- */
const InterviewBankWorkspace: React.FC = () => {
  const { state, toggleFlashcardMastered } = useApp();
  const allCourses = getAllCourses();
  const [items, setItems] = useState<GlobalInterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'All'>('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'flashcards'>('list');

  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadAllInterviewQuestions().then((all) => {
      if (!mounted) return;
      setItems(all);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (courseFilter !== 'all' && item.courseSlug !== courseFilter) return false;
      if (levelFilter !== 'All' && item.level !== levelFilter) return false;
      if (q) {
        const hay = `${item.question} ${item.answer} ${item.topic} ${item.courseTitle}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, courseFilter, levelFilter, search]);

  useEffect(() => {
    setCardIdx(0);
    setFlipped(false);
  }, [courseFilter, levelFilter, search, viewMode]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        Loading cross-course interview bank across all 23 curricula…
      </div>
    );
  }

  const activeCard = filtered[cardIdx];

  return (
    <div className="space-y-6">
      {/* Filter & View Mode Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <label htmlFor="qa-search" className="sr-only">
              Search interview questions
            </label>
            <input
              id="qa-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topic or question…"
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <select
            aria-label="Filter by course"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="all">All 23 Courses</option>
            {allCourses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by difficulty level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as CourseLevel | 'All')}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="All">All Levels</option>
            {COURSE_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 self-start dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Question List ({filtered.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('flashcards')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'flashcards'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Flashcard Mode
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            No interview questions match your current filters.
          </p>
        </div>
      ) : viewMode === 'flashcards' && activeCard ? (
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span>
              Card {cardIdx + 1} of {filtered.length}
            </span>
            <span>
              Mastered: {state.flashcardMastered.length} cards
            </span>
          </div>

          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="flex min-h-[300px] w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {activeCard.courseTitle} · {activeCard.level} · {activeCard.topic}
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {flipped ? 'Answer' : 'Question — Click to flip'}
              </span>
            </div>

            <div className="my-8">
              {flipped ? (
                <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200">
                  {activeCard.answer}
                </p>
              ) : (
                <h3 className="text-xl font-bold leading-snug text-slate-900 dark:text-white">
                  {activeCard.question}
                </h3>
              )}
            </div>

            <div className="text-xs text-slate-400 dark:text-slate-500">
              {flipped ? 'Click card to return to prompt' : 'Think through your explanation, then click to reveal'}
            </div>
          </button>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={cardIdx === 0}
                onClick={() => {
                  setCardIdx((i) => Math.max(0, i - 1));
                  setFlipped(false);
                }}
                className="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                disabled={cardIdx >= filtered.length - 1}
                onClick={() => {
                  setCardIdx((i) => Math.min(filtered.length - 1, i + 1));
                  setFlipped(false);
                }}
                className="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCardIdx(Math.floor(Math.random() * filtered.length));
                  setFlipped(false);
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Random</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleFlashcardMastered(activeCard.id)}
              className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-semibold cursor-pointer ${
                state.flashcardMastered.includes(activeCard.id)
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {state.flashcardMastered.includes(activeCard.id)
                  ? 'Mastered'
                  : 'Mark as Mastered'}
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.slice(0, 60).map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.courseTitle}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.topic}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                    {item.question}
                  </p>
                </div>
                <HelpCircle className="mt-1 h-4 w-4 shrink-0 text-slate-400 group-open:text-indigo-500" />
              </summary>
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {item.answer}
              </p>
            </details>
          ))}
          {filtered.length > 60 && (
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Showing first 60 of {filtered.length} matching questions. Narrow filters or
              switch to Flashcard Mode to drill specific topics.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------- 3. Timed Mock Interview Mode ---------------- */
interface MockQuestion extends QuizQuestion {
  courseTitle: string;
}

const MockInterviewWorkspace: React.FC = () => {
  const allCourses = getAllCourses();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    'javascript',
    'typescript',
    'react',
  ]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);

  const [phase, setPhase] = useState<'setup' | 'running' | 'done'>('setup');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);

  const toggleCourse = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  useEffect(() => {
    if (phase !== 'running') return;
    if (secondsLeft <= 0) {
      setPhase('done');
      return;
    }
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [phase, secondsLeft]);

  const startMock = async () => {
    if (selectedSlugs.length === 0) return;
    setLoading(true);
    const loaded = await Promise.all(
      selectedSlugs.map(async (slug) => {
        const exam = await loadCourseExam(slug);
        const course = allCourses.find((c) => c.slug === slug);
        if (!exam || !course) return [] as MockQuestion[];
        return exam.questions.map((q) => ({
          ...q,
          id: `${slug}:${q.id}`,
          courseTitle: course.title,
        }));
      })
    );
    const pool = loaded.flat();
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    setQuestions(pool.slice(0, Math.min(questionCount, pool.length)));
    setAnswers({});
    setCurrentIdx(0);
    setSecondsLeft(durationMinutes * 60);
    setLoading(false);
    setPhase('running');
  };

  if (phase === 'setup') {
    return (
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Configure Timed Mock Interview
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Select one or more courses to generate a randomized timed interview screening.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSlugs(['html', 'css', 'javascript', 'typescript', 'react'])}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Preset: Frontend Stack
          </button>
          <button
            type="button"
            onClick={() => setSelectedSlugs(['nodejs', 'postgresql', 'sql', 'supabase', 'mvc'])}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Preset: Backend &amp; SQL
          </button>
          <button
            type="button"
            onClick={() => setSelectedSlugs(['c', 'cpp', 'java', 'python', 'csharp'])}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Preset: Core Languages
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
          {allCourses.map((c) => {
            const active = selectedSlugs.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleCourse(c.slug)}
                aria-pressed={active}
                className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-800 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-200'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                }`}
              >
                {c.title}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 dark:border-slate-800">
          <div>
            <label
              htmlFor="mock-qcount"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Number of questions
            </label>
            <select
              id="mock-qcount"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value={10}>10 questions (Quick Screen)</option>
              <option value={15}>15 questions (Standard Round)</option>
              <option value={20}>20 questions (Deep Technical)</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="mock-duration"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Time limit
            </label>
            <select
              id="mock-duration"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={25}>25 minutes</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {selectedSlugs.length} {selectedSlugs.length === 1 ? 'course' : 'courses'}{' '}
            selected
          </p>
          <button
            type="button"
            disabled={selectedSlugs.length === 0 || loading}
            onClick={startMock}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-45 cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>{loading ? 'Preparing questions…' : 'Start Mock Interview'}</span>
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const correct = questions.reduce(
      (sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0),
      0
    );
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Mock Interview Summary
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {pct >= 75 ? 'Strong Interview Performance' : 'Keep Practicing Targeted Topics'}
              </h2>
            </div>
            <div className="text-right">
              <p className="font-mono text-4xl font-extrabold tabular-nums text-indigo-600 dark:text-indigo-400">
                {pct}%
              </p>
              <p className="text-xs text-slate-500 tabular-nums">
                {correct} / {questions.length} correct
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Configure New Mock Interview</span>
          </button>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => {
            const picked = answers[q.id];
            const right = picked === q.correctIndex;
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {q.courseTitle} · {q.level || 'Mixed'}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                      {idx + 1}. {q.prompt}
                    </p>
                  </div>
                  {right ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-600" />
                  )}
                </div>
                <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Correct: {q.options[q.correctIndex]}
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            {q.courseTitle}
          </span>
          <span className="mx-2">·</span>
          <span className="font-mono tabular-nums">
            Question {currentIdx + 1} / {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white">
            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            {formatTimer(secondsLeft)}
          </span>
          <button
            type="button"
            onClick={() => setPhase('done')}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-slate-700 cursor-pointer"
          >
            Finish Early
          </button>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-white">
        {q.prompt}
      </h3>
      {q.codeSnippet && (
        <div className="mt-4">
          <CodeBlock
            language={q.codeSnippet.language}
            code={q.codeSnippet.code}
            title="Code snippet"
          />
        </div>
      )}

      <div className="mt-5 space-y-2.5">
        {q.options.map((opt, idx) => {
          const selected = answers[q.id] === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
              className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-sm font-medium transition-colors cursor-pointer ${
                selected
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60 dark:text-slate-200'
              }`}
            >
              <span className="font-mono text-xs">{String.fromCharCode(65 + idx)}.</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 cursor-pointer"
        >
          Previous
        </button>
        {currentIdx < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
          >
            Next Question
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setPhase('done')}
            className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
          >
            Submit Mock Interview
          </button>
        )}
      </div>
    </div>
  );
};
