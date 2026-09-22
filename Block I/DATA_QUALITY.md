# PDF extraction and answer audit

**Source:** `source/NUMS BLOCK 4 PREPROF MCQS 2025.pdf` (92 pages). The source was parsed from page 1 through page 92. Its question numbering has a jump in KIMS from Physiology Q50 to Biochemistry Q56; Q51–55 do not appear at that transition in the PDF.

| Measure | Count |
|---|---:|
| Colleges | 9 |
| Total numbered items | 385 |
| Anatomy | 181 |
| Physiology | 118 |
| Biochemistry | 86 |
| Four-option items | 377 |
| PDF answers independently confirmed | 35 |
| PDF answers corrected | 4 |
| Needs independent medical review | 346 |

The nine colleges are AMC, CMH Lahore, CKMC, CIMS Multan, WMC, HITEC, CIMS BWP, QIMS, and KIMS. Each question remains under its source college; repeated questions across colleges were retained. The application contains one flashcard per numbered item and one hint per item. Quiz scoring uses only `verifiedCorrectAnswer` and excludes items with `verificationStatus: "needs-review"`.

## Corrected PDF answers

| College | Subject | Q | PDF | Verified | Reason |
|---|---|---:|---|---|---|
| CMH Lahore | Anatomy | 24 | B | A | The cervical squamocolumnar junction is typically at or near the external os, with location varying over life; the internal os is not its usual site. [NCBI reference](https://www.ncbi.nlm.nih.gov/books/NBK568392/) |
| CIMS Multan | Anatomy | 19 | B | A | Gallstones most commonly enter bowel via a cholecystoduodenal fistula; a colonic fistula is less common. [NCBI reference](https://www.ncbi.nlm.nih.gov/books/NBK430738/) |
| WMC | Anatomy | 3 | A | B | The most common uterine orientation is anteverted and anteflexed. [NCBI reference](https://www.ncbi.nlm.nih.gov/books/NBK557575/) |
| WMC | Anatomy | 9 | C | B | The cystic duct is a triangle border; the cystic artery lies within the hepatocystic triangle. [NCBI reference](https://www.ncbi.nlm.nih.gov/books/NBK459246/) |

## Review queue

The complete item-by-item review list is in [`src/data/quality-report.json`](src/data/quality-report.json). Eight source items have fewer than four options or no single marked answer and require source reconstruction. Two further examples of medical ambiguity are AMC Biochemistry Q3, where the most direct enzyme deficiency is absent from the choices, and QIMS Physiology Q29, where the pacemaker cells responsible for gut slow waves are absent from the choices. Both remain unscored.

The PDF is the source of question wording and grouping, not an automatic authority for medical answers. Pending items must not be treated as confirmed by students or by the scoring system.
