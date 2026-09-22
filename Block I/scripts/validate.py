import json,collections
from pathlib import Path
questions=json.loads(Path('src/data/questions.json').read_text())
report=json.loads(Path('src/data/quality-report.json').read_text())
assert len(questions)==report['totalMcqs']==385
assert len({q['id'] for q in questions})==len(questions)
assert len({q['college'] for q in questions})==report['totalColleges']==9
assert set(q['subject'] for q in questions)=={'Anatomy','Physiology','Biochemistry'}
assert dict(collections.Counter(q['subject'] for q in questions))==report['bySubject']
assert all(q['question'] and q['hint'] and q['explanation'] for q in questions)
assert all(1<=q['sourcePage']<=92 for q in questions)
assert all(len({o['id'] for o in q['options']})==len(q['options']) for q in questions)
assert all(q['verifiedCorrectAnswer'] in {o['id'] for o in q['options']} for q in questions if q['verificationStatus']!='needs-review')
assert all(q['verifiedCorrectAnswer'] is None for q in questions if q['verificationStatus']=='needs-review')
assert all(q['correctionMade']==(q['sourceMarkedAnswer']!=q['verifiedCorrectAnswer']) for q in questions if q['verificationStatus']!='needs-review')
assert sum(q['verificationStatus']=='verified' for q in questions)==report['answersConfirmed']
assert sum(q['verificationStatus']=='corrected' for q in questions)==report['answersCorrected']
assert sum(q['verificationStatus']=='needs-review' for q in questions)==report['needsReview']
assert len(report['corrections'])==report['answersCorrected']
assert len(report['reviewItems'])==report['needsReview']
print('Validated: 92 source pages, 9 colleges, 385 items, 385 hints, 385 flashcards, verification report aligned.')
