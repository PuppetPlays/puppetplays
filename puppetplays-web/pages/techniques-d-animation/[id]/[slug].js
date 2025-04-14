import AnimationTechniqueNote from 'components/AnimationTechnique/AnimationTechniqueNote';
import ContentLayout from 'components/ContentLayout';
import Layout from 'components/Layout';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import {
  getAnimationTechniqueByIdQuery,
  getFetchAPIClient,
  getWorksOfAnimationTechniqueQuery,
} from 'lib/api';
import get from 'lodash/get';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';

const AnimationTechniquesPage = ({
  animationTechniquesData,
  animationTechniquesWorksData,
}) => {
  const { t } = useTranslation();

  // Vérifier si les données nécessaires sont disponibles
  const hasData = animationTechniquesData?.entry?.title;

  // Vérifier si nous avons des données suffisantes pour afficher le contenu
  const hasNoData =
    !hasData ||
    !animationTechniquesWorksData?.entries ||
    animationTechniquesWorksData.entries.length === 0;

  if (hasNoData) {
    return (
      <Layout>
        <Head>
          <title>{`${t('common:animationTechniques')} | Puppetplays`}</title>
        </Head>
        <ContentLayout style={{ maxWidth: 1072, padding: '32px 20px' }}>
          <PageTitle smaller>{t('common:animationTechniques')}</PageTitle>
          <div
            style={{
              maxWidth: '800px',
              margin: '60px auto',
              textAlign: 'center',
              backgroundColor: 'var(--color-bg-depth-1)',
              padding: '40px 30px',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              style={{ margin: '0 auto 24px' }}
            >
              <path
                d="M12 6V12L16 14"
                stroke="var(--color-brand)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="var(--color-brand)"
                strokeWidth="2"
              />
            </svg>

            <h2
              style={{
                fontSize: '24px',
                fontWeight: '500',
                marginBottom: '16px',
                color: 'var(--color-text-default)',
              }}
            >
              {t('common:contentNotAvailable')}
            </h2>

            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'var(--color-text-subtle)',
                maxWidth: '640px',
                margin: '0 auto 24px',
              }}
            >
              {t('common:animationTechniquesNotAvailable')}
            </p>

            <div
              style={{
                width: '120px',
                height: '4px',
                background: 'var(--color-brand-light)',
                margin: '0 auto',
                opacity: 0.3,
                borderRadius: '2px',
              }}
            />
          </div>
        </ContentLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>
          {hasData
            ? `${animationTechniquesData.entry.title} | Puppetplays`
            : `${t('common:animationTechniques')} | Puppetplays`}
        </title>
      </Head>
      <ContentLayout
        style={{ maxWidth: 678, padding: '62px 20px', textAlign: 'center' }}
      >
        <PageSubtitle>{t('common:animationTechniques')}</PageSubtitle>
        {hasData && (
          <PageTitle>{animationTechniquesData.entry.title}</PageTitle>
        )}
        {hasData && animationTechniquesWorksData?.entries && (
          <AnimationTechniqueNote
            {...animationTechniquesData.entry}
            works={animationTechniquesWorksData.entries}
            bleedCarousel
          />
        )}
      </ContentLayout>
    </Layout>
  );
};

AnimationTechniquesPage.propTypes = {
  animationTechniquesData: PropTypes.object.isRequired,
  animationTechniquesWorksData: PropTypes.object.isRequired,
};

export default AnimationTechniquesPage;

export async function getServerSideProps({ locale, params, query }) {
  try {
    const token = query && query.token;
    const apiClient = getFetchAPIClient({
      variables: { locale, id: params.id },
      token,
    });

    const [animationTechniquesData, animationTechniquesWorksData] =
      await Promise.all([
        apiClient(getAnimationTechniqueByIdQuery),
        apiClient(getWorksOfAnimationTechniqueQuery),
      ]);

    // Assurer que les objets retournés sont sérialisables
    const safeAnimationTechniquesData = JSON.parse(
      JSON.stringify(animationTechniquesData || { entry: {} }),
    );
    const safeAnimationTechniquesWorksData = JSON.parse(
      JSON.stringify(animationTechniquesWorksData || { entries: [] }),
    );

    return {
      props: {
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
        animationTechniquesData: safeAnimationTechniquesData,
        animationTechniquesWorksData: safeAnimationTechniquesWorksData,
      },
    };
  } catch (error) {
    console.error('Error fetching animation technique:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale || 'fr', ['common'])),
        animationTechniquesData: { entry: {} },
        animationTechniquesWorksData: { entries: [] },
      },
    };
  }
}
