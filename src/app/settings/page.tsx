'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';
import BottomNav from '@/components/layout/BottomNav';
import ChevronLeft from '@/components/icons/ChevronLeft';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUserProfile, updateUserProfile, resetProgress, UserProfile } from '@/lib/firestore';

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

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [soundEffects, setSoundEffects] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const p = await getUserProfile(user.uid);
    setProfile(p);
    setSoundEffects(p?.soundEffects ?? true);
  }, [user]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  async function handleSoundToggle() {
    if (!user) return;
    const next = !soundEffects;
    setSoundEffects(next);
    await updateUserProfile(user.uid, { soundEffects: next });
  }

  async function handleReset() {
    if (!user) return;
    setResetting(true);
    await resetProgress(user.uid);
    setResetting(false);
    setResetDone(true);
    setShowResetConfirm(false);
    setTimeout(() => setResetDone(false), 3000);
  }

  async function handleLanguageChange(lang: 'english' | 'punjabi') {
    if (!user) return;
    setLanguage(lang);
    await updateUserProfile(user.uid, { language: lang });
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
          <h1 className="text-lg font-extrabold text-slate-700">Parent Settings</h1>
        </header>

        <div className="px-4 pt-4 pb-28 space-y-3">
          {resetDone && (
            <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 text-xs font-bold text-green-700">
              Progress reset successfully.
            </div>
          )}

          {/* Edit child profile */}
          <button
            onClick={() => router.push('/more')}
            className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm min-h-[52px]"
          >
            <span className="text-xl">🧒</span>
            <span className="flex-1 text-sm font-semibold text-slate-700 text-left">Edit Child Profile</span>
            <span className="text-slate-300">→</span>
          </button>

          {/* Notification timings */}
          <button
            onClick={() => router.push('/notifications')}
            className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm min-h-[52px]"
          >
            <span className="text-xl">🔔</span>
            <span className="flex-1 text-sm font-semibold text-slate-700 text-left">Notification Timings</span>
            <span className="text-slate-300">→</span>
          </button>

          {/* Language */}
          <div className="bg-white rounded-2xl px-4 py-4 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Language</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleLanguageChange('english')}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                  language === 'english' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('punjabi')}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-bold border-2 transition-all ${
                  language === 'punjabi' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>

          {/* Sound effects */}
          <div className="bg-white rounded-2xl px-4 py-3.5 border border-slate-100 shadow-sm flex items-center justify-between min-h-[52px]">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔊</span>
              <span className="text-sm font-semibold text-slate-700">Sound Effects</span>
            </div>
            <Toggle enabled={soundEffects} onToggle={handleSoundToggle} />
          </div>

          {/* Child info summary */}
          {profile && (
            <div className="bg-slate-100 rounded-2xl px-4 py-3 text-xs text-slate-500 space-y-1">
              <p><span className="font-bold">Child:</span> {profile.childName || '—'}</p>
              <p><span className="font-bold">Age:</span> {profile.childAge || '—'}</p>
              <p><span className="font-bold">Wake-up:</span> {profile.wakeUpTime || '—'}</p>
              <p><span className="font-bold">Total stars:</span> {profile.totalStars}</p>
              <p><span className="font-bold">Streak:</span> {profile.streak} days</p>
            </div>
          )}

          {/* Reset progress */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 border border-red-100 shadow-sm min-h-[52px]"
            >
              <span className="text-xl">🔄</span>
              <span className="flex-1 text-sm font-semibold text-red-500 text-left">Reset Progress</span>
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3">
              <p className="text-sm font-bold text-red-700">Are you sure?</p>
              <p className="text-xs text-red-500">This will reset all stars, streak, and task completion data. Tasks are kept.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-2xl border-2 border-slate-200 text-sm font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  className="flex-1 py-2.5 rounded-2xl bg-red-500 text-white text-sm font-bold disabled:opacity-60"
                >
                  {resetting ? 'Resetting...' : 'Yes, Reset'}
                </button>
              </div>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </AuthGuard>
  );
}
