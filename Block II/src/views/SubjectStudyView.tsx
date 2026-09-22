import React from 'react';
import { SubjectId } from '../types';
import { COLLEGE_MAP } from '../data/colleges';
import { useStudyProgress } from '../context/StudyProgressContext';
import { Play, BookOpen, ArrowLeft, Brain, Activity, Dna, Award, CheckCircle2, RotateCcw } from 'lucide-react';

interface SubjectStudyViewProps {
  collegeId: string;
  subjectId: SubjectId;
  totalQuestions: number;
  onStartQuiz: () => void;
  onStartFlashcards: () => void;
  onBackToCollege: () => void;
}

export const SubjectStudyView: React.FC<SubjectStudyViewProps> = ({
  collegeId,
  subjectId,
  totalQuestions,
  onStartQuiz,
  onStartFlashcards,
  onBackToCollege,
}) => {
  const college = COLLEGE_MAP[collegeId];
  const { getSubjectStats, resetSubjectProgress } = useStudyProgress();
  const stats = getSubjectStats(collegeId, subjectId);

  const subjectTitles: Record<SubjectId, string> = {
    anatomy: 'Anatomy',
    physiology: 'Physiology',
    biochemistry: 'Biochemistry',
  };

  const subjectIcons = {
    anatomy: Brain,
    physiology: Activity,
    biochemistry: Dna,
  }[subjectId];

  const SubjectIcon = subjectIcons;

  const subjectThemes = {
    anatomy: {
      gradient: 'from-rose-500/10 to-rose-600/5',
      border: 'border-rose-200 dark:border-rose-900/40',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      text: 'text-rose-600 dark:text-rose-400',
    },
    physiology: {
      gradient: 'from-teal-500/10 to-teal-600/5',
      border: 'border-teal-200 dark:border-teal-900/40',
      badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
      btn: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20',
      text: 'text-teal-600 dark:text-teal-400',
    },
    biochemistry: {
      gradient: 'from-purple-500/10 to-purple-600/5',
      border: 'border-purple-200 dark:border-purple-900/40',
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      btn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
      text: 'text-purple-600 dark:text-purple-400',
    },
  }[subjectId];

  const bestScorePercent =
    stats.bestScore !== null && totalQuestions > 0
      ? Math.round((stats.bestScore / totalQuestions) * 100)
      : null;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4">
      {/* Back navigation */}
      <button
        onClick={onBackToCollege}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {college?.name || 'College'} Overview</span>
      </button>

      {/* Main Subject Study Hub Banner */}
      <div className={`bg-white dark:bg-slate-900 rounded-3xl border ${subjectThemes.border} p-6 sm:p-10 shadow-sm mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6`}>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {college?.name}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${subjectThemes.badge}`}>
              Block 5
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-3">
            <SubjectIcon className={`w-8 h-8 ${subjectThemes.text}`} />
            <span>{subjectTitles[subjectId]}</span>
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {totalQuestions} Authentic Pre-Prof Examination MCQs with Verified Rationales
          </p>
        </div>

        {/* Status Pill */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 text-center min-w-[140px]">
          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
            Best Score
          </span>
          {bestScorePercent !== null ? (
            <div className="flex items-center justify-center gap-1.5">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {bestScorePercent}%
              </span>
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-400">Unattempted</span>
          )}
          {stats.quizzesAttempted > 0 && (
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {stats.quizzesAttempted} {stats.quizzesAttempted === 1 ? 'attempt' : 'attempts'}
            </span>
          )}
        </div>
      </div>

      {/* TWO PRIMARY STUDY OPTIONS (Prompt Requirement #9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Option 1: MCQ Quiz */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Play className="w-6 h-6 fill-current" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              MCQ Examination Quiz
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal mb-6">
              Simulate exam conditions with one question at a time, interactive answer selection, conceptual hints, and comprehensive post-exam reviews.
            </p>
          </div>

          <div>
            <button
              onClick={onStartQuiz}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start MCQ Quiz ({totalQuestions} Questions)</span>
            </button>
          </div>
        </div>

        {/* Option 2: Flashcards */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Active Recall Flashcards
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal mb-6">
              Review every MCQ with smooth 3D flip cards, instant answer reveal, high-yield memory pearls, and desktop keyboard shortcuts (Space / Arrows).
            </p>
          </div>

          <div>
            <button
              onClick={onStartFlashcards}
              className="w-full py-3.5 px-6 rounded-2xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Flashcards Deck ({totalQuestions} Cards)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
