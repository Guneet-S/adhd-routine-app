'use client';

import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  childName?: string;
}

export default function Header({ childName }: HeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-white">
      {/* Left: avatar + greeting */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-2xl shadow-sm border-2 border-primary/20">
          🧒
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{t('header_greeting')}</p>
          <p className="text-base font-bold text-slate-700">
            {childName || '...'} <span>⭐</span>
          </p>
          <p className="text-xs text-slate-400">{t('header_tagline')}</p>
        </div>
      </div>

      {/* Right: notification bell */}
      <button className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-xl hover:bg-slate-50 transition">
        🔔
      </button>
    </div>
  );
}
