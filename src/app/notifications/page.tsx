'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import ChevronLeft from '@/components/icons/ChevronLeft';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, saveNotificationPrefs, NotificationPrefs } from '@/lib/firestore';

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 overflow-hidden ${
        enabled ? 'bg-primary' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

const DEFAULT_PREFS: NotificationPrefs = {
  wakeUpEnabled: false,
  wakeUpTime: '07:00',
  homeworkEnabled: false,
  homeworkTime: '15:30',
  bedtimeEnabled: false,
  bedtimeTime: '20:30',
  hydrationEnabled: false,
  rewardsEnabled: true,
};

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadPrefs = useCallback(async () => {
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    if (profile?.notifications) {
      setPrefs(profile.notifications);
    }
  }, [user]);

  useEffect(() => { loadPrefs(); }, [loadPrefs]);

  function update<K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await saveNotificationPrefs(user.uid, prefs);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

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
          <h1 className="text-lg font-extrabold text-slate-700">Notifications</h1>
        </header>

        <div className="px-4 pt-4 pb-28 space-y-3">
          <p className="text-xs text-slate-400 px-1">Configure reminders for your child&apos;s daily routine.</p>

          {/* Wake-up reminder */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌞</span>
                <span className="text-sm font-bold text-slate-700">Wake-up Reminder</span>
              </div>
              <Toggle enabled={prefs.wakeUpEnabled} onToggle={() => update('wakeUpEnabled', !prefs.wakeUpEnabled)} />
            </div>
            <AnimatePresence>
              {prefs.wakeUpEnabled && (
                <motion.input
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  type="time"
                  value={prefs.wakeUpTime}
                  onChange={(e) => update('wakeUpTime', e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Homework reminder */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <span className="text-sm font-bold text-slate-700">Homework Reminder</span>
              </div>
              <Toggle enabled={prefs.homeworkEnabled} onToggle={() => update('homeworkEnabled', !prefs.homeworkEnabled)} />
            </div>
            <AnimatePresence>
              {prefs.homeworkEnabled && (
                <motion.input
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  type="time"
                  value={prefs.homeworkTime}
                  onChange={(e) => update('homeworkTime', e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Bedtime reminder */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌙</span>
                <span className="text-sm font-bold text-slate-700">Bedtime Reminder</span>
              </div>
              <Toggle enabled={prefs.bedtimeEnabled} onToggle={() => update('bedtimeEnabled', !prefs.bedtimeEnabled)} />
            </div>
            <AnimatePresence>
              {prefs.bedtimeEnabled && (
                <motion.input
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  type="time"
                  value={prefs.bedtimeTime}
                  onChange={(e) => update('bedtimeTime', e.target.value)}
                  className="w-full mt-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Hydration */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💧</span>
                <div>
                  <span className="text-sm font-bold text-slate-700">Hydration Reminder</span>
                  <p className="text-[10px] text-slate-400">Every 2 hours</p>
                </div>
              </div>
              <Toggle enabled={prefs.hydrationEnabled} onToggle={() => update('hydrationEnabled', !prefs.hydrationEnabled)} />
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <span className="text-sm font-bold text-slate-700">Reward Notifications</span>
                  <p className="text-[10px] text-slate-400">When badges are earned</p>
                </div>
              </div>
              <Toggle enabled={prefs.rewardsEnabled} onToggle={() => update('rewardsEnabled', !prefs.rewardsEnabled)} />
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-white font-bold text-sm rounded-full py-3.5 shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}
