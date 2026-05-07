'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';
import ChevronLeft from '@/components/icons/ChevronLeft';
import AddTaskModal from '@/components/modals/AddTaskModal';
import EditTaskModal from '@/components/modals/EditTaskModal';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  getTasks,
  addTask as fsAddTask,
  updateTask as fsUpdateTask,
  deleteTask as fsDeleteTask,
  isCompletedToday,
  autoGenerateRoutine,
  getUserProfile,
  Task as FsTask,
} from '@/lib/firestore';
import { Task, CATEGORY_CONFIG } from '@/lib/mockData';

function toUiTask(t: FsTask): Task {
  return { ...t, completed: isCompletedToday(t) };
}

export default function RoutinePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoGenerating, setAutoGenerating] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    const fetched = await getTasks(user.uid);
    setTasks(fetched.map(toUiTask));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleAutoGenerate() {
    if (!user) return;
    setAutoGenerating(true);
    const profile = await getUserProfile(user.uid);
    const age = profile?.childAge ?? 6;
    await autoGenerateRoutine(user.uid, age);
    await loadTasks();
    setAutoGenerating(false);
  }

  const addTask = async (newTask: { title: string; emoji: string; category: Task['category']; reminderTime?: string; notes?: string }) => {
    if (!user) return;
    const order = tasks.filter((task) => task.category === newTask.category).length + 1;
    const fsTask = { ...newTask, order, completedDate: null };
    const id = await fsAddTask(user.uid, fsTask);
    setTasks((prev) => [...prev, { ...newTask, id, completed: false, order }]);
  };

  const saveEdit = async (updated: Task) => {
    if (!user) return;
    await fsUpdateTask(user.uid, updated.id, {
      title: updated.title,
      emoji: updated.emoji,
      category: updated.category,
      reminderTime: updated.reminderTime,
      notes: updated.notes,
    });
    setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    await fsDeleteTask(user.uid, id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const categoryLabel: Record<string, string> = {
    morning: t('routine_morning'),
    study: t('routine_study'),
    evening: t('routine_evening'),
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-10 bg-white flex items-center gap-3 px-4 py-3 border-b border-slate-100 shadow-sm">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-lg font-extrabold text-slate-700 flex-1">{t('routine_title')}</h1>
          {/* Fix 7 — Auto Generate button in header */}
          <button
            onClick={handleAutoGenerate}
            disabled={autoGenerating}
            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full shrink-0 disabled:opacity-60"
          >
            {autoGenerating ? 'Generating...' : 'Auto Generate'}
          </button>
        </header>

        <div className="px-4 pb-28 pt-4 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12 text-3xl animate-pulse">⭐</div>
          ) : tasks.length === 0 ? (
            /* Fix 6 — Warm empty state */
            <div className="flex flex-col items-center justify-center py-16 text-center bg-violet-50 rounded-3xl mx-0">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-base font-extrabold text-slate-700 mb-1">Let&apos;s build today&apos;s calm routine</p>
              <p className="text-xs text-slate-400 mb-6 px-6">Add tasks one by one or let us generate a full routine for your child.</p>
              <div className="flex flex-col gap-3 w-full px-8">
                <button
                  onClick={() => setAddOpen(true)}
                  className="w-full py-3 rounded-2xl bg-primary text-white font-bold text-sm shadow-sm"
                >
                  Add Task
                </button>
                <button
                  onClick={handleAutoGenerate}
                  disabled={autoGenerating}
                  className="w-full py-3 rounded-2xl border-2 border-primary text-primary font-bold text-sm disabled:opacity-60"
                >
                  {autoGenerating ? 'Generating...' : 'Auto Generate Routine'}
                </button>
              </div>
            </div>
          ) : (
            (['morning', 'study', 'evening'] as const).map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const catTasks = tasks
                .filter((task) => task.category === cat)
                .sort((a, b) => a.order - b.order);

              return (
                <div key={cat}>
                  <div className={`rounded-2xl p-4 ${config.bg}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{config.emoji}</span>
                      <h2 className="text-sm font-bold text-slate-700">{categoryLabel[cat]}</h2>
                      <span className="text-xs text-slate-500">{config.time}</span>
                    </div>

                    <div className="space-y-2">
                      {catTasks.map((task, i) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white rounded-2xl px-3 py-2.5 flex items-center gap-3 shadow-sm"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${config.iconBg}`}>
                            {task.emoji}
                          </div>
                          <span className="flex-1 text-sm font-semibold text-slate-700">{task.title}</span>
                          <button
                            onClick={() => setEditTask(task)}
                            className="text-slate-400 text-sm hover:text-primary transition px-1"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-400 text-sm hover:text-red-400 transition px-1"
                          >
                            🗑️
                          </button>
                        </motion.div>
                      ))}

                      {catTasks.length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-3">{t('routine_no_tasks')}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <BottomNav onAddTask={() => setAddOpen(true)} />
        <AddTaskModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={addTask} />
        <EditTaskModal task={editTask} onClose={() => setEditTask(null)} onSave={saveEdit} />
      </div>
    </AuthGuard>
  );
}
