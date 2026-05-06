'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/layout/BottomNav';
import AddTaskModal from '@/components/modals/AddTaskModal';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTasks, getUserProfile, isCompletedToday, addTask as fsAddTask, Task, UserProfile } from '@/lib/firestore';

export default function RewardsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [fetchedTasks, fetchedProfile] = await Promise.all([
      getTasks(user.uid),
      getUserProfile(user.uid),
    ]);
    setTasks(fetchedTasks);
    setProfile(fetchedProfile);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddTask = async (newTask: { title: string; emoji: string; category: Task['category'] }) => {
    if (!user) return;
    const order = tasks.filter((t) => t.category === newTask.category).length + 1;
    const id = await fsAddTask(user.uid, { ...newTask, order, completedDate: null });
    setTasks((prev) => [...prev, { ...newTask, id, order, completedDate: null }]);
  };

  const totalStars = profile?.totalStars ?? 0;
  const streak = profile?.streak ?? 0;
  const doneToday = tasks.filter(isCompletedToday).length;
  const totalToday = tasks.length;

  const BADGES = [
    {
      emoji: '🌟',
      title: t('rewards_badge_first_task'),
      desc: t('rewards_badge_first_task_desc'),
      earned: totalStars >= 1,
    },
    {
      emoji: '🔥',
      title: t('rewards_badge_3day'),
      desc: t('rewards_badge_3day_desc'),
      earned: streak >= 3,
    },
    {
      emoji: '🏆',
      title: t('rewards_badge_perfect_day'),
      desc: t('rewards_badge_perfect_day_desc'),
      earned: totalToday > 0 && doneToday === totalToday,
    },
    {
      emoji: '🌈',
      title: t('rewards_badge_week_warrior'),
      desc: t('rewards_badge_week_warrior_desc'),
      earned: streak >= 7,
    },
    {
      emoji: '💎',
      title: t('rewards_badge_super_star'),
      desc: t('rewards_badge_super_star_desc'),
      earned: totalStars >= 50,
    },
    {
      emoji: '🚀',
      title: t('rewards_badge_rocket_kid'),
      desc: t('rewards_badge_rocket_kid_desc'),
      earned: totalStars >= 100,
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <div className="bg-white px-4 pt-5 pb-3 flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 text-lg">←</Link>
          <h1 className="text-lg font-extrabold text-slate-700">{t('rewards_title')} ⭐</h1>
        </div>

        <div className="px-4 pb-28 pt-4">
          {/* Stars summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary rounded-2xl p-5 flex items-center gap-4 mb-6 shadow-lg shadow-primary/20"
          >
            <div className="text-5xl">⭐</div>
            <div>
              {loading ? (
                <p className="text-3xl font-extrabold text-white">...</p>
              ) : totalStars === 0 ? (
                <p className="text-sm font-semibold text-violet-200">{t('rewards_empty')}</p>
              ) : (
                <p className="text-3xl font-extrabold text-white">{totalStars}</p>
              )}
              <p className="text-sm font-semibold text-violet-200">{t('rewards_total_stars')}</p>
              <p className="text-xs text-violet-300 mt-0.5">{t('rewards_keep_going')}</p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: '🔥', value: loading ? '...' : streak, label: t('rewards_day_streak') },
              { icon: '✅', value: loading ? '...' : doneToday, label: t('rewards_done_today') },
              { icon: '📊', value: loading ? '...' : totalStars, label: t('rewards_total_stars') },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-slate-700">{stat.value}</div>
                <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <h2 className="text-sm font-bold text-slate-600 mb-3">{t('rewards_badges')}</h2>
          <div className="grid grid-cols-2 gap-3">
            {BADGES.map((badge, i) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border ${
                  badge.earned ? 'border-primary/20' : 'border-slate-100 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    badge.earned ? 'bg-primary/10' : 'bg-slate-100'
                  }`}
                >
                  {badge.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{badge.title}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{badge.desc}</p>
                  {badge.earned && (
                    <span className="text-[9px] font-bold text-primary">{t('rewards_earned')} ✓</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <BottomNav onAddTask={() => setAddOpen(true)} />
        <AddTaskModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAddTask} />
      </div>
    </AuthGuard>
  );
}
