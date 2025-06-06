import ContentLayout from 'components/ContentLayout';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import { PageTitle } from 'components/Primitives';
import { fetchAPI, getAllDiscoveryPaths } from 'lib/api';
import { hasAtLeastOneItem } from 'lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import styles from 'styles/DiscoveryPaths.module.scss';
import useSWR from 'swr';

function ParcoursDecouverte({ initialData }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data } = useSWR(
    [getAllDiscoveryPaths, router.locale],
    (query, locale) => {
      return fetchAPI(query, {
        variables: {
          locale,
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

      <ContentLayout style={{ maxWidth: 930, padding: '32px 20px' }}>
        <div className={styles.pageTitle}>
          {t('common:discoveryPaths')}{' '}
          {data?.entries && <span>({data.entries.length})</span>}
        </div>
        <div className={styles.list}>
          {data?.entries &&
          Array.isArray(data.entries) &&
          data.entries.length > 0 ? (
            data.entries.map(entry => (
              <article key={entry.id} className={styles.listItem}>
                {hasAtLeastOneItem(entry.thumbnail) && (
                  <div key={entry.id} className={styles.listItemImage}>
                    <img
                      src={entry.thumbnail[0].url}
                      alt={entry.thumbnail[0].caption}
                    />
                  </div>
                )}
                <div className={styles.listItemContent}>
                  <h1>
                    <Link
                      href={`/parcours-decouverte/${entry.id}/${entry.slug}`}
                    >
                      {entry.title}
                    </Link>
                  </h1>
                  <div dangerouslySetInnerHTML={{ __html: entry.abstract }} />
                </div>
              </article>
            ))
          ) : (
            <NoResults
              icon="info"
              title={t('common:error.dataNotFound')}
              message={t('common:error.noResultsFound')}
            />
          )}
        </div>
      </ContentLayout>
    </Layout>
  );
}

ParcoursDecouverte.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default ParcoursDecouverte;

export async function getServerSideProps({ locale }) {
  try {
    const data = await fetchAPI(getAllDiscoveryPaths, {
      variables: { locale },
    });

    return {
      props: {
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
        initialData: data,
      },
    };
  } catch (error) {
    console.error('Error fetching discovery paths:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
        initialData: {},
      },
    };
  }
}
