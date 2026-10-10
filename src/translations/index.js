import { en } from './en';
import { te } from './te';
import { hi } from './hi';

export const translations = { en, te, hi };

export function getTranslation(key, lang = 'en') {
  const dictionary = translations[lang] || translations.en;
  return dictionary[key] || translations.en[key] || key;
}
