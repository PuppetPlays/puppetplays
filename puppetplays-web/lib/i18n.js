import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend/cjs';
import nextI18NextConfig from '../next-i18next.config';

// Only initialize on client side
if (typeof window !== 'undefined') {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...nextI18NextConfig,
      debug: process.env.NODE_ENV === 'development',
      lng: nextI18NextConfig.i18n.defaultLocale,
      fallbackLng: nextI18NextConfig.i18n.defaultLocale,
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      detection: {
        order: ['path', 'cookie', 'navigator'],
        caches: ['cookie'],
      },
    });
}

export default i18n; 