import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected rendering error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-20 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {this.state.message}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reload page</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const PageLoadingSkeleton: React.FC<{ label?: string }> = ({
  label = 'Loading curriculum content…',
}) => (
  <div
    className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    role="status"
    aria-label={label}
  >
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-96 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-6 pt-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="mt-4 h-5 w-40 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
