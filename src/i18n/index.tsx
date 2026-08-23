import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import fr from "./fr.json";
import en from "./en.json";
import ar from "./ar.json";

export const LANGUAGES = ["fr", "en", "ar"] as const;
export type Language = (typeof LANGUAGES)[number];

const dictionaries: Record<Language, unknown> = { fr, en, ar };

export const LOCALE_MAP: Record<Language, string> = {
  fr: "fr-FR",
  en: "en-GB",
  ar: "ar-TN",
};

const STORAGE_KEY = "wedding-lang";

function lookup(dict: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, dict);
  return typeof value === "string" ? value : path;
}

type I18nValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
  locale: string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGUAGES as readonly string[]).includes(stored)) {
      setLangState(stored as Language);
    }
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback((key: string) => lookup(dictionaries[lang], key), [lang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t, dir, locale: LOCALE_MAP[lang] }),
    [lang, setLang, t, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
