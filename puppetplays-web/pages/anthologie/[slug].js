import Button from 'components/Button';
import Footer from 'components/Footer';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import { fetchAPI } from 'lib/api';
import { fetchNakalaItem, getNakalaEmbedUrl, getMetaValue } from 'lib/nakala';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment, useState, useEffect } from 'react';
import styles from 'styles/Anthology.module.scss';

// Utility function to ensure safe serialization for Next.js JSON
const safeSerialize = (value, defaultValue = null) => {
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value;
};

// GraphQL query to get anthology entry by slug
const getAnthologyBySlugQuery = `
  query GetAnthologyBySlug($slug: [String], $site: [String]) {
    entries(section: "anthology", slug: $slug, site: $site) {
      ... on anthology_default_Entry {
        id
        title
        slug
        uri
        editors {
          id
          title
          ... on persons_persons_Entry {
            firstName
            lastName
            usualName
          }
        }
        transcribers {
          id
          title
          ... on persons_persons_Entry {
            firstName
            lastName
            usualName
          }
        }
        license
        doi
      }
    }
  }
`;

const AnthologyDetailPage = ({ anthologyData, error }) => {
  const { t } = useTranslation(['common', 'anthology']);
  const [currentPage, setCurrentPage] = useState(1);
  const [nakalaViewerUrl, setNakalaViewerUrl] = useState('');

  useEffect(() => {
    if (
      anthologyData &&
      anthologyData.imageFiles &&
      anthologyData.imageFiles.length > 0
    ) {
      // Use the first image file for the viewer by default
      updateViewerForPage(1);
    }
  }, [anthologyData]);

  const updateViewerForPage = pageNumber => {
    if (
      anthologyData &&
      anthologyData.nakalaIdentifier &&
      anthologyData.nakalaFileIdentifier
    ) {
      const viewerUrl = getNakalaEmbedUrl(
        anthologyData.nakalaIdentifier,
        anthologyData.nakalaFileIdentifier,
        {
          buttons: true,
        },
      );
      setNakalaViewerUrl(viewerUrl);
      setCurrentPage(pageNumber);
    }
  };

  const handlePageChange = pageNumber => {
    updateViewerForPage(pageNumber);
  };

  const downloadPDF = async () => {
    // This would require a PDF generation service or library
    // For now, we'll show a placeholder
    alert(t('anthology:pdfDownloadComingSoon'));
  };

  if (error) {
    return (
      <Layout
        title={t('anthology:anthologyNotFound')}
        metaDescription={t('anthology:anthologyNotFoundDescription')}
      >
        <Head>
          <title>{`${t('anthology:anthologyNotFound')} | Puppetplays`}</title>
        </Head>
        <div className={styles.container}>
          <NoResults title={t('anthology:anthologyNotFound')} message={error} />
          <Link href="/anthologie" className={styles.backLink}>
            {t('anthology:backToAnthology')}
          </Link>
        </div>
      </Layout>
    );
  }

  if (!anthologyData) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>{t('common:loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Fragment>
      <Layout
        title={anthologyData.title}
        metaDescription={`Anthologie: ${anthologyData.title}`}
      >
        <Head>
          <title>{`${anthologyData.title} | Puppetplays`}</title>
          <meta
            name="description"
            content={`Anthologie: ${anthologyData.title}`}
          />
        </Head>

        <div className={styles.container}>
          {/* Breadcrumbs */}
          <div className={styles.breadcrumbs}>
            <Link href="/anthologie">
              <span className={styles.breadcrumbItemText}>
                {t('anthology:title')}
              </span>
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>
              <span className={styles.breadcrumbItemText}>
                {anthologyData.title}
              </span>
            </span>
          </div>

          {/* Anthology Header */}
          <header className={styles.playHeader}>
            <h1 className={styles.playTitle}>{anthologyData.title}</h1>
            <div className={styles.playMeta}>
              {anthologyData.editorsDisplay && (
                <p className={styles.playAuthor}>
                  <strong>{t('anthology:compiler')}:</strong>{' '}
                  {anthologyData.editorsDisplay}
                </p>
              )}
              {anthologyData.transcribersDisplay && (
                <p className={styles.playAuthor}>
                  <strong>{t('anthology:transcriber')}:</strong>{' '}
                  {anthologyData.transcribersDisplay}
                </p>
              )}
              {anthologyData.license && (
                <p className={styles.playInfo}>
                  <strong>{t('anthology:license')}:</strong>{' '}
                  {anthologyData.license}
                </p>
              )}
              {anthologyData.nakalaMetadata?.created && (
                <p className={styles.playInfo}>
                  <strong>{t('anthology:nakalaYear')}:</strong>{' '}
                  {anthologyData.nakalaMetadata.created}
                </p>
              )}
              {anthologyData.nakalaMetadata?.description && (
                <p className={styles.playDescription}>
                  <strong>{t('anthology:nakalaDescription')}:</strong>{' '}
                  {anthologyData.nakalaMetadata.description}
                </p>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Viewer Section - Full Width */}
            <div className={styles.viewerSection}>
              <div className={styles.viewerHeader}>
                <h2 className={styles.sectionTitle}>
                  {t('anthology:digitalizedDocument')}
                </h2>
                <div className={styles.viewerControls}>
                  <div className={styles.pageNavigation}>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className={styles.navButton}
                    >
                      ← {t('anthology:previousPage')}
                    </button>
                    <span className={styles.pageIndicator}>
                      {currentPage} / 8
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= 8}
                      className={styles.navButton}
                    >
                      {t('anthology:nextPage')} →
                    </button>
                  </div>

                  <div className={styles.downloadButtons}>
                    <Button onClick={downloadPDF} variant="secondary">
                      {t('anthology:downloadPDF')}
                    </Button>
                  </div>
                </div>
              </div>

              {nakalaViewerUrl ? (
                <div className={styles.viewerContainer}>
                  <iframe
                    src={nakalaViewerUrl}
                    title={`${t('anthology:digitalizedDocument')} - ${t('anthology:page')} ${currentPage}`}
                    className={styles.viewerFrame}
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className={styles.noViewer}>
                  <p>{t('anthology:loadingViewer')}</p>
                </div>
              )}
            </div>

            {/* Transcription Section - Sidebar */}
            <div className={styles.transcriptionSection}>
              <div className={styles.transcriptionHeader}>
                <h3 className={styles.sectionTitle}>
                  {t('anthology:transcription')}
                </h3>
                <div className={styles.comingSoon}>Coming Soon</div>
              </div>

              <div className={styles.transcriptionPlaceholder}>
                <p>{t('anthology:noTranscriptionAvailable')}</p>
                <small>La transcription sera bientôt disponible</small>
              </div>
            </div>
          </div>

          {/* No Content Available */}
          {!nakalaViewerUrl &&
            anthologyData.transcriptionFiles.length === 0 && (
              <div className={styles.noContent}>
                <p>{t('anthology:noDigitalContentAvailable')}</p>
              </div>
            )}
        </div>

        <Footer />
      </Layout>
    </Fragment>
  );
};

export async function getServerSideProps({ params, locale }) {
  const { slug } = params;

  try {
    // First, fetch the anthology entry from CraftCMS
    const siteHandle = locale === 'fr' ? 'fr' : locale;
    const anthologyResponse = await fetchAPI(getAnthologyBySlugQuery, {
      slug: [slug],
      site: [siteHandle],
    });

    if (!anthologyResponse?.entries || anthologyResponse.entries.length === 0) {
      return {
        props: {
          ...(await serverSideTranslations(locale, [
            'common',
            'anthology',
            'home',
          ])),
          anthologyData: null,
          error: 'Anthology not found',
        },
      };
    }

    const anthology = anthologyResponse.entries[0];

    // Extract Nakala identifiers from DOI
    let nakalaIdentifier = null;
    let nakalaFileIdentifier = null;
    if (anthology.doi) {
      // DOI format includes both dataset and file identifier: "10.34847/nkl.xxxxxxxx/filesha1"
      const doiMatch = anthology.doi.match(/(10\.34847\/nkl\.[^/]+)\/(.+)/);
      if (doiMatch) {
        nakalaIdentifier = doiMatch[1]; // Dataset identifier: 10.34847/nkl.14b5rpso
        nakalaFileIdentifier = doiMatch[2]; // File identifier: a6251ee5c023450205416abd312f77db09500c94
      }
    }

    let nakalaData = null;
    const nakalaMetadata = {};
    const imageFiles = [];
    const transcriptionFiles = [];

    // If we have a Nakala identifier, fetch the data from Nakala
    if (nakalaIdentifier) {
      try {
        nakalaData = await fetchNakalaItem(nakalaIdentifier);

        // Extract useful metadata from Nakala
        if (nakalaData.metas) {
          const { metas } = nakalaData;
          nakalaMetadata.description =
            getMetaValue(metas, 'http://purl.org/dc/terms/description', 'fr') ||
            getMetaValue(metas, 'http://purl.org/dc/terms/description', 'en');
          nakalaMetadata.creator = getMetaValue(
            metas,
            'http://nakala.fr/terms#creator',
          );
          nakalaMetadata.created = getMetaValue(
            metas,
            'http://nakala.fr/terms#created',
          );
          nakalaMetadata.license = getMetaValue(
            metas,
            'http://nakala.fr/terms#license',
          );
          nakalaMetadata.title =
            getMetaValue(metas, 'http://nakala.fr/terms#title', 'fr') ||
            getMetaValue(metas, 'http://nakala.fr/terms#title', 'en');
        }

        // Process image and transcription files from Nakala
        if (nakalaData.files) {
          nakalaData.files.forEach(file => {
            // Check for image files (JPG, PNG, etc.)
            if (
              file.mime_type &&
              file.mime_type.startsWith('image/') &&
              file.sha1
            ) {
              imageFiles.push({
                name: file.name,
                sha1: file.sha1,
                mimetype: file.mime_type,
                size: file.size,
              });
            }
            // Check for transcription files (XML)
            else if (
              file.mime_type === 'application/xml' ||
              file.name.endsWith('.xml')
            ) {
              // Extract language from filename if possible
              const langMatch = file.name.match(/[_-]([a-z]{2,3})\./i);
              const fileLanguage = langMatch
                ? langMatch[1].toLowerCase()
                : 'unknown';

              transcriptionFiles.push({
                url: file.uri,
                language: fileLanguage,
                filename: file.name,
              });
            }
          });
        }
      } catch (nakalaError) {
        console.error('Error fetching Nakala data:', nakalaError);
      }
    }

    // Format editors and transcribers names
    const formatPersonName = person => {
      if (!person) return 'Inconnu';
      if (person.firstName && person.lastName) {
        return `${person.firstName} ${person.lastName}`;
      }
      if (person.usualName) return person.usualName;
      if (person.title) return person.title;
      return 'Inconnu';
    };

    const anthologyData = {
      id: anthology.id,
      slug: anthology.slug,
      title: anthology.title || 'Titre non disponible',
      editors: anthology.editors || [],
      transcribers: anthology.transcribers || [],
      license: safeSerialize(anthology.license),
      doi: safeSerialize(anthology.doi),
      nakalaIdentifier,
      nakalaFileIdentifier,
      nakalaMetadata: nakalaMetadata || {},
      imageFiles,
      transcriptionFiles,
      // Additional fields for display
      editorsDisplay: anthology.editors
        ? anthology.editors.map(formatPersonName).join(', ')
        : '',
      transcribersDisplay: anthology.transcribers
        ? anthology.transcribers.map(formatPersonName).join(', ')
        : '',
    };

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'anthology',
          'home',
        ])),
        anthologyData,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching anthology data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'anthology',
          'home',
        ])),
        anthologyData: null,
        error: error.message || "Erreur lors du chargement de l'anthologie",
      },
    };
  }
}

export default AnthologyDetailPage;
