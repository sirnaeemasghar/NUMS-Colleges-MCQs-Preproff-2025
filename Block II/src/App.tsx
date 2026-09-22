import React, { useState, useEffect } from 'react';
import { SubjectId, MCQ } from './types';
import { COLLEGE_MAP } from './data/colleges';
import { getQuestionsByCollegeAndSubject } from './data/questionBank';
import { Header } from './components/layout/Header';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { CollegeView } from './views/CollegeView';
import { SubjectStudyView } from './views/SubjectStudyView';
import { QuizContainer } from './components/quiz/QuizContainer';
import { FlashcardDeck } from './components/flashcards/FlashcardDeck';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { VerificationAuditModal } from './components/audit/VerificationAuditModal';
import { BookmarksModal } from './components/bookmarks/BookmarksModal';
import { QuestionInspectModal } from './components/modal/QuestionInspectModal';

interface RouteState {
  collegeId: string | null;
  subjectId: SubjectId | null;
  mode: 'quiz' | 'flashcards' | null;
}

export const App: React.FC = () => {
  const [route, setRoute] = useState<RouteState>({
    collegeId: null,
    subjectId: null,
    mode: null,
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [inspectedQuestion, setInspectedQuestion] = useState<MCQ | null>(null);

  // Parse URL hash on mount and on popstate/hashchange
  const parseHash = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) {
      setRoute({ collegeId: null, subjectId: null, mode: null });
      return;
    }

    const parts = hash.split('/');
    if (parts[0] === 'audit') {
      setIsAuditOpen(true);
      return;
    }
    if (parts[0] === 'bookmarks') {
      setIsBookmarksOpen(true);
      return;
    }

    if (parts[0] === 'college' && parts[1]) {
      const colId = parts[1];
      const subId = (parts[2] as SubjectId) || null;
      const mode = (parts[3] as 'quiz' | 'flashcards') || null;
      setRoute({ collegeId: colId, subjectId: subId, mode });
    }
  };

  useEffect(() => {
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  // Update hash when route changes
  const updateRoute = (newRoute: RouteState) => {
    setRoute(newRoute);
    if (!newRoute.collegeId) {
      window.location.hash = '';
    } else if (!newRoute.subjectId) {
      window.location.hash = `college/${newRoute.collegeId}`;
    } else if (!newRoute.mode) {
      window.location.hash = `college/${newRoute.collegeId}/${newRoute.subjectId}`;
    } else {
      window.location.hash = `college/${newRoute.collegeId}/${newRoute.subjectId}/${newRoute.mode}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation handlers
  const handleNavigateHome = () => {
    updateRoute({ collegeId: null, subjectId: null, mode: null });
  };

  const handleSelectCollege = (collegeId: string) => {
    updateRoute({ collegeId, subjectId: null, mode: null });
  };

  const handleSelectSubject = (collegeId: string, subjectId: SubjectId) => {
    updateRoute({ collegeId, subjectId, mode: null });
  };

  const handleStartQuiz = (collegeId: string, subjectId: SubjectId) => {
    updateRoute({ collegeId, subjectId, mode: 'quiz' });
  };

  const handleStartFlashcards = (collegeId: string, subjectId: SubjectId) => {
    updateRoute({ collegeId, subjectId, mode: 'flashcards' });
  };

  const currentCollege = route.collegeId ? COLLEGE_MAP[route.collegeId] : null;
  const currentQuestions =
    route.collegeId && route.subjectId
      ? getQuestionsByCollegeAndSubject(route.collegeId, route.subjectId)
      : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Global Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onNavigateHome={handleNavigateHome}
      />

      {/* Breadcrumb Navigation */}
      {route.collegeId && (
        <Breadcrumbs
          collegeId={route.collegeId}
          subjectId={route.subjectId}
          mode={route.mode}
          onNavigateHome={handleNavigateHome}
          onNavigateCollege={handleSelectCollege}
          onNavigateSubject={handleSelectSubject}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {!route.collegeId ? (
          <HomeView
            onSelectCollege={handleSelectCollege}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAudit={() => setIsAuditOpen(true)}
          />
        ) : !route.subjectId ? (
          <CollegeView
            collegeId={route.collegeId}
            onSelectSubject={handleSelectSubject}
            onBackToHome={handleNavigateHome}
            onStartQuiz={handleStartQuiz}
            onStartFlashcards={handleStartFlashcards}
          />
        ) : !route.mode ? (
          <SubjectStudyView
            collegeId={route.collegeId}
            subjectId={route.subjectId}
            totalQuestions={currentQuestions.length}
            onStartQuiz={() => handleStartQuiz(route.collegeId!, route.subjectId!)}
            onStartFlashcards={() => handleStartFlashcards(route.collegeId!, route.subjectId!)}
            onBackToCollege={() => handleSelectCollege(route.collegeId!)}
          />
        ) : route.mode === 'quiz' ? (
          <QuizContainer
            collegeId={route.collegeId}
            collegeName={currentCollege?.name || 'College'}
            subjectId={route.subjectId}
            subjectName={
              route.subjectId === 'anatomy'
                ? 'Anatomy'
                : route.subjectId === 'physiology'
                ? 'Physiology'
                : 'Biochemistry'
            }
            questions={currentQuestions}
            onBackToSubject={() => handleSelectSubject(route.collegeId!, route.subjectId!)}
            onStudyFlashcards={() => handleStartFlashcards(route.collegeId!, route.subjectId!)}
          />
        ) : (
          <FlashcardDeck
            collegeId={route.collegeId}
            collegeName={currentCollege?.name || 'College'}
            subjectId={route.subjectId}
            subjectName={
              route.subjectId === 'anatomy'
                ? 'Anatomy'
                : route.subjectId === 'physiology'
                ? 'Physiology'
                : 'Biochemistry'
            }
            questions={currentQuestions}
            onBackToSubject={() => handleSelectSubject(route.collegeId!, route.subjectId!)}
            onStartQuiz={() => handleStartQuiz(route.collegeId!, route.subjectId!)}
          />
        )}
      </main>

      {/* Academic Footer */}
      <Footer onOpenAudit={() => setIsAuditOpen(true)} />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectQuestion={(q) => setInspectedQuestion(q)}
        onGoToSubject={(cId, sId) => handleSelectSubject(cId, sId)}
      />

      {/* Medical Verification & Audit Report Modal */}
      <VerificationAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />

      {/* Bookmarked Questions Modal */}
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onSelectQuestion={(q) => setInspectedQuestion(q)}
        onGoToSubject={(cId, sId) => handleSelectSubject(cId, sId)}
      />

      {/* Single Question Inspection Modal */}
      <QuestionInspectModal
        question={inspectedQuestion}
        onClose={() => setInspectedQuestion(null)}
        onGoToSubject={(cId, sId) => handleSelectSubject(cId, sId)}
      />
    </div>
  );
};
