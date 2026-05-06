'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ProgressRing from '@/components/ui/ProgressRing';
import StatsCard from '@/components/ui/StatsCard';
import TaskCategorySection from '@/components/tasks/TaskCategorySection';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { MOCK_TASKS, Task, CATEGORY_CONFIG } from '@/lib/mockData';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleTask = (id: string, completed: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );
  };

  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'order'>) => {
    const id = Date.now().toString();
    const order = tasks.filter((t) => t.category === newTask.category).length + 1;
    setTasks((prev) => [...prev, { ...newTask, id, completed: false, order }]);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const tasksByCategory = (cat: Task['category']) =>
    tasks.filter((t) => t.category === cat).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header />

      {/* Motivational banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mb-4 bg-amber-50 rounded-2xl p-4 flex items-center gap-3 border border-amber-100"
      >
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-700 leading-snug">
            Keep going, Arjan! ☀️
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            You&apos;re doing amazing today. Every task counts!
          </p>
        </div>
        <div className="text-4xl">🏔️🌈</div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mx-4 mb-4 grid grid-cols-4 gap-2"
      >
        <StatsCard
          icon={<ProgressRing value={completedCount} max={totalCount} size={48} />}
          value=""
          label="Done"
        />
        <StatsCard icon="⭐" value={completedCount * 2} label="Stars Today" />
        <StatsCard icon="🔥" value={3} label="Streak Days" />
        <StatsCard
          icon="🏆"
          value=""
          label="Rewards"
          action={
            <span className="text-[9px] font-bold text-primary border border-primary rounded-full px-2 py-0.5">
              View
            </span>
          }
        />
      </motion.div>

      {/* Routine sections */}
      <div className="mx-4 pb-28">
        {(['morning', 'study', 'evening'] as const).map((cat, i) => {
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
                tasks={catTasks}
                bg={config.bg}
                iconBg={config.iconBg}
                onToggle={toggleTask}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <BottomNav onAddTask={() => setModalOpen(true)} />

      {/* Add task modal */}
      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addTask}
      />
    </div>
  );
}
