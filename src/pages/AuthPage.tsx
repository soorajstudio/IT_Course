import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Database, ShieldCheck, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured, supabase } from '../services/supabaseClient';

export const AuthPage: React.FC = () => {
  const { signIn, state, notify } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState(state.profile?.name ?? '');
  const [email, setEmail] = useState(state.profile?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isConnected = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (mode === 'signup' && trimmedName.length < 2) {
      setError('Please enter your full name (at least 2 characters) for certificates.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const displayName =
      mode === 'signup'
        ? trimmedName
        : trimmedName || trimmedEmail.split('@')[0].replace(/[._-]/g, ' ');

    if (isConnected && supabase) {
      setSubmitting(true);
      try {
        if (mode === 'signup') {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: trimmedEmail,
            password,
            options: {
              data: {
                name: displayName,
              },
            },
          });
          if (signUpError) {
            setError(signUpError.message);
            setSubmitting(false);
            return;
          }

          const userId = data.user?.id || `user-${Date.now()}`;
          signIn(displayName, trimmedEmail, userId);

          if (!data.session) {
            notify(
              `Welcome, ${displayName}! Account created. (Check your email inbox if verification is enabled).`,
              'success'
            );
          } else {
            notify(`Welcome, ${displayName}! Account created and connected.`, 'success');
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });
          if (signInError) {
            setError(signInError.message);
            setSubmitting(false);
            return;
          }
          const userObj = data.user;
          const resolvedName =
            userObj?.user_metadata?.name ||
            userObj?.user_metadata?.full_name ||
            displayName;

          signIn(resolvedName, trimmedEmail, userObj?.id);
          notify(`Welcome back, ${resolvedName}!`, 'success');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setError(message);
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    } else {
      signIn(displayName, trimmedEmail);
    }

    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Code2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === 'signup' ? 'Create Learner Profile' : 'Sign In to IT Courses'}
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isConnected ? 'Connected to Supabase PostgreSQL' : 'Local Storage Mode'}
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="auth-name"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Full Name (printed on certificates)
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.dev"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="auth-password"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === 'signup' ? (
              'Create Account & Continue'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2.5 border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <p>
            {isConnected
              ? 'Connected to Supabase. Your courses, progress, and certificates sync to the cloud database across devices.'
              : 'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local to enable multi-device PostgreSQL cloud sync.'}
          </p>
        </div>
      </div>
    </div>
  );
};
