import React from 'react';
import { X, CheckCircle2, Bookmark, BookmarkCheck, Lightbulb, ShieldAlert, ArrowRight } from 'lucide-react';
import { MCQ, SubjectId } from '../../types';
import { useStudyProgress } from '../../context/StudyProgressContext';

interface QuestionInspectModalProps {
  question: MCQ | null;
  onClose: () => void;
  onGoToSubject: (collegeId: string, subjectId: SubjectId) => void;
}

export const QuestionInspectModal: React.FC<QuestionInspectModalProps> = ({
  question,
  onClose,
  onGoToSubject,
}) => {
  const { isBookmarked, toggleBookmark } = useStudyProgress();

  if (!question) return null;

  const bookmarked = isBookmarked(question.id);

  const subjectBadges = {
    anatomy: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
    physiology: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
    biochemistry: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
  }[question.subjectId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {question.collegeName}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${subjectBadges}`}>
              {question.subjectName}
            </span>
            <span className="text-xs text-slate-400">
              Q#{question.originalQuestionNumber}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleBookmark(question.id)}
              aria-label="Bookmark"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {bookmarked ? (
                <BookmarkCheck className="w-5 h-5 fill-amber-500 text-amber-500" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stem & Options */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
            {question.question}
          </h3>

          <div className="space-y-2">
            {question.options.map((opt) => {
              const isVerified = question.verifiedCorrectAnswer === opt.id;

              return (
                <div
                  key={opt.id}
                  className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                    isVerified
                      ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500/40'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                      isVerified
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="flex-1 leading-snug pt-0.5">{opt.text}</span>
                  {isVerified && (
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Answer
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">
              Medical Explanation:
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {question.explanation}
            </p>
            {question.correctionReason && (
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-amber-700 dark:text-amber-300">
                <strong>Audit Note:</strong> {question.correctionReason}
              </div>
            )}
          </div>

          {/* Concept Hint */}
          <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-xl p-3 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Recall Concept:</span>
              <span className="leading-snug">{question.hint}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            onClick={() => {
              onGoToSubject(question.collegeId, question.subjectId);
              onClose();
            }}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>Study {question.collegeName} {question.subjectName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
