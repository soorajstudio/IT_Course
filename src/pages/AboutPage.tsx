import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, FolderTree, ShieldCheck } from 'lucide-react';
import { getAllCourses } from '../content/loader';
import { CodeBlock } from '../components/CodeBlock';

const ABOUT_IMAGE = '/src/assets/images/about_studio_1795067383964.jpg';

const ADD_COURSE_SNIPPET = `src/content/courses/rust/
├── meta.json      # Course slug, area, tagline, learning outcomes
├── lessons.json   # 3 levels × 4 sections × 4 lessons (48 total)
├── quizzes.json   # 12 section quizzes × 8+ questions (70% pass mark)
├── exam.json      # 30+ timed mixed final exam questions
└── project.json   # Capstone brief, checklist, steps, reference solution`;

export const AboutPage: React.FC = () => {
  const courses = getAllCourses();
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid items-stretch gap-10 lg:grid-cols-12">
        <div className="flex flex-col justify-center lg:col-span-6">
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            About IT Courses
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Engineering depth over superficial tutorials.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
            IT Courses was designed for computer science students, freshers preparing for
            technical rounds, and working engineers expanding into new languages or
            databases. Every track pairs clear conceptual prose with real, idiomatic code
            examples, common production pitfalls, gated assessments, and capstone builds.
          </p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <span>Explore all {courses.length} courses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
            {!imgFailed ? (
              <img
                src={ABOUT_IMAGE}
                alt="Software engineers discussing system architecture diagrams at a whiteboard"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-indigo-600">
                <Code2 className="h-12 w-12" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pillars */}
      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Uniform 3-Level Rigor
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Every single one of our {courses.length} courses spans Beginner, Intermediate,
            and Advanced levels with 12 sections, 48 lessons, 96+ quiz questions, a
            30-question timed exam, and a guided mini project.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Earned, Verifiable Credentials
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Certificates cannot be skipped into. Learners must pass every gated section
            quiz (70%+), pass the timed final exam, and complete the mini project to
            download their QR-verified PDF certificate.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <FolderTree className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Data-Driven Content Architecture
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            All curriculum content lives in modular JSON folders discovered dynamically at
            build time via Vite glob imports — adding a 24th course requires zero React
            code changes.
          </p>
        </div>
      </section>

      {/* Extensibility guide */}
      <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Adding a New Course Without Code Changes
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Drop a new folder under <code className="font-mono text-xs">src/content/courses/&lt;slug&gt;/</code>{' '}
          containing the five JSON files below. The catalog, search, interview Q&amp;A
          bank, mock interview generator, progress engine, and certificate issuer discover
          it automatically.
        </p>
        <div className="mt-5">
          <CodeBlock
            title="Course Folder Contract"
            language="bash"
            code={ADD_COURSE_SNIPPET}
          />
        </div>
      </section>
    </div>
  );
};
