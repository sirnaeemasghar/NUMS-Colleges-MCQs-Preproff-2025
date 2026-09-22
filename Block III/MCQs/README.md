# NUMS Block 6 Preprofessional Examination MCQs (2025) — Study Platform

A responsive, high-yield medical study web platform created directly from the authentic 77-page past paper document **“NUMS BLOCK 6 PREPROF MCQS 2025.pdf”**.

The platform contains **372 authentic questions** across Anatomy, Physiology, and Biochemistry from 9 medical colleges affiliated with the National University of Medical Sciences (NUMS). No sample, placeholder, or synthetic content is used.

---

## 🏛️ Navigation Architecture

The site follows a hierarchical structure:
```
Colleges Hub  ──▶  Subject Selection  ──▶  Mode: Take Quiz OR Study Flashcards
```

### Colleges & Available Subjects:
1. **AMC** (24 Questions) — Anatomy (8), Physiology (6), Biochemistry (10)
2. **CMH LHR** (41 Questions) — Anatomy (19), Physiology (7), Biochemistry (15)
3. **CKMC** (23 Questions) — Anatomy: Head & Neck Set 2 (23)
4. **CIMS Multan** (29 Questions) — Anatomy (29)
5. **WMC** (50 Questions) — Anatomy (20), Physiology (16), Biochemistry (14)
6. **HITEC** (39 Questions) — Anatomy: Head & Neck (39)
7. **CIMS BWP** (41 Questions) — Anatomy (20), Physiology (13), Biochemistry (8)
8. **QIMS** (84 Questions) — Anatomy (28), Physiology (28), Biochemistry (28)
9. **KIMS** (41 Questions) — Anatomy (26), Physiology (5), Biochemistry (10)

---

## ⚡ Core Features

### 1. Interactive Quiz Mode
- **Step-by-Step Delivery:** 1 question at a time to prevent cognitive overload.
- **Pedagogical Hints:** Expandable hints guiding thought processes without revealing the answer.
- **Instant Explanations & Source Citations:** Immediate feedback with full clinical rationale and textbook references (*Guyton & Hall 14th ed.*, *Snell's Anatomy 10th ed.*, *Harper's Biochemistry 32nd ed.*).
- **Collapsible Question Navigator Palette:** Jump to any question instantly with real-time status indicators (current, answered, skipped).
- **Fair Scoring Logic:** Items marked as unverified or disputed are clearly indicated and excluded from penalizing scores.
- **Post-Quiz Analytics & Retry:** Score percentage, performance tier, detailed review of missed questions, and one-click retry of missed items.
- **Progress Persistence:** In-progress quizzes save automatically to browser `localStorage`.

### 2. 3D Flashcard Study Mode
- **Interactive 3D Flip Card:** Realistic flipping animation toggling question front and detailed clinical answer back.
- **Keyboard Shortcuts:**
  - `Space` / `Enter`: Flip card
  - `→` (Right Arrow): Next card
  - `←` (Left Arrow): Previous card
  - `S`: Star / unstar card for focused review
- **Study Deck Customization:**
  - Star/bookmark high-yield questions for review.
  - Toggle between **All Cards** and **Starred Only**.
  - **Shuffle Deck** for randomized active recall.

### 3. Answer Verification & Discrepancy Inspector
- **Provisional vs. Verified:** Separates student-marked checkmarks from medically verified answers.
- **Multi-Filter Search:** Filter by College, Subject, Verification Status (`Verified`, `Provisional`, `Needs Review`), and Discrepancies.
- **In-Browser Answer Editor:** Allows educators or students to update answers, toggle review statuses, and add clinical notes directly in the browser with persistence in `localStorage`.
- **JSON Export:** Export customized answer sets and verifications back to JSON anytime.

### 4. 77-Page Import Audit Matrix
- Dedicated audit screen detailing the exact question count and page range for every college and subject section.
- Complete catalog of flagged review items with clinical commentary explaining discrepancies between student markings and textbook physiological/anatomical facts.

### 5. Responsive Design & Accessibility
- Clean medical aesthetics with light and dark mode toggling.
- Fully responsive on desktop, tablet, and mobile screens.
- Accessible semantic HTML with keyboard navigation support.

---

## 📁 File Structure

```
.
├── index.html                  # Single Page Application entry point
├── audit_report.md             # Markdown verification & discrepancy report
├── README.md                   # This documentation file
├── css/
│   └── styles.css              # Design system, themes, and 3D card styles
├── js/
│   ├── app.js                  # SPA routing, quiz engine, and flashcards
│   ├── review.js               # Discrepancy inspector & in-browser editor
│   └── questions-data.js       # Complete 372-question dataset (JS global)
└── data/
    ├── questions.json          # Canonical JSON dataset
    └── audit.json              # Machine-readable import audit metadata
```

---

## 🚀 How to Run

No build step or Node.js server is required.

### Option 1: Direct Browser Open
Simply double-click `index.html` or drag it into any modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local HTTP Server
Using Python's built-in web server:
```bash
# Navigate to the folder
cd "/Volumes/Personal/Projects/MBBS Preparation/Block III/MCQs"

# Launch local server
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 📚 Reference Standards
- **Physiology:** Guyton and Hall Textbook of Medical Physiology (14th Edition)
- **Anatomy:** Snell's Clinical Anatomy by Regions (10th Edition) & BD Chaurasia Vol. 3
- **Biochemistry:** Harper's Illustrated Biochemistry (32nd Edition) & Lippincott Illustrated Reviews
