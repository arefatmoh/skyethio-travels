import en from './en.json';
import am from './am.json';

export type Locale = 'en' | 'am';

export const locales: Record<Locale, string> = {
  en: 'English',
  am: 'አማርኛ'
};

export const localeNames: Record<Locale, string> = {
  en: 'EN',
  am: 'AM'
};

export const translations = {
  en,
  am
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if translation not found
      value = getNestedValue(translations.en, keys);
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

function getNestedValue(obj: any, keys: string[]): any {
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

// URL routing functions - will be implemented in future phase
// export function getLocaleFromPathname(pathname: string): Locale {
//   // Check if pathname starts with locale
//   const segments = pathname.split('/');
//   if (segments[1] && (segments[1] === 'en' || segments[1] === 'am')) {
//     return segments[1] as Locale;
//   }
//   return 'en'; // Default to English
// }

// export function addLocaleToPathname(pathname: string, locale: Locale): string {
//   if (locale === 'en') {
//     return pathname; // English is default, no prefix needed
//   }
  
//   const segments = pathname.split('/');
//   if (segments[1] && (segments[1] === 'en' || segments[1] === 'am')) {
//     segments[1] = locale;
//   } else {
//     segments.splice(1, 0, locale);
//   }
  
//   return segments.join('/');
// }

// export function removeLocaleFromPathname(pathname: string): string {
//   const segments = pathname.split('/');
//   if (segments[1] && (segments[1] === 'am')) {
//     segments.splice(1, 1);
//   }
//   return segments.join('/');
// }
