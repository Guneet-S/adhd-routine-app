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
import { createUserProfile } from '@/lib/firestore';
import GoogleIcon from '@/components/icons/GoogleIcon';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Step 1: Create Firebase Auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Step 2: Save profile to Firestore (non-blocking — don't fail auth if this fails)
      try {
        await createUserProfile(cred.user.uid, { parentName: name, childName, email });
      } catch {
        // Profile save failed (likely Firestore rules) — auth still succeeded, continue
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

  async function handleGoogleSignup() {
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());

      try {
        await createUserProfile(cred.user.uid, {
          parentName: cred.user.displayName || '',
          childName: '',
          email: cred.user.email || '',
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
          <h1 className="text-2xl font-extrabold text-slate-700 mb-1">Create Account</h1>
          <p className="text-xs text-slate-500 text-center">Set up your family&apos;s routine app</p>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex-1 bg-white rounded-t-3xl px-6 pt-6 pb-8 shadow-xl"
        >
          <h2 className="text-xl font-extrabold text-slate-700 mb-1">Sign Up</h2>
          <p className="text-xs text-slate-400 mb-5">Fill in your details to get started</p>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-xs text-red-500 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Parent name"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🧒</span>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Child's name"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password (min 6 chars)"
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
              {loading ? 'Creating account...' : 'Create Account'}
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
            Continue with Google
          </motion.button>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold">
              Login
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
