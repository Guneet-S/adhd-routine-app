'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ProgressRing from '@/components/ui/ProgressRing';
import StatsCard from '@/components/ui/StatsCard';
import TaskCategorySection from '@/components/tasks/TaskCategorySection';
import AddTaskModal from '@/components/modals/AddTaskModal';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  getTasks,
  addTask as fsAddTask,
  toggleTaskCompletion,
  getUserProfile,
  Task,
  isCompletedToday,
  UserProfile,
} from '@/lib/firestore';
import { CATEGORY_CONFIG } from '@/lib/mockData';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    const [fetchedTasks, fetchedProfile] = await Promise.all([
      getTasks(user.uid),
      getUserProfile(user.uid),
    ]);
    setTasks(fetchedTasks);
    setProfile(fetchedProfile);
    setLoadingTasks(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (id: string, completed: boolean) => {
    if (!user) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completedDate: completed ? new Date().toISOString().split('T')[0] : null }
          : t
      )
    );
    await toggleTaskCompletion(user.uid, id, completed);
    const updatedProfile = await getUserProfile(user.uid);
    setProfile(updatedProfile);
  };

  const handleAddTask = async (newTask: { title: string; emoji: string; category: Task['category']; reminderTime?: string; notes?: string }) => {
    if (!user) return;
    const order = tasks.filter((t) => t.category === newTask.category).length + 1;
    const fsTask = { ...newTask, order, completedDate: null };
    const id = await fsAddTask(user.uid, fsTask);
    setTasks((prev) => [...prev, { ...fsTask, id }]);
  };

  const completedCount = tasks.filter(isCompletedToday).length;
  const totalCount = tasks.length;
  const starsToday = completedCount;
  const streak = profile?.streak ?? 0;
  const childName = profile?.childName || '';

  const tasksByCategory = (cat: Task['category']) =>
    tasks.filter((t) => t.category === cat).sort((a, b) => a.order - b.order);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <Header childName={childName} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-4 mb-4 bg-amber-50 rounded-2xl p-4 flex items-center gap-3 border border-amber-100"
        >
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-700 leading-snug">
              {t('dashboard_cheer')}{childName ? `, ${childName}` : ''}! ☀️
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('dashboard_amazing')}
            </p>
          </div>
          <div className="text-4xl">🏔️🌈</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-4 mb-4 grid grid-cols-4 gap-2"
        >
          <StatsCard
            icon={<ProgressRing value={completedCount} max={totalCount || 1} size={48} />}
            value=""
            label={t('dashboard_done')}
          />
          <StatsCard icon="⭐" value={starsToday} label={t('dashboard_stars_today')} />
          <StatsCard icon="🔥" value={streak} label={t('dashboard_streak')} />
          <StatsCard
            icon="🏆"
            value=""
            label={t('dashboard_rewards')}
            action={
              <button
                onClick={() => router.push('/rewards')}
                className="text-[9px] font-bold text-primary border border-primary rounded-full px-2 py-0.5"
              >
                {t('view')}
              </button>
            }
          />
        </motion.div>

        <div className="mx-4 pb-28">
          {loadingTasks ? (
            <div className="flex justify-center py-12 text-3xl animate-pulse">⭐</div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-sm font-bold text-slate-600 mb-1">No tasks yet!</p>
              <p className="text-xs text-slate-400">Tap + below to add your first task</p>
            </div>
          ) : (
            (['morning', 'study', 'evening'] as const).map((cat, i) => {
              const config = CATEGORY_CONFIG[cat];
              const catTasks = tasksByCategory(cat);
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <TaskCategorySection
                    title={config.label}
                    emoji={config.emoji}
                    tasks={catTasks.map((t) => ({ ...t, completed: isCompletedToday(t) }))}
                    bg={config.bg}
                    iconBg={config.iconBg}
                    onToggle={handleToggle}
                  />
                </motion.div>
              );
            })
          )}
        </div>

        <BottomNav onAddTask={() => setModalOpen(true)} />

        <AddTaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddTask}
        />
      </div>
    </AuthGuard>
  );
}
