import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Award, CheckCircle2, Loader2, SearchX } from 'lucide-react';
import type { CertificateRecord } from '../types/course';
import { fetchCertificateById, storageAdapter } from '../services/storage';

export const VerifyCertificatePage: React.FC = () => {
  const { certId = '' } = useParams<{ certId: string }>();
  const [cert, setCert] = useState<CertificateRecord | null>(() =>
    storageAdapter.findCertificateById(certId)
  );
  const [loading, setLoading] = useState<boolean>(!cert && Boolean(certId));

  useEffect(() => {
    let active = true;
    if (!cert && certId) {
      setLoading(true);
      fetchCertificateById(certId)
        .then((record) => {
          if (active) {
            setCert(record);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, [certId, cert]);

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Verifying credential {certId} with registry...
        </p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <SearchX className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Certificate record not found
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          No certificate matching ID{' '}
          <span className="font-mono font-semibold">{certId}</span> was found in the
          registry.
        </p>
        <Link
          to="/certificates"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          View my certificates
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="rounded-2xl border border-emerald-200 bg-white p-8 dark:border-emerald-900/60 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <span className="text-sm font-semibold">Verified IT Courses Credential</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
          {cert.courseTitle} Engineering Track
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {cert.levelLabel} · Domain: {cert.courseArea}
        </p>

        <dl className="mt-6 grid gap-4 border-y border-slate-100 py-6 sm:grid-cols-2 dark:border-slate-800">
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Recipient</dt>
            <dd className="mt-1 text-base font-bold text-slate-900 dark:text-white">
              {cert.learnerName}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Certificate ID</dt>
            <dd className="mt-1 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {cert.id}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Final Score</dt>
            <dd className="mt-1 font-mono text-base font-bold tabular-nums text-slate-900 dark:text-white">
              {cert.finalScore}%
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500 dark:text-slate-400">Issued Date</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {new Date(cert.issuedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            All section quizzes, timed exam &amp; capstone project verified
          </span>
          <Link
            to="/certificates"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Back to Certificates
          </Link>
        </div>
      </div>
    </div>
  );
};
