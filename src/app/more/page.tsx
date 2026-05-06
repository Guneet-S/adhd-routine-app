'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import { useState } from 'react';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { Task } from '@/lib/mockData';

export default function MorePage() {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  async function handleSignOut() {
    await signOut(auth);
    router.replace('/login');
  }

  const handleAdd = (_task: Omit<Task, 'id' | 'completed' | 'order'>) => {};

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 pt-5 pb-3">
          <h1 className="text-lg font-extrabold text-slate-700">More</h1>
        </div>

        <div className="px-4 pt-6 pb-28 space-y-3">
          <Link
            href="/routine"
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-slate-100"
          >
            <span className="text-xl">📋</span>
            <span className="text-sm font-semibold text-slate-700">Routine Builder</span>
            <span className="ml-auto text-slate-400">→</span>
          </Link>

          <Link
            href="/rewards"
            className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-slate-100"
          >
            <span className="text-xl">🏆</span>
            <span className="text-sm font-semibold text-slate-700">Rewards</span>
            <span className="ml-auto text-slate-400">→</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-red-100 text-red-500"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>

        <BottomNav onAddTask={() => setAddOpen(true)} />
        <AddTaskModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      </div>
    </AuthGuard>
  );
}
