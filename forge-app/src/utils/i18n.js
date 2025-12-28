// Scalable internationalization utility
import enLocale from '../locales/en.json';
import frLocale from '../locales/fr.json';
import esLocale from '../locales/es.json';
import deLocale from '../locales/de.json';

const locales = {
  en: enLocale,
  fr: frLocale,
  es: esLocale,
  de: deLocale
};

// Get UI text with fallback
export const getUIText = (language, key) => {
  const locale = locales[language] || locales.en;
  return locale.ui[key] || locales.en.ui[key] || key;
};

// Add new language support dynamically
export const addLanguageSupport = (langCode, translations) => {
  locales[langCode] = translations;
};

export default { getUIText, addLanguageSupport };