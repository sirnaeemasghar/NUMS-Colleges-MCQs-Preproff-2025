import { VerificationAuditItem } from '../types';

export interface VerificationStats {
  totalQuestions: number;
  totalColleges: number;
  anatomyQuestions: number;
  physiologyQuestions: number;
  biochemistryQuestions: number;
  answersConfirmed: number;
  answersCorrected: number;
  answersNeedsReview: number;
}

export const VERIFICATION_STATS: VerificationStats = {
  totalQuestions: 514,
  totalColleges: 9,
  anatomyQuestions: 221,
  physiologyQuestions: 132,
  biochemistryQuestions: 161,
  answersConfirmed: 507,
  answersCorrected: 5,
  answersNeedsReview: 2
};

export const AUDIT_ITEMS: VerificationAuditItem[] = [
  {
    "id": "amc-anatomy-2",
    "college": "AMC",
    "subject": "Anatomy",
    "questionNumber": 2,
    "questionStem": "The body and inferior horn of the lateral ventricle have a common boundary with the:",
    "pdfMarkedAnswer": "D",
    "verifiedAnswer": "A",
    "status": "corrected",
    "correctionReason": "The caudate nucleus is the only structure directly related to both regions: the body of the caudate borders the body of the lateral ventricle, and the tail of the caudate borders the roof of the inferior horn. The thalamus borders the body but is absent from the inferior horn.",
    "page": 1
  },
  {
    "id": "amc-anatomy-5",
    "college": "AMC",
    "subject": "Anatomy",
    "questionNumber": 5,
    "questionStem": "In Huntington\u2019s disease, which nucleus is primarily affected?",
    "pdfMarkedAnswer": "D",
    "verifiedAnswer": "A",
    "status": "corrected",
    "correctionReason": "Huntington disease primarily affects the striatum (caudate nucleus and putamen) with profound loss of GABAergic medium spiny neurons. The globus pallidus (part of the lentiform nucleus) is relatively spared early on, making Putamen (A) the anatomically accurate primary site among the options.",
    "page": 2
  },
  {
    "id": "amc-anatomy-10",
    "college": "AMC",
    "subject": "Anatomy",
    "questionNumber": 10,
    "questionStem": "The medial boundary of the internal capsule is formed by the:",
    "pdfMarkedAnswer": "C",
    "verifiedAnswer": "D",
    "status": "corrected",
    "correctionReason": "The internal capsule is bounded laterally by the lentiform nucleus (putamen and globus pallidus). Medially, it is bounded by the head of the caudate nucleus anteriorly and the thalamus posteriorly. Globus pallidus (marked C in PDF) is strictly lateral.",
    "page": 3
  },
  {
    "id": "ckmc-anatomy-20",
    "college": "CKMC",
    "subject": "Anatomy",
    "questionNumber": 20,
    "questionStem": "Crescent-shaped hematoma on X-ray indicates:",
    "pdfMarkedAnswer": "A",
    "verifiedAnswer": "B",
    "status": "corrected",
    "correctionReason": "Subdural hematomas characteristically appear as crescent-shaped (concavo-convex) collections crossing cranial suture lines. Epidural hematomas (marked A in PDF) are classically biconvex or lens-shaped and limited by sutures.",
    "page": 17
  },
  {
    "id": "ckmc-physiology-4",
    "college": "CKMC",
    "subject": "Physiology",
    "questionNumber": 4,
    "questionStem": "Satiety center located in:",
    "pdfMarkedAnswer": "A",
    "verifiedAnswer": "C",
    "status": "corrected",
    "correctionReason": "The satiety center is definitively located in the ventromedial hypothalamic nucleus (VMN), lesion of which causes hyperphagia and obesity. The lateral hypothalamus functions as the feeding/hunger center. Dorsomedial (marked A in PDF) is involved in blood pressure and GI regulation.",
    "page": 19
  },
  {
    "id": "ckmc-biochemistry-18",
    "college": "CKMC",
    "subject": "Biochemistry",
    "questionNumber": 18,
    "questionStem": "Telomerase action:",
    "pdfMarkedAnswer": "A",
    "verifiedAnswer": "B",
    "status": "needs-review",
    "correctionReason": "In purine nucleotide synthesis, aspartate donates only nitrogen at position N1. Position N7 is derived from glycine (along with C4 and C5), and N3 and N9 are donated by glutamine. Option B (\"N1, N7\") is the intended answer key in the Pakistani medical syllabus, but is biochemically imprecise for N7.",
    "page": 24
  },
  {
    "id": "cims-bwp-anatomy-12",
    "college": "CIMS BWP",
    "subject": "Anatomy",
    "questionNumber": 12,
    "questionStem": "Downward herniation of cerebellum and spinal cord (Chiari malformation) occurs due to:",
    "pdfMarkedAnswer": "A",
    "verifiedAnswer": "A",
    "status": "needs-review",
    "correctionReason": "Chiari II malformation is classically linked to caudal neural tube defects (myelomeningocele) and hypoplasia of the posterior cranial fossa. Failure of cranial neuropore closure (marked in PDF) actually causes anencephaly. Preserved as marked with review flag.",
    "page": 55
  }
];
