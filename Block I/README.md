# NUMS Block 6 · Pre-Prof MCQ Study

College-wise React/TypeScript study app built from the attached **NUMS BLOCK 4 PREPROF MCQS 2025.pdf**. The requested app title says Block 6; the source PDF itself says Block 4.

## Run

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite. `npm run build` creates a production bundle in `dist/`.

## Question bank

- Source: [`source/NUMS BLOCK 4 PREPROF MCQS 2025.pdf`](source/NUMS%20BLOCK%204%20PREPROF%20MCQS%202025.pdf), 92 pages.
- Structured questions: [`src/data/questions.json`](src/data/questions.json), 385 numbered items from nine colleges.
- Audit: [`src/data/quality-report.json`](src/data/quality-report.json).
- Extraction and enrichment scripts: `scripts/extract.py`, `scripts/enrich.py`.

The PDF checkmark is stored only in `sourceMarkedAnswer`. The app scores against `verifiedCorrectAnswer`. If that field is null, the question remains visible but is excluded from the score. At this stage, 35 PDF answers are independently confirmed, four are corrected, and 346 need medical review. The report lists all pending items and four corrections. Eight source items lack a full four-choice set or a single marked answer; they were retained for completeness.

Recreate the dataset with the bundled Python runtime plus `pdfplumber`:

```bash
/Users/naeemasghar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/extract.py
python3 scripts/enrich.py
```

Use `scripts/enrich.py` for further item-level verification and add an authoritative reference when a disputed answer is corrected. Do not mark pending items as verified based solely on the PDF checkmark.

## Features

College → subject → quiz / flashcards, local progress, search, answer review, light/dark theme, responsive layout, and clean browser routes. Progress is stored in browser `localStorage`, without a login.
