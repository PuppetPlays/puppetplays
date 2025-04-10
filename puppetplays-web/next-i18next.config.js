/** @type {import('next-i18next').UserConfig} */
const path = require('path');
const HttpBackend = require('i18next-http-backend/cjs');

const config = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
  },
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath: path.resolve('./public/locales'),
  defaultNS: 'common',
  ns: ['common', 'home'],
  serializeConfig: false,
  use: typeof window !== 'undefined' ? [HttpBackend] : [],
  react: {
    useSuspense: true,
  },
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: './public/locales/{{lng}}/{{ns}}.json',
  },
  load: 'all',
};

module.exports = config; 