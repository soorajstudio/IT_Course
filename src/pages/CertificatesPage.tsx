import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Lock,
  Sparkles,
} from 'lucide-react';
import { getAllCourses } from '../content/loader';
import { useApp } from '../context/AppContext';
import type { CertificateRecord } from '../types/course';
import {
  downloadCertificatePdf,
  generateCertificateQrDataUrl,
  getCertificateVerificationUrl,
} from '../utils/certificatePdf';
import {
  calculateCourseCompletionPercent,
  getPassedSectionCount,
} from '../utils/progress';
import { ProgressBar } from '../components/ProgressRing';

const CertificateVisualCard: React.FC<{
  cert: CertificateRecord;
  onDownload: (cert: CertificateRecord) => void;
  downloading: boolean;
}> = ({ cert, onDownload, downloading }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    generateCertificateQrDataUrl(cert.id)
      .then((url) => {
        if (active) setQrUrl(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [cert.id]);

  const formattedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCopyVerify = async () => {
    const url = getCertificateVerificationUrl(cert.id);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard restriction
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Live certificate visual preview */}
      <div className="border-b border-slate-200 bg-[#FAFBFD] p-6 sm:p-8 text-slate-900 dark:border-slate-800">
        <div className="rounded-xl border border-indigo-200/80 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Code2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">IT Courses</p>
                <p className="text-[11px] text-slate-500">
                  Verified Completion Credential
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-semibold text-indigo-700">
              {cert.id}
            </span>
          </div>

          <div className="py-6 text-center">
            <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Certificate of Achievement
            </p>
            <p className="mt-3 text-xs text-slate-500">This certifies that</p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {cert.learnerName}
            </h3>
            <p className="mt-3 text-xs text-slate-600">
              has completed all 12 section assessments, final exam, and mini project for
            </p>
            <p className="mt-1.5 text-xl font-bold text-indigo-600">
              {cert.courseTitle} Engineering Track
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {cert.levelLabel} · {cert.courseArea}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
            <div className="flex flex-wrap gap-6 text-xs">
              <div>
                <p className="text-slate-400">Final Score</p>
                <p className="font-mono font-bold tabular-nums text-slate-900">
                  {cert.finalScore}%
                </p>
              </div>
              <div>
                <p className="text-slate-400">Completion Date</p>
                <p className="font-semibold text-slate-900">{formattedDate}</p>
              </div>
            </div>

            {qrUrl && (
              <div className="flex items-center gap-2.5">
                <img
                  src={qrUrl}
                  alt={`QR code verifying certificate ${cert.id}`}
                  className="h-14 w-14 rounded border border-slate-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onDownload(cert)}
            disabled={downloading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Generating PDF…' : 'Download PDF Certificate'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyVerify}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Link copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy verify URL</span>
              </>
            )}
          </button>
        </div>

        <Link
          to={`/verify/${encodeURIComponent(cert.id)}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          <span>Verification page</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export const CertificatesPage: React.FC = () => {
  const { state, updateLearnerName, loadSampleProgress, notify } = useApp();
  const allCourses = getAllCourses();
  const earned = Object.values(state.certificates);

  const [nameInput, setNameInput] = useState(state.profile?.name ?? '');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    setNameInput(state.profile?.name ?? '');
  }, [state.profile?.name]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateLearnerName(nameInput);
    notify('Certificate display name updated.', 'success');
  };

  const handleDownload = async (cert: CertificateRecord) => {
    setDownloadingId(cert.id);
    try {
      await downloadCertificatePdf(cert);
      notify(`Downloaded PDF certificate (${cert.id})`, 'success');
    } catch {
      notify('Unable to generate PDF in this browser context.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const inProgressLocked = allCourses.filter(
    (c) => !state.certificates[c.slug] && state.courses[c.slug]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Certificates
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Certificates unlock automatically once you pass all 12 section quizzes, pass
            the timed final exam, and complete the mini project for a course.
          </p>
        </div>

        <form onSubmit={handleSaveName} className="flex items-center gap-2">
          <label htmlFor="cert-display-name" className="sr-only">
            Full name printed on certificates
          </label>
          <input
            id="cert-display-name"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your full name on certificates"
            className="h-10 w-60 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="h-10 rounded-xl border border-slate-200 bg-slate-100 px-3.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer whitespace-nowrap shrink-0"
          >
            Save name
          </button>
        </form>
      </div>

      {/* Earned Certificates */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Earned Certificates ({earned.length})
        </h2>

        {earned.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
            <Award className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
              No certificates unlocked yet
            </h3>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Complete any course&apos;s 12 section quizzes (70%+), timed 30-question
              exam (70%+), and mini project to generate a downloadable PDF certificate.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/courses"
                className="inline-flex h-11 items-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Explore courses
              </Link>
              <button
                type="button"
                onClick={loadSampleProgress}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Preview sample certificate</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {earned.map((cert) => (
              <CertificateVisualCard
                key={cert.id}
                cert={cert}
                onDownload={handleDownload}
                downloading={downloadingId === cert.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Progress toward locked certificates */}
      {inProgressLocked.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            In Progress Toward Certification
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {inProgressLocked.map((course) => {
              const prog = state.courses[course.slug];
              const pct = calculateCourseCompletionPercent(course, prog);
              const passedSecs = getPassedSectionCount(prog);
              return (
                <div
                  key={course.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {course.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="h-3.5 w-3.5" />
                      Locked
                    </span>
                  </div>
                  <ProgressBar percent={pct} className="mt-3" />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>
                      Quizzes: {passedSecs}/{course.sectionCount}
                    </span>
                    <span>
                      Exam: {prog.examResult?.passed ? 'Passed' : 'Pending'}
                    </span>
                    <span>Project: {prog.projectDone ? 'Done' : 'Pending'}</span>
                  </div>
                  <Link
                    to={`/courses/${course.slug}`}
                    className="mt-4 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Continue track →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
