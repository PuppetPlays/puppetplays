const { locales, defaultLocale } = require('./i18n.json');
const withTranspile = require('next-transpile-modules')(['ol']);

module.exports = withTranspile({
  poweredByHeader: false,
  i18n: {
    locales,
    defaultLocale,
  },
});
