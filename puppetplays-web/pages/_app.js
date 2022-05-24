import Head from 'next/head';
import ReactModal from 'react-modal';
import { CookiesProvider } from 'react-cookie';
import { ModalProvider } from 'components/modalContext';
import 'styles/globals.css';

ReactModal.setAppElement('#__next');

// eslint-disable-next-line react/prop-types
function CustomApp({ Component, pageProps }) {
  return (
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
  );
}

export default CustomApp;
