'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import BottomNav from '@/components/layout/BottomNav';
import AddTaskModal from '@/components/modals/AddTaskModal';
import EditTaskModal from '@/components/modals/EditTaskModal';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/context/AuthContext';
import {
  getTasks,
  addTask as fsAddTask,
  updateTask as fsUpdateTask,
  deleteTask as fsDeleteTask,
  isCompletedToday,
  Task as FsTask,
} from '@/lib/firestore';
import { Task, CATEGORY_CONFIG } from '@/lib/mockData';

// Map Firestore task to UI task (completed: boolean)
function toUiTask(t: FsTask): Task {
  return { ...t, completed: isCompletedToday(t) };
}

export default function RoutinePage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!user) return;
    const fetched = await getTasks(user.uid);
    setTasks(fetched.map(toUiTask));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (newTask: { title: string; emoji: string; category: Task['category'] }) => {
    if (!user) return;
    const order = tasks.filter((t) => t.category === newTask.category).length + 1;
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
    });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    await fsDeleteTask(user.uid, id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white px-4 pt-5 pb-3 flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 text-lg">←</Link>
          <h1 className="text-lg font-extrabold text-slate-700">Routine Builder</h1>
        </div>

        {/* Task list by category */}
        <div className="px-4 pb-28 pt-4 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12 text-3xl animate-pulse">📋</div>
          ) : (
            (['morning', 'study', 'evening'] as const).map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const catTasks = tasks
                .filter((t) => t.category === cat)
                .sort((a, b) => a.order - b.order);

              return (
                <div key={cat}>
                  <div className={`rounded-2xl p-4 ${config.bg}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{config.emoji}</span>
                      <h2 className="text-sm font-bold text-slate-700">{config.label}</h2>
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
                    </div>

                    {catTasks.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-3">No tasks yet</p>
                    )}
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
