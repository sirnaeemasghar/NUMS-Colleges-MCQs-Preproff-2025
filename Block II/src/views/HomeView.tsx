import React, { useState } from 'react';
import { COLLEGES } from '../data/colleges';
import { CollegeCard } from '../components/college/CollegeCard';
import { useStudyProgress } from '../context/StudyProgressContext';
import { GraduationCap, Award, CheckCircle2, ShieldCheck, Sparkles, Filter, Search } from 'lucide-react';

interface HomeViewProps {
  onSelectCollege: (collegeId: string) => void;
  onOpenSearch: () => void;
  onOpenAudit: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectCollege,
  onOpenSearch,
  onOpenAudit,
}) => {
  const { getGlobalStats } = useStudyProgress();
  const globalStats = getGlobalStats();
  const [filterCity, setFilterCity] = useState<string>('all');

  const cities = Array.from(new Set(COLLEGES.map((c) => c.city))).sort();

  const filteredColleges = filterCity === 'all'
    ? COLLEGES
    : COLLEGES.filter((c) => c.city === filterCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-10 mb-8 sm:mb-12 shadow-lg">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>NUMS Block 5 Pre-Prof 2025 Dataset</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            NUMS Block 5 Pre-Prof MCQ Study
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6">
            Master college-wise high-yield MCQs directly from the official 2025 Pre-Prof examinations. Each question has been independently verified against <strong className="text-white">Gray's Anatomy</strong>, <strong className="text-white">Guyton & Hall</strong>, and <strong className="text-white">Harper's Biochemistry</strong>.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-2xl font-black text-white">514</div>
              <div className="text-[11px] font-medium text-slate-300">Total Verified MCQs</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-2xl font-black text-white">9</div>
              <div className="text-[11px] font-medium text-slate-300">Medical Colleges</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-2xl font-black text-emerald-400">
                {globalStats.totalQuizzesTaken}
              </div>
              <div className="text-[11px] font-medium text-slate-300">Quizzes Completed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
              <div className="text-2xl font-black text-sky-300">
                {globalStats.overallAccuracy > 0 ? `${globalStats.overallAccuracy}%` : '—'}
              </div>
              <div className="text-[11px] font-medium text-slate-300">Overall Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Colleges Section Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span>Select Medical College</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Choose an institution to study its authentic Anatomy, Physiology, and Biochemistry papers
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCity('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors shrink-0 ${
              filterCity === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            All Cities ({COLLEGES.length})
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                filterCity === city
                  ? 'bg-sky-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Colleges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredColleges.map((college) => (
          <CollegeCard
            key={college.id}
            college={college}
            onSelect={onSelectCollege}
          />
        ))}
      </div>
    </div>
  );
};
