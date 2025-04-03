module.exports = {
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  pages: {
    '*': ['common'],
    '/': ['home'],
    '/wip': ['home'],
  },
  loadLocaleFrom: (lang, ns) =>
    import(`./locales/${lang}/${ns}.json`).then(m => m.default),
};
