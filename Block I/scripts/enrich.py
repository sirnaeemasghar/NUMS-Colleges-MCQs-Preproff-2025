import json,re,collections
from pathlib import Path
p=Path('src/data/questions.json');items=json.loads(p.read_text())
# Each item here was reviewed independently of the PDF checkmark. The last field is an optional reference.
V={
'AMC|Anatomy|1':('C','Albumin is a colloid; saline, dextrose and Ringer’s lactate are crystalloids.','Distinguish large-molecule plasma expanders from electrolyte solutions.',None),
'AMC|Anatomy|3':('B','The suspensory muscle of the duodenum marks the duodenojejunal junction.','Recall the ligament that suspends the junction between duodenum and jejunum.',None),
'AMC|Anatomy|4':('A','The colon has straight tubular crypts with abundant goblet cells and no villi.','Compare crypt shape and goblet-cell abundance along the gut.',None),
'AMC|Anatomy|5':('A','The common hepatic duct forms the medial border of the hepatocystic triangle.','Map the three boundaries of the surgical triangle before choosing.','https://www.ncbi.nlm.nih.gov/books/NBK459246/'),
'AMC|Anatomy|9':('B','The horseshoe kidney is arrested beneath the inferior mesenteric artery during ascent.','Think of the artery crossing the fused lower renal poles.',None),
'AMC|Anatomy|10':('B','The left gastric artery runs along the lesser curvature and can bleed from an ulcer there.','Trace the vessel along the lesser curvature.',None),
'AMC|Anatomy|11':('A','An omphalocele herniates through the umbilical ring and is covered by a membrane; gastroschisis is uncovered.','Use the presence or absence of a covering sac to separate abdominal-wall defects.',None),
'AMC|Physiology|1':('A','Early salicylate toxicity stimulates ventilation, producing respiratory alkalosis; later acid accumulation causes metabolic acidosis.','Think about the early effect on breathing and the later effect of organic acids.',None),
'AMC|Physiology|2':('C','Cholecystokinin is the main hormonal driver of pancreatic enzyme secretion after a meal.','Which duodenal hormone responds to fat and protein and acts on pancreatic acini?',None),
'AMC|Physiology|3':('B','Enteropeptidase activates trypsinogen; trypsin then activates the other pancreatic zymogens.','Start with the brush-border activator of trypsinogen.',None),
'AMC|Physiology|5':('D','Afferent arteriolar constriction lowers glomerular capillary hydrostatic pressure and filtration.','Trace how less blood reaching the glomerulus changes capillary pressure.',None),
'AMC|Physiology|7':('A','Low ionized calcium increases neuromuscular excitability, causing tetany and Chvostek’s sign.','Consider which extracellular ion stabilizes excitable membranes.',None),
'AMC|Physiology|10':('C','Gastric distension after a meal can increase colonic motility through the gastrocolic reflex.','Think of the reflex linking a filled stomach to colonic movement.',None),
'AMC|Physiology|15':('A','Uncontrolled diabetes can generate excess ketoacids, causing metabolic acidosis.','Recall the acidic products of increased fat breakdown when insulin is deficient.',None),
'AMC|Biochemistry|2':('B','The ureteric bud must interact with metanephric mesenchyme to induce kidney development.','Think about the two embryonic tissues that induce each other during renal formation.','https://www.ncbi.nlm.nih.gov/books/NBK10089/'),
'AMC|Biochemistry|7':('A','Clearance equals urine concentration times urine flow divided by plasma concentration: 196 × 1 ÷ 1.4 = 140 mL/min.','Apply C = U × V / P and keep the units as mL/min.',None),
'CMH Lahore|Anatomy|2':('C','The first part of the duodenum forms the inferior boundary of the epiploic foramen.','Picture the four borders of the opening to the lesser sac.',None),
'CMH Lahore|Anatomy|6':('B','The left gastric vein connects the portal system with esophageal systemic veins.','Recall the portosystemic connection at the lower esophagus.',None),
'CMH Lahore|Anatomy|8':('B','The retrocecal position is the most common position of the vermiform appendix.','Visualize where the appendix most often lies relative to the cecum.',None),
'CMH Lahore|Anatomy|13':('C','The ventral pancreatic bud contributes the uncinate process and inferior part of the pancreatic head.','Distinguish derivatives of the dorsal and ventral pancreatic buds.',None),
'CMH Lahore|Anatomy|24':('A','The cervical squamocolumnar junction lies at or near the external os in classic descriptions; its precise location changes with age and hormones, but the internal os is not its usual site.','Distinguish the opening into the vagina from the opening into the uterine cavity.','https://www.ncbi.nlm.nih.gov/books/NBK568392/'),
'CMH Lahore|Physiology|25':('A','Granular cells of the afferent arteriole release renin in response to renal perfusion signals.','Focus on the modified vascular smooth muscle cells near the glomerulus.',None),
'CMH Lahore|Physiology|26':('B','Renal interstitial fibroblast-like cells are the main source of erythropoietin.','Think of oxygen-sensing interstitial cells rather than tubular epithelium.',None),
'CKMC|Anatomy|2':('C','The testicular arteries arise directly from the abdominal aorta.','Trace the gonadal artery to its major parent vessel.',None),
'CKMC|Anatomy|4':('B','Occluding the deep inguinal ring prevents an indirect hernia from protruding while a direct hernia can still appear.','Compare the two inguinal hernia paths relative to the deep ring.',None),
'CKMC|Anatomy|8':('B','The perineal membrane forms the roof of the superficial perineal pouch.','Identify the membrane above the superficial perineal space.',None),
'CIMS Multan|Anatomy|1':('B','Corpora amylacea are concentrically laminated bodies found in prostatic gland lumens.','Recall the gland with age-related lamellated secretions.',None),
'CIMS Multan|Anatomy|3':('A','The rectum begins at the rectosigmoid junction at the level of S3.','Locate the vertebral level where sigmoid colon becomes rectum.',None),
'CIMS Multan|Anatomy|5':('A','The jejunum has fewer arterial arcades and longer vasa recta than the ileum.','Compare mesenteric arcades in proximal and distal small bowel.',None),
'CIMS Multan|Anatomy|7':('A','The splenorenal ligament contains the splenic vessels and pancreatic tail.','Think of the peritoneal fold running toward the left kidney.',None),
'CIMS Multan|Anatomy|19':('A','Gallstones commonly erode through a cholecystoduodenal fistula because the duodenum is adjacent to the gallbladder; colonic fistulas are less common.','Which bowel segment lies closest to the gallbladder?','https://www.ncbi.nlm.nih.gov/books/NBK430738/'),
'WMC|Anatomy|2':('C','The spleen develops from mesenchyme in the dorsal mesogastrium.','Recall which embryonic mesentery houses the splenic primordium.',None),
'WMC|Anatomy|3':('B','The most common uterine position is anteverted and anteflexed, not retroflexed.','Separate the tilt of the cervix from the bend of the uterine body.','https://www.ncbi.nlm.nih.gov/books/NBK557575/'),
'WMC|Anatomy|9':('B','The cystic duct is a border of the hepatocystic triangle; the cystic artery is a structure within it.','Separate the triangle boundaries from the vessels found inside it.','https://www.ncbi.nlm.nih.gov/books/NBK459246/'),
'WMC|Physiology|3':('A','Hypotonic saline lowers extracellular osmolality, so water enters cells and they swell.','Follow water movement when extracellular fluid becomes less concentrated.',None),
'HITEC|Biochemistry|3':('A','Deficiency of homogentisate 1,2-dioxygenase causes homogentisic acid accumulation in alkaptonuria.','Think of the tyrosine degradation step that produces dark urine.',None),
'CIMS BWP|Anatomy|1':('C','The deep inguinal ring is an opening in transversalis fascia just above the inguinal ligament and lateral to the inferior epigastric vessels.','Use the inferior epigastric vessels as your landmark.',None),
'QIMS|Physiology|30':('B','Duodenal distension activates enterogastric reflex pathways that inhibit gastric motility.','Which duodenal change would signal the stomach to slow emptying?',None),
'KIMS|Biochemistry|70':('D','Failure of the urea cycle prevents ammonia disposal and can cause neonatal hyperammonemia.','Recall the hepatic pathway that converts toxic nitrogen into an excretable compound.',None),
}
patterns=[
(r'artery|arterial|blood supply|bleeding', 'Trace the vessel through its usual anatomical course and neighboring structures.'),
(r'nerve|innervation|plexus', 'Use the region supplied and the course of the relevant nerve to eliminate distractors.'),
(r'hernia|inguinal', 'Locate the defect relative to the inguinal ligament and inferior epigastric vessels.'),
(r'kidney|renal|ureter|urine|neph', 'Follow the renal structure or nephron segment involved before choosing.'),
(r'uter|ovar|vagin|cervix|fallopian', 'Map the reproductive structure, its attachments, and nearby vessels.'),
(r'pancrea|duoden|gastric|stomach|intestin|bowel|gut', 'Match the location in the gastrointestinal tract to its usual structure or function.'),
(r'acid|alkalo|ph|hco|pco', 'Read the pH first, then identify which primary variable changes in the same direction.'),
(r'hormone|secret|cck|gastrin', 'Identify the stimulus for release, then connect it to the hormone’s main target.'),
(r'enzyme|deficiency|metaboli|ammonia|protein', 'Work through the pathway one step at a time and locate the blocked reaction.'),
(r'calcium|potassium|sodium|electrolyte', 'Connect the electrolyte change to its effect on membrane excitability and fluid balance.'),
(r'embryo|develop|bud|mesenter', 'Trace the relevant embryonic primordium to the adult structure.'),
(r'microscop|epithel|histolog|cell|gland', 'Compare the tissue’s lining and characteristic cell types.'),
]
def hint(q):
 t=q['question'].lower()
 for pat,h in patterns:
  if re.search(pat,t):return h
 return {'Anatomy':'Locate the structure first, then compare its relations with the nearby options.','Physiology':'Identify the stimulus and follow the physiological response step by step.','Biochemistry':'Place the finding within its metabolic pathway before choosing.'}[q['subject']]
for q in items:
 k=f"{q['college']}|{q['subject']}|{q['originalQuestionNumber']}"
 if k in V:
  answer,explanation,h,ref=V[k]
  if answer not in [o['id'] for o in q['options']]:raise Exception(k)
  q['verifiedCorrectAnswer']=answer;q['explanation']=explanation;q['hint']=h
  q['correctionMade']=answer!=q['sourceMarkedAnswer']
  q['verificationStatus']='corrected' if q['correctionMade'] else 'verified'
  if ref:q['verificationReferences']=[ref]
 else:
  q['hint']=hint(q)
  q['explanation']='This item is awaiting independent medical verification. The PDF-marked choice is not treated as a confirmed answer.'
  if len(q['options'])!=4:q['reviewReason']='The PDF does not provide a complete four-option MCQ.'
  elif not q['sourceMarkedAnswer']:q['reviewReason']='The PDF does not mark one answer.'
  elif k=='AMC|Biochemistry|3':q['reviewReason']='Elevated citrulline most strongly suggests argininosuccinate synthetase deficiency, which is absent from the options.'
  elif k=='QIMS|Physiology|29':q['reviewReason']='GI slow waves arise from interstitial cells of Cajal, absent from the listed options.'
  else:q['reviewReason']='Awaiting independent answer check.'
p.write_text(json.dumps(items,ensure_ascii=False,indent=2))
confirmed=sum(q['verificationStatus']=='verified' for q in items);corrected=sum(q['verificationStatus']=='corrected' for q in items);pending=sum(q['verificationStatus']=='needs-review' for q in items)
report={'sourcePdf':'NUMS BLOCK 4 PREPROF MCQS 2025.pdf','pagesProcessed':92,'totalColleges':len({q['college'] for q in items}),'totalMcqs':len(items),'bySubject':dict(collections.Counter(q['subject'] for q in items)),'answersConfirmed':confirmed,'answersCorrected':corrected,'needsReview':pending,'corrections':[{'college':q['college'],'subject':q['subject'],'questionNumber':q['originalQuestionNumber'],'sourcePage':q['sourcePage'],'sourceMarkedAnswer':q['sourceMarkedAnswer'],'verifiedCorrectAnswer':q['verifiedCorrectAnswer'],'reason':q['explanation'],'verificationStatus':q['verificationStatus'],'references':q.get('verificationReferences',[])} for q in items if q['correctionMade']],'reviewItems':[{'college':q['college'],'subject':q['subject'],'questionNumber':q['originalQuestionNumber'],'sourcePage':q['sourcePage'],'reason':q['reviewReason']} for q in items if q['verificationStatus']=='needs-review']}
Path('src/data/quality-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('confirmed',confirmed,'corrected',corrected,'needs review',pending)
