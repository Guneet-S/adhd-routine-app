'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from './EmojiPicker';
import Button from '@/components/ui/Button';
import { Task } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'order'>) => void;
}

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [category, setCategory] = useState<'morning' | 'evening' | 'study'>('morning');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('07:00');
  const [notes, setNotes] = useState('');

  const CATEGORIES = [
    { value: 'morning' as const, label: t('routine_morning'), emoji: '☀️', time: '6:30 - 8:30', bg: 'bg-morning-accent' },
    { value: 'evening' as const, label: t('routine_evening'), emoji: '🌙', time: '6:00 - 8:30', bg: 'bg-evening-accent' },
    { value: 'study' as const, label: t('routine_study'), emoji: '📖', time: '3:30 - 5:00', bg: 'bg-study-accent' },
  ];

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      emoji,
      category,
      reminderTime: reminder ? reminderTime : undefined,
      notes: notes.trim() || undefined,
    });
    setTitle('');
    setEmoji('⭐');
    setCategory('morning');
    setReminder(false);
    setReminderTime('07:00');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[92vh] overflow-y-auto"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-lg font-bold text-slate-700">Add New Task</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="px-5 pb-4 space-y-5">
              {/* 1. Task Name */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">1. Task Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✏️</span>
                  <input
                    type="text"
                    maxLength={40}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Brush Teeth"
                    className="w-full pl-10 pr-16 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    {title.length}/40
                  </span>
                </div>
              </div>

              {/* 2. Emoji */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">2. Choose Emoji</label>
                <EmojiPicker selected={emoji} onSelect={setEmoji} />
              </div>

              {/* 3. Category */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">3. Choose Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`relative rounded-2xl p-3 text-center transition-all border-2 ${
                        category === cat.value
                          ? 'border-primary bg-primary/5'
                          : 'border-transparent'
                      } ${cat.bg}`}
                    >
                      {category === cat.value && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">✓</span>
                        </span>
                      )}
                      <div className="text-2xl mb-1">{cat.emoji}</div>
                      <div className="text-[10px] font-bold text-slate-700 leading-tight">{cat.label}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{cat.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Reminder */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">4. Reminder (Optional)</label>
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 min-w-0">
                      <span className="shrink-0">🔔</span>
                      <span className="text-sm font-medium truncate">Set reminder time</span>
                    </div>
                    {/* Toggle — shrink-0 + overflow-hidden prevent layout breaks */}
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

                  {/* Time picker — shown only when toggle is on */}
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

              {/* 5. Notes */}
              <div>
                <label className="text-sm font-bold text-slate-600 mb-2 block">5. Notes (Optional)</label>
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

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                fullWidth
                disabled={!title.trim()}
              >
                + Add Task
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
