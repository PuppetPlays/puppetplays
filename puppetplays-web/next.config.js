const nextTranslate = require('next-translate');
const withTranspile = require('next-transpile-modules')(['ol', 'react-slider']);

module.exports = nextTranslate(
  withTranspile({
    poweredByHeader: false,
    swcMinify: true,
    eslint: {
      // Warning: Dangerously allow production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }),
);
