import Head from 'next/head';
import ReactModal from 'react-modal';
import { CookiesProvider } from 'react-cookie';
import { appWithTranslation } from 'next-i18next';
import { ModalProvider } from 'components/modalContext';
import { SWRConfig } from 'swr';
import { handleApiError } from 'lib/apiErrorHandler';
import 'lib/i18n'; // Import i18n initialization
import 'styles/globals.css';
import nextI18NextConfig from '../next-i18next.config.js';

ReactModal.setAppElement('#__next');

// Global SWR configuration
const swrConfig = {
  // Handle global SWR errors
  onError: handleApiError,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// eslint-disable-next-line react/prop-types
function CustomApp({ Component, pageProps }) {
  return (
    <SWRConfig value={swrConfig}>
      <CookiesProvider>
        <ModalProvider>
          <Head>
            <link
              key="apple-touch-icon"
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png?v=0.8"
            />
            <link
              key="favicon-32"
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png?v=0.8"
            />
            <link
              key="favicon-16"
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png?v=0.8"
            />
            <link
              key="manifest"
              rel="manifest"
              href="/site.webmanifest?v=0.8"
            />
            <link
              key="mask-icon"
              rel="mask-icon"
              href="/safari-pinned-tab.svg?v=0.8"
              color="#2037b1"
            />
            <link
              key="shortcut-icon"
              rel="shortcut icon"
              href="/favicon.ico?v=0.8"
            />
            <meta
              key="apple-mobile-web-app-title"
              name="apple-mobile-web-app-title"
              content="Puppetplays"
            />
            <meta
              key="application-name"
              name="application-name"
              content="Puppetplays"
            />
            <meta
              key="msapplication-TileColor"
              name="msapplication-TileColor"
              content="#2037b1"
            />
            <meta key="theme-color" name="theme-color" content="#2037b1" />
          </Head>
          <Component {...pageProps} />
        </ModalProvider>
      </CookiesProvider>
    </SWRConfig>
  );
}

export default appWithTranslation(CustomApp, nextI18NextConfig);
