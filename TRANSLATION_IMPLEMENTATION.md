# Amharic Translation Implementation Guide

## Overview

This document outlines the implementation of Amharic (አማርኛ) translation support for the SkyEthio Travels & Cargo website. The system provides a complete bilingual experience with English and Amharic languages.

## Architecture

### 1. Translation Files Structure

```
locales/
├── en.json          # English translations
├── am.json          # Amharic translations
└── index.ts         # Translation configuration and utilities
```

### 2. Core Components

- **LanguageContext**: React context for managing language state
- **useTranslation**: Custom hook for accessing translations
- **LanguageProvider**: Wraps the app to provide language context

### 3. Key Features

- ✅ Language switching between English and Amharic
- ✅ Persistent language preference (localStorage)
- ✅ Fallback to English for missing translations
- ✅ RTL support for Amharic
- 🔄 URL-based language routing (planned for future phase)

## Implementation Details

### Translation Files

#### English (en.json)
Contains all English text organized in nested objects:
```json
{
  "navigation": {
    "home": "Home",
    "about": "About"
  },
  "homepage": {
    "hero": {
      "title": "SkyEthio Travels & Cargo"
    }
  }
}
```

#### Amharic (am.json)
Contains corresponding Amharic translations:
```json
{
  "navigation": {
    "home": "ዋና ገጽ",
    "about": "ስለ እኛ"
  },
  "homepage": {
    "hero": {
      "title": "SkyEthio Travels & Cargo"
    }
  }
}
```

### Usage in Components

#### 1. Import the hook
```tsx
import { useTranslation } from "@/hooks/useTranslation"
```

#### 2. Use in component
```tsx
export default function MyComponent() {
  const { t, locale, switchLanguage } = useTranslation()
  
  return (
    <div>
      <h1>{t("homepage.hero.title")}</h1>
      <button onClick={() => switchLanguage('am')}>
        Switch to Amharic
      </button>
    </div>
  )
}
```

#### 3. Translation function
```tsx
// Simple translation
t("navigation.home") // Returns "Home" or "ዋና ገጽ"

// Nested keys
t("homepage.services.hotelBooking.title") // Returns "Hotel Booking" or "የሆቴል ማዘዣ"
```

### Language Switching

The language switcher in the navigation bar allows users to toggle between English and Amharic:

```tsx
const { switchLanguage } = useTranslation()

// Switch to Amharic
switchLanguage('am')

// Switch to English
switchLanguage('en')
```

## Current Translation Coverage

### ✅ Completed Pages
- **Navigation**: All menu items, descriptions, and submenu items
- **Homepage**: Hero section, services, destinations, airlines, CTA sections
- **Common Elements**: Buttons, labels, and shared text

### 🔄 In Progress
- **About Page**: Company information and values
- **Services Page**: Service descriptions and features
- **Book Ticket Page**: Form labels and instructions
- **Visa Application Page**: Form fields and requirements
- **Contact Page**: Contact information and form labels

### 📋 To Do
- **Ad Components**: Ad titles, descriptions, and CTAs
- **UI Components**: Form validation messages, error states
- **Dynamic Content**: User-generated content and notifications

## Adding New Translations

### 1. Add to English file (en.json)
```json
{
  "newSection": {
    "title": "New Section Title",
    "description": "New section description"
  }
}
```

### 2. Add to Amharic file (am.json)
```json
{
  "newSection": {
    "title": "አዲስ ክፍል ርዕስ",
    "description": "አዲስ ክፍል መግለጫ"
  }
}
```

### 3. Use in component
```tsx
const { t } = useTranslation()

return (
  <div>
    <h2>{t("newSection.title")}</h2>
    <p>{t("newSection.description")}</p>
  </div>
)
```

## Best Practices

### 1. Key Naming Convention
- Use descriptive, hierarchical keys
- Separate words with dots: `homepage.hero.title`
- Group related translations together

### 2. Translation Quality
- Ensure Amharic translations are culturally appropriate
- Maintain consistent terminology across the app
- Consider context when translating

### 3. Performance
- Translations are loaded once and cached
- Language switching is instant
- No additional API calls required

## Testing

### Language Test Component
A test component is available at `/components/LanguageTest.tsx` to verify:
- Language switching functionality
- Translation accuracy
- RTL layout support

### Manual Testing
1. Navigate to any page
2. Click the language switcher in the navigation
3. Verify all text changes to the selected language
4. Check that language preference persists on page refresh

## Future Enhancements

### 1. Advanced Features
- **Pluralization**: Handle different plural forms
- **Interpolation**: Dynamic content in translations
- **Context-aware**: Different translations based on context

### 2. SEO Optimization
- **Meta tags**: Language-specific meta descriptions
- **URL structure**: `/am/about` for Amharic pages (Phase 2)
- **Hreflang**: Proper language indication for search engines

### 3. Accessibility
- **Screen readers**: Language announcement
- **Keyboard navigation**: RTL keyboard support
- **Font optimization**: Better Amharic font rendering

## Troubleshooting

### Common Issues

1. **Translation not found**
   - Check if the key exists in both language files
   - Verify the key path is correct
   - Check for typos in the key name

2. **Language not switching**
   - Ensure LanguageProvider wraps the component
   - Check localStorage for saved preference
   - Verify the switchLanguage function is called

3. **RTL layout issues**
   - Check if `isRTL` is properly set
   - Verify CSS supports RTL direction
   - Test with Amharic text

### Debug Mode
Enable debug logging by adding to the translation hook:
```tsx
const { t, locale } = useTranslation()

// Debug: Log current language and key
console.log(`Language: ${locale}, Key: navigation.home, Value: ${t("navigation.home")}`)
```

## Support

For questions or issues with the translation system:
1. Check this documentation
2. Review the translation files for examples
3. Test with the LanguageTest component
4. Check browser console for errors

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Active Development
