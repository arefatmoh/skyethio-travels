import { useLanguage } from '@/contexts/LanguageContext';

export function useTranslation() {
  const { t, locale, switchLanguage, isRTL } = useLanguage();
  
  return {
    t,
    locale,
    switchLanguage,
    isRTL,
    // Helper function for conditional translation
    tConditional: (key: string, condition: boolean, fallbackKey?: string) => {
      if (condition) {
        return t(key);
      }
      return fallbackKey ? t(fallbackKey) : key;
    },
    // Helper function for pluralization
    tPlural: (singularKey: string, pluralKey: string, count: number) => {
      return count === 1 ? t(singularKey) : t(pluralKey);
    }
  };
}
