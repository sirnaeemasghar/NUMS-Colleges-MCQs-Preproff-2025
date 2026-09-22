export type Subject = 'Anatomy' | 'Physiology' | 'Biochemistry';
export type OptionId = 'A' | 'B' | 'C' | 'D';
export interface Question {id:string; college:string; subject:Subject; originalQuestionNumber:string; question:string; options:{id:OptionId;text:string}[]; sourceMarkedAnswer:OptionId|null; verifiedCorrectAnswer:OptionId|null; hint:string; explanation:string; verificationStatus:'verified'|'corrected'|'needs-review'; correctionMade:boolean; sourcePage:number; sourceHeading:string}
export interface StudyProgress {attempts:number;latestScore:number|null;bestScore:number|null;lastQuestion:number;flashcardsViewed:number[];flashcardsCompleted:boolean}
