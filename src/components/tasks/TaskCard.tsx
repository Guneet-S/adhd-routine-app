'use client';

import { motion } from 'framer-motion';
import Checkbox from '@/components/ui/Checkbox';
import { Task } from '@/lib/mockData';

interface TaskCardProps {
  task: Task;
  iconBg: string;
  onToggle: (id: string, completed: boolean) => void;
}

export default function TaskCard({ task, iconBg, onToggle }: TaskCardProps) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 py-2.5 px-1"
    >
      {/* Emoji icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${iconBg}`}
      >
        {task.emoji}
      </div>

      {/* Task name + reminder */}
      <div className="flex-1 min-w-0">
        <span
          className={`block text-sm font-semibold transition-colors ${
            task.completed ? 'line-through text-slate-400' : 'text-slate-700'
          }`}
        >
          {task.title}
        </span>
        {task.reminderTime && (
          <span className="text-[10px] text-slate-400 font-medium">🔔 {task.reminderTime}</span>
        )}
        {task.notes && (
          <span className="text-[10px] text-slate-400 block truncate">{task.notes}</span>
        )}
      </div>

      {/* Checkbox */}
      <Checkbox
        checked={task.completed}
        onChange={(checked) => onToggle(task.id, checked)}
      />
    </motion.div>
  );
}
