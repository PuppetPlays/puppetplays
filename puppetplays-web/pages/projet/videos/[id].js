import Button from 'components/Button';
import NoResults from 'components/NoResults';
import ProjectLayout from 'components/Project/ProjectLayout';
import {
  fetchVideoData,
  fetchCollection,
  fetchCollectionVideos,
  getMetaValue,
  getMetaValues,
} from 'lib/nakala';
import { stringifyQuery } from 'lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import styles from 'styles/VideoPage.module.scss';

const VideoDetailPage = ({ videoData, relatedVideos, error }) => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'project']);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Error handling
  if (error || !videoData) {
    // Use error object if available, otherwise use default keys
    const errorTitleKey =
      error?.titleKey || 'project:videoDetail.notFoundTitle';
    const errorMessageKey =
      error?.messageKey || 'project:videoDetail.notFoundMessage';

    return (
      <ProjectLayout
        title={t(errorTitleKey)}
        metaDescription={t('project:videoDetail.notFoundMetaDescription')}
        hideNav={true}
      >
        <div className={styles.container}>
          <NoResults
            icon="error"
            title={t(errorTitleKey)}
            message={t(errorMessageKey)}
          />
          <div className={styles.backButtonContainer}>
            <Button
              onClick={() => router.push('/projet/videos')}
              inverse={true}
            >
              {t('project:videoDetail.backToGallery')}
            </Button>
          </div>
        </div>
      </ProjectLayout>
    );
  }

  // Use fetched data
  const {
    rawIdentifier,
    title,
    description,
    date,
    duration,
    tags,
    author,
    collectionId,
    collectionTitle,
    videoFiles,
  } = videoData;

  return (
    <ProjectLayout
      title={title}
      metaDescription={
        description?.substring(0, 160) ||
        t('project:videoDetail.defaultMetaDescription')
      }
      hideNav={true}
    >
      <Head>
        <title>{t('project:videoDetail.pageTitle', { title: title })}</title>
        <meta
          name="description"
          content={
            description?.substring(0, 160) ||
            t('project:videoDetail.defaultMetaDescription')
          }
        />
      </Head>

      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link href="/projet/videos">
            <span className={styles.breadcrumbItemText}>
              {t('project:mainNav.videos')}
            </span>
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          {collectionId && collectionTitle && (
            <>
              <Link
                href={`/projet/videos?${stringifyQuery({ collection: collectionId })}`}
              >
                <span className={styles.breadcrumbItemText}>
                  {collectionTitle}
                </span>
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
            </>
          )}
          <span className={styles.breadcrumbCurrent}>
            <span className={styles.breadcrumbItemText}>{title}</span>
          </span>
        </div>

        <h1 className={styles.videoDetailTitle}>{title}</h1>

        <div className={styles.videoDetailMetadata}>
          {date && (
            <div className={styles.videoMetaItem}>
              <span className={styles.videoMetaLabel}>
                {t('common:dateLabel')}
              </span>
              {new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </div>
          )}
          {duration && duration !== '-' && (
            <div className={styles.videoMetaItem}>
              <span className={styles.videoMetaLabel}>
                {t('common:durationLabel')}
              </span>
              {duration}
            </div>
          )}
          {author && (
            <div className={styles.videoMetaItem}>
              <span className={styles.videoMetaLabel}>
                {t('common:authorLabel')}
              </span>
              {author}
            </div>
          )}
        </div>

        <div className={styles.videoPlayerContainer}>
          {videoFiles && videoFiles.length > 0 ? (
            <>
              {console.log('Rendering video player with files:', videoFiles)}
              {videoFiles.map((file, index) => {
                const embedUrl = `https://api.nakala.fr/embed/${rawIdentifier}/${file.sha1}`;
                console.log(`Using embed URL for file ${index}:`, embedUrl);

                // N'afficher que la première vidéo trouvée
                if (index === 0) {
                  return (
                    <div className={styles.iframeContainer} key={file.sha1}>
                      <iframe
                        src={embedUrl}
                        title={title}
                        allowFullScreen
                        className={styles.videoIframe}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </>
          ) : (
            <div className={styles.videoPlayerPlaceholder}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{t('project:videoDetail.noVideoAvailable')}</p>
            </div>
          )}
        </div>

        <div className={styles.videoDetailContent}>
          {description && (
            <>
              <h2 className={styles.videoDetailSectionTitle}>
                {t('common:description')}
              </h2>
              <div className={styles.descriptionContainer}>
                <p
                  className={`${styles.videoDetailDescription} ${!isDescriptionExpanded ? styles.collapsedText : ''}`}
                >
                  {description}
                </p>
                <button
                  className={styles.toggleButton}
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  aria-expanded={isDescriptionExpanded}
                >
                  {isDescriptionExpanded
                    ? t('common:seeLess')
                    : t('common:seeMore')}
                </button>
              </div>
            </>
          )}

          {tags && tags.length > 0 && (
            <div className={styles.videoDetailTags}>
              {tags.map(tag => (
                <span key={tag} className={styles.videoTag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {relatedVideos && relatedVideos.length > 0 && (
          <div className={styles.relatedVideosSection}>
            <h2 className={styles.videoDetailSectionTitle}>
              {t('project:videoDetail.relatedVideos')}
            </h2>
            <div className={styles.relatedVideosGrid}>
              {relatedVideos.map(relatedVideo => (
                <Link
                  key={relatedVideo.id}
                  href={`/projet/videos/${encodeURIComponent(relatedVideo.id)}`}
                  className={styles.relatedVideoCard}
                >
                  <div className={styles.relatedVideoThumbnail}>
                    <div className={styles.videoImagePlaceholder}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className={styles.relatedVideoInfo}>
                    <h3 className={styles.relatedVideoTitle}>
                      {relatedVideo.title}
                    </h3>
                    {relatedVideo.date && (
                      <p className={styles.relatedVideoDate}>
                        {new Date(relatedVideo.date).toLocaleDateString(
                          'fr-FR',
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          },
                        )}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </ProjectLayout>
  );
};

export async function getServerSideProps({ params, query, locale }) {
  const { id } = params;
  const collectionId = query.collection || null;
  const currentLang = locale || 'fr'; // Default to French if locale not available

  console.log(`Decoded video ID: ${id}`); // Log the decoded ID

  try {
    // Fetch main video data using the decoded ID
    const rawVideoData = await fetchVideoData(id);
    console.log(
      `Raw video data for ${id}:`,
      JSON.stringify(rawVideoData, null, 2),
    );

    if (!rawVideoData) {
      // Return specific error keys for translation in component
      return {
        props: {
          ...(await serverSideTranslations(locale, ['common', 'project'])),
          videoData: null,
          relatedVideos: [],
          error: {
            titleKey: 'project:videoDetail.notFoundTitle',
            messageKey: 'project:videoDetail.errorNotFoundNakala',
          },
        },
      };
    }

    // Extract collection ID from relations if available, otherwise parse from identifier
    let collectionId = null;
    console.log(
      'Raw video data relations:',
      JSON.stringify(rawVideoData.relations || [], null, 2),
    );
    console.log(
      'Raw video collections IDs:',
      JSON.stringify(rawVideoData.collectionsIds || [], null, 2),
    );

    // 1. First try to get from collectionsIds directly if available
    if (
      Array.isArray(rawVideoData.collectionsIds) &&
      rawVideoData.collectionsIds.length > 0
    ) {
      collectionId = rawVideoData.collectionsIds[0];
      console.log('Collection ID found from collectionsIds:', collectionId);
    }
    // 2. Then try relations
    else {
      const collectionRelation = rawVideoData.relations?.find(
        rel => rel.typeUri === 'http://nakala.fr/terms#isPartOf',
      );
      if (
        collectionRelation &&
        collectionRelation.value &&
        collectionRelation.value.identifier
      ) {
        collectionId = collectionRelation.value.identifier;
        console.log('Collection ID found from relations:', collectionId);
      }
      // 3. Fallback to parsing the ID (less reliable)
      else if (id.includes('nkl.')) {
        const parts = id.split('/');
        if (parts.length > 1 && parts[0].startsWith('10.')) {
          // Make sure we have the full collection ID pattern
          if (parts[0].match(/10\.\d+\/nkl\.[a-z0-9]+/)) {
            collectionId = parts[0];
          }
        }
        console.log('Collection ID extracted from video ID:', collectionId);
      }
    }

    console.log('Final detected collection ID:', collectionId);

    let collectionTitle = null;
    if (collectionId) {
      try {
        const collectionInfo = await fetchCollection(collectionId);
        collectionTitle = getMetaValue(
          collectionInfo.metas,
          'http://nakala.fr/terms#title',
          currentLang,
        );
      } catch (collError) {
        console.warn(
          `Could not fetch collection info for ${collectionId}:`,
          collError,
        );
      }
    }

    // Process main video data
    const videoData = {
      id: rawVideoData.identifier,
      rawIdentifier: rawVideoData.identifier, // Identifiant complet pour l'URL
      title:
        getMetaValue(
          rawVideoData.metas,
          'http://nakala.fr/terms#title',
          currentLang,
        ) || 'Titre Inconnu',
      description:
        getMetaValue(
          rawVideoData.metas,
          'http://purl.org/dc/terms/description',
          currentLang,
        ) || null,
      date:
        getMetaValue(rawVideoData.metas, 'http://nakala.fr/terms#created') ||
        rawVideoData.creDate ||
        null,
      duration: '-', // Placeholder - Nakala doesn't usually provide this directly in metadata
      tags:
        getMetaValues(rawVideoData.metas, 'http://purl.org/dc/terms/subject') ||
        [],
      // Extract first creator as author
      author:
        getMetaValues(rawVideoData.metas, 'http://nakala.fr/terms#creator')
          .filter(c => c && c.fullName) // Filter out null values and objects without fullName
          .map(c => c.fullName)[0] || null,
      // Views are not available
      collectionId: collectionId,
      collectionTitle: collectionTitle,
      // Extract video files from raw data
      videoFiles:
        rawVideoData.files?.filter(file => {
          const isVideoFile = file.extension
            ?.toLowerCase()
            .match(/(mp4|webm|mov|avi|mkv)$/i);
          if (isVideoFile) {
            console.log(
              'Found video file:',
              file.name,
              'with sha1:',
              file.sha1,
            );
          }
          return isVideoFile;
        }) || [],
    };

    // Fetch related videos (first 3 from the same collection, excluding current video)
    let relatedVideos = [];
    if (collectionId) {
      try {
        const collectionVideosData = await fetchCollectionVideos(collectionId);
        relatedVideos = collectionVideosData.data
          .filter(video => video.identifier !== id) // Exclude the current video
          .slice(0, 3) // Take the first 3
          .map(video => ({
            // Map to simplified structure for related card
            id: video.identifier,
            title:
              getMetaValue(
                video.metas,
                'http://nakala.fr/terms#title',
                currentLang,
              ) || 'Titre Inconnu',
            date:
              getMetaValue(video.metas, 'http://nakala.fr/terms#created') ||
              video.creDate ||
              null, // Remplacer undefined par null pour la sérialisation
            duration: '-', // Placeholder
          }));
      } catch (relatedError) {
        console.warn(
          `Could not fetch related videos for collection ${collectionId}:`,
          relatedError,
        );
      }
    }

    // Add fallback for title if it's null after processing
    if (videoData.title === null) {
      videoData.title = 'Titre Inconnu'; // Keep hardcoded fallback for props, translate in component
    }
    relatedVideos.forEach(vid => {
      if (vid.title === null) {
        vid.title = 'Titre Inconnu'; // Keep hardcoded fallback for props, translate in component
      }
    });

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'project',
          'home',
        ])),
        videoData,
        relatedVideos,
        error: null,
      },
    };
  } catch (error) {
    console.error(`Error fetching data for video ${id}:`, error);
    // Return generic error keys
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'project',
          'home',
        ])),
        videoData: null,
        relatedVideos: [],
        error: {
          titleKey: 'common:error.loadingTitle',
          messageKey: 'project:videoDetail.errorLoadingData',
        },
      },
    };
  }
}

export default VideoDetailPage;
