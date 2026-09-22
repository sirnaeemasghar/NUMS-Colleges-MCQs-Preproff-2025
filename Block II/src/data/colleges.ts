import { CollegeInfo } from '../types';

export const COLLEGES: CollegeInfo[] = [
  {
    "id": "amc",
    "name": "AMC",
    "fullName": "Army Medical College, Rawalpindi",
    "city": "Rawalpindi",
    "accent": "#dc2626",
    "description": "Premier military medical college affiliated with NUMS, established in 1977.",
    "totalMCQs": 36,
    "anatomyCount": 10,
    "physiologyCount": 10,
    "biochemistryCount": 16,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  },
  {
    "id": "cmh-lhr",
    "name": "CMH Lahore",
    "fullName": "CMH Lahore Medical College",
    "city": "Lahore",
    "accent": "#2563eb",
    "description": "Renowned armed forces medical institution located in Lahore Cantonment.",
    "totalMCQs": 31,
    "anatomyCount": 22,
    "physiologyCount": 5,
    "biochemistryCount": 4,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  },
  {
    "id": "ckmc",
    "name": "CKMC",
    "fullName": "CMH Kharian Medical College",
    "city": "Kharian",
    "accent": "#7c3aed",
    "description": "Constituent medical college located at Kharian Cantonment.",
    "totalMCQs": 71,
    "anatomyCount": 31,
    "physiologyCount": 17,
    "biochemistryCount": 23,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  },
  {
    "id": "cims-multan",
    "name": "CIMS Multan",
    "fullName": "Combined Institute of Medical Sciences, Multan",
    "city": "Multan",
    "accent": "#059669",
    "description": "Prestigious medical institute situated in Multan Cantonment.",
    "totalMCQs": 69,
    "anatomyCount": 28,
    "physiologyCount": 19,
    "biochemistryCount": 22,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  },
  {
    "id": "wmc",
    "name": "WMC",
    "fullName": "Wah Medical College",
    "city": "Wah Cantt",
    "accent": "#d97706",
    "description": "Leading private medical college affiliated with NUMS, located in Wah Cantt.",
    "totalMCQs": 56,
    "anatomyCount": 24,
    "physiologyCount": 12,
    "biochemistryCount": 20,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  },
  {
    "id": "hitec",
    "name": "HITEC",
    "fullName": "HITEC Institute of Medical Sciences",
    "city": "Taxila",
    "accent": "#0891b2",
    "description": "Modern medical institution situated in Taxila under Heavy Industries Taxila Education City.",
    "totalMCQs": 27,
    "anatomyCount": 27,
    "physiologyCount": 0,
    "biochemistryCount": 0,
    "availableSubjects": [
      "anatomy"
    ]
  },
  {
    "id": "cims-bwp",
    "name": "CIMS BWP",
    "fullName": "CIMS Bahawalpur",
    "city": "Bahawalpur",
    "accent": "#ea580c",
    "description": "Advanced medical education institute situated in Bahawalpur Cantonment.",
    "totalMCQs": 57,
    "anatomyCount": 18,
    "physiologyCount": 19,
    "biochemistryCount": 20,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  },
  {
    "id": "qims",
    "name": "QIMS",
    "fullName": "Quetta Institute of Medical Sciences",
    "city": "Quetta",
    "accent": "#4f46e5",
    "description": "Premier medical college of Balochistan affiliated with NUMS, located in Quetta Cantonment.",
    "totalMCQs": 84,
    "anatomyCount": 30,
    "physiologyCount": 25,
    "biochemistryCount": 29,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  },
  {
    "id": "kims",
    "name": "KIMS",
    "fullName": "Karachi Institute of Medical Sciences",
    "city": "Karachi",
    "accent": "#db2777",
    "description": "Military medical college affiliated with NUMS, located at Malir Cantonment, Karachi.",
    "totalMCQs": 83,
    "anatomyCount": 31,
    "physiologyCount": 25,
    "biochemistryCount": 27,
    "availableSubjects": [
      "anatomy",
      "physiology",
      "biochemistry"
    ]
  }
];

export const COLLEGE_MAP: Record<string, CollegeInfo> = COLLEGES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {} as Record<string, CollegeInfo>);
