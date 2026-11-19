import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  Flame,
  LogOut,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { getAllCourses, getCourseMetaMap } from '../content/loader';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import {
  calculateAverageQuizScore,
  calculateLearningStreak,
  computeEarnedBadges,
  getWeakTopics,
} from '../utils/progress';

export const DashboardPage: React.FC = () => {
  const { state, signOut, loadSampleProgress, resetAllProgress } = useApp();
  const allCourses = getAllCourses();
  const metaMap = getCourseMetaMap();

  const startedSlugs = Object.keys(state.courses);
  const startedCourses = startedSlugs
    .map((slug) => metaMap[slug])
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const completedCoursesCount = Object.keys(state.certificates).length;
  const avgQuizScore = calculateAverageQuizScore(state);
  const streakDays = calculateLearningStreak(state.activityDates);
  const weakTopics = getWeakTopics(state, metaMap);
  const badges = computeEarnedBadges(state);
  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  const hoursSpent = Math.floor(state.studyMinutes / 60);
  const minsRemainder = state.studyMinutes % 60;
  const formattedTime =
    hoursSpent > 0 ? `${hoursSpent}h ${minsRemainder}m` : `${minsRemainder}m`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {state.profile
              ? `Welcome back, ${state.profile.name}`
              : 'Learner Dashboard'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Track your progress across all 23 courses, quiz scores, weak topics, badges,
            and verified certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {state.profile ? (
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="inline-flex h-10 items-center rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Sign in to set certificate name
            </Link>
          )}
          {startedCourses.length > 0 && (
            <button
              type="button"
              onClick={resetAllProgress}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-600 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset local data</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Courses Started / Certified</span>
            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {startedCourses.length}{' '}
            <span className="text-base font-medium text-slate-400">
              / {completedCoursesCount} certified
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Average Quiz Score</span>
            <Trophy className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {avgQuizScore > 0 ? `${avgQuizScore}%` : '—'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Learning Streak</span>
            <Flame className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {streakDays}{' '}
            <span className="text-base font-medium text-slate-400">
              {streakDays === 1 ? 'day' : 'days'}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Study Time Tracked</span>
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
            {formattedTime}
          </p>
        </div>
      </div>

      {/* Empty state if no courses started yet */}
      {startedCourses.length === 0 ? (
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Start your first engineering track
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">
            Your active courses, quiz scores, weak topics, and earned PDF certificates
            will appear here automatically as you study.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/courses"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <span>Browse 23 courses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={loadSampleProgress}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Load sample progress &amp; certificate</span>
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Active Courses */}
          <section className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Your Courses ({startedCourses.length} of {allCourses.length})
              </h2>
              <Link
                to="/courses"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Explore more courses
              </Link>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {startedCourses.map((course) => (
                <CourseCard
                  key={course.slug}
                  course={course}
                  progress={state.courses[course.slug]}
                  hasCertificate={Boolean(state.certificates[course.slug])}
                />
              ))}
            </div>
          </section>

          {/* Weak Topics Review */}
          <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Weak Topics &amp; Suggested Review
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Sections where your quiz score is below 80% are flagged here for targeted
              reinforcement.
            </p>

            {weakTopics.length === 0 ? (
              <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-400">
                No weak sections detected right now — every attempted section is at 80%
                or above.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
                {weakTopics.map((item) => (
                  <li
                    key={`${item.courseSlug}-${item.sectionId}`}
                    className="flex flex-col justify-between gap-3 py-3.5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.courseTitle} — {item.sectionTitle}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        Last score: {item.scorePercent}% (Recommended target: 80%+)
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        to={`/courses/${item.courseSlug}`}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300"
                      >
                        Review lessons
                      </Link>
                      <Link
                        to={`/courses/${item.courseSlug}/quiz/${item.sectionId}`}
                        className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Retake quiz
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {/* Badges & Certificates Gallery */}
      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Achievement Badges
            </h2>
            <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
              {earnedBadgesCount} / {badges.length} earned
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 ${
                  badge.earned
                    ? 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/70 dark:bg-indigo-950/30'
                    : 'border-slate-200/70 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-950/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {badge.title}
                  </span>
                  <span
                    className={
                      badge.earned
                        ? 'font-semibold text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400'
                    }
                  >
                    {badge.earned ? 'Earned' : 'Locked'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Certificates Gallery
            </h2>
            <Link
              to="/certificates"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Manage all
            </Link>
          </div>

          {Object.values(state.certificates).length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
              <Award className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                No certificates earned yet
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Complete all 12 section quizzes, the final exam, and mini project for any
                course to unlock its PDF certificate.
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {Object.values(state.certificates).map((cert) => (
                <li
                  key={cert.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {cert.courseTitle}
                    </p>
                    <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {cert.id} · Score {cert.finalScore}%
                    </p>
                  </div>
                  <Link
                    to="/certificates"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    PDF
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
