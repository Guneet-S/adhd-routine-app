import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  increment,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/firebase';

export interface Task {
  id: string;
  title: string;
  emoji: string;
  category: 'morning' | 'evening' | 'study';
  order: number;
  completedDate: string | null; // 'YYYY-MM-DD' or null
}

export interface UserProfile {
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  streak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  totalStars: number;
  wakeUpTime: string; // 'HH:MM'
  schoolDays: boolean[]; // [Mon, Tue, Wed, Thu, Fri]
  language: string;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// ---- User Profile ----

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<UserProfile>;
  // Provide defaults for fields added after initial release
  return {
    parentName: data.parentName ?? '',
    childName: data.childName ?? '',
    childAge: data.childAge ?? 0,
    email: data.email ?? '',
    streak: data.streak ?? 0,
    lastActiveDate: data.lastActiveDate ?? null,
    totalStars: data.totalStars ?? 0,
    wakeUpTime: data.wakeUpTime ?? '07:00',
    schoolDays: data.schoolDays ?? [true, true, true, true, true],
    language: data.language ?? 'english',
  };
}

export async function createUserProfile(
  uid: string,
  profile: {
    parentName: string;
    childName: string;
    childAge: number;
    email: string;
    wakeUpTime: string;
    schoolDays: boolean[];
    language: string;
  }
) {
  await setDoc(doc(db, 'users', uid), {
    ...profile,
    streak: 0,
    lastActiveDate: null,
    totalStars: 0,
  });
}

// ---- Default Tasks ----

export async function createDefaultTasks(uid: string, childAge: number) {
  let tasks: Array<Omit<Task, 'id'>> = [];

  if (childAge >= 3 && childAge <= 5) {
    tasks = [
      { title: 'Brush Teeth', emoji: '🪥', category: 'morning', order: 1, completedDate: null },
      { title: 'Wash Face', emoji: '🚿', category: 'morning', order: 2, completedDate: null },
      { title: 'Drink Milk', emoji: '🥛', category: 'morning', order: 3, completedDate: null },
      { title: 'Wear Clothes', emoji: '👕', category: 'morning', order: 4, completedDate: null },
    ];
  } else if (childAge >= 6 && childAge <= 9) {
    tasks = [
      { title: 'Brush Teeth', emoji: '🪥', category: 'morning', order: 1, completedDate: null },
      { title: 'Pack School Bag', emoji: '🎒', category: 'morning', order: 2, completedDate: null },
      { title: 'Homework', emoji: '📚', category: 'study', order: 1, completedDate: null },
      { title: 'Reading', emoji: '📖', category: 'study', order: 2, completedDate: null },
      { title: 'Sleep on Time', emoji: '😴', category: 'evening', order: 1, completedDate: null },
    ];
  } else if (childAge >= 10 && childAge <= 13) {
    tasks = [
      { title: 'Brush Teeth', emoji: '🪥', category: 'morning', order: 1, completedDate: null },
      { title: 'Pack School Bag', emoji: '🎒', category: 'morning', order: 2, completedDate: null },
      { title: 'Revision', emoji: '📝', category: 'study', order: 1, completedDate: null },
      { title: 'Journaling', emoji: '📓', category: 'study', order: 2, completedDate: null },
      { title: 'Sleep Preparation', emoji: '😴', category: 'evening', order: 1, completedDate: null },
    ];
  } else {
    // Age 14+ or unknown: basic set
    tasks = [
      { title: 'Brush Teeth', emoji: '🪥', category: 'morning', order: 1, completedDate: null },
      { title: 'Revision', emoji: '📝', category: 'study', order: 1, completedDate: null },
      { title: 'Sleep on Time', emoji: '😴', category: 'evening', order: 1, completedDate: null },
    ];
  }

  for (const task of tasks) {
    await addTask(uid, task);
  }
}

// ---- Tasks ----

function tasksRef(uid: string) {
  return collection(db, 'tasks', uid, 'items');
}

export async function getTasks(uid: string): Promise<Task[]> {
  const q = query(tasksRef(uid), orderBy('order'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task));
}

export async function addTask(uid: string, task: Omit<Task, 'id'>): Promise<string> {
  const ref = await addDoc(tasksRef(uid), task);
  return ref.id;
}

export async function updateTask(uid: string, taskId: string, updates: Partial<Omit<Task, 'id'>>) {
  await updateDoc(doc(db, 'tasks', uid, 'items', taskId), updates);
}

export async function deleteTask(uid: string, taskId: string) {
  await deleteDoc(doc(db, 'tasks', uid, 'items', taskId));
}

// ---- Completion + Streak ----

export async function toggleTaskCompletion(uid: string, taskId: string, completed: boolean) {
  const completedDate = completed ? today() : null;
  await updateDoc(doc(db, 'tasks', uid, 'items', taskId), { completedDate });

  if (completed) {
    await updateStreak(uid);
    // Increment total stars earned
    await updateDoc(doc(db, 'users', uid), { totalStars: increment(1) });
  }
}

async function updateStreak(uid: string) {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const profile = snap.data() as UserProfile;
  const t = today();
  const y = yesterday();

  if (profile.lastActiveDate === t) return; // already counted today

  const newStreak =
    profile.lastActiveDate === y ? (profile.streak || 0) + 1 : 1;

  await updateDoc(userRef, { streak: newStreak, lastActiveDate: t });
}

// ---- Helpers ----

export function isCompletedToday(task: Task): boolean {
  return task.completedDate === today();
}

export { today };
