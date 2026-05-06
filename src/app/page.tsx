'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LanguageSelectPage() {
  const router = useRouter();

  useEffect(() => {
    // If language already chosen, skip to landing
    const saved = localStorage.getItem('appLanguage');
    if (saved === 'punjabi' || saved === 'english') {
      router.replace('/home');
    }
  }, [router]);

  function select(lang: 'punjabi' | 'english') {
    localStorage.setItem('appLanguage', lang);
    router.push('/home');
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-100 to-violet-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-sm w-full flex flex-col items-center">

        {/* App icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-4xl shadow-xl shadow-primary/30 mb-6"
        >
          🌟
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-extrabold text-slate-700 mb-1 text-center"
        >
          ADHD Routine App
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-slate-500 mb-10 text-center"
        >
          Choose your language / ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ
        </motion.p>

        {/* Language buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full space-y-3"
        >
          <button
            onClick={() => select('punjabi')}
            className="w-full bg-primary text-white font-bold text-lg rounded-2xl py-5 shadow-lg shadow-primary/25 flex items-center justify-center gap-3 hover:bg-primary/90 active:scale-[0.98] transition"
          >
            <span className="text-2xl">🇮🇳</span>
            ਪੰਜਾਬੀ
          </button>

          <button
            onClick={() => select('english')}
            className="w-full bg-white text-primary font-bold text-lg rounded-2xl py-5 border-2 border-primary flex items-center justify-center gap-3 hover:bg-violet-50 active:scale-[0.98] transition"
          >
            <span className="text-2xl">🇬🇧</span>
            English
          </button>
        </motion.div>

        {/* GPS logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-12 flex items-center gap-2 opacity-40"
        >
          <Image src="/gps_logo.png" alt="GPS" width={18} height={18} className="rounded" />
          <span className="text-xs text-slate-400">Powered by GPS</span>
        </motion.div>
      </div>
    </main>
  );
}
