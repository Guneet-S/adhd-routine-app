'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskList from './TaskList';
import { Task } from '@/lib/mockData';

interface TaskCategorySectionProps {
  title: string;
  emoji: string;
  tasks: Task[];
  bg: string;
  iconBg: string;
  onToggle: (id: string, completed: boolean) => void;
}

export default function TaskCategorySection({
  title,
  emoji,
  tasks,
  bg,
  iconBg,
  onToggle,
}: TaskCategorySectionProps) {
  const [expanded, setExpanded] = useState(true);
  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className={`rounded-2xl overflow-hidden mb-4 ${bg}`}>
      {/* Section header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2 px-4 py-3"
      >
        <span className="text-xl">{emoji}</span>
        <span className="flex-1 text-sm font-bold text-slate-700 text-left">{title}</span>
        <span className="text-xs text-slate-500 font-medium">{tasks.length} tasks</span>
        {remaining > 0 && (
          <span className="ml-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {remaining} left
          </span>
        )}
        <span className="text-slate-400 text-sm ml-1">{expanded ? '▾' : '▸'}</span>
      </button>

      {/* Task list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden px-4 pb-3"
          >
            <TaskList tasks={tasks} iconBg={iconBg} onToggle={onToggle} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
