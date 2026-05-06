'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '@/firebase';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/dashboard');
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? '';
      setError(friendlyError(code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
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
        {/* Top section */}
        <div className="flex flex-col items-center pt-12 pb-6 px-6">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center mb-4 overflow-hidden">
            <Image src="/gps_logo.png" alt="App" width={48} height={48} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-700 mb-1">{t('home_welcome')}</h1>
          <p className="text-sm font-bold text-primary mb-1">{t('app_name')}</p>
          <p className="text-xs text-slate-500 text-center">{t('app_tagline')}</p>
        </div>

        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <div className="w-40 h-32 bg-violet-100 rounded-3xl flex items-center justify-center text-7xl">
            👩‍👦
          </div>
        </div>

        {/* Login card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 bg-white rounded-t-3xl px-6 pt-6 pb-8 shadow-xl"
        >
          <h2 className="text-xl font-extrabold text-slate-700 mb-1">{t('login')}</h2>
          <p className="text-xs text-slate-400 mb-5">{t('login_subtitle')}</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-xs text-red-500 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-3">
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

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('password')}
                required
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="text-right">
              <button type="button" className="text-xs font-semibold text-primary">
                {t('forgot_password')}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary text-white font-bold text-base rounded-full py-4 shadow-md shadow-primary/20 disabled:opacity-60"
            >
              {loading ? t('signing_in') : t('login')}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 py-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-full py-3.5 shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <GoogleIcon size={20} />
            {t('continue_google')}
          </motion.button>

          <p className="text-center text-sm text-slate-400 mt-5">
            {t('no_account')}{' '}
            <Link href="/signup" className="text-primary font-bold">
              {t('sign_up')}
            </Link>
          </p>

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
            {[
              { icon: '📋', title: t('home_feature_routine'), desc: t('home_feature_routine_desc') },
              { icon: '⭐', title: t('home_feature_habits'), desc: t('home_feature_habits_desc') },
              { icon: '📊', title: t('home_feature_progress'), desc: t('home_feature_progress_desc') },
            ].map((f) => (
              <div key={f.title} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg">
                  {f.icon}
                </div>
                <span className="text-[9px] font-bold text-slate-600 text-center">{f.title}</span>
                <span className="text-[8px] text-slate-400 text-center">{f.desc}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <Image src="/gps_logo.png" alt="GPS" width={18} height={18} className="rounded opacity-40" />
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function friendlyError(code: string): string {
  if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
    return 'Incorrect email or password.';
  }
  if (code.includes('too-many-requests')) return 'Too many attempts. Please try again later.';
  if (code.includes('network-request-failed')) return 'Network error. Check your connection.';
  if (code.includes('unauthorized-domain')) return 'Login blocked: this domain is not authorized in Firebase. Add it to Firebase Console > Authentication > Authorized Domains.';
  if (code.includes('popup-closed-by-user') || code.includes('cancelled-popup-request')) return '';
  if (code.includes('operation-not-allowed')) return 'This login method is not enabled. Please enable it in Firebase Console.';
  return 'Login failed. Please try again.';
}
