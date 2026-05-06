'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [childName, setChildName] = useState('');

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-100 to-violet-50 flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col min-h-screen">
        {/* Top */}
        <div className="flex flex-col items-center pt-10 pb-4 px-6">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl mb-3">
            📅⭐
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

          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Parent name"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🧒</span>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Child&apos;s name"
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
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary text-white font-bold text-base rounded-full py-4 shadow-md shadow-primary/20"
            >
              Create Account
            </motion.button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">Or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-full py-3.5 shadow-sm flex items-center justify-center gap-2"
            >
              <span className="text-lg">🌐</span>
              Continue with Google
            </motion.button>
          </div>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
