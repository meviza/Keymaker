"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type LanguageContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  T: ReturnType<typeof t>;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "tr",
  setLocale: () => {},
  T: t("tr"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("km-locale") as Locale | null;
    if (saved === "tr" || saved === "en") setLocale(saved);
  }, []);

  function handleSetLocale(l: Locale) {
    setLocale(l);
    localStorage.setItem("km-locale", l);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, T: t(locale) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
