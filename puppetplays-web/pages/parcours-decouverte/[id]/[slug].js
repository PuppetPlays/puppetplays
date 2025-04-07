import PropTypes from 'prop-types';
import useSWR from 'swr';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { hasAtLeastOneItem } from 'lib/utils';
import { fetchAPI, getDiscoveryPathById } from 'lib/api';
import Layout from 'components/Layout';
import { PageTitle } from 'components/Primitives';
import ContentLayout from 'components/ContentLayout';
import styles from 'styles/DiscoveryPaths.module.scss';

function ParcourDecouverte({ initialData }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data } = useSWR(
    [getDiscoveryPathById, router.locale, initialData.id],
    (query, locale, id) => {
      return fetchAPI(query, {
        variables: {
          locale,
          id,
        },
      });
    },
    {
      initialData,
      revalidateOnFocus: false,
    },
  );

  return (
    <Layout>
      <Head>
        <title>{t('common:discoveryPaths')} | Puppetplays</title>
        <meta
          name="description"
          content={t('common:meta.discoveryPaths.description')}
        />
      </Head>

      <ContentLayout style={{ maxWidth: 720, padding: '60px 20px 32px' }}>
        {data && (
          <div className={styles.page}>
            <div className={styles.pageSubtitle}>
              {t('common:discoveryPaths')}
            </div>
            <h1>{data.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: data.richContent }} />
          </div>
        )}
      </ContentLayout>
    </Layout>
  );
}

ParcourDecouverte.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default ParcourDecouverte;

export async function getServerSideProps({ locale, params, query }) {
  const token = query && query.token;
  const data = await fetchAPI(getDiscoveryPathById, {
    variables: { locale, id: params.id },
    token,
  });

  return {
    props: {
      initialData: data.entry,
    },
  };
}
