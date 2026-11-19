import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { COURSE_AREAS, COURSE_LEVELS, getAllCourses } from '../content/loader';
import type { CourseArea, CourseLevel } from '../types/course';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { calculateCourseCompletionPercent } from '../utils/progress';

export const CatalogPage: React.FC = () => {
  const { state } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialArea = searchParams.get('area') as CourseArea | null;

  const [query, setQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<CourseArea | 'All'>(
    initialArea && COURSE_AREAS.includes(initialArea) ? initialArea : 'All'
  );
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'All'>('All');
  const [sortBy, setSortBy] = useState<'curriculum' | 'progress' | 'hours'>('curriculum');

  const allCourses = getAllCourses();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allCourses.filter((course) => {
      if (selectedArea !== 'All' && course.area !== selectedArea) return false;
      if (selectedLevel !== 'All' && !course.levelSummaries[selectedLevel]) return false;
      if (q) {
        const haystack = [
          course.title,
          course.shortTitle,
          course.area,
          course.tagline,
          course.description,
          ...course.whatYoullLearn,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'progress') {
      return [...list].sort(
        (a, b) =>
          calculateCourseCompletionPercent(b, state.courses[b.slug]) -
          calculateCourseCompletionPercent(a, state.courses[a.slug])
      );
    }
    if (sortBy === 'hours') {
      return [...list].sort((a, b) => b.estimatedHours - a.estimatedHours);
    }
    return list;
  }, [allCourses, query, selectedArea, selectedLevel, sortBy, state.courses]);

  const handleSelectArea = (area: CourseArea | 'All') => {
    setSelectedArea(area);
    if (area === 'All') {
      searchParams.delete('area');
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ area }, { replace: true });
    }
  };

  const resetFilters = () => {
    setQuery('');
    handleSelectArea('All');
    setSelectedLevel('All');
    setSortBy('curriculum');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Course Catalog
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
          All {allCourses.length} production courses with Beginner, Intermediate, and
          Advanced curricula, section quizzes, timed exams, and hands-on mini projects.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="catalog-search" className="sr-only">
              Search courses
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by language, framework, or topic…"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
              {(['All', ...COURSE_LEVELS] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {lvl === 'All' ? 'All Levels' : lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal
                className="h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <label htmlFor="catalog-sort" className="sr-only">
                Sort courses
              </label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'curriculum' | 'progress' | 'hours')
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="curriculum">Sort: Recommended order</option>
                <option value="progress">Sort: My progress</option>
                <option value="hours">Sort: Longest depth</option>
              </select>
            </div>
          </div>
        </div>

        {/* Area segmented controls */}
        <div
          className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800"
          role="group"
          aria-label="Filter by course area"
        >
          {(['All', ...COURSE_AREAS] as const).map((area) => {
            const count =
              area === 'All'
                ? allCourses.length
                : allCourses.filter((c) => c.area === area).length;
            const active = selectedArea === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => handleSelectArea(area)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span>{area === 'All' ? 'All Areas' : area}</span>
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    active ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      <div className="mt-6 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
        <p className="tabular-nums">
          Showing <strong className="font-semibold text-slate-900 dark:text-white">{filtered.length}</strong>{' '}
          of {allCourses.length} courses
          {selectedLevel !== 'All' && (
            <span> · Highlighting {selectedLevel} syllabus focus</span>
          )}
        </p>
        {(query || selectedArea !== 'All' || selectedLevel !== 'All') && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Course Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            No matching courses found
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Try clearing your search term or selecting a different engineering area.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
          >
            Show all 23 courses
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
              progress={state.courses[course.slug]}
              hasCertificate={Boolean(state.certificates[course.slug])}
            />
          ))}
        </div>
      )}
    </div>
  );
};
