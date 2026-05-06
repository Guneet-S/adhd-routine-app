'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { createUserProfile, createDefaultTasks } from '@/lib/firestore';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { useLanguage } from '@/context/LanguageContext';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;

export default function SignupPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [schoolDays, setSchoolDays] = useState([true, true, true, true, true]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleDay(i: number) {
    setSchoolDays((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      const age = parseInt(childAge, 10) || 0;
      try {
        await createUserProfile(cred.user.uid, {
          parentName: name,
          childName,
          childAge: age,
          email,
          wakeUpTime,
          schoolDays,
          language,
        });
        await createDefaultTasks(cred.user.uid, age);
      } catch {
        console.warn('Profile/tasks save failed — Firestore rules may need updating');
      }

      router.replace('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());

      try {
        await createUserProfile(cred.user.uid, {
          parentName: cred.user.displayName || '',
          childName: '',
          childAge: 0,
          email: cred.user.email || '',
          wakeUpTime: '07:00',
          schoolDays: [true, true, true, true, true],
          language,
        });
      } catch {
        console.warn('Profile save failed — Firestore rules may need updating');
      }

      router.replace('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-100 to-violet-50 flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col min-h-screen">
        {/* Top */}
        <div className="flex flex-col items-center pt-10 pb-4 px-6">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-3 overflow-hidden">
            <Image src="/gps_logo.png" alt="App" width={48} height={48} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-700 mb-1">{t('signup_title')}</h1>
          <p className="text-xs text-slate-500 text-center">{t('signup_subtitle')}</p>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 bg-white rounded-t-3xl px-6 pt-6 pb-8 shadow-xl"
        >
          <h2 className="text-xl font-extrabold text-slate-700 mb-1">{t('signup_form_title')}</h2>
          <p className="text-xs text-slate-400 mb-5">{t('signup_form_subtitle')}</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-xs text-red-500 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            {/* Parent name */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('parent_name')}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Child name */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🧒</span>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder={t('child_name')}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Child age */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🎂</span>
              <input
                type="number"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder={t('child_age')}
                required
                min={1}
                max={18}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Wake-up time */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⏰</span>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* School days */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 mb-2">{t('school_days')}</p>
              <div className="flex gap-2">
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                      schoolDays[i]
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {t(day)}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email')}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('signup_create_password')}
                required
                minLength={6}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary text-white font-bold text-base rounded-full py-4 shadow-md shadow-primary/20 disabled:opacity-60"
            >
              {loading ? t('creating_account') : t('create_account')}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 py-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-full py-3.5 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <GoogleIcon size={20} />
            {t('continue_google')}
          </motion.button>

          <p className="text-center text-sm text-slate-400 mt-5">
            {t('already_have_account')}{' '}
            <Link href="/login" className="text-primary font-bold">
              {t('login')}
            </Link>
          </p>

          <div className="flex justify-center mt-6 pt-4 border-t border-slate-100">
            <Image src="/gps_logo.png" alt="GPS" width={18} height={18} className="rounded opacity-40" />
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function friendlyError(code: string): string {
  if (code.includes('email-already-in-use')) return 'An account with this email already exists.';
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.';
  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  if (code.includes('network-request-failed')) return 'Network error. Check your connection.';
  if (code.includes('unauthorized-domain')) return 'Signup blocked: this domain is not authorized in Firebase. Add it to Firebase Console > Authentication > Authorized Domains.';
  if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) return '';
  if (code.includes('operation-not-allowed')) return 'Email/password signup is not enabled. Please enable it in Firebase Console > Authentication > Sign-in methods.';
  return `Signup failed (${code || 'unknown error'}). Please try again.`;
}
