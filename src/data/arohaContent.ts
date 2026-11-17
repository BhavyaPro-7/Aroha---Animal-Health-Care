export interface ChallengeItem {
  number: string;
  title: string;
  summary: string;
}

export interface ApproachStage {
  id: string;
  number: string;
  title: string;
  headline: string;
  description: string;
}

export interface AnimalRecordSample {
  id: string;
  tagId: string;
  breed: string;
  nextFollowUp: string;
  steps: {
    label: string;
    detail: string;
  }[];
}

export const HERO_IMAGE = '/src/assets/images/hero_farmer_cattle_1794926808222.jpg';
export const PROBLEM_VET_IMAGE = '/src/assets/images/problem_rural_vet_1794926808998.jpg';
export const APPROACH_HERD_IMAGE = '/src/assets/images/approach_dairy_herd_1794926809590.jpg';
export const COMMUNITY_FARMER_IMAGE = '/src/assets/images/community_rural_farmer_1794926809837.jpg';

export const CHALLENGES: ChallengeItem[] = [
  {
    number: '01',
    title: 'Delayed Veterinary Access',
    summary: 'Rural farmers struggle to reach qualified veterinarians quickly.',
  },
  {
    number: '02',
    title: 'Reactive Healthcare',
    summary: 'Routine preventive health checkups are often overlooked.',
  },
  {
    number: '03',
    title: 'Missing Medical Records',
    summary: 'There is no organized health history for individual animals.',
  },
  {
    number: '04',
    title: 'Weak Follow-ups',
    summary: 'Post-treatment recovery and follow-up visits lack continuity.',
  },
];

export const APPROACH_STAGES: ApproachStage[] = [
  {
    id: 'access',
    number: '01',
    title: 'Timely Veterinary Access',
    headline: 'Connecting rural farmers with qualified veterinarians without delay.',
    description:
      'Early clinical guidance and coordinated field visits ensure health issues are addressed before they escalate.',
  },
  {
    id: 'preventive',
    number: '02',
    title: 'Preventive Monitoring',
    headline: 'Routine checkups that protect herd health year-round.',
    description:
      'Scheduled vaccinations, deworming, and seasonal health reviews shift care from emergency response to prevention.',
  },
  {
    id: 'records',
    number: '03',
    title: 'Individual Health Records',
    headline: 'An organized medical history for every cow and buffalo.',
    description:
      'Treatments, vaccinations, and checkup notes stay structured per animal for faster, more accurate care.',
  },
  {
    id: 'followups',
    number: '04',
    title: 'Structured Follow-ups',
    headline: 'Consistent post-treatment care until full recovery.',
    description:
      'Guided recovery checkpoints help farmers track healing and prevent repeat complications.',
  },
];

export const SAMPLE_RECORDS: AnimalRecordSample[] = [
  {
    id: 'gir-402',
    tagId: 'IN-RJ-402',
    breed: 'Gir Cow',
    nextFollowUp: '14 Nov 2026',
    steps: [
      { label: 'Preventive Checkup', detail: 'Udder health and nutrition review completed' },
      { label: 'Immunization', detail: 'Seasonal vaccination logged on schedule' },
      { label: 'Follow-up Care', detail: 'Post-treatment recovery verified' },
    ],
  },
  {
    id: 'murrah-118',
    tagId: 'IN-GJ-118',
    breed: 'Murrah Buffalo',
    nextFollowUp: '25 Nov 2026',
    steps: [
      { label: 'Early Consultation', detail: 'Prompt veterinary assessment recorded' },
      { label: 'Deworming Cycle', detail: 'Scheduled dose tracked in profile' },
      { label: 'Recovery Check', detail: '7-day follow-up completed cleanly' },
    ],
  },
];
