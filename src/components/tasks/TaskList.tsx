'use client';

import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { Task } from '@/lib/mockData';

interface TaskListProps {
  tasks: Task[];
  iconBg: string;
  onToggle: (id: string, completed: boolean) => void;
}

export default function TaskList({ tasks, iconBg, onToggle }: TaskListProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06 } },
      }}
      className="divide-y divide-slate-100/60"
    >
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          variants={{
            hidden: { opacity: 0, y: 8 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.25 }}
        >
          <TaskCard task={task} iconBg={iconBg} onToggle={onToggle} />
        </motion.div>
      ))}
    </motion.div>
  );
}
