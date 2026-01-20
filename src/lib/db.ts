import { db, auth } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

/** ---------- Helpers ---------- */

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** ---------- Types ---------- */

export type Kid = {
  id: string;
  name?: string;
  avatar?: string;
  createdAt?: Timestamp;
  [key: string]: any;
};

export type Checkin = {
  id: string;
  date: string;
  selectedCategories: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Swipe = {
  id: string;
  category: string;
  cardIndex: number;
  cardText: string;
  choice: 'yes' | 'no' | 'unsure';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

/** ---------- Parent profile ---------- */

export async function getParentProfile(uid: string) {
  const ref = doc(db, 'parents', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function upsertParentProfile(uid: string, data: any) {
  const ref = doc(db, 'parents', uid);
  const existing = await getDoc(ref);
  const base: any = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  if (!existing.exists()) {
    base.createdAt = serverTimestamp();
  }

  await setDoc(ref, base, { merge: true });
}

/** ---------- Kids ---------- */

export async function listKids(uid: string): Promise<Kid[]> {
  const kidsRef = collection(db, 'parents', uid, 'kids');
  const qKids = query(kidsRef, orderBy('createdAt', 'asc'));
  const snap = await getDocs(qKids);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Kid[];
}

export async function addKid(uid: string, kid: Partial<Kid>) {
  const kidsRef = collection(db, 'parents', uid, 'kids');
  const docRef = await addDoc(kidsRef, { 
    ...kid, 
    createdAt: serverTimestamp() 
  });
  return docRef.id;
}

export async function getKid(uid: string, kidId: string): Promise<Kid | null> {
  const ref = doc(db, 'parents', uid, 'kids', kidId);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Kid) : null;
}

/** ---------- Check-ins ---------- */

export async function createTodayCheckin(params: {
  uid: string;
  kidId: string;
  selectedCategories: string[];
}): Promise<string> {
  const { uid, kidId, selectedCategories } = params;
  const checkinsRef = collection(db, 'parents', uid, 'kids', kidId, 'checkins');

  // Check if today's check-in already exists
  const qToday = query(checkinsRef, where('date', '==', todayISO()), limit(1));
  const existing = await getDocs(qToday);

  if (!existing.empty) {
    const existingId = existing.docs[0].id;
    await setDoc(
      doc(db, 'parents', uid, 'kids', kidId, 'checkins', existingId),
      { selectedCategories, updatedAt: serverTimestamp() },
      { merge: true }
    );
    return existingId;
  }

  const docRef = await addDoc(checkinsRef, {
    date: todayISO(),
    selectedCategories,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getCheckin(params: { 
  uid: string; 
  kidId: string; 
  checkinId: string 
}): Promise<Checkin | null> {
  const { uid, kidId, checkinId } = params;
  const ref = doc(db, 'parents', uid, 'kids', kidId, 'checkins', checkinId);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Checkin) : null;
}

export async function getTodayOrLatestCheckin(params: { 
  uid: string; 
  kidId: string 
}): Promise<Checkin | null> {
  const { uid, kidId } = params;
  const checkinsRef = collection(db, 'parents', uid, 'kids', kidId, 'checkins');

  // Try today's first
  const qToday = query(checkinsRef, where('date', '==', todayISO()), limit(1));
  const todaySnap = await getDocs(qToday);
  if (!todaySnap.empty) {
    const d = todaySnap.docs[0];
    return { id: d.id, ...d.data() } as Checkin;
  }

  // Otherwise most recent
  const qLatest = query(checkinsRef, orderBy('date', 'desc'), limit(1));
  const latestSnap = await getDocs(qLatest);
  if (latestSnap.empty) return null;

  const d = latestSnap.docs[0];
  return { id: d.id, ...d.data() } as Checkin;
}

/** ---------- Swipes ---------- */

function safeId(s: string) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_\-]/g, '');
}

export async function saveSwipe(params: {
  uid: string;
  kidId: string;
  checkinId: string;
  category: string;
  cardIndex: number;
  cardText: string;
  choice: 'yes' | 'no' | 'unsure';
}): Promise<void> {
  const { uid, kidId, checkinId, category, cardIndex, cardText, choice } = params;

  const swipeId = `${safeId(category)}_${cardIndex}`;
  const swipeRef = doc(
    db,
    'parents',
    uid,
    'kids',
    kidId,
    'checkins',
    checkinId,
    'swipes',
    swipeId
  );

  const existing = await getDoc(swipeRef);

  const base: any = {
    category,
    cardIndex,
    cardText,
    choice,
    updatedAt: serverTimestamp(),
  };

  if (!existing.exists()) {
    base.createdAt = serverTimestamp();
  }

  await setDoc(swipeRef, base, { merge: true });
}

export async function listSwipes(params: { 
  uid: string; 
  kidId: string; 
  checkinId: string 
}): Promise<Swipe[]> {
  const { uid, kidId, checkinId } = params;

  const swipesRef = collection(
    db,
    'parents',
    uid,
    'kids',
    kidId,
    'checkins',
    checkinId,
    'swipes'
  );

  const q = query(swipesRef, orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);

  // Dedupe by (category + cardIndex)
  const map = new Map<string, any>();

  for (const d of snap.docs) {
    const data = d.data();
    const key = `${data.category ?? ''}__${data.cardIndex ?? ''}`;

    if (!map.has(key)) {
      map.set(key, { id: d.id, ...data });
      continue;
    }

    const prev = map.get(key);
    const prevTs = (prev?.updatedAt as Timestamp)?.seconds ?? (prev?.createdAt as Timestamp)?.seconds ?? 0;
    const currTs = (data?.updatedAt as Timestamp)?.seconds ?? (data?.createdAt as Timestamp)?.seconds ?? 0;

    if (currTs >= prevTs) {
      map.set(key, { id: d.id, ...data });
    }
  }

  return Array.from(map.values()) as Swipe[];
}

/** ---------- Parent Swipes (for YourDay) ---------- */

export async function saveParentSwipe(params: {
  uid: string;
  category: string;
  cardIndex: number;
  cardText: string;
  choice: 'yes' | 'no';
  date?: string;
}): Promise<void> {
  const { uid, category, cardIndex, cardText, choice, date = todayISO() } = params;

  const swipeId = `${date}_${safeId(category)}_${cardIndex}`;
  const swipeRef = doc(db, 'parents', uid, 'parentSwipes', swipeId);

  const existing = await getDoc(swipeRef);

  const base: any = {
    date,
    category,
    cardIndex,
    cardText,
    choice,
    updatedAt: serverTimestamp(),
  };

  if (!existing.exists()) {
    base.createdAt = serverTimestamp();
  }

  await setDoc(swipeRef, base, { merge: true });
}

export async function listParentSwipes(params: {
  uid: string;
  startDate?: string;
  endDate?: string;
}): Promise<any[]> {
  const { uid, startDate, endDate } = params;

  const swipesRef = collection(db, 'parents', uid, 'parentSwipes');
  
  let q = query(swipesRef, orderBy('date', 'desc'));
  
  if (startDate) {
    q = query(q, where('date', '>=', startDate));
  }
  
  if (endDate) {
    q = query(q, where('date', '<=', endDate));
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** ---------- Current User Helper ---------- */

export function getCurrentUser() {
  return auth.currentUser;
}
