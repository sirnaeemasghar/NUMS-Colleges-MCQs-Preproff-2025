import React from 'react';
import { CollegeInfo } from '../../types';
import { useStudyProgress } from '../../context/StudyProgressContext';
import { ChevronRight, Award, Brain, Activity, Dna, CheckCircle2 } from 'lucide-react';

interface CollegeCardProps {
  college: CollegeInfo;
  onSelect: (collegeId: string) => void;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, onSelect }) => {
  const { getCollegeStats } = useStudyProgress();
  const stats = getCollegeStats(college.id);

  return (
    <div
      onClick={() => onSelect(college.id)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Name and Total MCQs */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              {college.city}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {college.name}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 border border-slate-200/60 dark:border-slate-700">
            {college.totalMCQs} MCQs
          </span>
        </div>

        {/* Full Name & Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-4 font-medium">
          {college.fullName}
        </p>

        {/* Subject Breakdown Pills */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Anatomy */}
          <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
            college.anatomyCount > 0
              ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-300'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
          }`}>
            <Brain className="w-4 h-4 mb-1 text-rose-500 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Anatomy</span>
            <span className="text-xs font-bold">{college.anatomyCount}</span>
          </div>

          {/* Physiology */}
          <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
            college.physiologyCount > 0
              ? 'bg-teal-50/70 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/40 text-teal-700 dark:text-teal-300'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
          }`}>
            <Activity className="w-4 h-4 mb-1 text-teal-500 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Physio</span>
            <span className="text-xs font-bold">{college.physiologyCount}</span>
          </div>

          {/* Biochemistry */}
          <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
            college.biochemistryCount > 0
              ? 'bg-purple-50/70 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40 text-purple-700 dark:text-purple-300'
              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60'
          }`}>
            <Dna className="w-4 h-4 mb-1 text-purple-500 shrink-0" />
            <span className="text-[10px] uppercase tracking-wider font-semibold">Biochem</span>
            <span className="text-xs font-bold">{college.biochemistryCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {stats.quizzesAttempted > 0 ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.quizzesCompleted} of {college.availableSubjects.length} Completed</span>
            </div>
            {stats.bestAverage !== null && (
              <span className="text-slate-400">• Best Avg {stats.bestAverage}%</span>
            )}
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 font-medium">
            Not started yet
          </span>
        )}

        <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
          <span>Study</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
