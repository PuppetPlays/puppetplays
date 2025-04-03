import PropTypes from 'prop-types';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { fetchAPI, getAllAnimationsTechniquesQuery } from 'lib/api';
import Layout from 'components/Layout';
import { PageTitle } from 'components/Primitives';
import ContentLayout from 'components/ContentLayout';

function AnimationTechniques({ initialData }) {
  const { t } = useTranslation();

  // Vérifie si les données sont vides
  const hasNoData = !initialData?.entries || initialData.entries.length === 0;

  return (
    <Layout>
      <Head>
        <title>{`${t('common:animationTechniques')} | Puppetplays`}</title>
        <meta
          name="description"
          content={t('common:meta.animationTechniques.description')}
        />
      </Head>

      <ContentLayout style={{ maxWidth: 1072, padding: '32px 20px' }}>
        <PageTitle smaller>{t('common:animationTechniques')}</PageTitle>

        {hasNoData ? (
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
            ></div>
          </div>
        ) : (
          // Ici, vous pouvez ajouter le rendu pour quand il y a des données
          <div>
            {initialData?.entries &&
              Array.isArray(initialData.entries) &&
              initialData.entries.map(technique => (
                <div key={technique.id}>
                  <h2>{technique.title}</h2>
                  {/* Autres informations sur la technique d'animation */}
                </div>
              ))}
          </div>
        )}
      </ContentLayout>
    </Layout>
  );
}

AnimationTechniques.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default AnimationTechniques;

export async function getServerSideProps({ locale, req, res }) {
  try {
    const data = await fetchAPI(getAllAnimationsTechniquesQuery, {
      variables: { locale },
    });

    // Assurer que l'objet retourné est sérialisable
    const safeData = JSON.parse(JSON.stringify(data || { entries: [] }));

    return {
      props: {
        initialData: safeData,
      },
    };
  } catch (error) {
    console.error('Error fetching animation techniques:', error);
    return {
      props: {
        initialData: { entries: [] },
      },
    };
  }
}
