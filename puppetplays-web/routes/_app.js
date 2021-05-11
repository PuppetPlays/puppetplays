import 'styles/globals.css';
import ReactModal from 'react-modal';
import { ModalProvider } from 'components/modalContext';

ReactModal.setAppElement('#__next');

// eslint-disable-next-line react/prop-types
function CustomApp({ Component, pageProps }) {
  return (
    <ModalProvider>
      <Component {...pageProps} />
    </ModalProvider>
  );
}

export default CustomApp;
