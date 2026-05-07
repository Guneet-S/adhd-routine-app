'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ProgressRing from '@/components/ui/ProgressRing';
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

const TIPS_EN = [
  'Small steps count too!',
  'Start with the easiest task first.',
  "You're doing great — one task at a time.",
  'Every task you finish is a win!',
  'Take a deep breath — you can do this.',
];
const TIPS_PA = [
  'ਛੋਟੇ ਕਦਮ ਵੀ ਮਾਇਨੇ ਰੱਖਦੇ ਹਨ!',
  'ਸਭ ਤੋਂ ਆਸਾਨ ਕੰਮ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।',
  'ਤੁਸੀਂ ਵਧੀਆ ਕਰ ਰਹੇ ਹੋ — ਇੱਕ ਕੰਮ ਇੱਕ ਵਾਰ।',
  'ਹਰ ਕੰਮ ਜੋ ਤੁਸੀਂ ਕਰਦੇ ਹੋ ਇੱਕ ਜਿੱਤ ਹੈ!',
  'ਡੂੰਘਾ ਸਾਹ ਲਓ — ਤੁਸੀਂ ਇਹ ਕਰ ਸਕਦੇ ਹੋ।',
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS_EN.length));

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
  const totalStars = profile?.totalStars ?? 0;
  const childName = profile?.childName || '';

  const incompleteTasks = tasks.filter((t) => !isCompletedToday(t));
  const nextTask = incompleteTasks[0] ?? null;

  const tasksByCategory = (cat: Task['category']) =>
    tasks.filter((t) => t.category === cat).sort((a, b) => a.order - b.order);

  const tip = language === 'punjabi' ? TIPS_PA[tipIndex] : TIPS_EN[tipIndex];

  // Focus Mode — Fix 8
  const [focusMode, setFocusMode] = useState(false);
  const [focusTasks, setFocusTasks] = useState<Task[]>([]);
  const [focusIdx, setFocusIdx] = useState(0);
  const [celebrating, setCelebrating] = useState(false);
  const [allFocusDone, setAllFocusDone] = useState(false);

  function openFocusMode() {
    const incomplete = tasks.filter((t) => !isCompletedToday(t));
    if (incomplete.length === 0) return;
    setFocusTasks(incomplete);
    setFocusIdx(0);
    setAllFocusDone(false);
    setFocusMode(true);
  }

  async function handleFocusDone() {
    const task = focusTasks[focusIdx];
    if (!task || !user) return;
    setCelebrating(true);
    await handleToggle(task.id, true);
    setTimeout(() => {
      setCelebrating(false);
      const next = focusIdx + 1;
      if (next < focusTasks.length) {
        setFocusIdx(next);
      } else {
        setAllFocusDone(true);
      }
    }, 1200);
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <Header childName={childName} />

        <div className="pb-28">
          {loadingTasks ? (
            <div className="flex justify-center py-20 text-3xl animate-pulse">⭐</div>
          ) : (
            <>
              {/* FIX 9 — Section 1: Today's Progress */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mx-4 mt-3 mb-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <ProgressRing value={completedCount} max={totalCount || 1} size={64} />
                  <div className="flex-1">
                    <p className="text-base font-extrabold text-slate-700">
                      {completedCount}/{totalCount} {t('dashboard_done')}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{t('dashboard_amazing')}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xl">🔥</span>
                    <span className="text-sm font-bold text-slate-700">{streak}</span>
                    <span className="text-[9px] text-slate-400">{t('dashboard_streak')}</span>
                  </div>
                </div>
              </motion.div>

              {/* ADHD Tip — Fix 8 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mx-4 mb-3"
              >
                <p className="text-xs text-primary/80 font-semibold text-center bg-violet-50 rounded-xl px-3 py-2">
                  💡 {tip}
                </p>
              </motion.div>

              {/* Focus Mode trigger — Fix 8 */}
              {incompleteTasks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.11 }}
                  className="mx-4 mb-3"
                >
                  <button
                    onClick={openFocusMode}
                    className="w-full flex items-center justify-between bg-violet-600 text-white rounded-2xl px-4 py-3 shadow-sm shadow-violet-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <div className="text-left">
                        <p className="text-sm font-bold">Focus Mode</p>
                        <p className="text-[10px] text-violet-200">One task at a time</p>
                      </div>
                    </div>
                    <span className="text-violet-200 text-lg">→</span>
                  </button>
                </motion.div>
              )}

              {/* Up Next — Fix 9 Section 3 */}
              {nextTask && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="mx-4 mb-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center text-lg shrink-0">
                    {nextTask.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">{t('next_task')}</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{nextTask.title}</p>
                  </div>
                  <span className="text-amber-400 text-lg">→</span>
                </motion.div>
              )}

              {/* Reset Moment Card — Fix 7 */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mx-4 mb-4 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3"
              >
                <span className="text-2xl shrink-0">🫁</span>
                <div>
                  <p className="text-xs font-bold text-blue-700">{t('adhd_reset_title')}</p>
                  <p className="text-xs text-blue-500">{t('adhd_reset_desc')}</p>
                </div>
              </motion.div>

              {/* FIX 9 — Section 2: Current Routine (task lists) */}
              <div className="mx-4 space-y-3">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-sm font-bold text-slate-600 mb-1">No tasks yet!</p>
                    <p className="text-xs text-slate-400">Tap + below to add your first task</p>
                  </div>
                ) : (
                  (['morning', 'study', 'evening'] as const).map((cat, i) => {
                    const config = CATEGORY_CONFIG[cat];
                    const catTasks = tasksByCategory(cat);
                    if (catTasks.length === 0) return null;
                    return (
                      <motion.div
                        key={cat}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
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

              {/* FIX 9 — Section 4: Rewards Summary */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mx-4 mt-4 bg-primary rounded-2xl px-4 py-3 flex items-center gap-4 shadow-md shadow-primary/15"
              >
                <span className="text-3xl">🏆</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-violet-200">{t('rewards_summary')}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm font-extrabold text-white">⭐ {totalStars}</span>
                    <span className="text-sm font-extrabold text-white">🔥 {streak}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/rewards')}
                  className="text-[10px] font-bold text-violet-200 border border-violet-300 rounded-full px-3 py-1 shrink-0"
                >
                  {t('view')}
                </button>
              </motion.div>
            </>
          )}
        </div>

        <BottomNav onAddTask={() => setModalOpen(true)} />

        <AddTaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAddTask}
        />

        {/* Focus Mode overlay — Fix 8 */}
        <AnimatePresence>
          {focusMode && (
            <motion.div
              key="focus-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-violet-700 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-10 pb-4">
                <p className="text-violet-200 text-xs font-bold uppercase tracking-wide">Focus Mode</p>
                <button
                  onClick={() => setFocusMode(false)}
                  className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-violet-200 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Task counter */}
              {!allFocusDone && (
                <p className="text-center text-violet-300 text-xs mb-2">
                  {focusIdx + 1} of {focusTasks.length}
                </p>
              )}

              {/* Main content */}
              <div className="flex-1 flex flex-col items-center justify-center px-8">
                <AnimatePresence mode="wait">
                  {allFocusDone ? (
                    <motion.div
                      key="all-done"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="text-8xl mb-6">🏆</div>
                      <p className="text-2xl font-extrabold text-white mb-2">All done!</p>
                      <p className="text-violet-200 text-sm mb-8">Amazing work today.</p>
                      <button
                        onClick={() => setFocusMode(false)}
                        className="bg-white text-violet-700 font-bold text-base rounded-2xl px-8 py-3"
                      >
                        Back to Dashboard
                      </button>
                    </motion.div>
                  ) : celebrating ? (
                    <motion.div
                      key="celebrate"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ scale: 1.3, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-center"
                    >
                      <div className="text-8xl mb-4">⭐</div>
                      <p className="text-2xl font-extrabold text-white">Amazing!</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={focusTasks[focusIdx]?.id}
                      initial={{ x: 60, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -60, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-center w-full"
                    >
                      <div className="text-8xl mb-6">{focusTasks[focusIdx]?.emoji}</div>
                      <p className="text-2xl font-extrabold text-white mb-2">
                        {focusTasks[focusIdx]?.title}
                      </p>
                      <p className="text-violet-300 text-xs mb-10 capitalize">
                        {focusTasks[focusIdx]?.category === 'study' ? 'Afternoon' : focusTasks[focusIdx]?.category} routine
                      </p>
                      <button
                        onClick={handleFocusDone}
                        className="w-full bg-white text-violet-700 font-extrabold text-lg rounded-2xl py-4 shadow-lg"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => {
                          const next = focusIdx + 1;
                          if (next < focusTasks.length) setFocusIdx(next);
                          else setAllFocusDone(true);
                        }}
                        className="mt-3 text-violet-300 text-sm font-medium"
                      >
                        Skip this task
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}
