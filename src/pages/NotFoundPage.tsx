import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="mx-auto max-w-xl px-4 py-24 text-center">
    <p className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">404</p>
    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
      Page not found
    </h1>
    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
      The route you requested does not exist on IT Courses.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back to Home</span>
    </Link>
  </div>
);
