'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from './EmojiPicker';
import Button from '@/components/ui/Button';
import { Task } from '@/lib/mockData';

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [category, setCategory] = useState<Task['category']>('morning');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setEmoji(task.emoji);
      setCategory(task.category);
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !title.trim()) return;
    onSave({ ...task, title: title.trim(), emoji, category });
    onClose();
  };

  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-lg font-bold text-slate-700">✏️ Edit Task</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="px-5 pb-6 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Task Name</label>
                <input
                  type="text"
                  maxLength={40}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Choose Emoji</label>
                <EmojiPicker selected={emoji} onSelect={setEmoji} />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Category</label>
                <div className="flex gap-2">
                  {(['morning', 'study', 'evening'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-2 rounded-2xl text-xs font-bold capitalize transition-all border-2 ${
                        category === cat
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} fullWidth disabled={!title.trim()}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
