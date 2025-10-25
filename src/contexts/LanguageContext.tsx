import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, TranslationKeys } from '../lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

async function detectLanguageByIP(): Promise<Language> {
  try {
    const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (response.ok) {
      const data = await response.json();
      const country = data.country_code?.toUpperCase();

      const languageMap: Record<string, Language> = {
        CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG: 'zh',
        JP: 'ja',
        ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
        FR: 'fr', BE: 'fr', CH: 'fr', CA: 'fr',
        DE: 'de', AT: 'de',
        KR: 'ko',
      };

      if (country && languageMap[country]) {
        return languageMap[country];
      }
    }
  } catch (error) {
    console.log('IP detection failed, falling back to browser language');
  }

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('ko')) return 'ko';
  return 'en';
}

const validLanguages: Language[] = ['zh', 'en', 'ja', 'es', 'fr', 'de', 'ko'];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    if (saved && validLanguages.includes(saved as Language)) {
      return saved as Language;
    }
    return 'en';
  });

  useEffect(() => {
    const initLanguage = async () => {
      const saved = localStorage.getItem('app-language');
      if (!saved) {
        const detected = await detectLanguageByIP();
        setLanguageState(detected);
        localStorage.setItem('app-language', detected);
      }
    };
    initLanguage();
  }, []);

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
