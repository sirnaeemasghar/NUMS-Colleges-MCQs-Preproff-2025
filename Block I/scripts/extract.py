import pdfplumber,re,json,collections,unicodedata
from pathlib import Path
PDF=str(Path(__file__).resolve().parents[1] / 'source' / 'NUMS BLOCK 4 PREPROF MCQS 2025.pdf')
OUT=Path('src/data/questions.json')
COLLEGES={'AMC':'AMC','CMH LHR':'CMH Lahore','CKMC':'CKMC','CIMS MULTAN':'CIMS Multan','WMC':'WMC','HITEC':'HITEC','CIMS BWP':'CIMS BWP','QIMS':'QIMS','KIMS':'KIMS'}
SUBJECTS=('ANATOMY','PHYSIOLOGY','BIOCHEMISTRY')
noise=('MJ MEDICOS','NUMS BLOCK 4 PREPROF','CEO :','TO JOIN OUR WHATSAPP')
emoji_digits={'🔟':'10'}
for i in range(1,10): emoji_digits[str(i)+'⃣']=str(i); emoji_digits[str(i)+'️⃣']=str(i)
def clean(s): return re.sub(r'\s+',' ',s).strip()
def qstart(s):
 for e,n in emoji_digits.items():
  if s.startswith(e): return n,clean(s[len(e):])
 m=re.match(r'^(\d{1,3})(?:⃣|️⃣|[.)])\s*(.+)$',s)
 return (m.group(1),m.group(2)) if m else None
def optstart(s):
 m=re.match(r'^([✅✔✓]\s*)?([A-Da-d])[.)]\s*(?:[✅✔✓]\s*)?(.*)$',s)
 if m:return m.group(2).upper(),clean(m.group(3)),bool(m.group(1) or re.search('[✅✔✓]',s))
 return None
items=[];college=None;subject=None;heading=None;q=None;part=None;pages_seen=[]
def flush():
 global q
 if not q:return
 q['question']=clean(q['question'])
 q['options']=[{'id':k,'text':clean(re.sub('[✅✔✓]','',v))} for k,v in sorted(q['options'].items())]
 q['sourceMarkedAnswer']=q.pop('_mark',None)
 q['verifiedCorrectAnswer']=None
 q['verificationStatus']='needs-review'
 q['correctionMade']=False
 q['hint']='Recall the key anatomical, physiological, or biochemical relationship tested in the question before comparing the options.'
 q['explanation']='This answer has not yet been independently verified against a medical reference.'
 q['sourceHeading']=heading
 q['id']=f"{q['college'].lower().replace(' ','-')}-{q['subject'].lower()}-{len(items)+1}"
 items.append(q);q=None
with pdfplumber.open(PDF) as pdf:
 for pi,page in enumerate(pdf.pages,1):
  pg=page.filter(lambda o:o.get('object_type')!='char' or o.get('size',0)<40)
  pages_seen.append(pi)
  for raw in (pg.extract_text() or '').splitlines():
   s=clean(raw)
   if not s or any(s.startswith(x) for x in noise) or s in ('🩻','🧠','⚙','⚙️'):continue
   upper=s.upper()
   if upper in COLLEGES:
    flush();college=COLLEGES[upper];subject=None;heading=None;part=None;continue
   if any(x in upper for x in SUBJECTS) and len(s)<75 and ('MCQ' in upper or upper.startswith(SUBJECTS)):
    flush();subject=next(x.title() for x in SUBJECTS if x in upper);heading=s;part=None;continue
   if s.startswith('💡'):continue
   qs=qstart(s)
   if qs and college and subject:
    flush();q={'college':college,'subject':subject,'originalQuestionNumber':qs[0],'question':qs[1],'options':{},'sourcePage':pi};part='question';continue
   op=optstart(s)
   if op and q:
    key,value,marked=op
    if key not in q['options']:
     q['options'][key]=value
     if marked:q['_mark']=key
     part=key;continue
   if q:
    if part=='question':q['question']+=' '+s
    elif part in q['options']:q['options'][part]+=' '+s
 flush()
OUT.write_text(json.dumps(items,ensure_ascii=False,indent=2))
stats=collections.Counter((x['college'],x['subject']) for x in items)
issues=[x for x in items if len(x['options'])!=4 or not x['sourceMarkedAnswer'] or not x['question']]
print('pages',len(pages_seen),'questions',len(items),'colleges',len({x['college'] for x in items}))
for c in COLLEGES.values():print(c,{s:stats[c,s] for s in ['Anatomy','Physiology','Biochemistry']})
print('issues',len(issues))
for x in issues[:60]:print(x['sourcePage'],x['college'],x['subject'],x['originalQuestionNumber'],len(x['options']),x['sourceMarkedAnswer'],x['question'][:65])
