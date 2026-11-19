import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Code2,
  Info,
  Menu,
  Moon,
  Sun,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV_LINKS = [
  { to: '/courses', label: 'Courses' },
  { to: '/practice', label: 'Practice' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/certificates', label: 'Certificates' },
  { to: '/about', label: 'About' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, state, toasts, dismissToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isLessonWorkspace = /^\/courses\/[^/]+\/lesson\//.test(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-[#0B1120] dark:text-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      {/* Strict 3-zone Top Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md dark:border-slate-800/90 dark:bg-[#0B1120]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand wordmark */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Code2 className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <span>IT Courses</span>
          </Link>

          {/* Zone 2: 5 clean single-line navigation links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Theme toggle + Account action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {state.profile ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-indigo-600"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white uppercase">
                  {state.profile.name.charAt(0)}
                </span>
                <span className="max-w-[120px] truncate">{state.profile.name}</span>
              </Link>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 whitespace-nowrap shrink-0"
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation"
            className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex flex-col space-y-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to={state.profile ? '/dashboard' : '/auth'}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white"
              >
                {state.profile ? `Account: ${state.profile.name}` : 'Sign in / Sign up'}
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {!isLessonWorkspace && (
        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-10 md:grid-cols-4">
              <div className="md:col-span-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Code2 className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span>IT Courses</span>
                </Link>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Structured programming courses, interview practice, timed assessments,
                  and verifiable certificates across 23 core software engineering
                  technologies.
                </p>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Platform
                </h2>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <Link to="/courses" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Course Catalog (23)
                    </Link>
                  </li>
                  <li>
                    <Link to="/practice" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      DSA &amp; Interview Practice
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Progress Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/certificates" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Certificates
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Resources
                </h2>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      About IT Courses
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Learner Account
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses?area=Web" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Web Development Track
                    </Link>
                  </li>
                  <li>
                    <Link to="/courses?area=Databases" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                      Database Engineering Track
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center dark:border-slate-800 dark:text-slate-400">
              <p>© {new Date().getFullYear()} IT Courses. Built for real software engineers.</p>
              <p>Progress stored locally · Ready for Supabase sync</p>
            </div>
          </div>
        </footer>
      )}

      {/* Accessible toast notification region */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {toast.tone === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : toast.tone === 'error' ? (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            ) : (
              <Info className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
            )}
            <span>{toast.text}</span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
