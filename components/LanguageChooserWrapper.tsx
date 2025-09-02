'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageChooser from '@/components/LanguageChooser';

interface LanguageChooserWrapperProps {
  children: React.ReactNode;
}

export default function LanguageChooserWrapper({ children }: LanguageChooserWrapperProps) {
  const { showLanguageChooser, switchLanguage } = useTranslation();

  const handleLanguageSelect = (locale: 'en' | 'am') => {
    switchLanguage(locale);
  };

  return (
    <>
      {children}
      {showLanguageChooser && (
        <LanguageChooser onLanguageSelect={handleLanguageSelect} />
      )}
    </>
  );
}
