import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { SubjectId } from '../../types';
import { COLLEGE_MAP } from '../../data/colleges';

interface BreadcrumbsProps {
  collegeId?: string | null;
  subjectId?: SubjectId | null;
  mode?: 'quiz' | 'flashcards' | 'review' | null;
  onNavigateHome: () => void;
  onNavigateCollege: (collegeId: string) => void;
  onNavigateSubject?: (collegeId: string, subjectId: SubjectId) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  collegeId,
  subjectId,
  mode,
  onNavigateHome,
  onNavigateCollege,
  onNavigateSubject,
}) => {
  const college = collegeId ? COLLEGE_MAP[collegeId] : null;

  const subjectTitles: Record<SubjectId, string> = {
    anatomy: 'Anatomy',
    physiology: 'Physiology',
    biochemistry: 'Biochemistry',
  };

  return (
    <nav aria-label="Breadcrumb" className="py-2.5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Colleges</span>
      </button>

      {college && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => onNavigateCollege(college.id)}
            className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
              !subjectId ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            {college.name}
          </button>
        </>
      )}

      {college && subjectId && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <button
            onClick={() => onNavigateSubject?.(college.id, subjectId)}
            className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
              !mode ? 'text-slate-900 dark:text-white font-semibold' : ''
            }`}
          >
            {subjectTitles[subjectId]}
          </button>
        </>
      )}

      {mode && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 dark:text-white font-semibold capitalize">
            {mode === 'quiz' ? 'MCQ Quiz' : mode === 'flashcards' ? 'Flashcards' : 'Answer Review'}
          </span>
        </>
      )}
    </nav>
  );
};
