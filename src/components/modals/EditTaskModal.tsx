'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from './EmojiPicker';
import Button from '@/components/ui/Button';
import { Task } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [category, setCategory] = useState<Task['category']>('morning');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('07:00');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setEmoji(task.emoji);
      setCategory(task.category);
      setReminder(!!task.reminderTime);
      setReminderTime(task.reminderTime || '07:00');
      setNotes(task.notes || '');
    }
  }, [task]);

  const handleSave = () => {
    if (!task || !title.trim()) return;
    onSave({
      ...task,
      title: title.trim(),
      emoji,
      category,
      reminderTime: reminder ? reminderTime : undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const categoryLabel: Record<string, string> = {
    morning: t('routine_morning'),
    study: t('routine_study'),
    evening: t('routine_evening'),
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
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-lg font-bold text-slate-700">Edit Task</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="px-5 pb-6 space-y-5">
              {/* Task Name */}
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

              {/* Emoji */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Choose Emoji</label>
                <EmojiPicker selected={emoji} onSelect={setEmoji} />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Category</label>
                <div className="flex gap-2">
                  {(['morning', 'study', 'evening'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all border-2 ${
                        category === cat
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}
                    >
                      {categoryLabel[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reminder */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Reminder (Optional)</label>
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 min-w-0">
                      <span className="shrink-0">🔔</span>
                      <span className="text-sm font-medium truncate">Set reminder time</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReminder((r) => !r)}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 overflow-hidden ml-3 ${
                        reminder ? 'bg-primary' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          reminder ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <AnimatePresence>
                    {reminder && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="time"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="w-full mt-3 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">Notes (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">💬</span>
                  <textarea
                    maxLength={80}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any extra notes..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <span className="absolute right-4 bottom-3 text-xs text-slate-400">{notes.length}/80</span>
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
