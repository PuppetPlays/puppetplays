import 'styles/globals.css';

// eslint-disable-next-line react/prop-types
function CustomApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default CustomApp;
