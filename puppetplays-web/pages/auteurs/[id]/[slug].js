import Head from 'next/head';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useTranslation } from 'next-i18next';
import {
  getAuthorByIdQuery,
  getFetchAPIClient,
  getWorksOfAuthorQuery,
} from 'lib/api';
import Layout from 'components/Layout';
import Author from 'components/Author';
import { PageSubtitle, PageTitle } from 'components/Primitives';
import ContentLayout from 'components/ContentLayout';
import AuthorNote from 'components/Author/AuthorNote';

const AuthorPage = ({ authorData, authorWorksData }) => {
  const { t } = useTranslation();

  // Vérifier si les données nécessaires sont disponibles
  const hasData = authorData?.entry?.title;

  // Vérifie si les données sont insuffisantes pour afficher le contenu
  const hasNoData =
    !hasData ||
    !authorWorksData?.entries ||
    authorWorksData.entries.length === 0;

  if (hasNoData) {
    return (
      <Layout>
        <Head>
          <title>{`${t('common:authors')} | Puppetplays`}</title>
        </Head>
        <ContentLayout style={{ maxWidth: 1072, padding: '32px 20px' }}>
          <PageTitle smaller>{t('common:authors')}</PageTitle>
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
              {t('common:authorsSectionComingSoon')}
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
        </ContentLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>
          {authorData?.entry?.title || t('common:authors')} | Puppetplays
        </title>
      </Head>
      <ContentLayout
        style={{ maxWidth: 678, padding: '62px 20px', textAlign: 'center' }}
      >
        <PageSubtitle>{t('common:author')}</PageSubtitle>
        {authorData?.entry && (
          <PageTitle>
            <Author {...get(authorData, 'entry', {})} />
          </PageTitle>
        )}

        {authorData?.entry && authorWorksData?.entries && (
          <AuthorNote
            {...authorData.entry}
            works={authorWorksData.entries}
            bleedCarousel
          />
        )}
      </ContentLayout>
    </Layout>
  );
};

AuthorPage.propTypes = {
  authorData: PropTypes.object.isRequired,
  authorWorksData: PropTypes.object.isRequired,
};

export default AuthorPage;

export async function getServerSideProps({ locale, req, res, params, query }) {
  try {
    const token = query && query.token;
    const apiClient = getFetchAPIClient({
      variables: { locale, id: params?.id },
      token,
    });

    const [authorData, authorWorksData] = await Promise.all([
      apiClient(getAuthorByIdQuery),
      apiClient(getWorksOfAuthorQuery),
    ]);

    // Ajouter null safety
    const entries = (authorWorksData?.entries || [])
      .filter(({ authors }) =>
        authors?.map(({ id }) => id).includes(params?.id),
      )
      .map(({ authors, ...entry }) => entry);

    return {
      props: {
        authorData: authorData || { entry: {} },
        authorWorksData: { entries: entries || [] },
      },
    };
  } catch (error) {
    console.error('Error fetching author:', error);
    return {
      props: {
        authorData: { entry: {} },
        authorWorksData: { entries: [] },
      },
    };
  }
}
