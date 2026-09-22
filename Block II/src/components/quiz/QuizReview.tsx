import React, { useState } from 'react';
import { MCQ, SubjectId } from '../../types';
import { CheckCircle2, XCircle, AlertCircle, Bookmark, BookmarkCheck, ArrowLeft, RotateCcw, BookOpen, ShieldAlert } from 'lucide-react';
import { useStudyProgress } from '../../context/StudyProgressContext';

interface QuizReviewProps {
  collegeName: string;
  subjectName: string;
  questions: MCQ[];
  userAnswers: Record<string, string>;
  revealedHints: Record<string, boolean>;
  onBackToResults: () => void;
  onRetry: () => void;
  onStudyFlashcards: () => void;
}

type FilterMode = 'all' | 'incorrect' | 'correct' | 'correctedKey';

export const QuizReview: React.FC<QuizReviewProps> = ({
  collegeName,
  subjectName,
  questions,
  userAnswers,
  revealedHints,
  onBackToResults,
  onRetry,
  onStudyFlashcards,
}) => {
  const [filter, setFilter] = useState<FilterMode>('all');
  const { isBookmarked, toggleBookmark } = useStudyProgress();

  const filteredQuestions = questions.filter((q) => {
    const selected = userAnswers[q.id];
    const isCorrect = selected === q.verifiedCorrectAnswer;
    if (filter === 'incorrect') return !isCorrect;
    if (filter === 'correct') return isCorrect;
    if (filter === 'correctedKey') return q.correctionMade || q.verificationStatus === 'needs-review';
    return true;
  });

  const incorrectCount = questions.filter((q) => userAnswers[q.id] !== q.verifiedCorrectAnswer).length;
  const correctedKeyCount = questions.filter((q) => q.correctionMade || q.verificationStatus === 'needs-review').length;

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-4">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBackToResults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Score Dashboard</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Answer Review — {collegeName} {subjectName}
          </h2>
        </div>

        {/* Action Quick Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRetry}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Quiz</span>
          </button>
          <button
            onClick={onStudyFlashcards}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            filter === 'all'
              ? 'bg-sky-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All ({questions.length})
        </button>

        <button
          onClick={() => setFilter('incorrect')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 ${
            filter === 'incorrect'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Incorrect ({incorrectCount})</span>
        </button>

        <button
          onClick={() => setFilter('correct')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 ${
            filter === 'correct'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Correct ({questions.length - incorrectCount})</span>
        </button>

        {correctedKeyCount > 0 && (
          <button
            onClick={() => setFilter('correctedKey')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center gap-1 ${
              filter === 'correctedKey'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Audited / Corrected ({correctedKeyCount})</span>
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              No questions match the selected filter.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const selected = userAnswers[q.id];
            const isCorrect = selected === q.verifiedCorrectAnswer;
            const bookmarked = isBookmarked(q.id);
            const hintWasUsed = Boolean(revealedHints[q.id]);

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 sm:p-6 shadow-sm transition-all ${
                  isCorrect
                    ? 'border-emerald-200/80 dark:border-emerald-900/40'
                    : 'border-rose-200/80 dark:border-rose-900/40'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      Q#{q.originalQuestionNumber}
                    </span>

                    {/* Result Badge */}
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <XCircle className="w-3.5 h-3.5" />
                        {selected ? 'Incorrect' : 'Unanswered'}
                      </span>
                    )}

                    {/* Audit note if key was corrected */}
                    {q.correctionMade && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        <ShieldAlert className="w-3 h-3" />
                        Source Key Corrected (PDF was {q.sourceMarkedAnswer})
                      </span>
                    )}

                    {q.verificationStatus === 'needs-review' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        <AlertCircle className="w-3 h-3" />
                        Needs Review
                      </span>
                    )}

                    {hintWasUsed && (
                      <span className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">
                        • Hint used
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleBookmark(q.id)}
                    aria-label="Bookmark"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Question Stem */}
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-4 leading-relaxed">
                  {q.question}
                </h3>

                {/* Options List */}
                <div className="space-y-2 mb-4">
                  {q.options.map((opt) => {
                    const isUserChoice = selected === opt.id;
                    const isVerified = q.verifiedCorrectAnswer === opt.id;

                    let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                    if (isVerified) {
                      optStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/50';
                    } else if (isUserChoice && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100 line-through ring-1 ring-rose-500/50';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${optStyle}`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                          isVerified
                            ? 'bg-emerald-600 text-white'
                            : isUserChoice && !isCorrect
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {opt.id}
                        </span>
                        <span className="flex-1 leading-normal pt-0.5">{opt.text}</span>
                        {isVerified && (
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Correct Answer
                          </span>
                        )}
                        {isUserChoice && !isVerified && (
                          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1 shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                            Your Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Educational Explanation Box */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span>Explanation:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {q.explanation}
                  </p>
                  {q.correctionReason && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-amber-700 dark:text-amber-300">
                      <strong>Audit Note:</strong> {q.correctionReason}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
