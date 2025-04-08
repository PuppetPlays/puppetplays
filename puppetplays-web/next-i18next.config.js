/** @type {import('next-i18next').UserConfig} */
const path = require('path');

const config = {
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
  },
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  defaultNS: 'common',
  ns: ['common', 'home'],
  serializeConfig: true,
  use: [],
  react: {
    useSuspense: true,
  },
  interpolation: {
    escapeValue: false,
  },
  load: 'all',
};

module.exports = config; 