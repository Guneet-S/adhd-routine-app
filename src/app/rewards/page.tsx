'use client';

import { motion } from 'framer-motion';
import BottomNav from '@/components/layout/BottomNav';
import { useState } from 'react';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { Task } from '@/lib/mockData';
import Link from 'next/link';
import AuthGuard from '@/components/auth/AuthGuard';

const BADGES = [
  { emoji: '🌟', title: 'First Task', desc: 'Completed your first task', earned: true },
  { emoji: '🔥', title: '3-Day Streak', desc: 'Three days in a row!', earned: true },
  { emoji: '🏆', title: 'Perfect Day', desc: 'All tasks done in one day', earned: false },
  { emoji: '🌈', title: 'Week Warrior', desc: '7-day streak', earned: false },
  { emoji: '💎', title: 'Super Star', desc: '50 tasks completed', earned: false },
  { emoji: '🚀', title: 'Rocket Kid', desc: '100 tasks completed', earned: false },
];

export default function RewardsPage() {
  const [addOpen, setAddOpen] = useState(false);

  const handleAdd = (_task: Omit<Task, 'id' | 'completed' | 'order'>) => {};

  return (
    <AuthGuard>
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white px-4 pt-5 pb-3 flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-400 text-lg">←</Link>
        <h1 className="text-lg font-extrabold text-slate-700">Rewards ⭐</h1>
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
            <p className="text-3xl font-extrabold text-white">24</p>
            <p className="text-sm font-semibold text-violet-200">Total Stars Earned</p>
            <p className="text-xs text-violet-300 mt-0.5">Keep completing tasks to earn more!</p>
          </div>
        </motion.div>

        {/* Streak */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: '🔥', value: 3, label: 'Day Streak' },
            { icon: '✅', value: 18, label: 'Tasks Done' },
            { icon: '📅', value: 5, label: 'Days Active' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-bold text-slate-700">{stat.value}</div>
              <div className="text-[10px] text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <h2 className="text-sm font-bold text-slate-600 mb-3">Badges</h2>
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
                  <span className="text-[9px] font-bold text-primary">Earned ✓</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav onAddTask={() => setAddOpen(true)} />
      <AddTaskModal isOpen={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAdd} />
    </div>
    </AuthGuard>
  );
}
