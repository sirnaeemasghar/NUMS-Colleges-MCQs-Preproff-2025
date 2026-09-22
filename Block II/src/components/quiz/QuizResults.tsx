import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle, XCircle, HelpCircle, Lightbulb, RotateCcw, BookOpen, Eye, ArrowLeft } from 'lucide-react';
import { MCQ, SubjectId } from '../../types';

interface QuizResultsProps {
  collegeId: string;
  collegeName: string;
  subjectId: SubjectId;
  subjectName: string;
  questions: MCQ[];
  userAnswers: Record<string, string>;
  revealedHints: Record<string, boolean>;
  onReview: () => void;
  onRetry: () => void;
  onStudyFlashcards: () => void;
  onBackToSubject: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  collegeName,
  subjectName,
  questions,
  userAnswers,
  revealedHints,
  onReview,
  onRetry,
  onStudyFlashcards,
  onBackToSubject,
}) => {
  const total = questions.length;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (!selected) {
      unansweredCount++;
    } else if (selected === q.verifiedCorrectAnswer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const percentage = Math.round((correctCount / total) * 100);
  const hintsUsedCount = Object.values(revealedHints).filter(Boolean).length;

  // Trigger celebration confetti if score is >= 75%
  useEffect(() => {
    if (percentage >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if confetti fails
      }
    }
  }, [percentage]);

  const getEvaluation = () => {
    if (percentage >= 85) return { text: 'Outstanding Mastery!', color: 'text-emerald-600 dark:text-emerald-400' };
    if (percentage >= 70) return { text: 'Solid Pass & Exam Ready!', color: 'text-sky-600 dark:text-sky-400' };
    if (percentage >= 50) return { text: 'Good Effort — Review Weak Areas', color: 'text-amber-600 dark:text-amber-400' };
    return { text: 'High-Yield Revision Recommended', color: 'text-rose-600 dark:text-rose-400' };
  };

  const evaluation = getEvaluation();

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm text-center mb-6">
        <div className="inline-flex p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mb-4 ring-1 ring-sky-500/20">
          <Award className="w-8 h-8" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          {collegeName} • {subjectName}
        </p>

        <h2 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${evaluation.color}`}>
          {evaluation.text}
        </h2>

        {/* Big Score Display */}
        <div className="flex items-baseline justify-center gap-2 my-6">
          <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            {correctCount}
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-slate-400">
            /{total}
          </span>
          <span className="ml-3 px-3 py-1 rounded-full text-lg font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            {percentage}%
          </span>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          {/* Correct */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-3.5 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
              {correctCount}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase">
              Correct
            </div>
          </div>

          {/* Incorrect */}
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-3.5 text-center">
            <XCircle className="w-5 h-5 text-rose-500 mx-auto mb-1" />
            <div className="text-xl font-black text-rose-700 dark:text-rose-300">
              {incorrectCount}
            </div>
            <div className="text-[11px] font-semibold text-rose-600/80 dark:text-rose-400/80 uppercase">
              Incorrect
            </div>
          </div>

          {/* Unanswered */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-3.5 text-center">
            <HelpCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-xl font-black text-amber-700 dark:text-amber-300">
              {unansweredCount}
            </div>
            <div className="text-[11px] font-semibold text-amber-600/80 dark:text-amber-400/80 uppercase">
              Unanswered
            </div>
          </div>

          {/* Hints Used */}
          <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 rounded-2xl p-3.5 text-center">
            <Lightbulb className="w-5 h-5 text-sky-500 mx-auto mb-1" />
            <div className="text-xl font-black text-sky-700 dark:text-sky-300">
              {hintsUsedCount}
            </div>
            <div className="text-[11px] font-semibold text-sky-600/80 dark:text-sky-400/80 uppercase">
              Hints Used
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onReview}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>Review Answers with Explanations</span>
          </button>

          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>

          <button
            onClick={onStudyFlashcards}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Flashcards</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
          <button
            onClick={onBackToSubject}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center gap-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {collegeName} {subjectName}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
