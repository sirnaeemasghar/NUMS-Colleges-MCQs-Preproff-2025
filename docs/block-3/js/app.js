/**
 * NUMS Block 6 Preprof MCQs Study Platform - Main Application
 * Handles routing, college/subject navigation, Quiz engine, Flashcard engine, and state.
 */

(function() {
  'use strict';

  // Application State
  const state = {
    view: 'colleges', // 'colleges' | 'subject' | 'quiz' | 'flashcards' | 'review' | 'audit'
    currentCollege: null,
    currentSubject: null,
    currentQuestions: [],
    
    // Quiz State
    quiz: {
      currentIndex: 0,
      userAnswers: {}, // { [qId]: { selectedOption, isSubmitted, usedHint } }
      isCompleted: false
    },

    // Flashcard State
    flashcards: {
      currentIndex: 0,
      isFlipped: false,
      bookmarkedIds: new Set(),
      onlyBookmarked: false,
      deck: []
    },

    // Global Search State
    searchQuery: '',
    theme: localStorage.getItem('nums_theme') || 'light'
  };

  // Initialize Bookmarks from localStorage
  try {
    const savedBookmarks = localStorage.getItem('nums_mcq_bookmarks');
    if (savedBookmarks) {
      state.flashcards.bookmarkedIds = new Set(JSON.parse(savedBookmarks));
    }
  } catch (e) {
    console.error('Error loading bookmarks', e);
  }

  function saveBookmarks() {
    localStorage.setItem('nums_mcq_bookmarks', JSON.stringify([...state.flashcards.bookmarkedIds]));
  }

  // Quiz Progress Persistence
  function getQuizStorageKey(college, subject) {
    return `nums_quiz_${college}_${subject}`.replace(/\s+/g, '_');
  }

  function saveQuizProgress() {
    if (!state.currentCollege || !state.currentSubject) return;
    const key = getQuizStorageKey(state.currentCollege, state.currentSubject);
    localStorage.setItem(key, JSON.stringify({
      currentIndex: state.quiz.currentIndex,
      userAnswers: state.quiz.userAnswers,
      isCompleted: state.quiz.isCompleted
    }));
  }

  function loadQuizProgress(college, subject) {
    const key = getQuizStorageKey(college, subject);
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading quiz progress', e);
    }
    return null;
  }

  function clearQuizProgress(college, subject) {
    const key = getQuizStorageKey(college, subject);
    localStorage.removeItem(key);
  }

  // Get active dataset applying human overrides
  function getActiveQuestions() {
    if (window.MCQ_REVIEW && typeof window.MCQ_REVIEW.getQuestionsWithOverrides === 'function') {
      return window.MCQ_REVIEW.getQuestionsWithOverrides();
    }
    return window.MCQ_DATA ? window.MCQ_DATA.questions : [];
  }

  // DOM Elements
  const elContent = document.getElementById('mainContentContainer');
  const elBreadcrumbs = document.getElementById('breadcrumbsNav');
  const elThemeToggle = document.getElementById('themeToggleBtn');
  const elNavHome = document.getElementById('navHome');
  const elNavReview = document.getElementById('navReview');
  const elNavAudit = document.getElementById('navAudit');

  // Apply Theme
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nums_theme', theme);
    if (elThemeToggle) {
      elThemeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      elThemeToggle.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }

  if (elThemeToggle) {
    elThemeToggle.addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
    });
  }
  applyTheme(state.theme);

  // Top Nav Handlers
  function updateActiveNav(view) {
    [elNavHome, elNavReview, elNavAudit].forEach(btn => btn && btn.classList.remove('active'));
    if (view === 'colleges' || view === 'subject' || view === 'quiz' || view === 'flashcards') {
      elNavHome && elNavHome.classList.add('active');
    } else if (view === 'review') {
      elNavReview && elNavReview.classList.add('active');
    } else if (view === 'audit') {
      elNavAudit && elNavAudit.classList.add('active');
    }
  }

  if (elNavHome) elNavHome.addEventListener('click', () => navigateToColleges());
  if (elNavReview) elNavReview.addEventListener('click', () => navigateToReview());
  if (elNavAudit) elNavAudit.addEventListener('click', () => navigateToAudit());

  // Breadcrumbs Renderer
  function updateBreadcrumbs() {
    if (!elBreadcrumbs) return;

    const parts = [
      `<span class="breadcrumb-item" data-action="home">Colleges Hub</span>`
    ];

    if (state.view === 'colleges') {
      elBreadcrumbs.innerHTML = `<span class="breadcrumb-current">All Medical Colleges</span>`;
      return;
    }

    if (state.view === 'review') {
      elBreadcrumbs.innerHTML = `${parts[0]} <span class="breadcrumb-sep">&gt;</span> <span class="breadcrumb-current">Answer Verification & Discrepancy Inspector</span>`;
      return;
    }

    if (state.view === 'audit') {
      elBreadcrumbs.innerHTML = `${parts[0]} <span class="breadcrumb-sep">&gt;</span> <span class="breadcrumb-current">Import Audit & Verification Report</span>`;
      return;
    }

    if (state.currentCollege) {
      parts.push(`<span class="breadcrumb-sep">&gt;</span>`);
      if (state.view === 'subject') {
        parts.push(`<span class="breadcrumb-current">${state.currentCollege}</span>`);
      } else {
        parts.push(`<span class="breadcrumb-item" data-action="college" data-college="${state.currentCollege}">${state.currentCollege}</span>`);
      }
    }

    if (state.currentSubject && state.view !== 'subject') {
      parts.push(`<span class="breadcrumb-sep">&gt;</span>`);
      parts.push(`<span class="breadcrumb-item" data-action="subject" data-college="${state.currentCollege}" data-subject="${state.currentSubject}">${state.currentSubject}</span>`);
      parts.push(`<span class="breadcrumb-sep">&gt;</span>`);
      parts.push(`<span class="breadcrumb-current">${state.view === 'quiz' ? 'Take Quiz' : 'Study Flashcards'}</span>`);
    }

    elBreadcrumbs.innerHTML = parts.join(' ');

    // Attach breadcrumb click actions
    elBreadcrumbs.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        if (action === 'home') navigateToColleges();
        else if (action === 'college') navigateToSubjectHub(item.getAttribute('data-college'), null);
        else if (action === 'subject') navigateToSubjectHub(item.getAttribute('data-college'), item.getAttribute('data-subject'));
      });
    });
  }

  // Navigation Functions
  function navigateToColleges() {
    state.view = 'colleges';
    state.currentCollege = null;
    state.currentSubject = null;
    state.searchQuery = '';
    updateActiveNav('colleges');
    updateBreadcrumbs();
    renderCollegesView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToSubjectHub(college, subject) {
    state.view = 'subject';
    state.currentCollege = college;
    
    // If no subject selected yet, pick the first subject present in this college
    const collegeData = window.MCQ_DATA.colleges.find(c => c.name === college);
    if (!subject && collegeData && collegeData.subjects.length > 0) {
      state.currentSubject = collegeData.subjects[0].name;
    } else {
      state.currentSubject = subject;
    }

    state.currentQuestions = getActiveQuestions().filter(
      q => q.college === state.currentCollege && q.subject === state.currentSubject
    );

    updateActiveNav('colleges');
    updateBreadcrumbs();
    renderSubjectHubView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToQuiz(college, subject) {
    state.view = 'quiz';
    state.currentCollege = college;
    state.currentSubject = subject;
    state.currentQuestions = getActiveQuestions().filter(
      q => q.college === college && q.subject === subject
    );

    // Check for saved progress
    const saved = loadQuizProgress(college, subject);
    if (saved) {
      state.quiz = saved;
    } else {
      state.quiz = {
        currentIndex: 0,
        userAnswers: {},
        isCompleted: false
      };
    }

    updateActiveNav('colleges');
    updateBreadcrumbs();
    renderQuizView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToFlashcards(college, subject) {
    state.view = 'flashcards';
    state.currentCollege = college;
    state.currentSubject = subject;
    state.currentQuestions = getActiveQuestions().filter(
      q => q.college === college && q.subject === subject
    );

    state.flashcards.deck = [...state.currentQuestions];
    state.flashcards.currentIndex = 0;
    state.flashcards.isFlipped = false;
    state.flashcards.onlyBookmarked = false;

    updateActiveNav('colleges');
    updateBreadcrumbs();
    renderFlashcardView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToReview() {
    state.view = 'review';
    updateActiveNav('review');
    updateBreadcrumbs();
    if (window.MCQ_REVIEW && typeof window.MCQ_REVIEW.renderReviewView === 'function') {
      window.MCQ_REVIEW.renderReviewView(elContent);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigateToAudit() {
    state.view = 'audit';
    updateActiveNav('audit');
    updateBreadcrumbs();
    renderAuditView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================================================
  // VIEW RENDERERS
  // ==========================================================================

  // 1. Colleges Hub View
  function renderCollegesView() {
    const allQ = getActiveQuestions();
    const colleges = window.MCQ_DATA.colleges;

    // Calculate metrics
    const totalCount = allQ.length;
    const verifiedCount = allQ.filter(q => q.verification_status === 'verified').length;
    const reviewCount = allQ.filter(q => q.verification_status === 'needs_review' || Boolean(q.flag_reason)).length;

    elContent.innerHTML = `
      <div class="hero-banner">
        <h1 class="hero-title">NUMS Block 6 Preprofessional MCQs</h1>
        <p class="hero-subtitle">
          Interactive study and testing system covering all 372 authentic past examination questions from 9 NUMS colleges across Anatomy, Physiology, and Biochemistry.
        </p>
        <div class="search-box-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" id="globalSearchInput" class="search-input" placeholder="Search any medical question, option, anatomy structure, or enzyme..." value="${state.searchQuery}">
        </div>
      </div>

      <div class="stats-banner">
        <div class="stat-card">
          <div class="stat-val">${totalCount}</div>
          <div class="stat-label">Total Authentic MCQs</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">9</div>
          <div class="stat-label">Medical Colleges</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" style="color: var(--verified-badge);">${verifiedCount}</div>
          <div class="stat-label">Medically Verified</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" style="color: var(--review-badge);">${reviewCount}</div>
          <div class="stat-label">Flagged for Review</div>
        </div>
      </div>

      <div id="searchResultsContainer" style="display: none; margin-bottom: 2.5rem;"></div>

      <div id="collegesSectionWrapper">
        <div class="section-title-bar">
          <h2 class="section-heading">
            <span>🏛️</span> Select Medical College
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            Showing only subjects actually present in each college's exam section
          </span>
        </div>

        <div class="colleges-grid">
          ${colleges.map(col => `
            <div class="college-card" data-college="${col.name}">
              <div class="college-header">
                <div>
                  <h3 class="college-name">${col.name}</h3>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">${col.subjects.length} ${col.subjects.length === 1 ? 'Subject' : 'Subjects'}</span>
                </div>
                <span class="college-total-badge">${col.total_questions} Questions</span>
              </div>

              <div class="college-subjects-list">
                ${col.subjects.map(sub => `
                  <div class="subject-item-row" data-college="${col.name}" data-subject="${sub.name}">
                    <span class="subject-name">
                      ${sub.name === 'Anatomy' ? '🧠' : (sub.name === 'Physiology' ? '⚙️' : '🧬')}
                      ${sub.name}
                      ${sub.subtitles && sub.subtitles.length ? `<small style="font-weight: normal; color: var(--text-muted);">(${sub.subtitles[0]})</small>` : ''}
                    </span>
                    <span class="subject-count">${sub.count} MCQs (pp. ${sub.page_range})</span>
                  </div>
                `).join('')}
              </div>

              <div class="college-actions">
                <button class="btn btn-primary btn-sm open-college-btn" data-college="${col.name}" style="flex: 1;">
                  Open College Section &rarr;
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Global Search Interaction
    const searchInput = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('searchResultsContainer');
    const collegesWrapper = document.getElementById('collegesSectionWrapper');

    function handleSearch() {
      const query = searchInput.value.trim().toLowerCase();
      state.searchQuery = query;

      if (!query) {
        searchResults.style.display = 'none';
        collegesWrapper.style.display = 'block';
        return;
      }

      collegesWrapper.style.display = 'none';
      searchResults.style.display = 'block';

      const matches = allQ.filter(q => {
        const text = `${q.id} ${q.college} ${q.subject} ${q.question} ${q.explanation || ''} ${q.options.map(o => o.text).join(' ')}`.toLowerCase();
        return text.includes(query);
      });

      searchResults.innerHTML = `
        <div class="section-title-bar">
          <h2 class="section-heading">Search Results (${matches.length} matches for "${query}")</h2>
          <button id="clearSearchBtn" class="btn btn-secondary btn-sm">Clear Search</button>
        </div>

        ${matches.length === 0 ? `
          <div style="background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 2rem; text-align: center; color: var(--text-muted);">
            No questions found matching "${query}". Try searching for anatomical terms, nerves, enzymes, or diseases.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${matches.slice(0, 50).map(q => `
              <div class="college-card" style="cursor: default;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
                  <div>
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--primary);">${q.id} &bull; Page ${q.pdf_page}</span>
                    <h4 style="font-size: 1.05rem; font-weight: 700; margin-top: 0.2rem;">${q.college} &bull; ${q.subject}</h4>
                  </div>
                  <span class="badge ${q.verification_status === 'verified' ? 'badge-verified' : (q.verification_status === 'needs_review' ? 'badge-review' : 'badge-provisional')}">
                    ${q.verification_status.replace('_', ' ')}
                  </span>
                </div>

                <p style="font-size: 1rem; font-weight: 600; margin: 0.5rem 0;">${q.question}</p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; font-size: 0.85rem;">
                  ${q.options.map(opt => `
                    <div style="padding: 0.35rem 0.5rem; border-radius: var(--radius-sm); background-color: ${opt.label === q.verified_answer ? 'var(--correct-bg)' : 'var(--bg-subtle)'}; border: 1px solid ${opt.label === q.verified_answer ? 'var(--correct-border)' : 'var(--border-color)'};">
                      <strong>${opt.label}.</strong> ${opt.text}
                      ${opt.label === q.verified_answer ? ' <span style="color:var(--verified-badge); font-weight:700;">✓</span>' : ''}
                    </div>
                  `).join('')}
                </div>

                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                  <button class="btn btn-outline-primary btn-sm jump-to-quiz-btn" data-college="${q.college}" data-subject="${q.subject}">
                    Open in Subject Quiz &rarr;
                  </button>
                </div>
              </div>
            `).join('')}
            ${matches.length > 50 ? `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem;">Showing first 50 of ${matches.length} matches. Refine your query for more specific results.</div>` : ''}
          </div>
        `}
      `;

      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          handleSearch();
        });
      }

      searchResults.querySelectorAll('.jump-to-quiz-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          navigateToQuiz(btn.getAttribute('data-college'), btn.getAttribute('data-subject'));
        });
      });
    }

    searchInput.addEventListener('input', handleSearch);

    // Card click handlers
    elContent.querySelectorAll('.college-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // If clicked on subject row specifically
        const subjectRow = e.target.closest('.subject-item-row');
        if (subjectRow) {
          const col = subjectRow.getAttribute('data-college');
          const sub = subjectRow.getAttribute('data-subject');
          navigateToSubjectHub(col, sub);
          return;
        }

        const colName = card.getAttribute('data-college');
        navigateToSubjectHub(colName, null);
      });
    });
  }

  // 2. Subject Hub View (College -> Subject -> Quiz or Flashcards)
  function renderSubjectHubView() {
    const collegeData = window.MCQ_DATA.colleges.find(c => c.name === state.currentCollege);
    if (!collegeData) {
      navigateToColleges();
      return;
    }

    const availableSubjects = collegeData.subjects;
    const currentSubData = availableSubjects.find(s => s.name === state.currentSubject) || availableSubjects[0];
    state.currentSubject = currentSubData.name;

    const questions = getActiveQuestions().filter(
      q => q.college === state.currentCollege && q.subject === state.currentSubject
    );

    const verifiedCount = questions.filter(q => q.verification_status === 'verified').length;
    const reviewCount = questions.filter(q => q.verification_status === 'needs_review' || Boolean(q.flag_reason)).length;
    const provisionalCount = questions.length - verifiedCount - reviewCount;

    // Check for existing quiz progress
    const quizProgress = loadQuizProgress(state.currentCollege, state.currentSubject);

    elContent.innerHTML = `
      <div class="subject-hub-header">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
              <span class="badge badge-verified" style="font-size: 0.75rem;">${state.currentCollege}</span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">PDF Pages ${currentSubData.page_range}</span>
            </div>
            <h1 class="subject-hub-title">${state.currentSubject}</h1>
            <p class="subject-hub-subtitle">
              ${questions.length} authentic questions from the ${state.currentCollege} examination section. Choose your learning mode below.
            </p>
          </div>

          <!-- Subject Selector Tabs for this college -->
          ${availableSubjects.length > 1 ? `
            <div style="display: flex; gap: 0.4rem; background-color: var(--bg-subtle); padding: 0.35rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); flex-wrap: wrap;">
              ${availableSubjects.map(s => `
                <button class="nav-btn ${s.name === state.currentSubject ? 'active' : ''} sub-tab-btn" data-subject="${s.name}">
                  ${s.name === 'Anatomy' ? '🧠' : (s.name === 'Physiology' ? '⚙️' : '🧬')} ${s.name} (${s.count})
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; font-size: 0.85rem; border-top: 1px solid var(--border-color); padding-top: 0.85rem;">
          <span style="color: var(--verified-text); font-weight: 600;">✓ ${verifiedCount} Verified</span>
          <span style="color: var(--provisional-text); font-weight: 600;">⏳ ${provisionalCount} Provisional</span>
          ${reviewCount > 0 ? `<span style="color: var(--review-text); font-weight: 600;">⚠️ ${reviewCount} Needs Review</span>` : ''}
        </div>
      </div>

      <div class="mode-selection-grid">
        <div class="mode-choice-card" id="startQuizCard">
          <div class="mode-icon-circle">📝</div>
          <div>
            <h3 class="mode-title">Take Quiz</h3>
            <p class="mode-desc">
              Test yourself one question at a time. Request clinical hints, submit your answer, and receive immediate verified explanations with textbook references.
            </p>
          </div>
          ${quizProgress && !quizProgress.isCompleted ? `
            <div style="font-size: 0.8rem; background-color: var(--primary-light); color: var(--primary); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); font-weight: 600;">
              In Progress: Question ${quizProgress.currentIndex + 1} of ${questions.length}
            </div>
          ` : ''}
          <button class="btn btn-primary" style="margin-top: auto;">
            ${quizProgress && !quizProgress.isCompleted ? 'Resume Quiz &rarr;' : 'Start Quiz &rarr;'}
          </button>
        </div>

        <div class="mode-choice-card" id="startFlashcardsCard">
          <div class="mode-icon-circle">🎴</div>
          <div>
            <h3 class="mode-title">Study Flashcards</h3>
            <p class="mode-desc">
              Reinforce high-yield recall with interactive 3D flip cards. View questions on the front, verified answers and rationale on the back, and bookmark cards for targeted review.
            </p>
          </div>
          <button class="btn btn-secondary" style="margin-top: auto;">
            Launch Flashcards &rarr;
          </button>
        </div>
      </div>

      <!-- Question Preview List -->
      <div class="section-title-bar">
        <h3 class="section-heading">Question Directory (${questions.length} MCQs)</h3>
        <span style="font-size: 0.85rem; color: var(--text-muted);">PDF pages ${currentSubData.page_range}</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${questions.map((q, idx) => `
          <div style="background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 260px;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;">
                <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--primary);">${q.id}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Page ${q.pdf_page}</span>
                <span class="badge ${q.verification_status === 'verified' ? 'badge-verified' : (q.verification_status === 'needs_review' ? 'badge-review' : 'badge-provisional')}" style="font-size: 0.65rem;">
                  ${q.verification_status.replace('_', ' ')}
                </span>
              </div>
              <div style="font-size: 0.95rem; font-weight: 600; color: var(--text-primary);">${idx + 1}. ${q.question}</div>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm preview-quiz-jump" data-index="${idx}">
                Quiz from here &rarr;
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Event Handlers
    document.getElementById('startQuizCard').addEventListener('click', () => {
      navigateToQuiz(state.currentCollege, state.currentSubject);
    });

    document.getElementById('startFlashcardsCard').addEventListener('click', () => {
      navigateToFlashcards(state.currentCollege, state.currentSubject);
    });

    elContent.querySelectorAll('.sub-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigateToSubjectHub(state.currentCollege, btn.getAttribute('data-subject'));
      });
    });

    elContent.querySelectorAll('.preview-quiz-jump').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        navigateToQuiz(state.currentCollege, state.currentSubject);
        state.quiz.currentIndex = idx;
        renderQuizView();
      });
    });
  }

  // 3. Quiz Mode Engine
  function renderQuizView() {
    const questions = state.currentQuestions;
    if (questions.length === 0) {
      navigateToSubjectHub(state.currentCollege, state.currentSubject);
      return;
    }

    const totalQ = questions.length;
    const currentIndex = Math.min(Math.max(state.quiz.currentIndex, 0), totalQ - 1);
    state.quiz.currentIndex = currentIndex;

    const q = questions[currentIndex];
    const userState = state.quiz.userAnswers[q.id] || {
      selectedOption: null,
      isSubmitted: false,
      usedHint: false
    };

    // Calculate answered count for progress
    const answeredCount = Object.keys(state.quiz.userAnswers).filter(k => state.quiz.userAnswers[k].isSubmitted).length;
    const progressPct = Math.round((answeredCount / totalQ) * 100);

    elContent.innerHTML = `
      <div class="quiz-container">
        <!-- Top Toolbar -->
        <div class="quiz-top-bar">
          <div>
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em;">
              ${state.currentCollege} &bull; ${state.currentSubject} Quiz
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">PDF Page ${q.pdf_page} &bull; ID: ${q.id}</div>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="togglePaletteBtn" class="btn btn-secondary btn-sm" title="Toggle Question Navigator">
              📋 Navigator (${answeredCount}/${totalQ})
            </button>
            <button id="finishQuizBtn" class="btn btn-outline-primary btn-sm">
              🏁 Summary / Finish
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="quiz-progress-wrap">
          <div class="quiz-progress-info">
            <span>Question ${currentIndex + 1} of ${totalQ}</span>
            <span>${progressPct}% Completed</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
          </div>
        </div>

        <!-- Collapsible Question Palette -->
        <div id="paletteDrawer" class="palette-container" style="display: none; margin-bottom: 0.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-size: 0.85rem; font-weight: 700;">Question Navigator</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Jump directly to any question</span>
          </div>
          <div class="palette-grid">
            ${questions.map((item, idx) => {
              const ans = state.quiz.userAnswers[item.id];
              let statusClass = '';
              if (idx === currentIndex) statusClass += ' current';
              if (ans && ans.isSubmitted) {
                if (item.verification_status === 'needs_review') {
                  statusClass += ' unresolved';
                } else if (ans.selectedOption && ans.selectedOption.toUpperCase() === item.verified_answer.toUpperCase()) {
                  statusClass += ' correct';
                } else {
                  statusClass += ' incorrect';
                }
              }
              return `
                <button class="palette-item ${statusClass}" data-index="${idx}">
                  ${idx + 1}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Question Card -->
        <div class="quiz-card">
          <div class="question-header">
            <div class="question-meta">
              <span>Question ${currentIndex + 1}</span>
              <span>&bull;</span>
              <span class="badge ${q.verification_status === 'verified' ? 'badge-verified' : (q.verification_status === 'needs_review' ? 'badge-review' : 'badge-provisional')}">
                ${q.verification_status.replace('_', ' ')}
              </span>
            </div>

            ${!userState.isSubmitted ? `
              <button id="requestHintBtn" class="btn btn-secondary btn-sm" style="color: var(--secondary);">
                💡 Request Clinical Hint
              </button>
            ` : ''}
          </div>

          <div class="question-text">
            ${q.question}
          </div>

          <!-- Hint display if active -->
          <div id="hintContainer" style="${userState.usedHint ? 'display: block;' : 'display: none;'}">
            <div class="hint-box">
              <span style="font-size: 1.1rem;">💡</span>
              <div>
                <strong>Clinical Reasoning Hint:</strong>
                <p style="margin-top: 0.2rem;">${q.hint || 'Carefully recall the relevant physiological or anatomical relationship.'}</p>
              </div>
            </div>
          </div>

          <!-- Options List -->
          <div class="options-group">
            ${q.options.map(opt => {
              const isSelected = userState.selectedOption === opt.label;
              let optionClass = 'option-btn';
              if (isSelected) optionClass += ' selected';

              if (userState.isSubmitted) {
                const isVerifiedMatch = opt.label.toUpperCase() === (q.verified_answer || '').toUpperCase();
                if (isVerifiedMatch) {
                  optionClass += ' is-correct';
                } else if (isSelected) {
                  optionClass += ' is-incorrect';
                }
              }

              return `
                <button class="${optionClass}" data-label="${opt.label}" ${userState.isSubmitted ? 'disabled' : ''}>
                  <div class="option-label-badge">${opt.label}</div>
                  <div class="option-text">${opt.text}</div>
                  ${userState.isSubmitted && opt.label.toUpperCase() === (q.verified_answer || '').toUpperCase() ? `
                    <span style="font-size: 1rem; color: #10b981; font-weight: 700;">✓</span>
                  ` : ''}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Post-Submission Feedback Card -->
          ${userState.isSubmitted ? `
            <div class="feedback-card ${
              q.verification_status === 'needs_review' ? 'status-unresolved' :
              (userState.selectedOption && userState.selectedOption.toUpperCase() === q.verified_answer.toUpperCase() ? 'status-correct' : 'status-incorrect')
            }">
              <div class="feedback-header">
                <span>
                  ${q.verification_status === 'needs_review' ? '⚠️ Question Under Medical Review' :
                    (userState.selectedOption && userState.selectedOption.toUpperCase() === q.verified_answer.toUpperCase() ? '✓ Correct Answer!' : '✗ Incorrect')}
                </span>
                <span style="font-size: 0.85rem; font-weight: 600;">
                  Verified: Option ${q.verified_answer}
                  ${q.pdf_marked && q.pdf_marked.toUpperCase() !== q.verified_answer.toUpperCase() ? `(PDF Mark: Option ${q.pdf_marked})` : ''}
                </span>
              </div>

              <div class="feedback-explanation">
                <strong>Medical Explanation:</strong> ${q.explanation}
              </div>

              ${q.flag_reason ? `
                <div style="font-size: 0.8rem; background-color: rgba(244, 63, 94, 0.1); color: var(--review-text); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--review-border);">
                  <strong>Review Flag:</strong> ${q.flag_reason}
                </div>
              ` : ''}

              <div class="feedback-source">
                <strong>Source:</strong> ${q.source || 'Standard NUMS Curriculum References'}
              </div>
            </div>
          ` : ''}

          <!-- Footer Actions -->
          <div class="quiz-footer-actions">
            <button id="prevQuestionBtn" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>
              &larr; Previous
            </button>

            <div style="display: flex; gap: 0.5rem;">
              ${!userState.isSubmitted ? `
                <button id="submitAnswerBtn" class="btn btn-primary" ${!userState.selectedOption ? 'disabled' : ''}>
                  Submit Answer
                </button>
              ` : `
                <button id="nextQuestionBtn" class="btn btn-primary">
                  ${currentIndex < totalQ - 1 ? 'Next Question &rarr;' : 'Finish Quiz &rarr;'}
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    // Event Listeners for Quiz Card
    const optionBtns = elContent.querySelectorAll('.option-btn');
    const submitBtn = document.getElementById('submitAnswerBtn');
    const requestHintBtn = document.getElementById('requestHintBtn');
    const prevBtn = document.getElementById('prevQuestionBtn');
    const nextBtn = document.getElementById('nextQuestionBtn');
    const togglePaletteBtn = document.getElementById('togglePaletteBtn');
    const finishBtn = document.getElementById('finishQuizBtn');
    const paletteDrawer = document.getElementById('paletteDrawer');

    // Option Selection
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (userState.isSubmitted) return;
        const label = btn.getAttribute('data-label');
        userState.selectedOption = label;
        state.quiz.userAnswers[q.id] = userState;
        saveQuizProgress();
        renderQuizView();
      });
    });

    // Request Hint
    if (requestHintBtn) {
      requestHintBtn.addEventListener('click', () => {
        userState.usedHint = true;
        state.quiz.userAnswers[q.id] = userState;
        saveQuizProgress();
        const hintBox = document.getElementById('hintContainer');
        if (hintBox) hintBox.style.display = 'block';
        requestHintBtn.style.display = 'none';
      });
    }

    // Submit Answer
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (!userState.selectedOption) return;
        userState.isSubmitted = true;
        state.quiz.userAnswers[q.id] = userState;
        saveQuizProgress();
        renderQuizView();
      });
    }

    // Prev / Next Buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          state.quiz.currentIndex = currentIndex - 1;
          saveQuizProgress();
          renderQuizView();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < totalQ - 1) {
          state.quiz.currentIndex = currentIndex + 1;
          saveQuizProgress();
          renderQuizView();
        } else {
          renderQuizSummaryView();
        }
      });
    }

    // Toggle Palette Drawer
    if (togglePaletteBtn && paletteDrawer) {
      togglePaletteBtn.addEventListener('click', () => {
        const isHidden = paletteDrawer.style.display === 'none';
        paletteDrawer.style.display = isHidden ? 'block' : 'none';
      });
    }

    // Palette Jump Buttons
    elContent.querySelectorAll('.palette-item').forEach(btn => {
      btn.addEventListener('click', () => {
        state.quiz.currentIndex = parseInt(btn.getAttribute('data-index'), 10);
        saveQuizProgress();
        renderQuizView();
      });
    });

    // Finish / Summary Button
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        renderQuizSummaryView();
      });
    }
  }

  // 4. Quiz Summary & Scoring Screen
  function renderQuizSummaryView() {
    const questions = state.currentQuestions;
    const totalQ = questions.length;
    state.quiz.isCompleted = true;
    saveQuizProgress();

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let unresolvedCount = 0;
    let hintsUsedCount = 0;
    const missedQuestions = [];

    questions.forEach(q => {
      const ans = state.quiz.userAnswers[q.id];
      if (!ans || !ans.isSubmitted) {
        unansweredCount++;
        missedQuestions.push({ question: q, userChoice: null, reason: 'Unanswered' });
        return;
      }

      if (ans.usedHint) hintsUsedCount++;

      // Disputed / Needs review questions are never penalized as definitively wrong
      if (q.verification_status === 'needs_review') {
        unresolvedCount++;
        return;
      }

      const isCorrect = ans.selectedOption && ans.selectedOption.toUpperCase() === q.verified_answer.toUpperCase();
      if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
        missedQuestions.push({ question: q, userChoice: ans.selectedOption, reason: 'Incorrect' });
      }
    });

    // Percentage based strictly on gradable questions (total minus unresolved)
    const gradableTotal = totalQ - unresolvedCount;
    const scorePct = gradableTotal > 0 ? Math.round((correctCount / gradableTotal) * 100) : 0;

    elContent.innerHTML = `
      <div class="quiz-container">
        <div class="scorecard">
          <div>
            <span class="badge badge-verified" style="margin-bottom: 0.5rem;">${state.currentCollege} &bull; ${state.currentSubject}</span>
            <h2 style="font-size: 1.85rem; font-weight: 800;">Quiz Performance Report</h2>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">
              Score percentage is calculated on gradable verified questions only.
            </p>
          </div>

          <div class="score-circle">
            <span class="score-pct">${scorePct}%</span>
            <span class="score-sub">${correctCount} / ${gradableTotal} Gradable</span>
          </div>

          <div class="scorecard-metrics">
            <div class="scorecard-metric">
              <div class="scorecard-metric-val" style="color: #10b981;">${correctCount}</div>
              <div class="scorecard-metric-lbl">Correct</div>
            </div>
            <div class="scorecard-metric">
              <div class="scorecard-metric-val" style="color: #ef4444;">${incorrectCount}</div>
              <div class="scorecard-metric-lbl">Incorrect</div>
            </div>
            <div class="scorecard-metric">
              <div class="scorecard-metric-val" style="color: var(--text-muted);">${unansweredCount}</div>
              <div class="scorecard-metric-lbl">Unanswered</div>
            </div>
            <div class="scorecard-metric">
              <div class="scorecard-metric-val" style="color: #f59e0b;">${unresolvedCount}</div>
              <div class="scorecard-metric-lbl">Unresolved / Review</div>
            </div>
            <div class="scorecard-metric">
              <div class="scorecard-metric-val" style="color: var(--secondary);">${hintsUsedCount}</div>
              <div class="scorecard-metric-lbl">Hints Used</div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;">
            <button id="retryQuizBtn" class="btn btn-secondary">
              🔄 Retry Subject Quiz
            </button>
            <button id="backToSubjectBtn" class="btn btn-primary">
              🏛️ Back to Subject Hub
            </button>
          </div>
        </div>

        <!-- Missed Questions Review Drawer -->
        ${missedQuestions.length > 0 ? `
          <div style="margin-top: 1.5rem;">
            <div class="section-title-bar">
              <h3 class="section-heading">Review Missed Questions (${missedQuestions.length})</h3>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Inspect answers and explanations</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              ${missedQuestions.map(({ question: mq, userChoice, reason }) => `
                <div class="quiz-card" style="padding: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; font-size: 0.8rem;">
                    <span style="font-family: var(--font-mono); font-weight: 700; color: var(--primary);">${mq.id} &bull; Page ${mq.pdf_page}</span>
                    <span class="badge ${reason === 'Unanswered' ? 'badge-provisional' : 'badge-review'}">${reason}</span>
                  </div>

                  <div style="font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem;">${mq.question}</div>

                  <div style="display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.875rem; margin-bottom: 0.75rem;">
                    ${mq.options.map(o => {
                      const isCorrect = o.label.toUpperCase() === (mq.verified_answer || '').toUpperCase();
                      const isUserChoice = userChoice && o.label.toUpperCase() === userChoice.toUpperCase();
                      return `
                        <div style="padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); background-color: ${isCorrect ? 'var(--correct-bg)' : (isUserChoice ? 'var(--incorrect-bg)' : 'var(--bg-subtle)')}; border: 1px solid ${isCorrect ? 'var(--correct-border)' : (isUserChoice ? 'var(--incorrect-border)' : 'var(--border-color)')}; display: flex; justify-content: space-between;">
                          <span><strong>${o.label}.</strong> ${o.text}</span>
                          <span>
                            ${isCorrect ? '<strong style="color:#10b981;">✓ Correct</strong>' : ''}
                            ${isUserChoice && !isCorrect ? '<strong style="color:#ef4444;">Your Choice</strong>' : ''}
                          </span>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <div style="font-size: 0.85rem; color: var(--text-secondary); background-color: var(--bg-subtle); padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
                    <strong>Explanation:</strong> ${mq.explanation}
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem; font-style: italic;">
                      Source: ${mq.source}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div style="text-align: center; padding: 2rem; color: #10b981; font-weight: 700;">
            🎉 Outstanding! You answered every question correctly on the first attempt!
          </div>
        `}
      </div>
    `;

    document.getElementById('retryQuizBtn').addEventListener('click', () => {
      clearQuizProgress(state.currentCollege, state.currentSubject);
      navigateToQuiz(state.currentCollege, state.currentSubject);
    });

    document.getElementById('backToSubjectBtn').addEventListener('click', () => {
      navigateToSubjectHub(state.currentCollege, state.currentSubject);
    });
  }

  // 5. Flashcard Mode Engine
  function renderFlashcardView() {
    const questions = state.currentQuestions;
    if (questions.length === 0) {
      navigateToSubjectHub(state.currentCollege, state.currentSubject);
      return;
    }

    const deck = state.flashcards.onlyBookmarked
      ? questions.filter(q => state.flashcards.bookmarkedIds.has(q.id))
      : questions;

    if (deck.length === 0 && state.flashcards.onlyBookmarked) {
      elContent.innerHTML = `
        <div style="max-width: 680px; margin: 2rem auto; text-align: center; background-color: var(--bg-surface); padding: 3rem 2rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⭐</div>
          <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem;">No Bookmarked Cards Yet</h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
            You haven't marked any questions for review in ${state.currentSubject} yet. Star difficult cards to study them together here.
          </p>
          <button id="showAllCardsBtn" class="btn btn-primary">
            Show All ${questions.length} Cards
          </button>
        </div>
      `;
      document.getElementById('showAllCardsBtn').addEventListener('click', () => {
        state.flashcards.onlyBookmarked = false;
        renderFlashcardView();
      });
      return;
    }

    const currentIndex = Math.min(Math.max(state.flashcards.currentIndex, 0), deck.length - 1);
    state.flashcards.currentIndex = currentIndex;
    const q = deck[currentIndex];
    const isBookmarked = state.flashcards.bookmarkedIds.has(q.id);

    // Find full text of the verified option
    const verifiedOpt = q.options.find(o => o.label.toUpperCase() === (q.verified_answer || '').toUpperCase());

    elContent.innerHTML = `
      <div class="flashcard-wrapper">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span style="font-weight: 700; font-size: 0.85rem; color: var(--primary);">${state.currentCollege} &bull; ${state.currentSubject}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.5rem;">Page ${q.pdf_page} &bull; ID: ${q.id}</span>
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button id="toggleBookmarkFilterBtn" class="btn btn-secondary btn-sm" style="${state.flashcards.onlyBookmarked ? 'background-color: var(--primary-light); color: var(--primary); font-weight: 700;' : ''}">
              ⭐ ${state.flashcards.onlyBookmarked ? 'Showing Starred Only' : 'Filter Starred'}
            </button>
            <button id="shuffleDeckBtn" class="btn btn-secondary btn-sm" title="Shuffle flashcards">
              🔀 Shuffle
            </button>
          </div>
        </div>

        <!-- 3D Flippable Card -->
        <div class="flashcard ${state.flashcards.isFlipped ? 'flipped' : ''}" id="flashcardElement">
          <!-- Front Face: Question -->
          <div class="flashcard-face flashcard-front">
            <div class="flashcard-top">
              <span class="badge ${q.verification_status === 'verified' ? 'badge-verified' : (q.verification_status === 'needs_review' ? 'badge-review' : 'badge-provisional')}">
                ${q.verification_status.replace('_', ' ')}
              </span>
              <button class="star-card-btn" id="starCardBtn" style="font-size: 1.35rem; color: ${isBookmarked ? '#f59e0b' : 'var(--text-muted)'};" title="Bookmark card for review">
                ${isBookmarked ? '★' : '☆'}
              </button>
            </div>

            <div class="flashcard-body">
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">
                Question ${currentIndex + 1} of ${deck.length}
              </div>
              <div class="flashcard-question-text">
                ${q.question}
              </div>
              <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-top: 1rem; text-align: left;">
                ${q.options.map(opt => `
                  <div style="font-size: 0.85rem; color: var(--text-secondary); padding: 0.3rem 0.5rem; border-radius: var(--radius-sm); background-color: var(--bg-subtle);">
                    <strong>${opt.label}.</strong> ${opt.text}
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="flashcard-hint-text">
              <span>🔄 Click card or press <strong>Spacebar</strong> to reveal answer</span>
            </div>
          </div>

          <!-- Back Face: Answer, Explanation, Source -->
          <div class="flashcard-face flashcard-back">
            <div class="flashcard-top">
              <span class="badge ${q.verification_status === 'verified' ? 'badge-verified' : (q.verification_status === 'needs_review' ? 'badge-review' : 'badge-provisional')}">
                ${q.verification_status.replace('_', ' ')}
              </span>
              <button class="star-card-btn" style="font-size: 1.35rem; color: ${isBookmarked ? '#f59e0b' : 'var(--text-muted)'};">
                ${isBookmarked ? '★' : '☆'}
              </button>
            </div>

            <div class="flashcard-body">
              <div class="flashcard-answer-box">
                <div>Correct Option: <strong>${q.verified_answer}</strong></div>
                ${verifiedOpt ? `<div style="font-size: 0.95rem; font-weight: 500; margin-top: 0.2rem;">${verifiedOpt.text}</div>` : ''}
              </div>

              ${q.pdf_marked && q.pdf_marked.toUpperCase() !== (q.verified_answer || '').toUpperCase() ? `
                <div style="font-size: 0.8rem; background-color: var(--provisional-bg); color: var(--provisional-text); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--provisional-border);">
                  ⚠️ <strong>Note:</strong> PDF provisional mark was <strong>Option ${q.pdf_marked}</strong>.
                </div>
              ` : ''}

              <div class="flashcard-explanation">
                <strong>Explanation:</strong> ${q.explanation}
              </div>

              <div style="font-size: 0.78rem; color: var(--text-muted); font-style: italic; border-top: 1px dashed var(--border-color); padding-top: 0.4rem; text-align: left;">
                <strong>Source:</strong> ${q.source || 'Medical References'} &bull; PDF Page ${q.pdf_page}
              </div>
            </div>

            <div class="flashcard-hint-text">
              <span>🔄 Click card or press <strong>Spacebar</strong> to flip back</span>
            </div>
          </div>
        </div>

        <!-- Controls Toolbar -->
        <div class="flashcard-controls-bar">
          <button id="prevCardBtn" class="btn btn-secondary" ${currentIndex === 0 ? 'disabled' : ''}>
            &larr; Previous (Left Arrow)
          </button>

          <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-secondary);">
            ${currentIndex + 1} / ${deck.length}
          </div>

          <button id="nextCardBtn" class="btn btn-primary" ${currentIndex === deck.length - 1 ? 'disabled' : ''}>
            Next (Right Arrow) &rarr;
          </button>
        </div>
      </div>
    `;

    const cardEl = document.getElementById('flashcardElement');
    const prevBtn = document.getElementById('prevCardBtn');
    const nextBtn = document.getElementById('nextCardBtn');
    const starBtn = document.getElementById('starCardBtn');
    const toggleFilterBtn = document.getElementById('toggleBookmarkFilterBtn');
    const shuffleBtn = document.getElementById('shuffleDeckBtn');

    // Flip action
    cardEl.addEventListener('click', () => {
      state.flashcards.isFlipped = !state.flashcards.isFlipped;
      cardEl.classList.toggle('flipped', state.flashcards.isFlipped);
    });

    // Star/Bookmark toggle
    starBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.flashcards.bookmarkedIds.has(q.id)) {
        state.flashcards.bookmarkedIds.delete(q.id);
      } else {
        state.flashcards.bookmarkedIds.add(q.id);
      }
      saveBookmarks();
      renderFlashcardView();
    });

    // Prev / Next
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        state.flashcards.currentIndex = currentIndex - 1;
        state.flashcards.isFlipped = false;
        renderFlashcardView();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentIndex < deck.length - 1) {
        state.flashcards.currentIndex = currentIndex + 1;
        state.flashcards.isFlipped = false;
        renderFlashcardView();
      }
    });

    // Filter Starred
    toggleFilterBtn.addEventListener('click', () => {
      state.flashcards.onlyBookmarked = !state.flashcards.onlyBookmarked;
      state.flashcards.currentIndex = 0;
      state.flashcards.isFlipped = false;
      renderFlashcardView();
    });

    // Shuffle
    shuffleBtn.addEventListener('click', () => {
      // Fisher-Yates shuffle
      for (let i = state.currentQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = state.currentQuestions[i];
        state.currentQuestions[i] = state.currentQuestions[j];
        state.currentQuestions[j] = temp;
      }
      state.flashcards.currentIndex = 0;
      state.flashcards.isFlipped = false;
      renderFlashcardView();
    });
  }

  // 6. Import Audit View
  function renderAuditView() {
    const colleges = window.MCQ_DATA.colleges;
    const allQ = getActiveQuestions();

    elContent.innerHTML = `
      <div class="subject-hub-header">
        <h1 class="subject-hub-title">Import Audit & Verification Report</h1>
        <p class="subject-hub-subtitle">
          Complete structural analysis and verification audit across all 77 pages of “NUMS BLOCK 6 PREPROF MCQS 2025.pdf”.
        </p>
      </div>

      <div class="stats-banner">
        <div class="stat-card">
          <div class="stat-val">372</div>
          <div class="stat-label">Total Authenticated Questions</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">77 / 77</div>
          <div class="stat-label">PDF Pages Covered (100%)</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" style="color: #10b981;">353</div>
          <div class="stat-label">Consensus Verified (94.9%)</div>
        </div>
        <div class="stat-card">
          <div class="stat-val" style="color: #f43f5e;">19</div>
          <div class="stat-label">Flagged / Discrepancies (5.1%)</div>
        </div>
      </div>

      <!-- College Breakdown Table -->
      <div class="section-title-bar">
        <h3 class="section-heading">College & Subject Import Breakdown</h3>
      </div>

      <div class="review-table-wrap" style="margin-bottom: 2rem;">
        <table class="review-table">
          <thead>
            <tr>
              <th>College (As Printed)</th>
              <th>Subjects Present</th>
              <th style="text-align: center;">Questions</th>
              <th style="text-align: center;">PDF Page Range</th>
              <th>Curricular Scope & Subtitles</th>
            </tr>
          </thead>
          <tbody>
            ${colleges.map(c => `
              <tr>
                <td style="font-weight: 700; color: var(--primary);">${c.name}</td>
                <td>
                  ${c.subjects.map(s => `<div>${s.name}</div>`).join('')}
                </td>
                <td style="text-align: center; font-weight: 700;">
                  ${c.total_questions}
                </td>
                <td style="text-align: center; font-family: var(--font-mono); font-size: 0.85rem;">
                  ${c.subjects.map(s => `<div>pp. ${s.page_range}</div>`).join('')}
                </td>
                <td style="font-size: 0.85rem; color: var(--text-secondary);">
                  ${c.subjects.map(s => s.subtitles && s.subtitles.length ? `<div><em>${s.subtitles.join(', ')}</em></div>` : '<div>Standard block coverage</div>').join('')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section-title-bar">
        <h3 class="section-heading">Discrepancies & Flagged Review Items</h3>
        <button id="jumpToReviewScreenBtn" class="btn btn-primary btn-sm">
          Open Live Review & Edit Screen &rarr;
        </button>
      </div>

      <div style="background-color: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 1.5rem; font-size: 0.9rem; line-height: 1.6;">
        <p style="margin-bottom: 1rem;">
          In accordance with the project requirements, provisional answers marked in the PDF are preserved separately from verified grading keys. Discrepancies between student checkmarks in the PDF and established medical literature (such as <em>Snell's Anatomy</em>, <em>Guyton & Hall Physiology</em>, and <em>Harper's Biochemistry</em>) are cataloged below:
        </p>
        <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <li>
            <strong>CKMC-ANAT-06 (Page 17):</strong> PDF marked <em>A (Stylomastoid foramen)</em> for hyperacusis + loss of taste. Medically, branches to stapedius and chorda tympani arise inside the facial canal before the stylomastoid foramen; true lesion site is <em>C (Geniculate ganglion)</em>.
          </li>
          <li>
            <strong>CKMC-ANAT-22 (Page 20):</strong> PDF printed mark is <em>A (Over hyoglossus)</em>, but handwritten student ink on the physical page correctly circled <em>B (Under hyoglossus)</em>. The lingual artery runs deep to hyoglossus.
          </li>
          <li>
            <strong>QIMS-PHYS-31 (Page 60):</strong> The PDF has two green checkmarks on both <em>(a)</em> and <em>(d)</em>. Option <em>(d)</em> correctly reflects tonotopic traveling wave resonance.
          </li>
          <li>
            <strong>QIMS-PHYS-40 (Page 62):</strong> The PDF has two green checkmarks on both <em>(a) Somatostatin</em> and <em>(b) Acute hyperglycemia</em>; both physiologically suppress GH.
          </li>
          <li>
            <strong>QIMS-PHYS-44 (Page 62):</strong> Patient with puffy skin has low TSH that rises markedly with TRH. PDF marked <em>d (Pituitary)</em>, but an intact response to TRH proves the pituitary works and the defect is in the <em>hypothalamus (c)</em>.
          </li>
          <li>
            <strong>QIMS-PHYS-55 (Page 64):</strong> Woman given daily injections from day 16 does not menstruate. PDF marked <em>c (Progesterone inhibitor)</em>, which would cause immediate menses; <em>hCG (d)</em> maintains the corpus luteum and prevents menses.
          </li>
          <li>
            <strong>QIMS-PHYS-56 (Page 64):</strong> 5 years amenorrhea with normal bone density. PDF marked <em>c (low estrogen)</em>, which causes severe osteoporosis; <em>anabolic steroids (d)</em> explain amenorrhea with preserved bone density.
          </li>
        </ul>
      </div>
    `;

    document.getElementById('jumpToReviewScreenBtn').addEventListener('click', () => {
      navigateToReview();
    });
  }

  // Keyboard Shortcuts Handler
  window.addEventListener('keydown', (e) => {
    // If typing inside an input or textarea, skip global shortcuts
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    if (state.view === 'flashcards') {
      if (e.code === 'Space') {
        e.preventDefault();
        const cardEl = document.getElementById('flashcardElement');
        if (cardEl) {
          state.flashcards.isFlipped = !state.flashcards.isFlipped;
          cardEl.classList.toggle('flipped', state.flashcards.isFlipped);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const prevBtn = document.getElementById('prevCardBtn');
        if (prevBtn && !prevBtn.disabled) prevBtn.click();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const nextBtn = document.getElementById('nextCardBtn');
        if (nextBtn && !nextBtn.disabled) nextBtn.click();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        const starBtn = document.getElementById('starCardBtn');
        if (starBtn) starBtn.click();
      }
    } else if (state.view === 'quiz') {
      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D', 'E'].includes(key) || ['1', '2', '3', '4', '5'].includes(key)) {
        let label = key;
        if (key === '1') label = 'A';
        if (key === '2') label = 'B';
        if (key === '3') label = 'C';
        if (key === '4') label = 'D';
        if (key === '5') label = 'E';

        const optBtn = elContent.querySelector(`.option-btn[data-label="${label}"]`);
        if (optBtn && !optBtn.disabled) {
          optBtn.click();
        }
      } else if (e.key === 'Enter') {
        const submitBtn = document.getElementById('submitAnswerBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.click();
        } else if (nextBtn) {
          nextBtn.click();
        }
      } else if (e.key.toLowerCase() === 'h') {
        const hintBtn = document.getElementById('requestHintBtn');
        if (hintBtn) hintBtn.click();
      }
    }
  });

  // Initial Load
  document.addEventListener('DOMContentLoaded', () => {
    navigateToColleges();
  });

})();
