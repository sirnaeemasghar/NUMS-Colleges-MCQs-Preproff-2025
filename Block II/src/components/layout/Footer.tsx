import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenAudit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAudit }) => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8 text-slate-500 dark:text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span>
            NUMS Block 5 Pre-Prof Question Bank • 2025 Comprehensive Medical Review
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={onOpenAudit}
            className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>514 MCQs Independently Verified</span>
          </button>
          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
            <span>Gray's • Guyton • Harper's</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
