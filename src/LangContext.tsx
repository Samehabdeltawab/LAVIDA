import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Lang } from "./i18n";

interface LangContextType {
  lang: Lang;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType>({ lang: "ar", toggleLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.body.style.direction = lang === "ar" ? "rtl" : "ltr";
    document.body.style.textAlign = lang === "ar" ? "right" : "left";
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => prev === "ar" ? "en" : "ar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
