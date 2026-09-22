import React from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { VERIFICATION_STATS, AUDIT_ITEMS } from '../../data/verificationReport';

interface VerificationAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationAuditModal: React.FC<VerificationAuditModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Data Quality & Medical Verification Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Comprehensive Audit of 101 PDF Pages Against Standard Textbooks
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Summary Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {VERIFICATION_STATS.totalQuestions}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">
                Total MCQs Extracted
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {VERIFICATION_STATS.answersConfirmed}
              </div>
              <div className="text-[11px] font-semibold text-emerald-700/80 dark:text-emerald-400/80 uppercase">
                PDF Answers Confirmed
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/40 text-center">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {VERIFICATION_STATS.answersCorrected}
              </div>
              <div className="text-[11px] font-semibold text-amber-700/80 dark:text-amber-400/80 uppercase">
                PDF Answers Corrected
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40 text-center">
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {VERIFICATION_STATS.answersNeedsReview}
              </div>
              <div className="text-[11px] font-semibold text-purple-700/80 dark:text-purple-400/80 uppercase">
                Flagged for Review
              </div>
            </div>
          </div>

          {/* Subject Breakdown Pill Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold">
            <div>
              <span className="text-slate-400 mr-1.5">Anatomy:</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">{VERIFICATION_STATS.anatomyQuestions} MCQs</span>
            </div>
            <div>
              <span className="text-slate-400 mr-1.5">Physiology:</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">{VERIFICATION_STATS.physiologyQuestions} MCQs</span>
            </div>
            <div>
              <span className="text-slate-400 mr-1.5">Biochemistry:</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">{VERIFICATION_STATS.biochemistryQuestions} MCQs</span>
            </div>
            <div>
              <span className="text-slate-400 mr-1.5">Colleges:</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">{VERIFICATION_STATS.totalColleges} Institutions</span>
            </div>
          </div>

          {/* Corrected & Audited Questions Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Independently Corrected & Reviewed Questions ({AUDIT_ITEMS.length})</span>
            </h3>

            <div className="space-y-3">
              {AUDIT_ITEMS.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {item.college} • {item.subject} Q#{item.questionNumber}
                      </span>
                      <span className="text-slate-400">Page {item.page}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      item.status === 'corrected'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="font-medium text-slate-900 dark:text-slate-100 leading-relaxed text-sm">
                    {item.questionStem}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-800 dark:text-rose-300">
                      <span className="font-bold block text-[10px] uppercase text-rose-600 dark:text-rose-400">
                        PDF Marked Answer (Source Key):
                      </span>
                      <span className="font-mono text-xs font-bold">Option {item.pdfMarkedAnswer}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                      <span className="font-bold block text-[10px] uppercase text-emerald-600 dark:text-emerald-400">
                        Verified Correct Answer (Medical Standard):
                      </span>
                      <span className="font-mono text-xs font-bold">Option {item.verifiedAnswer}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    <strong className="text-slate-900 dark:text-white">Medical Rationale: </strong>
                    {item.correctionReason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
          <span>All scoring strictly utilizes verified answers. Original PDF answers preserved for auditing.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-semibold hover:opacity-90 transition-opacity"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
