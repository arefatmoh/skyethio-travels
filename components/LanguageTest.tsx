'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

export default function LanguageTest() {
  const { t, locale, switchLanguage } = useTranslation();

  return (
    <div className="p-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-white mb-4">Language Test</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-white mb-2">Current Language: {locale}</p>
          <div className="flex gap-2">
            <Button 
              onClick={() => switchLanguage('en')}
              variant={locale === 'en' ? 'default' : 'outline'}
              size="sm"
            >
              English
            </Button>
            <Button 
              onClick={() => switchLanguage('am')}
              variant={locale === 'am' ? 'default' : 'outline'}
              size="sm"
            >
              አማርኛ
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white font-semibold">Navigation:</p>
          <p className="text-cyan-200">Home: {t('navigation.home')}</p>
          <p className="text-cyan-200">About: {t('navigation.about')}</p>
          <p className="text-cyan-200">Services: {t('navigation.services')}</p>
        </div>

        <div className="space-y-2">
          <p className="text-white font-semibold">Hero Section:</p>
          <p className="text-cyan-200">Title: {t('homepage.hero.title')}</p>
          <p className="text-cyan-200">Subtitle: {t('homepage.hero.subtitle')}</p>
        </div>

        <div className="space-y-2">
          <p className="text-white font-semibold">Common:</p>
          <p className="text-cyan-200">Scroll: {t('common.scroll')}</p>
          <p className="text-cyan-200">Loading: {t('common.loading')}</p>
        </div>
      </div>
    </div>
  );
}
