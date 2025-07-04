import Button from 'components/Button';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import { fetchNakalaItem, getMetaValue } from 'lib/nakala';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';
import styles from 'styles/PlayDetail.module.scss';

const PlayDetailPage = ({ playData, error }) => {
  const { t } = useTranslation(['common', 'anthology']);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [transcriptionContent, setTranscriptionContent] = useState('');
  const [isLoadingTranscription, setIsLoadingTranscription] = useState(false);
  const [isIIIFLoaded, setIsIIIFLoaded] = useState(false);

  useEffect(() => {
    if (playData && playData.iiifManifest) {
      loadIIIFViewer();
    }
  }, [playData]);

  useEffect(() => {
    if (playData && playData.transcriptionFiles.length > 0) {
      // Set default language to the first available transcription
      const defaultLang = playData.transcriptionFiles[0].language || 'fr';
      setSelectedLanguage(defaultLang);
      loadTranscription(defaultLang);
    }
  }, [playData]);

  const loadIIIFViewer = async () => {
    try {
      if (playData.iiifManifest) {
        // Use Universal Viewer as an iframe-based IIIF viewer
        setIsIIIFLoaded(true);
      }
    } catch (error) {
      console.error('Error loading IIIF viewer:', error);
    }
  };

  const loadTranscription = async language => {
    setIsLoadingTranscription(true);
    try {
      const transcriptionFile = playData.transcriptionFiles.find(
        file => file.language === language,
      );

      if (transcriptionFile) {
        const response = await fetch(transcriptionFile.url);
        const xmlContent = await response.text();

        // Parse XML and extract text content (excluding TEI header)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

        // Extract only the text part, not the TEI header
        const textElement = xmlDoc.querySelector('text');
        if (textElement) {
          setTranscriptionContent(formatTEIContent(textElement));
        } else {
          setTranscriptionContent(xmlContent);
        }
      }
    } catch (error) {
      console.error('Error loading transcription:', error);
      setTranscriptionContent(t('anthology:errorLoadingTranscription'));
    } finally {
      setIsLoadingTranscription(false);
    }
  };

  const formatTEIContent = textElement => {
    // Convert TEI XML to readable HTML
    let html = textElement.innerHTML;

    // Replace common TEI elements with HTML equivalents
    html = html.replace(/<speaker>/g, '<strong class="speaker">');
    html = html.replace(/<\/speaker>/g, '</strong>');
    html = html.replace(/<stage[^>]*>/g, '<em class="stage-direction">');
    html = html.replace(/<\/stage>/g, '</em>');
    html = html.replace(/<l>/g, '<div class="verse-line">');
    html = html.replace(/<\/l>/g, '</div>');
    html = html.replace(/<lg>/g, '<div class="verse-group">');
    html = html.replace(/<\/lg>/g, '</div>');
    html = html.replace(/<sp>/g, '<div class="speech">');
    html = html.replace(/<\/sp>/g, '</div>');
    html = html.replace(/<head[^>]*>/g, '<h3 class="section-head">');
    html = html.replace(/<\/head>/g, '</h3>');
    html = html.replace(/<pb[^>]*\/>/g, '<hr class="page-break" />');

    return html;
  };

  const handleLanguageChange = language => {
    setSelectedLanguage(language);
    loadTranscription(language);
  };

  const downloadTranscription = async () => {
    try {
      const transcriptionFile = playData.transcriptionFiles.find(
        file => file.language === selectedLanguage,
      );

      if (transcriptionFile) {
        const response = await fetch(transcriptionFile.url);
        const content = await response.text();

        const blob = new Blob([content], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${playData.title}_${selectedLanguage}.xml`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading transcription:', error);
    }
  };

  const downloadPDF = async () => {
    // This would require a PDF generation service or library
    // For now, we'll show a placeholder
    alert(t('anthology:pdfDownloadComingSoon'));
  };

  if (error) {
    return (
      <Layout
        title={t('anthology:playNotFound')}
        metaDescription={t('anthology:playNotFoundDescription')}
      >
        <Head>
          <title>{`${t('anthology:playNotFound')} | Puppetplays`}</title>
        </Head>
        <div className={styles.container}>
          <NoResults title={t('anthology:playNotFound')} message={error} />
          <Link href="/anthologie" className={styles.backLink}>
            {t('anthology:backToAnthology')}
          </Link>
        </div>
      </Layout>
    );
  }

  if (!playData) {
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
    <Layout title={playData.title} metaDescription={playData.description}>
      <Head>
        <title>{`${playData.title} | Puppetplays`}</title>
        <meta name="description" content={playData.description} />
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
            <span className={styles.breadcrumbItemText}>{playData.title}</span>
          </span>
        </div>

        {/* Play Header */}
        <header className={styles.playHeader}>
          <h1 className={styles.playTitle}>{playData.title}</h1>
          <div className={styles.playMeta}>
            <p className={styles.playAuthor}>
              {t('common:author')}: {playData.author}
            </p>
            <p className={styles.playDate}>
              {t('common:date')}: {new Date(playData.date).getFullYear()}
            </p>
            {playData.language && (
              <p className={styles.playLanguage}>
                {t('common:language')}: {playData.language}
              </p>
            )}
          </div>
          {playData.description && (
            <p className={styles.playDescription}>{playData.description}</p>
          )}
        </header>

        {/* Controls */}
        <div className={styles.controls}>
          {playData.transcriptionFiles.length > 1 && (
            <div className={styles.languageSelector}>
              <label htmlFor="language-select">
                {t('anthology:selectLanguage')}:
              </label>
              <select
                id="language-select"
                value={selectedLanguage}
                onChange={e => handleLanguageChange(e.target.value)}
                className={styles.languageSelect}
              >
                {playData.transcriptionFiles.map(file => (
                  <option key={file.language} value={file.language}>
                    {file.language.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.downloadButtons}>
            <Button
              onClick={downloadTranscription}
              disabled={!transcriptionContent}
            >
              {t('anthology:downloadTranscription')}
            </Button>
            <Button onClick={downloadPDF}>{t('anthology:downloadPDF')}</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* IIIF Viewer */}
          {playData.iiifManifest && (
            <div className={styles.viewerSection}>
              <h2 className={styles.sectionTitle}>
                {t('anthology:digitalizedManuscript')}
              </h2>
              <div className={styles.iiifViewer}>
                {playData.iiifManifest ? (
                  <iframe
                    src={`https://universalviewer.io/uv.html#?manifest=${encodeURIComponent(playData.iiifManifest)}`}
                    title={t('anthology:digitalizedManuscript')}
                    className={styles.iiifViewerFrame}
                    allowFullScreen
                  />
                ) : (
                  <div className={styles.iiifViewerPlaceholder}>
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p>{t('anthology:noDigitalContentAvailable')}</p>
                  </div>
                )}
              </div>
              {!isIIIFLoaded && (
                <div className={styles.viewerLoading}>
                  <p>{t('anthology:loadingViewer')}</p>
                </div>
              )}
            </div>
          )}

          {/* Transcription */}
          {playData.transcriptionFiles.length > 0 && (
            <div className={styles.transcriptionSection}>
              <h2 className={styles.sectionTitle}>
                {t('anthology:transcription')}
                {selectedLanguage && ` (${selectedLanguage.toUpperCase()})`}
              </h2>

              {isLoadingTranscription ? (
                <div className={styles.transcriptionLoading}>
                  <p>{t('anthology:loadingTranscription')}</p>
                </div>
              ) : transcriptionContent ? (
                <div
                  className={styles.transcriptionContent}
                  dangerouslySetInnerHTML={{ __html: transcriptionContent }}
                />
              ) : (
                <p className={styles.noTranscription}>
                  {t('anthology:noTranscriptionAvailable')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* No Content Available */}
        {!playData.iiifManifest && playData.transcriptionFiles.length === 0 && (
          <div className={styles.noContent}>
            <p>{t('anthology:noDigitalContentAvailable')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ params, locale }) {
  const { id } = params;

  try {
    // Fetch the play data from Nakala
    const itemData = await fetchNakalaItem(id);

    const title =
      getMetaValue(itemData.metas, 'http://nakala.fr/terms#title', locale) ||
      itemData.title ||
      'Titre non disponible';

    const author =
      getMetaValue(itemData.metas, 'http://purl.org/dc/terms/creator') ||
      'Auteur inconnu';

    const description =
      getMetaValue(
        itemData.metas,
        'http://purl.org/dc/terms/description',
        locale,
      ) || '';

    const language =
      getMetaValue(itemData.metas, 'http://purl.org/dc/terms/language') || '';

    const date = itemData.creDate || new Date().toISOString();

    // Look for IIIF manifest and transcription files in the item's files
    let iiifManifest = null;
    const transcriptionFiles = [];

    if (itemData.files) {
      itemData.files.forEach(file => {
        if (
          file.mimetype === 'application/json' &&
          file.name.includes('manifest')
        ) {
          iiifManifest = file.uri;
        } else if (
          file.mimetype === 'application/xml' ||
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

    const playData = {
      id: itemData.identifier,
      title,
      author,
      description,
      language,
      date,
      iiifManifest,
      transcriptionFiles,
    };

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'anthology'])),
        playData,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching play data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'anthology'])),
        playData: null,
        error: error.message || 'Erreur lors du chargement de la pièce',
      },
    };
  }
}

export default PlayDetailPage;
