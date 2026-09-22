import raw from './questions.json';
import type {Question,Subject} from './types';
export const questions=raw as Question[];
export const subjects:Subject[]=['Anatomy','Physiology','Biochemistry'];
export const colleges=[...new Set(questions.map(q=>q.college))];
export const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const collegeFromSlug=(s:string)=>colleges.find(c=>slug(c)===s);
export const subjectFromSlug=(s:string)=>subjects.find(x=>slug(x)===s);
export const getQuestions=(college:string,subject?:Subject)=>questions.filter(q=>q.college===college&&(!subject||q.subject===subject));
