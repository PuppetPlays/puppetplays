import Head from 'next/head';
import ReactModal from 'react-modal';
import { CookiesProvider } from 'react-cookie';
import { ModalProvider } from 'components/modalContext';
import { SWRConfig } from 'swr';
import ErrorBoundary from 'components/ErrorBoundary';
import { handleApiError } from 'lib/apiErrorHandler';
import 'styles/globals.css';

ReactModal.setAppElement('#__next');

// Global SWR configuration
const swrConfig = {
  // Handle global SWR errors
  onError: (error, key) => {
    console.error(`SWR Error for ${key}:`, error);
  },
  // Global error handling for fetch requests
  fetcher: async (resource, init) => {
    try {
      const res = await fetch(resource, init);
      
      // Handle non-2xx responses
      if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        error.status = res.status;
        error.info = await res.json().catch(() => ({}));
        throw error;
      }
      
      return res.json();
    } catch (error) {
      // Transform to standardized error
      throw handleApiError(error);
    }
  },
  // Default retry behavior
  shouldRetryOnError: true,
  errorRetryCount: 3,
  // Keep previous data on error
  keepPreviousData: true,
};

// eslint-disable-next-line react/prop-types
function CustomApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <SWRConfig value={swrConfig}>
        <CookiesProvider>
          <ModalProvider>
            <Head>
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/apple-touch-icon.png?v=0.8"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="/favicon-32x32.png?v=0.8"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="/favicon-16x16.png?v=0.8"
              />
              <link rel="manifest" href="/site.webmanifest?v=0.8" />
              <link
                rel="mask-icon"
                href="/safari-pinned-tab.svg?v=0.8"
                color="#2037b1"
              />
              <link rel="shortcut icon" href="/favicon.ico?v=0.8" />
              <meta name="apple-mobile-web-app-title" content="Puppetplays" />
              <meta name="application-name" content="Puppetplays" />
              <meta name="msapplication-TileColor" content="#2037b1" />
              <meta name="theme-color" content="#2037b1" />
            </Head>
            <Component {...pageProps} />
          </ModalProvider>
        </CookiesProvider>
      </SWRConfig>
    </ErrorBoundary>
  );
}

export default CustomApp;
