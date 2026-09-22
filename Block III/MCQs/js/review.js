/**
 * NUMS Block 6 MCQs - Answer Review & Verification Inspector
 * Provides interactive inspection, comparison, and live in-browser answer editing/approval.
 */

(function() {
  const STORAGE_KEY = 'nums_mcq_answer_overrides_v1';

  // Load custom overrides from localStorage
  function getOverrides() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Error loading overrides from localStorage', e);
      return {};
    }
  }

  function saveOverride(qid, patch) {
    const overrides = getOverrides();
    overrides[qid] = Object.assign(overrides[qid] || {}, patch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }

  function clearAllOverrides() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Apply overrides to a question object
  function applyOverride(q) {
    const overrides = getOverrides();
    if (overrides[q.id]) {
      return Object.assign({}, q, overrides[q.id]);
    }
    return q;
  }

  // Expose review helpers globally
  window.MCQ_REVIEW = {
    getOverrides: getOverrides,
    saveOverride: saveOverride,
    clearAllOverrides: clearAllOverrides,
    applyOverride: applyOverride,

    getQuestionsWithOverrides: function() {
      if (!window.MCQ_DATA || !window.MCQ_DATA.questions) return [];
      return window.MCQ_DATA.questions.map(applyOverride);
    },

    renderReviewView: function(containerEl) {
      const questions = this.getQuestionsWithOverrides();
      const colleges = window.MCQ_DATA.colleges.map(c => c.name);

      containerEl.innerHTML = `
        <div class="subject-hub-header">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 class="subject-hub-title">Answer Verification & Discrepancy Inspector</h2>
              <p class="subject-hub-subtitle">
                Compare original provisional answers marked in the PDF against verified medical keys. Approve answers, correct discrepancies, or add notes. All edits persist in your browser.
              </p>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <button id="exportJsonBtn" class="btn btn-secondary btn-sm">
                📥 Export Updated JSON
              </button>
              <button id="resetOverridesBtn" class="btn btn-secondary btn-sm" style="color: var(--review-text);">
                🔄 Reset to Defaults
              </button>
            </div>
          </div>
        </div>

        <div class="review-filter-bar">
          <div style="flex: 1; min-width: 240px; position: relative;">
            <input type="text" id="reviewSearch" class="search-input" placeholder="Search by question text, ID, or explanation..." style="padding: 0.5rem 0.85rem 0.5rem 2.2rem; font-size: 0.875rem;">
            <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔍</span>
          </div>

          <select id="reviewCollegeFilter" class="filter-select">
            <option value="">All Colleges (${colleges.length})</option>
            ${colleges.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>

          <select id="reviewSubjectFilter" class="filter-select">
            <option value="">All Subjects</option>
            <option value="Anatomy">Anatomy</option>
            <option value="Physiology">Physiology</option>
            <option value="Biochemistry">Biochemistry</option>
          </select>

          <select id="reviewStatusFilter" class="filter-select">
            <option value="">All Statuses</option>
            <option value="discrepancy" selected>⚠️ Discrepancies vs PDF Only</option>
            <option value="needs_review">Needs Review</option>
            <option value="provisional">Provisional</option>
            <option value="verified">Verified</option>
          </select>
        </div>

        <div style="margin-bottom: 1rem; font-size: 0.875rem; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
          <span id="reviewCountBadge">Showing 0 questions</span>
          <span style="font-size: 0.8rem;">Click <strong>Inspect / Edit</strong> on any row to modify answer keys</span>
        </div>

        <div class="review-table-wrap">
          <table class="review-table">
            <thead>
              <tr>
                <th style="width: 110px;">ID / Page</th>
                <th style="width: 140px;">College & Subject</th>
                <th>Question & Marked Options</th>
                <th style="width: 120px;">PDF Key</th>
                <th style="width: 120px;">Verified Key</th>
                <th style="width: 120px;">Status</th>
                <th style="width: 90px; text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody id="reviewTableBody">
              <!-- Rows inserted dynamically -->
            </tbody>
          </table>
        </div>

        <!-- Edit Modal Placeholder -->
        <div id="reviewModalContainer"></div>
      `;

      // Event Listeners for Filters
      const searchInput = document.getElementById('reviewSearch');
      const collegeSelect = document.getElementById('reviewCollegeFilter');
      const subjectSelect = document.getElementById('reviewSubjectFilter');
      const statusSelect = document.getElementById('reviewStatusFilter');
      const tableBody = document.getElementById('reviewTableBody');
      const countBadge = document.getElementById('reviewCountBadge');

      function filterAndRenderRows() {
        const query = searchInput.value.toLowerCase().trim();
        const selCollege = collegeSelect.value;
        const selSubject = subjectSelect.value;
        const selStatus = statusSelect.value;

        const currentQuestions = window.MCQ_REVIEW.getQuestionsWithOverrides();

        const filtered = currentQuestions.filter(q => {
          if (selCollege && q.college !== selCollege) return false;
          if (selSubject && q.subject !== selSubject) return false;

          const isDiscrepancy = (q.pdf_marked && q.verified_answer && q.pdf_marked.toLowerCase() !== q.verified_answer.toLowerCase()) || q.verification_status === 'needs_review' || Boolean(q.flag_reason);

          if (selStatus === 'discrepancy' && !isDiscrepancy) return false;
          if (selStatus === 'needs_review' && q.verification_status !== 'needs_review') return false;
          if (selStatus === 'provisional' && q.verification_status !== 'provisional') return false;
          if (selStatus === 'verified' && q.verification_status !== 'verified') return false;

          if (query) {
            const haystack = `${q.id} ${q.question} ${q.explanation || ''} ${q.source || ''}`.toLowerCase();
            if (!haystack.includes(query)) return false;
          }

          return true;
        });

        countBadge.textContent = `Showing ${filtered.length} of ${currentQuestions.length} questions`;

        if (filtered.length === 0) {
          tableBody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                No matching questions found with current filter parameters.
              </td>
            </tr>
          `;
          return;
        }

        tableBody.innerHTML = filtered.map(q => {
          const isDiscrepancy = q.pdf_marked && q.verified_answer && q.pdf_marked.toLowerCase() !== q.verified_answer.toLowerCase();

          return `
            <tr>
              <td>
                <span style="font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; color: var(--primary); display: block;">${q.id}</span>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Page ${q.pdf_page}</span>
              </td>
              <td>
                <div style="font-weight: 700; font-size: 0.85rem;">${q.college}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">${q.subject} ${q.subtitle ? `<br><small style="color:var(--text-secondary);">${q.subtitle}</small>` : ''}</div>
              </td>
              <td>
                <div style="font-weight: 600; margin-bottom: 0.4rem; color: var(--text-primary);">${q.question}</div>
                ${q.flag_reason ? `
                  <div style="font-size: 0.78rem; background-color: var(--review-bg); color: var(--review-text); padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--review-border); margin-top: 0.4rem;">
                    <strong>Flag:</strong> ${q.flag_reason}
                  </div>
                ` : ''}
              </td>
              <td>
                <span class="badge badge-provisional" style="font-size: 0.85rem; font-family: var(--font-mono);">
                  Option ${q.pdf_marked || '—'}
                </span>
              </td>
              <td>
                <span class="badge ${q.verification_status === 'verified' ? 'badge-verified' : (q.verification_status === 'needs_review' ? 'badge-review' : 'badge-provisional')}" style="font-size: 0.85rem; font-family: var(--font-mono); ${isDiscrepancy ? 'border: 2px solid var(--review-border);' : ''}">
                  Option ${q.verified_answer || '—'}
                </span>
                ${isDiscrepancy ? '<div style="font-size: 0.7rem; color: var(--review-text); font-weight: 700; margin-top: 0.2rem;">⚠️ Key Differs</div>' : ''}
              </td>
              <td>
                <span class="badge ${q.verification_status === 'verified' ? 'badge-verified' : (q.verification_status === 'needs_review' ? 'badge-review' : 'badge-provisional')}">
                  ${q.verification_status.replace('_', ' ')}
                </span>
              </td>
              <td style="text-align: center;">
                <button class="btn btn-outline-primary btn-sm inspect-btn" data-id="${q.id}">
                  Inspect
                </button>
              </td>
            </tr>
          `;
        }).join('');

        // Attach inspect button listeners
        const inspectBtns = tableBody.querySelectorAll('.inspect-btn');
        inspectBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const qid = btn.getAttribute('data-id');
            window.MCQ_REVIEW.openEditModal(qid, () => filterAndRenderRows());
          });
        });
      }

      searchInput.addEventListener('input', filterAndRenderRows);
      collegeSelect.addEventListener('change', filterAndRenderRows);
      subjectSelect.addEventListener('change', filterAndRenderRows);
      statusSelect.addEventListener('change', filterAndRenderRows);

      // Export JSON handler
      document.getElementById('exportJsonBtn').addEventListener('click', () => {
        const fullData = {
          total_questions: questions.length,
          colleges: window.MCQ_DATA.colleges,
          questions: window.MCQ_REVIEW.getQuestionsWithOverrides()
        };
        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NUMS_Block_6_MCQs_Verified_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });

      // Reset overrides handler
      document.getElementById('resetOverridesBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all custom edits and return to original dataset keys?')) {
          window.MCQ_REVIEW.clearAllOverrides();
          filterAndRenderRows();
        }
      });

      // Initial render
      filterAndRenderRows();
    },

    openEditModal: function(qid, onSaveCallback) {
      const currentQuestions = this.getQuestionsWithOverrides();
      const q = currentQuestions.find(item => item.id === qid);
      if (!q) return;

      const modalContainer = document.getElementById('reviewModalContainer');
      modalContainer.innerHTML = `
        <div class="modal-overlay" id="editModalOverlay">
          <div class="modal-card">
            <div class="modal-header">
              <div>
                <h3 style="font-size: 1.15rem; font-weight: 700;">Question Key Inspector & Editor</h3>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">${q.id} &bull; Page ${q.pdf_page}</span>
              </div>
              <button id="modalCloseBtn" style="font-size: 1.25rem; color: var(--text-muted); padding: 0.25rem 0.5rem;">&times;</button>
            </div>

            <div class="modal-body">
              <div>
                <label style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Question Text</label>
                <div style="font-weight: 600; margin-top: 0.25rem; line-height: 1.45;">${q.question}</div>
              </div>

              <div>
                <label style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Options</label>
                <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.4rem;">
                  ${q.options.map(opt => `
                    <div style="display: flex; gap: 0.5rem; align-items: center; padding: 0.45rem 0.65rem; border-radius: var(--radius-sm); background-color: var(--bg-subtle); font-size: 0.875rem;">
                      <span style="font-weight: 700; width: 22px;">${opt.label}.</span>
                      <span style="flex: 1;">${opt.text}</span>
                      ${q.pdf_marked && (q.pdf_marked.toUpperCase().includes(opt.label.toUpperCase())) ? '<span class="badge badge-provisional" style="font-size: 0.65rem;">PDF Marked</span>' : ''}
                    </div>
                  `).join('')}
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label for="editVerifiedOption" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Verified Answer Option</label>
                  <select id="editVerifiedOption" class="filter-select" style="width: 100%;">
                    ${q.options.map(opt => `
                      <option value="${opt.label}" ${opt.label.toUpperCase() === (q.verified_answer || '').toUpperCase() ? 'selected' : ''}>
                        Option ${opt.label} (${opt.text.slice(0, 30)}...)
                      </option>
                    `).join('')}
                  </select>
                </div>

                <div>
                  <label for="editStatus" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Verification Status</label>
                  <select id="editStatus" class="filter-select" style="width: 100%;">
                    <option value="verified" ${q.verification_status === 'verified' ? 'selected' : ''}>Verified</option>
                    <option value="needs_review" ${q.verification_status === 'needs_review' ? 'selected' : ''}>Needs Review</option>
                    <option value="provisional" ${q.verification_status === 'provisional' ? 'selected' : ''}>Provisional</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="editExplanation" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Medical Explanation / Rationale</label>
                <textarea id="editExplanation" rows="4" style="width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.6rem; font-size: 0.875rem; background-color: var(--bg-subtle); color: var(--text-primary); line-height: 1.4;">${q.explanation || ''}</textarea>
              </div>

              <div>
                <label for="editSource" style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Reference Source Citation</label>
                <input type="text" id="editSource" value="${q.source || ''}" style="width: 100%; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.5rem; font-size: 0.875rem; background-color: var(--bg-subtle); color: var(--text-primary);">
              </div>
            </div>

            <div class="modal-footer">
              <button id="modalCancelBtn" class="btn btn-secondary btn-sm">Cancel</button>
              <button id="modalSaveBtn" class="btn btn-primary btn-sm">💾 Save & Apply Changes</button>
            </div>
          </div>
        </div>
      `;

      function closeModal() {
        modalContainer.innerHTML = '';
      }

      document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
      document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
      document.getElementById('editModalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'editModalOverlay') closeModal();
      });

      document.getElementById('modalSaveBtn').addEventListener('click', () => {
        const newVerifiedOption = document.getElementById('editVerifiedOption').value;
        const newStatus = document.getElementById('editStatus').value;
        const newExplanation = document.getElementById('editExplanation').value;
        const newSource = document.getElementById('editSource').value;

        window.MCQ_REVIEW.saveOverride(q.id, {
          verified_answer: newVerifiedOption,
          verification_status: newStatus,
          explanation: newExplanation,
          source: newSource
        });

        closeModal();
        if (typeof onSaveCallback === 'function') {
          onSaveCallback();
        }
      });
    }
  };
})();
