import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
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
  email: string;
  streak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
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
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'streak' | 'lastActiveDate'>) {
  await setDoc(doc(db, 'users', uid), {
    ...profile,
    streak: 0,
    lastActiveDate: null,
  });
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
