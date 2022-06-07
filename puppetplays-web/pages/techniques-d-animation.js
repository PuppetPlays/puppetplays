import PropTypes from 'prop-types';
import useSWR from 'swr';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { fetchAPI, getAllAnimationsTechniquesQuery } from 'lib/api';
import Layout from 'components/Layout';
import { PageTitle } from 'components/Primitives';
import ContentLayout from 'components/ContentLayout';
import Card from 'components/Card';
import styles from 'styles/AnimationTechniques.module.scss';

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
        <title>{t('common:animationTechniques')} | Puppetplays</title>
        <meta
          name="description"
          content={t('common:meta.animationTechniques.description')}
        />
      </Head>

      <ContentLayout style={{ maxWidth: 1072, padding: '32px 20px' }}>
        <PageTitle smaller>{t('common:animationTechniques')}</PageTitle>
        <div className={styles.grid}>
          {data &&
            data.entries.map((entry) => (
              <div key={entry.id} className={styles.gridItem}>
                <Card
                  fixedHeight
                  href={`/techniques-d-animation/${entry.id}/${entry.slug}`}
                  {...entry}
                />
              </div>
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
  const data = await fetchAPI(getAllAnimationsTechniquesQuery, {
    variables: { locale },
  });

  return {
    props: {
      initialData: data,
    },
  };
}
