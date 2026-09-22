import React from 'react';
import { SubjectId } from '../../types';
import { useStudyProgress } from '../../context/StudyProgressContext';
import { Brain, Activity, Dna, Play, BookOpen, RotateCcw, CheckCircle, Award } from 'lucide-react';

interface SubjectCardProps {
  collegeId: string;
  subjectId: SubjectId;
  subjectName: string;
  totalQuestions: number;
  onStartQuiz: (collegeId: string, subjectId: SubjectId) => void;
  onStartFlashcards: (collegeId: string, subjectId: SubjectId) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  collegeId,
  subjectId,
  subjectName,
  totalQuestions,
  onStartQuiz,
  onStartFlashcards,
}) => {
  const { getSubjectStats, resetSubjectProgress } = useStudyProgress();
  const stats = getSubjectStats(collegeId, subjectId);

  // Subject Theme Styles
  const themeConfig = {
    anatomy: {
      border: 'border-rose-200 dark:border-rose-900/50 hover:border-rose-400 dark:hover:border-rose-700',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
      quizBtn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
      flashcardBtn: 'border-rose-200 hover:bg-rose-50 text-rose-700 dark:border-rose-800 dark:hover:bg-rose-950/40 dark:text-rose-300',
      icon: Brain,
    },
    physiology: {
      border: 'border-teal-200 dark:border-teal-900/50 hover:border-teal-400 dark:hover:border-teal-700',
      badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300',
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400',
      quizBtn: 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20',
      flashcardBtn: 'border-teal-200 hover:bg-teal-50 text-teal-700 dark:border-teal-800 dark:hover:bg-teal-950/40 dark:text-teal-300',
      icon: Activity,
    },
    biochemistry: {
      border: 'border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
      quizBtn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
      flashcardBtn: 'border-purple-200 hover:bg-purple-50 text-purple-700 dark:border-purple-800 dark:hover:bg-purple-950/40 dark:text-purple-300',
      icon: Dna,
    },
  }[subjectId];

  const SubjectIcon = themeConfig.icon;
  const bestPercentage =
    stats.bestScore !== null && totalQuestions > 0
      ? Math.round((stats.bestScore / totalQuestions) * 100)
      : null;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border ${themeConfig.border} p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${themeConfig.iconBg} flex items-center justify-center`}>
              <SubjectIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {subjectName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {totalQuestions} Exam Questions
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${themeConfig.badgeBg}`}>
            {totalQuestions} MCQs
          </span>
        </div>

        {/* Progress Metrics Panel */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 mb-6 border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-3 text-center">
            {/* Quiz Progress */}
            <div className="border-r border-slate-200 dark:border-slate-700/60 pr-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                Quiz Best Score
              </span>
              {bestPercentage !== null ? (
                <div className="flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {bestPercentage}%
                  </span>
                  <span className="text-xs text-slate-400">
                    ({stats.bestScore}/{totalQuestions})
                  </span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  Not attempted
                </span>
              )}
            </div>

            {/* Flashcards Progress */}
            <div className="pl-2">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">
                Flashcards
              </span>
              <div className="flex items-center justify-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {stats.flashcardsViewed}
                </span>
                <span className="text-xs text-slate-400">
                  /{totalQuestions} viewed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={() => onStartQuiz(collegeId, subjectId)}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all ${themeConfig.quizBtn}`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start MCQ Quiz ({totalQuestions} Qs)</span>
        </button>

        <button
          onClick={() => onStartFlashcards(collegeId, subjectId)}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all ${themeConfig.flashcardBtn}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Study Flashcards Deck</span>
        </button>

        {stats.quizzesAttempted > 0 && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => resetSubjectProgress(collegeId, subjectId)}
              title="Reset progress for this subject"
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Progress</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
