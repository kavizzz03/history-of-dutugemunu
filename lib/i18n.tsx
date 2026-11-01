'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Bil = { en: string; si: string };
/** Short alias used by the content files in lib/. */
export type L = Bil;
export type Lang = 'en' | 'si' | 'both';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** pick one string for the current language (in "both" mode returns English) */
  t: (b: Bil) => string;
};

const LangContext = createContext<Ctx>({ lang: 'en', setLang: () => {}, t: (b) => b.en });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dg-lang') as Lang | null;
      if (saved === 'en' || saved === 'si' || saved === 'both') setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('dg-lang', l);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'si' ? 'si' : 'en';
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const value = useMemo<Ctx>(() => ({ lang, setLang, t: (b) => (lang === 'si' ? b.si : b.en) }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/**
 * Renders a bilingual string. In "both" mode the Sinhala line sits beneath the English one.
 * `as` controls the wrapper element so headings stay semantic.
 */
export function Bi({
  v,
  as: Tag = 'span',
  className,
  subClassName,
}: {
  v: Bil;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  className?: string;
  subClassName?: string;
}) {
  const { lang } = useLang();
  if (lang === 'both') {
    return (
      <Tag className={className}>
        <span className="bi-en">{v.en}</span>
        <span className={`bi-si ${subClassName ?? ''}`} lang="si">
          {v.si}
        </span>
      </Tag>
    );
  }
  return (
    <Tag className={className} lang={lang === 'si' ? 'si' : 'en'}>
      {lang === 'si' ? v.si : v.en}
    </Tag>
  );
}
