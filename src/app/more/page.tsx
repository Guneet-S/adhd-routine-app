'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import { useState } from 'react';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { addTask as fsAddTask, getTasks, Task } from '@/lib/firestore';

export default function MorePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [addOpen, setAddOpen] = useState(false);

  async function handleSignOut() {
    await signOut(auth);
    router.replace('/login');
  }

  const handleAdd = async (newTask: { title: string; emoji: string; category: Task['category'] }) => {
    if (!user) return;
    const existing = await getTasks(user.uid);
    const order = existing.filter((t) => t.category === newTask.category).length + 1;
    await fsAddTask(user.uid, { ...newTask, order, completedDate: null });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 pt-5 pb-3">
          <h1 className="text-lg font-extrabold text-slate-700">{t('more_title')}</h1>
        </div>

        <div className="px-4 pt-6 pb-28 space-y-3">
          <Link
            href="/routine"
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-slate-100"
          >
            <span className="text-xl">📋</span>
            <span className="text-sm font-semibold text-slate-700">{t('more_routine_builder')}</span>
            <span className="ml-auto text-slate-400">→</span>
          </Link>

          <Link
            href="/rewards"
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-slate-100"
          >
            <span className="text-xl">🏆</span>
            <span className="text-sm font-semibold text-slate-700">{t('rewards_title')}</span>
            <span className="ml-auto text-slate-400">→</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-red-100 text-red-500"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm font-semibold">{t('sign_out')}</span>
          </button>
        </div>

        <BottomNav onAddTask={() => setAddOpen(true)} />
        <AddTaskModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      </div>
    </AuthGuard>
  );
}
