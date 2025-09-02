'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { Locale } from '@/locales';

interface LanguageChooserProps {
  onLanguageSelect: (locale: Locale) => void;
}

export default function LanguageChooser({ onLanguageSelect }: LanguageChooserProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Locale | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Show the component after a brief delay for smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const languages = [
    {
      code: 'en' as Locale,
      name: t('common.languageChooser.english'),
      nativeName: 'English',
      flag: '🇺🇸',
      description: t('common.languageChooser.englishDescription')
    },
    {
      code: 'am' as Locale,
      name: t('common.languageChooser.amharic'),
      nativeName: 'አማርኛ',
      flag: '🇪🇹',
      description: t('common.languageChooser.amharicDescription')
    }
  ];

  const handleLanguageSelect = (locale: Locale) => {
    setSelectedLanguage(locale);
    // Add a brief delay to show the selection animation
    setTimeout(() => {
      onLanguageSelect(locale);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-100">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30"
              />
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-30"
              />
            </div>

            <CardContent className="relative p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4"
                >
                  <Globe className="w-8 h-8 text-white" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  {t('common.languageChooser.title')}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm"
                >
                  {t('common.languageChooser.subtitle')}
                </motion.p>
              </motion.div>

              {/* Language Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleLanguageSelect(lang.code)}
                      variant="outline"
                      className={`w-full h-auto p-4 justify-start border-2 transition-all duration-300 ${
                        selectedLanguage === lang.code
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                    >
                      <div className="flex items-center w-full">
                        <div className="text-2xl mr-4">{lang.flag}</div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-800">
                            {lang.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lang.nativeName} • {lang.description}
                          </div>
                        </div>
                        {selectedLanguage === lang.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2"
                          >
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t('common.languageChooser.saveMessage')}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
