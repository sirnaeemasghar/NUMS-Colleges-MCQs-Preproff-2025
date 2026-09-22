import React from 'react';
import { COLLEGE_MAP } from '../data/colleges';
import { SubjectCard } from '../components/college/SubjectCard';
import { SubjectId } from '../types';
import { ArrowLeft, Award, BookOpen, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useStudyProgress } from '../context/StudyProgressContext';

interface CollegeViewProps {
  collegeId: string;
  onSelectSubject: (collegeId: string, subjectId: SubjectId) => void;
  onBackToHome: () => void;
  onStartQuiz: (collegeId: string, subjectId: SubjectId) => void;
  onStartFlashcards: (collegeId: string, subjectId: SubjectId) => void;
}

export const CollegeView: React.FC<CollegeViewProps> = ({
  collegeId,
  onSelectSubject,
  onBackToHome,
  onStartQuiz,
  onStartFlashcards,
}) => {
  const college = COLLEGE_MAP[collegeId];
  const { getCollegeStats } = useStudyProgress();
  const stats = getCollegeStats(collegeId);

  if (!college) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">College not found.</p>
        <button
          onClick={onBackToHome}
          className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All Colleges</span>
      </button>

      {/* College Hero Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              {college.city} Cantonment
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {college.name} — {college.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {college.description}
            </p>
          </div>

          {/* Quick Stats Pill Panel */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {college.totalMCQs}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">
                Total MCQs
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.quizzesCompleted}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">
                Completed
              </div>
            </div>
          </div>
        </div>

        {/* Note if college only has one subject (e.g. HITEC) */}
        {college.availableSubjects.length < 3 && (
          <div className="mt-4 p-3 rounded-xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40 text-xs text-sky-800 dark:text-sky-300 font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sky-500 shrink-0" />
            <span>
              Source Note: In the official 2025 PDF, {college.name} provided an extensive Anatomy paper (27 MCQs covering Brainstem, Spinal Cord & Vascular Lesions).
            </span>
          </div>
        )}
      </div>

      {/* Section Title */}
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-4">
        Choose Subject to Study
      </h2>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {college.anatomyCount > 0 && (
          <SubjectCard
            collegeId={college.id}
            subjectId="anatomy"
            subjectName="Anatomy"
            totalQuestions={college.anatomyCount}
            onStartQuiz={onStartQuiz}
            onStartFlashcards={onStartFlashcards}
          />
        )}

        {college.physiologyCount > 0 && (
          <SubjectCard
            collegeId={college.id}
            subjectId="physiology"
            subjectName="Physiology"
            totalQuestions={college.physiologyCount}
            onStartQuiz={onStartQuiz}
            onStartFlashcards={onStartFlashcards}
          />
        )}

        {college.biochemistryCount > 0 && (
          <SubjectCard
            collegeId={college.id}
            subjectId="biochemistry"
            subjectName="Biochemistry"
            totalQuestions={college.biochemistryCount}
            onStartQuiz={onStartQuiz}
            onStartFlashcards={onStartFlashcards}
          />
        )}
      </div>
    </div>
  );
};
