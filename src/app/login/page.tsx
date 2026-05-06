'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-100 to-violet-50 flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col min-h-screen">
        {/* Top section */}
        <div className="flex flex-col items-center pt-12 pb-6 px-6">
          {/* App icon */}
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl mb-4">
            📅⭐
          </div>
          <h1 className="text-2xl font-extrabold text-slate-700 mb-1">Swaagat Hai! ❤️</h1>
          <p className="text-sm font-bold text-primary mb-1">ADHD Routine App</p>
          <p className="text-xs text-slate-500 text-center">
            Building better habits, one day at a time
          </p>
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
          <h2 className="text-xl font-extrabold text-slate-700 mb-1">Login</h2>
          <p className="text-xs text-slate-400 mb-5">Sign in to manage your child&apos;s routine</p>

          <div className="space-y-3">
            {/* Email */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or mobile"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
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

            {/* Forgot password */}
            <div className="text-right">
              <button className="text-xs font-semibold text-primary">Forgot password?</button>
            </div>

            {/* Login button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary text-white font-bold text-base rounded-full py-4 shadow-md shadow-primary/20"
            >
              Login
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">Or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-full py-3.5 shadow-sm flex items-center justify-center gap-2"
            >
              <span className="text-lg">🌐</span>
              Continue with Google
            </motion.button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-slate-400 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-bold">
              Sign Up
            </Link>
          </p>

          {/* Feature row */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
            {[
              { icon: '📋', title: 'Daily Routine', desc: 'Manage easily' },
              { icon: '⭐', title: 'Build Habits', desc: 'Stay consistent' },
              { icon: '📊', title: 'Track Progress', desc: 'See growth' },
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

          {/* GPS logo */}
          <div className="flex justify-center mt-4 opacity-40">
            <Image src="/gps_logo.png" alt="GPS" width={18} height={18} className="rounded" />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
