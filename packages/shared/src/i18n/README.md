# inField i18n — Translation Files

## Structure

- `he.json` — Hebrew (primary language, RTL)
- `en.json` — English (secondary)

Both files share the **exact same key structure**. Keys are English dot-notation, values are natural language.

## How apps use these files

Each app installs its own i18n library and imports the JSON files:

### Mobile (apps/mobile)

```typescript
// Libraries: i18next + react-i18next + expo-localization
import he from '@infield/shared/src/i18n/he.json';
import en from '@infield/shared/src/i18n/en.json';

i18n.init({
  resources: { he: { translation: he }, en: { translation: en } },
  lng: getLocales()[0]?.languageCode ?? 'he',
  fallbackLng: 'he',
});
```

### Web (apps/web)

```typescript
// Libraries: i18next + react-i18next
import he from '@infield/shared/src/i18n/he.json';
import en from '@infield/shared/src/i18n/en.json';

i18n.init({
  resources: { he: { translation: he }, en: { translation: en } },
  lng: 'he',
  fallbackLng: 'he',
});
```

## Rules

- ALL UI text must come from these files — never hardcode strings in components
- Keys: English, dot-notation (`defects.severity.critical`)
- Values: natural language for each locale
- Default language: Hebrew (`he`)
