import {
  Timestamp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  BookingStatus,
  CareServiceId,
  CattleProfile,
  FarmerBooking,
  TIME_SLOTS,
} from '../data/arohaContent';
import { OperationType, db, handleFirestoreError } from './firebase';

const TAG_REGEX = /^[a-zA-Z0-9-]+$/;
const PHONE_REGEX = /^[+0-9\s()-]{10,16}$/;
const DATE_ISO_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
const REF_REGEX = /^ARH-[0-9]{4,8}$/;

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
}

function sanitizeTag(raw: string): string {
  const cleaned = raw.trim().replace(/[^a-zA-Z0-9-]/g, '').slice(0, 32);
  return cleaned.length >= 2 ? cleaned : `IN-${Math.floor(100 + Math.random() * 899)}`;
}

function toMillis(val: unknown): number {
  if (val instanceof Timestamp) return val.toMillis();
  if (typeof val === 'string') {
    const parsed = Date.parse(val);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export async function ensureFarmerProfile(
  uid: string,
  displayName: string
): Promise<void> {
  const path = `farmers/${uid}`;
  const ref = doc(db, 'farmers', uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const safeName = (displayName || 'AROHA Farmer').trim().slice(0, 100) || 'AROHA Farmer';
      await setDoc(ref, {
        ownerUid: uid,
        displayName: safeName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeFarmerCattle(
  uid: string,
  onData: (cattle: CattleProfile[]) => void,
  onError: (err: Error) => void
): () => void {
  const path = `farmers/${uid}/cattle`;
  const q = query(collection(db, 'farmers', uid, 'cattle'), where('ownerUid', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: (CattleProfile & { _sortMs: number })[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name ?? ''),
          species: data.species === 'Buffalo' ? 'Buffalo' : 'Cow',
          breed: String(data.breed ?? ''),
          tagId: String(data.tagId ?? ''),
          stage: String(data.stage ?? ''),
          _sortMs: toMillis(data.createdAt),
        };
      });
      items.sort((a, b) => b._sortMs - a._sortMs);
      onData(items.map(({ _sortMs: _, ...rest }) => rest));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export function subscribeFarmerBookings(
  uid: string,
  onData: (bookings: FarmerBooking[]) => void,
  onError: (err: Error) => void
): () => void {
  const path = `farmers/${uid}/bookings`;
  const q = query(collection(db, 'farmers', uid, 'bookings'), where('ownerUid', '==', uid));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: (FarmerBooking & { _sortMs: number })[] = snapshot.docs.map((d) => {
        const data = d.data();
        const createdMs = toMillis(data.createdAt);
        return {
          id: d.id,
          referenceCode: String(data.referenceCode ?? ''),
          serviceId: data.serviceId as CareServiceId,
          serviceTitle: String(data.serviceTitle ?? ''),
          cattleId: String(data.cattleId ?? ''),
          cattleLabel: String(data.cattleLabel ?? ''),
          cattleTag: String(data.cattleTag ?? ''),
          dateISO: String(data.dateISO ?? ''),
          dateLabel: String(data.dateLabel ?? ''),
          timeSlot: String(data.timeSlot ?? ''),
          farmerName: String(data.farmerName ?? ''),
          phone: String(data.phone ?? ''),
          village: String(data.village ?? ''),
          district: String(data.district ?? ''),
          notes: String(data.notes ?? ''),
          status: (data.status as BookingStatus) ?? 'Scheduled',
          createdAt: createdMs ? new Date(createdMs).toISOString() : new Date().toISOString(),
          _sortMs: createdMs,
        };
      });
      items.sort((a, b) => b._sortMs - a._sortMs);
      onData(items.map(({ _sortMs: _, ...rest }) => rest));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function createCattleProfile(
  uid: string,
  displayName: string,
  draft: Omit<CattleProfile, 'id'>
): Promise<CattleProfile> {
  await ensureFarmerProfile(uid, displayName);

  const cattleId = sanitizeId(`cattle_${Date.now()}_${Math.floor(100 + Math.random() * 899)}`);
  const name = draft.name.trim().slice(0, 60);
  const breed = draft.breed.trim().slice(0, 60);
  const tagId = sanitizeTag(draft.tagId);
  const stage = (draft.stage.trim() || 'Active').slice(0, 40);
  const species: 'Cow' | 'Buffalo' = draft.species === 'Buffalo' ? 'Buffalo' : 'Cow';

  if (name.length < 1 || breed.length < 1 || !TAG_REGEX.test(tagId)) {
    throw new Error('Invalid animal profile fields.');
  }

  const path = `farmers/${uid}/cattle/${cattleId}`;
  try {
    await setDoc(doc(db, 'farmers', uid, 'cattle', cattleId), {
      ownerUid: uid,
      name,
      species,
      breed,
      tagId,
      stage,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: cattleId, name, species, breed, tagId, stage };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function createFarmerBooking(
  uid: string,
  displayName: string,
  draft: Omit<FarmerBooking, 'id' | 'referenceCode' | 'status' | 'createdAt'>
): Promise<FarmerBooking> {
  await ensureFarmerProfile(uid, displayName);

  const bookingId = sanitizeId(`bk_${Date.now()}_${Math.floor(100 + Math.random() * 899)}`);
  const referenceCode = `ARH-${Math.floor(1000 + Math.random() * 8999)}`;

  const cattleId = sanitizeId(draft.cattleId);
  const cattleLabel = draft.cattleLabel.trim().slice(0, 100);
  const cattleTag = sanitizeTag(draft.cattleTag);
  const serviceTitle = draft.serviceTitle.trim().slice(0, 60);
  const dateISO = draft.dateISO.trim();
  const dateLabel = draft.dateLabel.trim().slice(0, 40);
  const timeSlot = TIME_SLOTS.includes(draft.timeSlot) ? draft.timeSlot : TIME_SLOTS[0];
  const farmerName = draft.farmerName.trim().slice(0, 100);
  const phone = draft.phone.trim().slice(0, 16);
  const village = draft.village.trim().slice(0, 80);
  const district = draft.district.trim().slice(0, 80);
  const notes = draft.notes.trim().slice(0, 500);

  if (
    !REF_REGEX.test(referenceCode) ||
    !DATE_ISO_REGEX.test(dateISO) ||
    !PHONE_REGEX.test(phone) ||
    farmerName.length < 2 ||
    village.length < 1 ||
    district.length < 1
  ) {
    throw new Error('Booking details failed schema validation.');
  }

  const path = `farmers/${uid}/bookings/${bookingId}`;
  try {
    await setDoc(doc(db, 'farmers', uid, 'bookings', bookingId), {
      ownerUid: uid,
      referenceCode,
      serviceId: draft.serviceId,
      serviceTitle,
      cattleId,
      cattleLabel,
      cattleTag,
      dateISO,
      dateLabel,
      timeSlot,
      farmerName,
      phone,
      village,
      district,
      notes,
      status: 'Scheduled',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: bookingId,
      referenceCode,
      serviceId: draft.serviceId,
      serviceTitle,
      cattleId,
      cattleLabel,
      cattleTag,
      dateISO,
      dateLabel,
      timeSlot,
      farmerName,
      phone,
      village,
      district,
      notes,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function rescheduleFarmerBooking(
  uid: string,
  bookingId: string,
  dateISO: string,
  dateLabel: string,
  timeSlot: string
): Promise<void> {
  const path = `farmers/${uid}/bookings/${bookingId}`;
  if (!DATE_ISO_REGEX.test(dateISO) || !TIME_SLOTS.includes(timeSlot)) {
    throw new Error('Invalid reschedule slot.');
  }
  try {
    await updateDoc(doc(db, 'farmers', uid, 'bookings', bookingId), {
      dateISO,
      dateLabel: dateLabel.slice(0, 40),
      timeSlot,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateFarmerBookingStatus(
  uid: string,
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  const path = `farmers/${uid}/bookings/${bookingId}`;
  if (status !== 'Completed' && status !== 'Cancelled') {
    throw new Error('Invalid status transition.');
  }
  try {
    await updateDoc(doc(db, 'farmers', uid, 'bookings', bookingId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
