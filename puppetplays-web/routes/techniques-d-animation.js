import PropTypes from 'prop-types';
import useSWR from 'swr';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import { fetchAPI, getAllAnimationsTechniquesQuery } from 'lib/api';
import Layout from 'components/Layout';
import styles from 'styles/AnimationTechniques.module.scss';
import { hasAtLeastOneItem } from 'lib/utils';
import { PageTitle } from 'components/Primitives';
import ContentLayout from 'components/ContentLayout';
import Link from 'next/link';

function AnimationTechniques({ initialData }) {
  const { t } = useTranslation();
  const router = useRouter();

  const { data } = useSWR(
    [getAllAnimationsTechniquesQuery, router.locale],
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
        <title>Puppetplays | Auteurs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ContentLayout style={{ maxWidth: 1072, padding: '32px 0' }}>
        <PageTitle smaller>{t('common:animationTechniques')}</PageTitle>
        <div className={styles.grid}>
          {data &&
            data.entries.map((entry) => (
              <Link
                href={`/techniques-d-animation/${entry.id}/${entry.slug}`}
                key={entry.id}
              >
                <a className={styles.gridItem}>
                  {hasAtLeastOneItem(entry.mainImage) && (
                    <div className={styles.itemImage}>
                      <img src={entry.mainImage[0].url} alt="" />
                    </div>
                  )}
                  <div className={styles.itemTitle}>{entry.title}</div>
                </a>
              </Link>
            ))}
        </div>
      </ContentLayout>
    </Layout>
  );
}

AnimationTechniques.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default AnimationTechniques;

export async function getServerSideProps({ locale, req, res }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const data = await fetchAPI(getAllAnimationsTechniquesQuery, {
    variables: { locale },
  });

  return {
    props: {
      initialData: data,
    },
  };
}
