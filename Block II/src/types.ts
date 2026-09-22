// Data models for NUMS Block 5 Pre-Prof MCQ Study Platform

export type SubjectId = 'anatomy' | 'physiology' | 'biochemistry';
export type VerificationStatus = 'verified' | 'corrected' | 'needs-review';

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface MCQ {
  id: string;
  collegeId: string;
  collegeName: string;
  subjectId: SubjectId;
  subjectName: 'Anatomy' | 'Physiology' | 'Biochemistry';
  originalQuestionNumber: number;
  rawSubjectHeading?: string;
  question: string;
  options: MCQOption[];
  sourceMarkedAnswer: string;
  verifiedCorrectAnswer: string;
  hint: string;
  explanation: string;
  verificationStatus: VerificationStatus;
  correctionMade: boolean;
  correctionReason?: string | null;
  sourcePage: number;
}

export interface CollegeInfo {
  id: string;
  name: string;
  fullName: string;
  city: string;
  accent: string;
  description: string;
  totalMCQs: number;
  anatomyCount: number;
  physiologyCount: number;
  biochemistryCount: number;
  availableSubjects: SubjectId[];
}

export interface SubjectStats {
  subjectId: SubjectId;
  subjectName: string;
  totalQuestions: number;
  quizzesAttempted: number;
  bestScore: number | null;
  latestScore: number | null;
  flashcardsViewed: number;
  completed: boolean;
}

export interface CollegeProgress {
  collegeId: string;
  subjects: Record<SubjectId, SubjectStats>;
}

export interface StudyProgressState {
  colleges: Record<string, CollegeProgress>;
  bookmarkedQuestionIds: string[];
}

export interface QuizState {
  collegeId: string;
  subjectId: SubjectId;
  questionIds: string[];
  currentIndex: number;
  userAnswers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  revealedHints: Record<string, boolean>;
  isSubmitted: boolean;
  startedAt: number;
  completedAt?: number;
}

export interface VerificationAuditItem {
  id: string;
  college: string;
  subject: string;
  questionNumber: number;
  questionStem: string;
  pdfMarkedAnswer: string;
  verifiedAnswer: string;
  status: VerificationStatus;
  correctionReason: string;
  reference?: string;
  page: number;
}
