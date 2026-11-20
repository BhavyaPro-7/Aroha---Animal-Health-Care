export type CareServiceId =
  | 'urgent-visit'
  | 'preventive-checkup'
  | 'follow-up'
  | 'animal-registration';

export interface CareServiceOption {
  id: CareServiceId;
  title: string;
  shortDesc: string;
  defaultNote: string;
}

export interface CattleProfile {
  id: string;
  name: string;
  species: 'Cow' | 'Buffalo';
  breed: string;
  tagId: string;
  stage: string;
}

export type BookingStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface FarmerBooking {
  id: string;
  referenceCode: string;
  serviceId: CareServiceId;
  serviceTitle: string;
  cattleId: string;
  cattleLabel: string;
  cattleTag: string;
  dateISO: string;
  dateLabel: string;
  timeSlot: string;
  farmerName: string;
  phone: string;
  village: string;
  district: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

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

export const HERO_IMAGE = '/src/assets/images/hero_farmer_cattle_1794926808222.jpg';
export const PROBLEM_VET_IMAGE = '/src/assets/images/problem_rural_vet_1794926808998.jpg';
export const APPROACH_HERD_IMAGE = '/src/assets/images/approach_dairy_herd_1794926809590.jpg';
export const COMMUNITY_FARMER_IMAGE = '/src/assets/images/community_rural_farmer_1794926809837.jpg';

export const CARE_SERVICES: CareServiceOption[] = [
  {
    id: 'urgent-visit',
    title: 'Veterinary Visit',
    shortDesc: 'Timely clinical visit when your cow or buffalo needs attention.',
    defaultNote: '',
  },
  {
    id: 'preventive-checkup',
    title: 'Preventive Checkup',
    shortDesc: 'Routine health check, seasonal vaccination, or deworming.',
    defaultNote: 'Routine preventive checkup and vaccination review.',
  },
  {
    id: 'follow-up',
    title: 'Post-Treatment Follow-up',
    shortDesc: 'Scheduled recovery check after an earlier treatment.',
    defaultNote: 'Post-treatment recovery and appetite follow-up.',
  },
  {
    id: 'animal-registration',
    title: 'Health Record Setup',
    shortDesc: 'Start an organized medical history for an animal.',
    defaultNote: 'Initial animal health baseline and record setup.',
  },
];

export const TIME_SLOTS = [
  '07:00 AM – 10:00 AM',
  '11:00 AM – 02:00 PM',
  '03:00 PM – 06:00 PM',
];

export const QUICK_SYMPTOM_NOTES = [
  'Reduced feed intake',
  'Routine vaccination',
  'Fever or lethargy',
  'Milk yield drop',
  'Udder check',
  'Post-calving check',
];

export const INITIAL_CATTLE: CattleProfile[] = [
  {
    id: 'cattle-1',
    name: 'Lakshmi',
    species: 'Cow',
    breed: 'Gir',
    tagId: 'IN-RJ-402',
    stage: 'Lactating',
  },
  {
    id: 'cattle-2',
    name: 'Gauri',
    species: 'Buffalo',
    breed: 'Murrah',
    tagId: 'IN-GJ-118',
    stage: 'Mid-Lactation',
  },
];

export const INITIAL_BOOKINGS: FarmerBooking[] = [
  {
    id: 'bk-seed-1',
    referenceCode: 'ARH-1042',
    serviceId: 'preventive-checkup',
    serviceTitle: 'Preventive Checkup',
    cattleId: 'cattle-1',
    cattleLabel: 'Lakshmi (Gir Cow)',
    cattleTag: 'IN-RJ-402',
    dateISO: getRelativeDateISO(1),
    dateLabel: formatDateLabel(getRelativeDateISO(1)),
    timeSlot: '07:00 AM – 10:00 AM',
    farmerName: 'Ramesh Patel',
    phone: '9876543210',
    village: 'Bhimpur',
    district: 'Anand, Gujarat',
    notes: 'Routine preventive checkup and mineral review.',
    status: 'Scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bk-seed-2',
    referenceCode: 'ARH-1018',
    serviceId: 'follow-up',
    serviceTitle: 'Post-Treatment Follow-up',
    cattleId: 'cattle-2',
    cattleLabel: 'Gauri (Murrah Buffalo)',
    cattleTag: 'IN-GJ-118',
    dateISO: getRelativeDateISO(-3),
    dateLabel: formatDateLabel(getRelativeDateISO(-3)),
    timeSlot: '11:00 AM – 02:00 PM',
    farmerName: 'Ramesh Patel',
    phone: '9876543210',
    village: 'Bhimpur',
    district: 'Anand, Gujarat',
    notes: '7-day post-treatment recovery check verified.',
    status: 'Completed',
    createdAt: new Date().toISOString(),
  },
];

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
    headline: 'Book qualified veterinary visits directly from your village.',
    description:
      'Reach veterinary care early without waiting for an animal to reach an emergency.',
  },
  {
    id: 'preventive',
    number: '02',
    title: 'Preventive Monitoring',
    headline: 'Schedule routine checkups and seasonal care on time.',
    description:
      'Keep vaccinations, deworming, and nutrition reviews organized year-round.',
  },
  {
    id: 'records',
    number: '03',
    title: 'Individual Health Records',
    headline: 'Every cow and buffalo keeps its own medical history.',
    description:
      'Past treatments and checkups stay linked to each animal tag for clear care.',
  },
  {
    id: 'followups',
    number: '04',
    title: 'Structured Follow-ups',
    headline: 'Post-treatment recovery tracked until your animal is well.',
    description:
      'Schedule follow-up visits directly from completed appointments to avoid relapse.',
  },
];

export function getRelativeDateISO(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getUpcomingBookingDays(count = 7): { iso: string; dayLabel: string; dateNum: string; monthLabel: string }[] {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const iso = getRelativeDateISO(i);
    days.push({
      iso,
      dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
      dateNum: String(d.getDate()).padStart(2, '0'),
      monthLabel: d.toLocaleDateString('en-IN', { month: 'short' }),
    });
  }
  return days;
}
