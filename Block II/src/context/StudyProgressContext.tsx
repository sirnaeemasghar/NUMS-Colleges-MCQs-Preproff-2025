import React, { createContext, useContext, useEffect, useState } from 'react';
import { SubjectId, SubjectStats, CollegeProgress, StudyProgressState } from '../types';
import { COLLEGES } from '../data/colleges';

interface StudyProgressContextType {
  progressState: StudyProgressState;
  getSubjectStats: (collegeId: string, subjectId: SubjectId) => SubjectStats;
  getCollegeStats: (collegeId: string) => {
    quizzesAttempted: number;
    quizzesCompleted: number;
    bestAverage: number | null;
    totalFlashcardsViewed: number;
    overallPercentage: number;
  };
  getGlobalStats: () => {
    totalQuizzesTaken: number;
    totalQuestionsPracticed: number;
    overallAccuracy: number;
    bookmarkedCount: number;
  };
  recordQuizResult: (
    collegeId: string,
    subjectId: SubjectId,
    score: number,
    total: number
  ) => void;
  recordFlashcardProgress: (
    collegeId: string,
    subjectId: SubjectId,
    viewedCount: number
  ) => void;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  resetSubjectProgress: (collegeId: string, subjectId: SubjectId) => void;
}

const STORAGE_KEY = 'nums_study_progress_v1';

const createDefaultCollegeProgress = (collegeId: string): CollegeProgress => {
  const college = COLLEGES.find((c) => c.id === collegeId);
  return {
    collegeId,
    subjects: {
      anatomy: {
        subjectId: 'anatomy',
        subjectName: 'Anatomy',
        totalQuestions: college?.anatomyCount || 0,
        quizzesAttempted: 0,
        bestScore: null,
        latestScore: null,
        flashcardsViewed: 0,
        completed: false,
      },
      physiology: {
        subjectId: 'physiology',
        subjectName: 'Physiology',
        totalQuestions: college?.physiologyCount || 0,
        quizzesAttempted: 0,
        bestScore: null,
        latestScore: null,
        flashcardsViewed: 0,
        completed: false,
      },
      biochemistry: {
        subjectId: 'biochemistry',
        subjectName: 'Biochemistry',
        totalQuestions: college?.biochemistryCount || 0,
        quizzesAttempted: 0,
        bestScore: null,
        latestScore: null,
        flashcardsViewed: 0,
        completed: false,
      },
    },
  };
};

const getInitialState = (): StudyProgressState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: StudyProgressState = JSON.parse(saved);
      // Ensure all current colleges exist in parsed state
      COLLEGES.forEach((c) => {
        if (!parsed.colleges[c.id]) {
          parsed.colleges[c.id] = createDefaultCollegeProgress(c.id);
        } else {
          // Update question counts in case
          parsed.colleges[c.id].subjects.anatomy.totalQuestions = c.anatomyCount;
          parsed.colleges[c.id].subjects.physiology.totalQuestions = c.physiologyCount;
          parsed.colleges[c.id].subjects.biochemistry.totalQuestions = c.biochemistryCount;
        }
      });
      return parsed;
    }
  } catch (e) {
    console.error('Failed to parse study progress from localStorage', e);
  }

  const defaultColleges: Record<string, CollegeProgress> = {};
  COLLEGES.forEach((c) => {
    defaultColleges[c.id] = createDefaultCollegeProgress(c.id);
  });

  return {
    colleges: defaultColleges,
    bookmarkedQuestionIds: [],
  };
};

const StudyProgressContext = createContext<StudyProgressContextType | undefined>(undefined);

export const StudyProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressState, setProgressState] = useState<StudyProgressState>(getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
    } catch (e) {
      console.error('Failed to save study progress to localStorage', e);
    }
  }, [progressState]);

  const getSubjectStats = (collegeId: string, subjectId: SubjectId): SubjectStats => {
    const college = progressState.colleges[collegeId];
    if (college && college.subjects[subjectId]) {
      return college.subjects[subjectId];
    }
    const defaultStats = createDefaultCollegeProgress(collegeId).subjects[subjectId];
    return defaultStats;
  };

  const getCollegeStats = (collegeId: string) => {
    const college = progressState.colleges[collegeId] || createDefaultCollegeProgress(collegeId);
    const subList = Object.values(college.subjects).filter((s) => s.totalQuestions > 0);

    let quizzesAttempted = 0;
    let quizzesCompleted = 0;
    let bestScores: number[] = [];
    let totalFlashcardsViewed = 0;

    subList.forEach((sub) => {
      quizzesAttempted += sub.quizzesAttempted;
      if (sub.completed) quizzesCompleted += 1;
      if (sub.bestScore !== null) {
        bestScores.push((sub.bestScore / sub.totalQuestions) * 100);
      }
      totalFlashcardsViewed += sub.flashcardsViewed;
    });

    const bestAverage =
      bestScores.length > 0
        ? Math.round(bestScores.reduce((a, b) => a + b, 0) / bestScores.length)
        : null;

    const overallPercentage =
      subList.length > 0
        ? Math.round((quizzesCompleted / subList.length) * 100)
        : 0;

    return {
      quizzesAttempted,
      quizzesCompleted,
      bestAverage,
      totalFlashcardsViewed,
      overallPercentage,
    };
  };

  const getGlobalStats = () => {
    let totalQuizzesTaken = 0;
    let totalQuestionsPracticed = 0;
    let totalScoreSum = 0;
    let totalScorePossible = 0;

    Object.values(progressState.colleges).forEach((col) => {
      Object.values(col.subjects).forEach((sub) => {
        totalQuizzesTaken += sub.quizzesAttempted;
        if (sub.latestScore !== null) {
          totalQuestionsPracticed += sub.totalQuestions;
          totalScoreSum += sub.latestScore;
          totalScorePossible += sub.totalQuestions;
        }
      });
    });

    const overallAccuracy =
      totalScorePossible > 0
        ? Math.round((totalScoreSum / totalScorePossible) * 100)
        : 0;

    return {
      totalQuizzesTaken,
      totalQuestionsPracticed,
      overallAccuracy,
      bookmarkedCount: progressState.bookmarkedQuestionIds.length,
    };
  };

  const recordQuizResult = (
    collegeId: string,
    subjectId: SubjectId,
    score: number,
    total: number
  ) => {
    setProgressState((prev) => {
      const col = prev.colleges[collegeId] || createDefaultCollegeProgress(collegeId);
      const sub = col.subjects[subjectId];

      const newBest = sub.bestScore === null ? score : Math.max(sub.bestScore, score);

      return {
        ...prev,
        colleges: {
          ...prev.colleges,
          [collegeId]: {
            ...col,
            subjects: {
              ...col.subjects,
              [subjectId]: {
                ...sub,
                quizzesAttempted: sub.quizzesAttempted + 1,
                latestScore: score,
                bestScore: newBest,
                completed: true,
              },
            },
          },
        },
      };
    });
  };

  const recordFlashcardProgress = (
    collegeId: string,
    subjectId: SubjectId,
    viewedCount: number
  ) => {
    setProgressState((prev) => {
      const col = prev.colleges[collegeId] || createDefaultCollegeProgress(collegeId);
      const sub = col.subjects[subjectId];

      return {
        ...prev,
        colleges: {
          ...prev.colleges,
          [collegeId]: {
            ...col,
            subjects: {
              ...col.subjects,
              [subjectId]: {
                ...sub,
                flashcardsViewed: Math.max(sub.flashcardsViewed, viewedCount),
              },
            },
          },
        },
      };
    });
  };

  const toggleBookmark = (questionId: string) => {
    setProgressState((prev) => {
      const isBookmarked = prev.bookmarkedQuestionIds.includes(questionId);
      return {
        ...prev,
        bookmarkedQuestionIds: isBookmarked
          ? prev.bookmarkedQuestionIds.filter((id) => id !== questionId)
          : [...prev.bookmarkedQuestionIds, questionId],
      };
    });
  };

  const isBookmarked = (questionId: string) => {
    return progressState.bookmarkedQuestionIds.includes(questionId);
  };

  const resetSubjectProgress = (collegeId: string, subjectId: SubjectId) => {
    setProgressState((prev) => {
      const col = prev.colleges[collegeId] || createDefaultCollegeProgress(collegeId);
      const sub = col.subjects[subjectId];

      return {
        ...prev,
        colleges: {
          ...prev.colleges,
          [collegeId]: {
            ...col,
            subjects: {
              ...col.subjects,
              [subjectId]: {
                ...sub,
                quizzesAttempted: 0,
                bestScore: null,
                latestScore: null,
                flashcardsViewed: 0,
                completed: false,
              },
            },
          },
        },
      };
    });
  };

  return (
    <StudyProgressContext.Provider
      value={{
        progressState,
        getSubjectStats,
        getCollegeStats,
        getGlobalStats,
        recordQuizResult,
        recordFlashcardProgress,
        toggleBookmark,
        isBookmarked,
        resetSubjectProgress,
      }}
    >
      {children}
    </StudyProgressContext.Provider>
  );
};

export const useStudyProgress = (): StudyProgressContextType => {
  const context = useContext(StudyProgressContext);
  if (!context) {
    throw new Error('useStudyProgress must be used within a StudyProgressProvider');
  }
  return context;
};
