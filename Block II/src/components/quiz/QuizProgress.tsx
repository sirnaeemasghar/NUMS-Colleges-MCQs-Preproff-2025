import React from 'react';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  userAnswers: Record<string, string>;
  questionIds: string[];
  onSelectQuestion: (index: number) => void;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  userAnswers,
  questionIds,
  onSelectQuestion,
}) => {
  const percentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-900 dark:text-white font-bold text-sm">
            Question {currentIndex + 1}
          </span>
          <span className="text-slate-400">of {totalQuestions}</span>
        </div>
        <div>
          <span className="text-sky-600 dark:text-sky-400 font-bold">{answeredCount}</span>
          <span className="text-slate-400">/{totalQuestions} answered</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Quick Jump Question Dots / Numbers Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        {questionIds.map((qId, idx) => {
          const isAnswered = Boolean(userAnswers[qId]);
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={qId}
              onClick={() => onSelectQuestion(idx)}
              title={`Jump to Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}`}
              className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center justify-center ${
                isCurrent
                  ? 'bg-sky-600 text-white ring-2 ring-sky-500/40 shadow-sm scale-110'
                  : isAnswered
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};
