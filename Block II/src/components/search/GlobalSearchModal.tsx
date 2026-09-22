import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Brain, Activity, Dna, ArrowRight, ExternalLink } from 'lucide-react';
import { MCQ, SubjectId } from '../../types';
import { searchQuestions } from '../../data/questionBank';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (question: MCQ) => void;
  onGoToSubject: (collegeId: string, subjectId: SubjectId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectQuestion,
  onGoToSubject,
}) => {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [results, setResults] = useState<MCQ[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const res = searchQuestions(query);
    if (subjectFilter === 'all') {
      setResults(res.slice(0, 50));
    } else {
      setResults(res.filter((q) => q.subjectId === subjectFilter).slice(0, 50));
    }
  }, [query, subjectFilter]);

  if (!isOpen) return null;

  const subjectBadges = {
    anatomy: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
    physiology: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
    biochemistry: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 sm:pt-20 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Header Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 514 MCQs (e.g., 'Adamkiewicz', 'Wallenberg', 'HGPRT', 'allopurinol')..."
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Esc
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium shrink-0">Filter:</span>
          <button
            onClick={() => setSubjectFilter('all')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 ${
              subjectFilter === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Subjects
          </button>
          <button
            onClick={() => setSubjectFilter('anatomy')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
              subjectFilter === 'anatomy'
                ? 'bg-rose-600 text-white'
                : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Brain className="w-3 h-3" />
            <span>Anatomy</span>
          </button>
          <button
            onClick={() => setSubjectFilter('physiology')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
              subjectFilter === 'physiology'
                ? 'bg-teal-600 text-white'
                : 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Physiology</span>
          </button>
          <button
            onClick={() => setSubjectFilter('biochemistry')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors shrink-0 flex items-center gap-1 ${
              subjectFilter === 'biochemistry'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Dna className="w-3 h-3" />
            <span>Biochemistry</span>
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {query.trim().length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Instant Search across 514 MCQs
              </p>
              <p>Type any medical term, syndrome, drug, enzyme, or question number</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                No matching questions found
              </p>
              <p className="mt-1">Try searching a different keyword or removing filters</p>
            </div>
          ) : (
            results.map((q) => {
              const verifiedOpt = q.options.find((o) => o.id === q.verifiedCorrectAnswer);

              return (
                <div
                  key={q.id}
                  className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 hover:border-sky-400 dark:hover:border-sky-600 transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
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

                    <button
                      onClick={() => {
                        onGoToSubject(q.collegeId, q.subjectId);
                        onClose();
                      }}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>Study Subject</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed mb-2">
                    {q.question}
                  </p>

                  <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-slate-400 mr-1.5 font-medium">Answer:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {verifiedOpt ? `${q.verifiedCorrectAnswer}. ${verifiedOpt.text}` : q.verifiedCorrectAnswer}
                      </strong>
                    </div>

                    <button
                      onClick={() => {
                        onSelectQuestion(q);
                        onClose();
                      }}
                      className="px-2 py-1 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-bold hover:bg-sky-100 dark:hover:bg-sky-900 shrink-0 flex items-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Inspect</span>
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
