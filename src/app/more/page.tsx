'use client';

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

interface MenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  right?: React.ReactNode;
}

function MenuItem({ icon, label, onClick, danger, right }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border ${
        danger ? 'border-red-100' : 'border-slate-100'
      } min-h-[52px]`}
    >
      <span className="text-xl w-7 text-center shrink-0">{icon}</span>
      <span className={`flex-1 text-sm font-semibold text-left ${danger ? 'text-red-500' : 'text-slate-700'}`}>
        {label}
      </span>
      {right ?? <span className="text-slate-300 text-sm">→</span>}
    </button>
  );
}

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
        <div className="bg-white px-4 pt-5 pb-3 border-b border-slate-100">
          <h1 className="text-lg font-extrabold text-slate-700">{t('more_title')}</h1>
        </div>

        <div className="px-4 pt-4 pb-28 space-y-3">

          {/* Child Profile — Fix 3 */}
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">{t('child_profile')}</p>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-3xl shrink-0">
                🧒
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-extrabold text-slate-700 truncate">
                  {profile?.childName || '—'}
                </p>
                <p className="text-xs text-slate-500">
                  {profile?.childAge ? `Age ${profile.childAge}` : ''}
                  {profile?.childAge && profile?.parentName ? ' · ' : ''}
                  {profile?.parentName || ''}
                </p>
                {profile?.wakeUpTime && (
                  <p className="text-xs text-primary font-medium mt-0.5">⏰ {profile.wakeUpTime}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-bold text-slate-700">{profile?.totalStars ?? 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm">🔥</span>
                  <span className="text-sm font-bold text-slate-700">{profile?.streak ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Language Toggle — Fix 3 */}
          <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Language</p>
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

          {/* Menu items — Fix 3 */}
          <MenuItem
            icon="🔔"
            label={t('notifications')}
            onClick={() => {}}
          />
          <MenuItem
            icon="⚙️"
            label={t('parent_settings')}
            onClick={() => {}}
          />
          <MenuItem
            icon="📋"
            label={t('more_routine_builder')}
            onClick={() => router.push('/routine')}
          />
          <MenuItem
            icon="🏆"
            label={t('rewards_title')}
            onClick={() => router.push('/rewards')}
          />
          <MenuItem
            icon="❓"
            label={t('help')}
            onClick={() => {}}
          />
          <MenuItem
            icon="🧠"
            label={t('about_adhd')}
            onClick={() => {}}
          />

          {/* Sign Out */}
          <MenuItem
            icon="🚪"
            label={t('sign_out')}
            onClick={handleSignOut}
            danger
            right={<span />}
          />
        </div>

        <BottomNav onAddTask={() => setAddOpen(true)} />
        <AddTaskModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
      </div>
    </AuthGuard>
  );
}
