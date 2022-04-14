import Head from 'next/head';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { groupBy } from 'lodash';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import { fetchAPI, getWorkMediasByIdQuery } from 'lib/api';
import Layout from 'components/Layout';
import useActiveAnchor from 'hooks/useActiveAnchor';
import ContentLayout from 'components/ContentLayout';
import WorkPageHeader from 'components/Work/WorkPageHeader';
import MediaSection from 'components/Work/MediaSection';
import MediaMenu from 'components/Work/MediaMenu';
import { PageTitle } from 'components/Primitives';
import styles from 'styles/Work.module.scss';
import { useState } from 'react';

function MediasPage({ initialData }) {
  const { t } = useTranslation();
  const [firstMediaSection] = useState(() => {
    const keys = Object.keys(initialData.medias);
    return keys.length > 0 ? keys[0] : null;
  });
  const [activeAnchor, handleScroll] = useActiveAnchor(
    '[data-media-section]',
    firstMediaSection,
  );

  return (
    <Layout>
      <Head>
        <title>{initialData.title} - Medias | Puppetplays</title>
      </Head>

      <div className={styles.workHeader}>
        <WorkPageHeader
          id={initialData.id}
          slug={initialData.slug}
          title={initialData.title}
          authors={initialData.authors}
          writingPlace={initialData.writingPlace}
          hasMedia
        />
      </div>
      <ContentLayout style={{ maxWidth: 600 }} onScroll={handleScroll}>
        <div className={styles.contentHeader}>
          <PageTitle>{t('common:medias')}</PageTitle>
        </div>
        <div className={styles.mediaMenu}>
          <MediaMenu
            sections={Object.keys(initialData.medias)}
            activeAnchor={activeAnchor}
          />
        </div>
        <div className={styles.mediasContent}>
          {Object.entries(initialData.medias).map(
            ([kind, medias], _, entries) => (
              <MediaSection
                key={kind}
                kind={kind}
                medias={medias}
                showTitle={entries.length > 1}
              />
            ),
          )}
        </div>
      </ContentLayout>
    </Layout>
  );
}

MediasPage.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default MediasPage;

export async function getServerSideProps({ locale, req, res, params }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const { entry } = await fetchAPI(getWorkMediasByIdQuery, {
    variables: { locale, id: params.id },
  });
  const mediasByKind = groupBy(entry.medias, (m) => m.kind);
  const entryWithGroupedMedias = { ...entry, medias: mediasByKind };

  return {
    props: { initialData: entryWithGroupedMedias },
  };
}
