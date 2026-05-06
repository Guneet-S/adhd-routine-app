'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/translations/en.json';
import pa from '@/translations/pa.json';

export type Language = 'english' | 'punjabi';

type TranslationKey = keyof typeof en;
type Translations = Record<TranslationKey, string>;

const translations: Record<Language, Translations> = {
  english: en as Translations,
  punjabi: pa as Translations,
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('english');

  useEffect(() => {
    const saved = localStorage.getItem('appLanguage') as Language | null;
    if (saved === 'english' || saved === 'punjabi') {
      setLanguageState(saved);
    }
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  }

  function t(key: TranslationKey): string {
    return translations[language][key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
