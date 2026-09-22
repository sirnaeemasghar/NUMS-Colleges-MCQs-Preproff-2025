import React from 'react';
import { MCQ } from '../../types';
import { QuizHint } from './QuizHint';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useStudyProgress } from '../../context/StudyProgressContext';

interface QuizQuestionProps {
  question: MCQ;
  selectedOptionId?: 'A' | 'B' | 'C' | 'D';
  onSelectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  hintRevealed: boolean;
  onRevealHint: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  hintRevealed,
  onRevealHint,
}) => {
  const { isBookmarked, toggleBookmark } = useStudyProgress();
  const bookmarked = isBookmarked(question.id);

  const subjectBadges = {
    anatomy: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
    physiology: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
    biochemistry: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
  }[question.subjectId];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 shadow-sm transition-all duration-200">
      {/* Question Header Meta */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {question.collegeName}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${subjectBadges}`}>
            {question.subjectName}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Orig Q#{question.originalQuestionNumber}
          </span>
        </div>

        {/* Bookmark Toggle */}
        <button
          onClick={() => toggleBookmark(question.id)}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
          className={`p-2 rounded-xl transition-colors ${
            bookmarked
              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-500'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {bookmarked ? (
            <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-500" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Question Stem */}
      <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-6 select-text">
        {question.question}
      </h2>

      {/* 4 Options Grid */}
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onSelectOption(opt.id)}
              className={`w-full text-left p-4 sm:p-4.5 rounded-xl border transition-all duration-150 flex items-start gap-3.5 group cursor-pointer ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 dark:border-sky-500 shadow-xs ring-1 ring-sky-500'
                  : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
              }`}
            >
              {/* Option Letter Circle */}
              <span
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                }`}
              >
                {opt.id}
              </span>

              {/* Option Text */}
              <span
                className={`text-sm sm:text-base leading-snug pt-0.5 ${
                  isSelected
                    ? 'font-bold text-sky-950 dark:text-sky-100'
                    : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}
              >
                {opt.text}
              </span>
            </button>
          );
        })}
      </div>

      {/* Non-revealing Concept Hint */}
      <QuizHint
        hint={question.hint}
        isRevealed={hintRevealed}
        onReveal={onRevealHint}
      />
    </div>
  );
};
