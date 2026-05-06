'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col">
      <div className="max-w-sm mx-auto w-full flex flex-col min-h-screen px-6">
        {/* Header */}
        <header className="flex items-center justify-between pt-8 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white text-lg">
              🌟
            </div>
            <span className="text-base font-bold text-primary">RoutineKids</span>
          </div>
          <Image src="/gps_logo.png" alt="GPS" width={32} height={32} className="rounded-lg opacity-70" />
        </header>

        {/* Hero */}
        <section className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-48 h-48 rounded-3xl bg-violet-100 flex items-center justify-center text-8xl mb-8 shadow-sm">
            👩‍👦
          </div>

          <h1 className="text-3xl font-extrabold text-slate-700 leading-tight mb-3">
            {t('home_welcome')}
          </h1>
          <p className="text-base font-semibold text-primary mb-2">{t('app_name')}</p>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed">
            {t('home_help_text')}
          </p>

          {/* CTAs */}
          <div className="w-full space-y-3">
            <Link
              href="/login"
              className="block w-full text-center bg-primary text-white font-bold text-base rounded-full py-4 shadow-lg shadow-primary/25 hover:bg-primary-dark transition"
            >
              {t('login')}
            </Link>
            <Link
              href="/signup"
              className="block w-full text-center bg-white text-primary font-bold text-base rounded-full py-4 border-2 border-primary hover:bg-violet-50 transition"
            >
              {t('create_account')}
            </Link>
          </div>

          {/* Feature icons */}
          <div className="flex gap-4 mt-10 w-full justify-around">
            {[
              { icon: '📋', title: t('home_feature_routine'), desc: t('home_feature_routine_desc') },
              { icon: '⭐', title: t('home_feature_habits'), desc: t('home_feature_habits_desc') },
              { icon: '📊', title: t('home_feature_progress'), desc: t('home_feature_progress_desc') },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-xl">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-600">{f.title}</span>
                <span className="text-[9px] text-slate-400">{f.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-8 text-center">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <Image src="/gps_logo.png" alt="GPS" width={18} height={18} className="rounded" />
            <span className="text-xs text-slate-400">Powered by GPS</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
