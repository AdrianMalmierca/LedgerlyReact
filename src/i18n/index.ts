import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';

//Detect the device's language setting
const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager?.settings?.AppleLocale ||
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
      'es'
    : NativeModules.I18nManager?.localeIdentifier || 'es';

// we only take the first two characters: "es_ES" → "es"
const languageCode = deviceLanguage.substring(0, 2);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
  },
  lng: ['en', 'es', 'fr'].includes(languageCode) ? languageCode : 'es',
  fallbackLng: 'es', //in case the device language is not supported, fallback to Spanish
  interpolation: { //to insert variables into the translation strings
    escapeValue: false, //react scapes html characters by default, so we don't need to escape them again
  },
});

export default i18n;