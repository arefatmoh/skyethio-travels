'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, getTranslation } from '@/locales';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  switchLanguage: (newLocale: Locale) => void;
  isRTL: boolean;
  showLanguageChooser: boolean;
  setShowLanguageChooser: (show: boolean) => void;
  isFirstTimeVisitor: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [showLanguageChooser, setShowLanguageChooser] = useState(false);
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(false);

  // Initialize locale from localStorage or default to English
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
      
      if (!hasVisitedBefore) {
        // First time visitor - show language chooser
        setIsFirstTimeVisitor(true);
        setShowLanguageChooser(true);
      } else if (savedLocale && (savedLocale === 'en' || savedLocale === 'am')) {
        setLocaleState(savedLocale);
      }
    }
  }, []);

  // Translation function
  const t = (key: string): string => {
    return getTranslation(locale, key);
  };

  // Switch language function
  const switchLanguage = (newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      // Mark as visited
      localStorage.setItem('hasVisitedBefore', 'true');
    }

    // Hide language chooser after selection
    setShowLanguageChooser(false);

    // For now, just update the state without changing the URL
    // URL routing will be implemented in a future phase
    // const newPath = addLocaleToPathname(pathname, newLocale);
    // if (newPath !== pathname) {
    //   router.push(newPath);
    // }
  };

  // Check if current language is RTL
  const isRTL = locale === 'am'; // Amharic is RTL

  const value: LanguageContextType = {
    locale,
    setLocale: setLocaleState,
    t,
    switchLanguage,
    isRTL,
    showLanguageChooser,
    setShowLanguageChooser,
    isFirstTimeVisitor
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
