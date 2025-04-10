import { useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { groupBy } from 'lodash';
import { fetchAPI, getWorkMediasByIdQuery } from 'lib/api';
import Layout from 'components/Layout';
import useActiveAnchor from 'hooks/useActiveAnchor';
import ContentLayout from 'components/ContentLayout';
import WorkDocument from 'components/Work/WorkDocument';
import WorkPageHeader from 'components/Work/WorkPageHeader';
import MediaSection from 'components/Work/MediaSection';
import MediaMenu from 'components/Work/MediaMenu';
import { PageTitle } from 'components/Primitives';
import styles from 'styles/Work.module.scss';

function MediasPage({ initialData }) {
  const { t } = useTranslation();
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);

  // Vérifie si les données initiales sont complètes
  const hasAllRequiredData =
    initialData && initialData.id && initialData.title && initialData.medias;

  const [firstMediaSection] = useState(() => {
    const keys = Object.keys(initialData?.medias || {});
    return keys.length > 0 ? keys[0] : null;
  });

  const [activeAnchor, handleScroll] = useActiveAnchor(
    '[data-media-section]',
    firstMediaSection,
  );

  if (!hasAllRequiredData) {
    return (
      <Layout>
        <Head>
          <title>{t('common:medias')} | Puppetplays</title>
        </Head>
        <ContentLayout style={{ maxWidth: 800, padding: '60px 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '500',
                marginBottom: '20px',
                color: 'var(--color-text-default)',
              }}
            >
              {t('common:error.dataNotFound')}
            </h1>
            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'var(--color-text-subtle)',
                maxWidth: '600px',
                margin: '0 auto 30px',
              }}
            >
              {t('common:error.notFound')}
            </p>
          </div>
        </ContentLayout>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <Head>
          <title>
            {initialData?.title || t('common:medias')} - Medias | Puppetplays
          </title>
        </Head>

        <div className={styles.workHeader}>
          <WorkPageHeader
            id={initialData?.id}
            slug={initialData?.slug}
            title={initialData?.title}
            authors={initialData?.authors || []}
            writingPlace={initialData?.writingPlace || ''}
            hasMedia
            hasDocument={(initialData?.scannedDocumentPagesCount || 0) > 0}
            onOpenDocument={() => setIsDocumentOpen(true)}
          />
        </div>
        <ContentLayout style={{ maxWidth: 600 }} onScroll={handleScroll}>
          <div className={styles.contentHeader}>
            <PageTitle>{t('common:medias')}</PageTitle>
          </div>
          <div className={styles.mediaMenu}>
            <MediaMenu
              sections={Object.keys(initialData?.medias || {})}
              activeAnchor={activeAnchor}
            />
          </div>
          <div className={styles.mediasContent}>
            {Object.entries(initialData?.medias || {}).map(
              ([kind, medias], _, entries) => (
                <MediaSection
                  key={kind}
                  kind={kind}
                  medias={medias || []}
                  showTitle={entries.length > 1}
                />
              ),
            )}
          </div>
        </ContentLayout>
      </Layout>
      {isDocumentOpen && (
        <WorkDocument
          workId={initialData.id}
          onClose={() => setIsDocumentOpen(false)}
        />
      )}
    </>
  );
}

MediasPage.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default MediasPage;

export async function getServerSideProps({ locale, req, res, params }) {
  try {
    const result = await fetchAPI(getWorkMediasByIdQuery, {
      variables: { locale, id: params?.id },
    });

    // Vérifier si les données sont valides
    if (!result || !result.entry) {
      return {
        props: {
          initialData: {
            id: params?.id,
            slug: params?.slug,
            medias: {},
          },
        },
      };
    }

    const { entry } = result;
    const mediasByKind = groupBy(entry?.medias || [], m => m?.kind);
    const entryWithGroupedMedias = { ...entry, medias: mediasByKind };

    return {
      props: { initialData: entryWithGroupedMedias },
    };
  } catch (error) {
    console.error('Error fetching work medias:', error);
    return {
      props: {
        initialData: {
          id: params?.id,
          slug: params?.slug,
          medias: {},
        },
      },
    };
  }
}
