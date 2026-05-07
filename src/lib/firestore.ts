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
  reminderTime?: string; // 'HH:MM'
  notes?: string;
}

export interface NotificationPrefs {
  wakeUpEnabled: boolean;
  wakeUpTime: string;
  homeworkEnabled: boolean;
  homeworkTime: string;
  bedtimeEnabled: boolean;
  bedtimeTime: string;
  hydrationEnabled: boolean;
  rewardsEnabled: boolean;
}

export interface UserProfile {
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  streak: number;
  lastActiveDate: string | null;
  totalStars: number;
  wakeUpTime: string;
  schoolDays: boolean[];
  language: string;
  avatar?: string;
  soundEffects?: boolean;
  notifications?: NotificationPrefs;
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
    avatar: data.avatar ?? '🧒',
    soundEffects: data.soundEffects ?? true,
    notifications: data.notifications,
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
    avatar: '🧒',
    soundEffects: true,
  });
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', uid), updates as Record<string, unknown>);
}

export async function saveNotificationPrefs(uid: string, prefs: NotificationPrefs) {
  await updateDoc(doc(db, 'users', uid), { notifications: prefs });
}

export async function resetProgress(uid: string) {
  // Reset stars and streak
  await updateDoc(doc(db, 'users', uid), {
    totalStars: 0,
    streak: 0,
    lastActiveDate: null,
  });
  // Mark all tasks as incomplete
  const tasks = await getTasks(uid);
  for (const task of tasks) {
    await updateDoc(doc(db, 'tasks', uid, 'items', task.id), { completedDate: null });
  }
}

// ---- Default Tasks ----

export async function createDefaultTasks(uid: string, childAge: number) {
  const baseTasks: Array<Omit<Task, 'id'>> = [
    { title: 'Brush Teeth', emoji: '🪥', category: 'morning', order: 1, completedDate: null },
    { title: 'Drink Water', emoji: '💧', category: 'morning', order: 2, completedDate: null },
    { title: 'Breakfast', emoji: '🥣', category: 'morning', order: 3, completedDate: null },
    { title: 'Homework', emoji: '📚', category: 'study', order: 1, completedDate: null },
    { title: 'Reading', emoji: '📖', category: 'study', order: 2, completedDate: null },
    { title: 'Prepare Clothes', emoji: '👕', category: 'evening', order: 1, completedDate: null },
    { title: 'Brush Teeth', emoji: '🪥', category: 'evening', order: 2, completedDate: null },
    { title: 'Sleep', emoji: '😴', category: 'evening', order: 3, completedDate: null },
  ];

  let ageTasks: Array<Omit<Task, 'id'>> = [];
  if (childAge <= 2) {
    ageTasks = [
      { title: 'Wash Hands', emoji: '🙌', category: 'morning', order: 4, completedDate: null },
      { title: 'Drink Milk', emoji: '🥛', category: 'morning', order: 5, completedDate: null },
      { title: 'Story Time', emoji: '📖', category: 'evening', order: 4, completedDate: null },
    ];
  } else if (childAge >= 3 && childAge <= 5) {
    ageTasks = [
      { title: 'Wash Face', emoji: '🚿', category: 'morning', order: 4, completedDate: null },
      { title: 'Wear Clothes', emoji: '👗', category: 'morning', order: 5, completedDate: null },
    ];
  } else if (childAge >= 6 && childAge <= 9) {
    ageTasks = [
      { title: 'Pack School Bag', emoji: '🎒', category: 'morning', order: 4, completedDate: null },
    ];
  } else if (childAge >= 10) {
    ageTasks = [
      { title: 'Pack School Bag', emoji: '🎒', category: 'morning', order: 4, completedDate: null },
      { title: 'Revision', emoji: '📝', category: 'study', order: 3, completedDate: null },
    ];
  }

  for (const task of [...baseTasks, ...ageTasks]) {
    await addTask(uid, task);
  }
}

// ---- Auto Generate Routine ----

function getAutoTasks(childAge: number): Array<Omit<Task, 'id'>> {
  if (childAge <= 4) {
    return [
      { title: 'Wake Up', emoji: '🌞', category: 'morning', order: 1, completedDate: null },
      { title: 'Brush Teeth', emoji: '🪥', category: 'morning', order: 2, completedDate: null },
      { title: 'Wash Face', emoji: '🚿', category: 'morning', order: 3, completedDate: null },
      { title: 'Drink Milk', emoji: '🥛', category: 'morning', order: 4, completedDate: null },
      { title: 'Wear Clothes', emoji: '👕', category: 'morning', order: 5, completedDate: null },
      { title: 'Lunch', emoji: '🍽️', category: 'study', order: 1, completedDate: null },
      { title: 'Nap Time', emoji: '😴', category: 'study', order: 2, completedDate: null },
      { title: 'Coloring', emoji: '🎨', category: 'study', order: 3, completedDate: null },
      { title: 'Water Break', emoji: '💧', category: 'study', order: 4, completedDate: null },
      { title: 'Story Time', emoji: '📖', category: 'study', order: 5, completedDate: null },
      { title: 'Put Toys Away', emoji: '🧸', category: 'evening', order: 1, completedDate: null },
      { title: 'Family Time', emoji: '👨‍👩‍👧', category: 'evening', order: 2, completedDate: null },
      { title: 'Brush Teeth', emoji: '🪥', category: 'evening', order: 3, completedDate: null },
      { title: 'Pajamas', emoji: '🌙', category: 'evening', order: 4, completedDate: null },
      { title: 'Sleep', emoji: '😴', category: 'evening', order: 5, completedDate: null },
    ];
  } else if (childAge <= 8) {
    return [
      { title: 'Brush Teeth', emoji: '🪥', category: 'morning', order: 1, completedDate: null },
      { title: 'Pack School Bag', emoji: '🎒', category: 'morning', order: 2, completedDate: null },
      { title: 'Breakfast', emoji: '🥣', category: 'morning', order: 3, completedDate: null },
      { title: 'Wear Uniform', emoji: '👕', category: 'morning', order: 4, completedDate: null },
      { title: 'Drink Water', emoji: '💧', category: 'morning', order: 5, completedDate: null },
      { title: 'Homework', emoji: '📚', category: 'study', order: 1, completedDate: null },
      { title: 'Reading', emoji: '📖', category: 'study', order: 2, completedDate: null },
      { title: 'Snack Break', emoji: '🍎', category: 'study', order: 3, completedDate: null },
      { title: 'Outdoor Play', emoji: '🏃', category: 'study', order: 4, completedDate: null },
      { title: 'Organize Desk', emoji: '✏️', category: 'study', order: 5, completedDate: null },
      { title: 'Prepare Clothes', emoji: '👗', category: 'evening', order: 1, completedDate: null },
      { title: 'Family Time', emoji: '👨‍👩‍👧', category: 'evening', order: 2, completedDate: null },
      { title: 'Limited Screen Time', emoji: '📱', category: 'evening', order: 3, completedDate: null },
      { title: 'Brush Teeth', emoji: '🪥', category: 'evening', order: 4, completedDate: null },
      { title: 'Sleep', emoji: '😴', category: 'evening', order: 5, completedDate: null },
    ];
  } else {
    return [
      { title: 'Hygiene', emoji: '🚿', category: 'morning', order: 1, completedDate: null },
      { title: 'School Prep', emoji: '🎒', category: 'morning', order: 2, completedDate: null },
      { title: 'Breakfast', emoji: '🥣', category: 'morning', order: 3, completedDate: null },
      { title: 'Water Intake', emoji: '💧', category: 'morning', order: 4, completedDate: null },
      { title: 'Positive Affirmation', emoji: '🌟', category: 'morning', order: 5, completedDate: null },
      { title: 'Homework', emoji: '📚', category: 'study', order: 1, completedDate: null },
      { title: 'Reading', emoji: '📖', category: 'study', order: 2, completedDate: null },
      { title: 'Exercise', emoji: '🏃', category: 'study', order: 3, completedDate: null },
      { title: 'Journaling', emoji: '📓', category: 'study', order: 4, completedDate: null },
      { title: 'Break Time', emoji: '☕', category: 'study', order: 5, completedDate: null },
      { title: 'Prepare Tomorrow', emoji: '📋', category: 'evening', order: 1, completedDate: null },
      { title: 'Relaxation', emoji: '🧘', category: 'evening', order: 2, completedDate: null },
      { title: 'No Screens', emoji: '🚫', category: 'evening', order: 3, completedDate: null },
      { title: 'Brush Teeth', emoji: '🪥', category: 'evening', order: 4, completedDate: null },
      { title: 'Sleep', emoji: '😴', category: 'evening', order: 5, completedDate: null },
    ];
  }
}

export async function autoGenerateRoutine(uid: string, childAge: number) {
  // Clear existing tasks
  const existing = await getTasks(uid);
  for (const task of existing) {
    await deleteDoc(doc(db, 'tasks', uid, 'items', task.id));
  }
  // Create age-appropriate tasks
  const tasks = getAutoTasks(childAge);
  for (const task of tasks) {
    await addDoc(tasksRef(uid), task);
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

  if (profile.lastActiveDate === t) return;

  const newStreak =
    profile.lastActiveDate === y ? (profile.streak || 0) + 1 : 1;

  await updateDoc(userRef, { streak: newStreak, lastActiveDate: t });
}

// ---- Helpers ----

export function isCompletedToday(task: Task): boolean {
  return task.completedDate === today();
}

export { today };
