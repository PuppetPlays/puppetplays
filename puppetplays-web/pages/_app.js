import 'styles/globals.css';
import ReactModal from 'react-modal';
import { CookiesProvider } from 'react-cookie';
import { ModalProvider } from 'components/modalContext';

ReactModal.setAppElement('#__next');

// eslint-disable-next-line react/prop-types
function CustomApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </CookiesProvider>
  );
}

export default CustomApp;
