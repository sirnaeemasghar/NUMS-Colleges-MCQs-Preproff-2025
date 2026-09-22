import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MCQ, SubjectId } from '../../types';
import { useStudyProgress } from '../../context/StudyProgressContext';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, CheckCircle2, Bookmark, BookmarkCheck, ArrowLeft, Lightbulb, Sparkles } from 'lucide-react';

interface FlashcardDeckProps {
  collegeId: string;
  collegeName: string;
  subjectId: SubjectId;
  subjectName: string;
  questions: MCQ[];
  onBackToSubject: () => void;
  onStartQuiz: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  collegeId,
  collegeName,
  subjectId,
  subjectName,
  questions,
  onBackToSubject,
  onStartQuiz,
}) => {
  const [deck, setDeck] = useState<MCQ[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set());

  const { recordFlashcardProgress, isBookmarked, toggleBookmark } = useStudyProgress();

  const currentCard = deck[currentIndex];
  const bookmarked = isBookmarked(currentCard.id);

  // Mark current card as viewed
  useEffect(() => {
    setViewedCards((prev) => {
      const next = new Set(prev);
      next.add(currentCard.id);
      recordFlashcardProgress(collegeId, subjectId, next.size);
      return next;
    });
  }, [currentIndex, currentCard.id, collegeId, subjectId, recordFlashcardProgress]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length, isFlipped]);

  const handleNext = () => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRestart = () => {
    setDeck(questions);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  };

  // Find verified option text
  const verifiedOption = currentCard.options.find(
    (o) => o.id === currentCard.verifiedCorrectAnswer
  );

  const subjectBadges = {
    anatomy: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
    physiology: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
    biochemistry: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
  }[currentCard.subjectId];

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-8 sm:py-16 px-4 text-center">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-6 ring-1 ring-emerald-500/20">
            <Sparkles className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Deck Completed!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            You've studied all <strong>{deck.length}</strong> flashcards for <strong>{collegeName} {subjectName}</strong>. Ready to test your recall under exam conditions?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md shadow-sky-600/20 transition-all"
            >
              Take MCQ Quiz Now
            </button>
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
            >
              Restart Flashcards
            </button>
            <button
              onClick={onBackToSubject}
              className="w-full sm:w-auto px-5 py-3 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold text-sm transition-all"
            >
              Back to Subject
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-6 px-4">
      {/* Top Deck Info & Quick Controls */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            {collegeName} • {subjectName}
          </span>
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Card {currentIndex + 1} of {deck.length}</span>
            <span className="text-xs font-normal text-slate-400">
              ({viewedCards.size}/{deck.length} seen)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            title="Shuffle deck"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleBookmark(currentCard.id)}
            title={bookmarked ? 'Bookmarked' : 'Bookmark card'}
            className={`p-2 rounded-xl border transition-colors ${
              bookmarked
                ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            {bookmarked ? (
              <BookmarkCheck className="w-4 h-4 fill-amber-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div
        className="w-full min-h-[380px] sm:min-h-[420px] cursor-pointer perspective-1000 mb-6 select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full min-h-[380px] sm:min-h-[420px] rounded-3xl border border-slate-200/80 dark:border-slate-800 transition-transform duration-500 transform-style-3d shadow-sm hover:shadow-md ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col justify-between backface-hidden">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${subjectBadges}`}>
                  {currentCard.subjectName}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Q#{currentCard.originalQuestionNumber}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed mt-4">
                {currentCard.question}
              </h3>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tap or press Space to reveal answer</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full rounded-3xl bg-slate-900 text-white dark:bg-slate-950 p-6 sm:p-8 flex flex-col justify-between rotate-y-180 backface-hidden border border-slate-700">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Correct Answer
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Option {currentCard.verifiedCorrectAnswer}
                </span>
              </div>

              {/* Correct Answer Highlight */}
              <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 mb-4">
                <div className="text-xl sm:text-2xl font-black text-emerald-300 leading-snug">
                  {verifiedOption ? verifiedOption.text : currentCard.verifiedCorrectAnswer}
                </div>
              </div>

              {/* Educational Explanation */}
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mb-3">
                {currentCard.explanation}
              </div>

              {/* High-yield clinical hint */}
              <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800 text-xs text-amber-200/90 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{currentCard.hint}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 font-medium">
              <span>Tap to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-all"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Flip Card</span>
        </button>

        <button
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 transition-all"
        >
          <span>{currentIndex < deck.length - 1 ? 'Next' : 'Finish'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Helper */}
      <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
        <span className="hidden sm:inline">Shortcuts:</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono">Space</kbd> Flip
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono">←</kbd> Prev
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono">→</kbd> Next
        </span>
      </div>
    </div>
  );
};
