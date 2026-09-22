import React from 'react';
import { X, Bookmark, BookmarkCheck, ArrowRight, BookOpen, Trash2 } from 'lucide-react';
import { useStudyProgress } from '../../context/StudyProgressContext';
import { QUESTION_MAP } from '../../data/questionBank';
import { MCQ, SubjectId } from '../../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: MCQ) => void;
  onGoToSubject: (collegeId: string, subjectId: SubjectId) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
  onGoToSubject,
}) => {
  const { progressState, toggleBookmark } = useStudyProgress();

  if (!isOpen) return null;

  const bookmarkedIds = progressState.bookmarkedQuestionIds;
  const bookmarkedQuestions = bookmarkedIds
    .map((id) => QUESTION_MAP[id])
    .filter(Boolean);

  const subjectBadges = {
    anatomy: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
    physiology: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
    biochemistry: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Bookmarked Questions ({bookmarkedQuestions.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick review of saved high-yield questions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Bookmarks */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {bookmarkedQuestions.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                No bookmarked questions yet
              </p>
              <p className="mt-1">
                Click the bookmark icon during a quiz or flashcard study session to save questions here.
              </p>
            </div>
          ) : (
            bookmarkedQuestions.map((q) => {
              const verifiedOpt = q.options.find((o) => o.id === q.verifiedCorrectAnswer);

              return (
                <div
                  key={q.id}
                  className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {q.collegeName}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${subjectBadges[q.subjectId]}`}>
                        {q.subjectName}
                      </span>
                      <span className="text-xs text-slate-400">
                        Q#{q.originalQuestionNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        title="Remove bookmark"
                        className="p-1 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {q.question}
                  </p>

                  <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      Correct Answer: {q.verifiedCorrectAnswer}. {verifiedOpt?.text}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {q.explanation}
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        onGoToSubject(q.collegeId, q.subjectId);
                        onClose();
                      }}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>Go to {q.collegeName} {q.subjectName}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
