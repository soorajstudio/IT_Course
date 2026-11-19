import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  FileCheck2,
  Layers,
  Play,
  Target,
} from 'lucide-react';
import { AREA_STYLES, COURSE_AREAS, getAllCourses, getCourseMeta } from '../content/loader';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { AreaIcon } from '../components/AreaIcon';
import { calculateCourseCompletionPercent } from '../utils/progress';

const HERO_IMAGE = '/src/assets/images/hero_workspace_1795067398163.jpg';

const FAQ_ITEMS = [
  {
    q: 'Are all 23 courses completely available right now?',
    a: 'Yes. Every single course across Web, Languages, Databases, Backend & Cloud, and Mobile includes 3 full levels (Beginner, Intermediate, Advanced), 12 sections, 48 lessons, 12 section quizzes, a timed 30-question final exam, and a guided mini project.',
  },
  {
    q: 'How does section unlocking work?',
    a: 'Section 1 of every course is open immediately. Passing a section quiz with at least 70% unlocks the next section so you build durable fundamentals before tackling advanced internals.',
  },
  {
    q: 'What is required to unlock a downloadable PDF certificate?',
    a: 'You must pass all 12 section quizzes (70%+ each), pass the timed 30-question final exam (70%+), and complete the mini project checklist and mark the project as done. Once unlocked, you can download a print-ready PDF with your unique Certificate ID and verification QR code.',
  },
  {
    q: 'Where is my learning progress saved?',
    a: 'Progress, quiz results, DSA code drafts, and earned certificates are persisted automatically in your browser’s local storage using a clean storage adapter interface, ready for drop-in Supabase synchronization later.',
  },
  {
    q: 'How should I use IT Courses for technical interview preparation?',
    a: 'Every lesson includes dedicated interview Q&A, quizzes include code output-prediction questions, and the Practice hub provides a curated DSA workspace with a live CodeMirror editor, an across-all-courses Interview Q&A flashcard bank, and a timed Mock Interview simulator.',
  },
];

const FEATURED_SLUGS = ['javascript', 'typescript', 'react', 'python', 'postgresql', 'flutter'];

export const HomePage: React.FC = () => {
  const { state } = useApp();
  const allCourses = getAllCourses();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const featuredCourses = FEATURED_SLUGS.map((s) =>
    allCourses.find((c) => c.slug === s)
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  const lastCourseMeta = state.lastActiveCourseSlug
    ? getCourseMeta(state.lastActiveCourseSlug)
    : undefined;
  const lastCourseProgress = lastCourseMeta
    ? state.courses[lastCourseMeta.slug]
    : undefined;
  const lastLessonId =
    state.lastActiveLessonId || lastCourseProgress?.lastVisitedLessonId;

  const totalLessons = allCourses.reduce((sum, c) => sum + c.lessonCount, 0);
  const totalSections = allCourses.reduce((sum, c) => sum + c.sectionCount, 0);
  const totalExamQs = allCourses.reduce((sum, c) => sum + c.examQuestionCount, 0);

  return (
    <div>
      {/* Continue where you left off bar */}
      {lastCourseMeta && lastLessonId && (
        <div className="border-b border-indigo-200/70 bg-indigo-50/70 dark:border-indigo-900/50 dark:bg-indigo-950/30">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 text-sm">
              <AreaIcon area={lastCourseMeta.area} size="sm" />
              <div>
                <span className="text-slate-600 dark:text-slate-300">
                  Pick up where you left off:{' '}
                </span>
                <strong className="font-semibold text-slate-900 dark:text-white">
                  {lastCourseMeta.title}
                </strong>
                <span className="ml-2 font-mono text-xs tabular-nums text-indigo-700 dark:text-indigo-300">
                  {calculateCourseCompletionPercent(
                    lastCourseMeta,
                    lastCourseProgress
                  )}
                  % complete
                </span>
              </div>
            </div>
            <Link
              to={`/courses/${lastCourseMeta.slug}/lesson/${lastLessonId}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 whitespace-nowrap shrink-0"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Continue where you left off</span>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-[#0B1120]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-50/70 to-transparent dark:from-indigo-950/25"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-stretch gap-12 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                23 complete engineering tracks · Beginner to Advanced
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.12] dark:text-white">
                Learn programming in depth and pass technical interviews.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Structured curricula across web, systems languages, databases, backend
                architecture, and mobile. Study real code examples, pass gated quizzes,
                build capstone mini projects, and earn verifiable PDF certificates.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/courses"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 whitespace-nowrap shrink-0"
                >
                  <span>Browse all 23 courses</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/practice"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  <span>Interview &amp; DSA practice</span>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  No placeholders or locked paywalls
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Code output-prediction quizzes
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Instant PDF certificates with QR
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                {!heroImgFailed ? (
                  <img
                    src={HERO_IMAGE}
                    alt="Clean modern software developer desk with laptop showing structured code"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-8 text-center dark:from-indigo-950/50 dark:to-slate-900">
                    <Code2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      IT Courses Engineering Workspace
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full-width 4-column quantitative proof strip */}
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-200 pt-10 lg:grid-cols-4 dark:border-slate-800">
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {allCourses.length}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Full courses across 5 domains
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {totalLessons.toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Structured lessons with code &amp; Q&amp;A
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {(totalSections * 8 + totalExamQs).toLocaleString()}+
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Quiz &amp; timed exam questions
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                23
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Guided capstone mini projects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Five Curriculum Areas */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Five core software engineering areas, zero shortcuts
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Every area has a clear visual identity and a consistent three-level syllabus
            from syntax fundamentals to production architecture.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {COURSE_AREAS.map((area) => {
            const count = allCourses.filter((c) => c.area === area).length;
            const info = AREA_STYLES[area];
            return (
              <Link
                key={area}
                to={`/courses?area=${encodeURIComponent(area)}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
              >
                <AreaIcon area={area} />
                <h3 className="mt-4 text-base font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {area}
                </h3>
                <p className="mt-1 font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                  {count} {count === 1 ? 'course' : 'courses'}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {info.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="border-y border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Featured engineering tracks
              </h2>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
                Start with the highest-demand languages and tools, or explore the full
                23-course catalog.
              </p>
            </div>
            <Link
              to="/courses"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 whitespace-nowrap shrink-0"
            >
              <span>View all 23 courses</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                progress={state.courses[course.slug]}
                hasCertificate={Boolean(state.certificates[course.slug])}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            How every IT Courses track works
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Designed to replace passive video watching with active reading, code tracing,
            timed exams, and real implementation.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: '01',
              icon: BookOpen,
              title: 'Study deep lessons',
              body: 'Each of the 12 sections contains 4 focused lessons with idiomatic code examples, pitfalls, and real interview Q&A.',
            },
            {
              step: '02',
              icon: Target,
              title: 'Pass gated quizzes',
              body: 'Prove mastery with 8+ conceptual and code output-prediction questions per section. Scoring 70%+ unlocks the next section.',
            },
            {
              step: '03',
              icon: Layers,
              title: 'Build the mini project',
              body: 'Follow a realistic engineering brief and requirements checklist, then compare your work against a reference solution.',
            },
            {
              step: '04',
              icon: Award,
              title: 'Pass exam & get certified',
              body: 'Complete the timed 30-question final exam to unlock an elegant downloadable PDF certificate with a unique verification QR code.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Step {item.step}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Value Proposition Split: Interview Readiness */}
      <section className="border-y border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-7 dark:border-slate-800 dark:bg-slate-900/70">
              <Code2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                DSA Practice Workspace
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Solve interview algorithms in an interactive CodeMirror editor across
                JavaScript, Python, Java, and C++ with progressive hints and Big-O notes.
              </p>
              <Link
                to="/practice?tab=dsa"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>Open DSA problems</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-7 dark:border-slate-800 dark:bg-slate-900/70">
              <FileCheck2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                Cross-Course Interview Bank
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Filter hundreds of curated interview questions across all 23 technologies
                by course, difficulty level, and topic — with active-recall flashcards.
              </p>
              <Link
                to="/practice?tab=bank"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>Study flashcards</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-7 dark:border-slate-800 dark:bg-slate-900/70">
              <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                Timed Mock Interviews
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Combine any stack of courses (e.g. TypeScript + React + PostgreSQL) into a
                timed randomized interview simulation with an actionable weak-topic report.
              </p>
              <Link
                to="/practice?tab=mock"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                <span>Launch mock interview</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Everything you need to know about our curriculum structure, exams, and
            certificates.
          </p>
        </div>

        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-slate-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 px-8 py-14 text-center text-white sm:px-14 dark:border dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to build real engineering depth?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Pick your first language or database track, complete Section 1 in 20 minutes,
            and track every milestone from your personal dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/courses"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 whitespace-nowrap shrink-0"
            >
              <span>Start learning now</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 px-6 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <span>View dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
