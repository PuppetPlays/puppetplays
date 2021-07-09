const { locales, defaultLocale } = require('./i18n.json');
const withTranspile = require('next-transpile-modules')(['ol']);

module.exports = withTranspile({
  poweredByHeader: false,
  i18n: {
    locales,
    defaultLocale,
  },
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});
