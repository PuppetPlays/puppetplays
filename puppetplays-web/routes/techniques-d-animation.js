import PropTypes from 'prop-types';
import useSWR from 'swr';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
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
        <title>Puppetplays | Auteurs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ContentLayout style={{ maxWidth: 1072, padding: '32px 0' }}>
        <PageTitle smaller>{t('common:animationTechniques')}</PageTitle>
        <div className={styles.grid}>
          {data &&
            data.entries.map((entry) => (
              <div key={entry.id} className={styles.gridItem}>
                <Card
                  buttonLabel={t('common:readNote')}
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
