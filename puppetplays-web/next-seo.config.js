const SEO = {
  titleTemplate: '%s | Puppetplays',
  defaultTitle:
    'Puppetplays - Base de données sur les pièces pour marionnettes',
  description:
    'Base de données internationale de pièces pour marionnettes et exploration du théâtre de marionnettes.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR, en_US',
    url: 'https://puppetplays.eu/',
    siteName: 'Puppetplays',
    images: [
      {
        url: '/logo-stamp.png',
        width: 1200,
        height: 630,
        alt: 'Puppetplays',
      },
    ],
  },
  twitter: {
    handle: '@puppetplays',
    site: '@puppetplays',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
  ],
};

export default SEO;
