import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface QuizHintProps {
  hint: string;
  isRevealed: boolean;
  onReveal: () => void;
}

export const QuizHint: React.FC<QuizHintProps> = ({ hint, isRevealed, onReveal }) => {
  const [isOpen, setIsOpen] = useState(isRevealed);

  const handleToggle = () => {
    if (!isOpen && !isRevealed) {
      onReveal();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={handleToggle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 border border-amber-200/80 dark:border-amber-900/60 transition-colors shadow-2xs"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          <span>Need a Concept Hint?</span>
          <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
        </button>
      ) : (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-200 transition-all">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-amber-800 dark:text-amber-300">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Recall Hint</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 text-[11px] flex items-center gap-0.5"
            >
              <span>Hide</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="leading-relaxed font-medium pl-5">{hint}</p>
        </div>
      )}
    </div>
  );
};
