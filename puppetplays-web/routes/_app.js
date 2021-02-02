import Layout from 'components/Layout';
import 'styles/globals.css';

function CustomApp({ Component, pageProps }) {
  return (
    <Layout translations={pageProps && pageProps._ns && pageProps._ns.common}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default CustomApp;
