import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useStudyProgress } from '../../context/StudyProgressContext';
import { Moon, Sun, Search, ShieldCheck, Bookmark, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAudit: () => void;
  onOpenBookmarks: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAudit,
  onOpenBookmarks,
  onNavigateHome,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { getGlobalStats } = useStudyProgress();
  const stats = getGlobalStats();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-base tracking-tight">NUMS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Block 5 Pre-Prof
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                2025
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              9 Medical Colleges • 514 Verified MCQs
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search questions"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden md:inline">Search 514 MCQs...</span>
            <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            aria-label="View bookmarked questions"
            title={`${stats.bookmarkedCount} Bookmarked questions`}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bookmark className="w-5 h-5" />
            {stats.bookmarkedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {stats.bookmarkedCount}
              </span>
            )}
          </button>

          {/* Data Quality & Audit Report Button */}
          <button
            onClick={onOpenAudit}
            title="Data Quality & Medical Audit Report"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors border border-emerald-200 dark:border-emerald-800"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Audit Report</span>
          </button>

          {/* Dark/Light Mode Switch */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
