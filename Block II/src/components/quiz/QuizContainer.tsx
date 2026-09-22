import React, { useState } from 'react';
import { MCQ, SubjectId } from '../../types';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { QuizReview } from './QuizReview';
import { useStudyProgress } from '../../context/StudyProgressContext';
import { ChevronLeft, ChevronRight, Check, AlertTriangle, X } from 'lucide-react';

interface QuizContainerProps {
  collegeId: string;
  collegeName: string;
  subjectId: SubjectId;
  subjectName: string;
  questions: MCQ[];
  onBackToSubject: () => void;
  onStudyFlashcards: () => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  collegeId,
  collegeName,
  subjectId,
  subjectName,
  questions,
  onBackToSubject,
  onStudyFlashcards,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [viewState, setViewState] = useState<'taking' | 'results' | 'review'>('taking');
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);

  const { recordQuizResult } = useStudyProgress();

  const currentQ = questions[currentIndex];
  const questionIds = questions.map((q) => q.id);
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId,
    }));
  };

  const handleRevealHint = () => {
    setRevealedHints((prev) => ({
      ...prev,
      [currentQ.id]: true,
    }));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSubmitAttempt = () => {
    if (unansweredCount > 0) {
      setShowSubmitWarning(true);
    } else {
      finalizeSubmit();
    }
  };

  const finalizeSubmit = () => {
    setShowSubmitWarning(false);
    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.verifiedCorrectAnswer) {
        score++;
      }
    });

    // Record result in progress context
    recordQuizResult(collegeId, subjectId, score, questions.length);
    setViewState('results');
  };

  const handleRetry = () => {
    setUserAnswers({});
    setRevealedHints({});
    setCurrentIndex(0);
    setViewState('taking');
  };

  if (viewState === 'results') {
    return (
      <QuizResults
        collegeId={collegeId}
        collegeName={collegeName}
        subjectId={subjectId}
        subjectName={subjectName}
        questions={questions}
        userAnswers={userAnswers}
        revealedHints={revealedHints}
        onReview={() => setViewState('review')}
        onRetry={handleRetry}
        onStudyFlashcards={onStudyFlashcards}
        onBackToSubject={onBackToSubject}
      />
    );
  }

  if (viewState === 'review') {
    return (
      <QuizReview
        collegeName={collegeName}
        subjectName={subjectName}
        questions={questions}
        userAnswers={userAnswers}
        revealedHints={revealedHints}
        onBackToResults={() => setViewState('results')}
        onRetry={handleRetry}
        onStudyFlashcards={onStudyFlashcards}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 px-4">
      {/* Progress & Quick Jump Strip */}
      <QuizProgress
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        userAnswers={userAnswers}
        questionIds={questionIds}
        onSelectQuestion={(idx) => setCurrentIndex(idx)}
      />

      {/* Active Question Card */}
      <QuizQuestion
        question={currentQ}
        selectedOptionId={userAnswers[currentQ.id]}
        onSelectOption={handleSelectOption}
        hintRevealed={Boolean(revealedHints[currentQ.id])}
        onRevealHint={handleRevealHint}
      />

      {/* Navigation Buttons Footer */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitAttempt}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Submit Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Submit Floating Button on mobile if all/most answered */}
      {answeredCount > 0 && currentIndex < questions.length - 1 && (
        <div className="mt-4 text-center">
          <button
            onClick={handleSubmitAttempt}
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 underline underline-offset-4 transition-colors"
          >
            Finished early? Submit Quiz Now ({answeredCount}/{questions.length} answered)
          </button>
        </div>
      )}

      {/* Early Submission Warning Modal */}
      {showSubmitWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Unanswered Questions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  You have <strong className="text-amber-600 dark:text-amber-400">{unansweredCount}</strong> unanswered {unansweredCount === 1 ? 'question' : 'questions'}. Unanswered questions will be scored as incorrect.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowSubmitWarning(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Keep Answering
              </button>
              <button
                onClick={finalizeSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
