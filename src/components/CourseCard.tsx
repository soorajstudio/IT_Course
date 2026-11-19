import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import type { CourseMeta, CourseProgress } from '../types/course';
import { AREA_STYLES } from '../content/loader';
import {
  calculateCourseCompletionPercent,
  getPassedSectionCount,
} from '../utils/progress';
import { AreaIcon } from './AreaIcon';
import { ProgressBar } from './ProgressRing';

interface CourseCardProps {
  course: CourseMeta;
  progress?: CourseProgress;
  hasCertificate?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  hasCertificate = false,
}) => {
  const areaStyle = AREA_STYLES[course.area];
  const completionPct = calculateCourseCompletionPercent(course, progress);
  const sectionsPassed = getPassedSectionCount(progress);

  const quizScores = progress
    ? Object.values(progress.quizResults).map((q) => q.scorePercent)
    : [];
  const avgQuiz =
    quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : null;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <AreaIcon area={course.area} />
          {hasCertificate ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <Award className="h-4 w-4" aria-hidden="true" />
              <span>Certified</span>
            </span>
          ) : completionPct > 0 ? (
            <span className="font-mono text-xs font-medium tabular-nums text-indigo-600 dark:text-indigo-400">
              {completionPct}% done
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              3 levels
            </span>
          )}
        </div>

        <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className={`font-medium ${areaStyle.colorText}`}>{course.area}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{course.lessonCount} lessons</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{course.estimatedHours}h</span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-50 dark:group-hover:text-indigo-400">
          {course.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {course.tagline}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80">
        {progress ? (
          <div className="space-y-2.5">
            <ProgressBar
              percent={completionPct}
              label={`${course.title} progress: ${completionPct}%`}
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span>
                Sections: {sectionsPassed}/{course.sectionCount}
              </span>
              <span>
                {avgQuiz !== null ? `Quiz avg: ${avgQuiz}%` : 'No quiz yet'}
              </span>
              <span className="inline-flex items-center gap-1">
                {progress.projectDone ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">
                      Project done
                    </span>
                  </>
                ) : (
                  <span>Project open</span>
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>
              {course.sectionCount} quizzes · {course.examQuestionCount}-Q exam · Project
            </span>
            <span className="inline-flex items-center gap-1 text-indigo-600 transition-transform group-hover:translate-x-0.5 dark:text-indigo-400">
              <span>Explore</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
