'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import { useState, useEffect, useCallback } from 'react';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { addTask as fsAddTask, getTasks, getUserProfile, Task, UserProfile } from '@/lib/firestore';

export default function MorePage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [addOpen, setAddOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const p = await getUserProfile(user.uid);
    setProfile(p);
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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

        <div className="px-4 pt-4 pb-28 space-y-3">
          {/* Profile Card */}
          {profile && (
            <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  🧒
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-slate-700 truncate">{profile.childName || '—'}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {profile.childAge ? `Age ${profile.childAge}` : ''}{profile.childAge && profile.parentName ? ' · ' : ''}{profile.parentName}
                  </p>
                  {profile.wakeUpTime && (
                    <p className="text-xs text-primary font-medium">⏰ Wake-up: {profile.wakeUpTime}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Language Toggle */}
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wide">Language</p>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('english')}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                  language === 'english'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('punjabi')}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${
                  language === 'punjabi'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>

          {/* Navigation links */}
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
