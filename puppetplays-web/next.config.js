const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  poweredByHeader: false,
  eslint: {
    // Warning: Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'puppetplays.ddev.site',
        port: '7443',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
};
