import { getHalPdfUrl } from 'lib/hal-config';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useMemo, memo, useState, useEffect } from 'react';

import styles from './PDFViewer.module.scss';

// Icônes SVG
const ExternalLinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/**
 * Extrait l'URL HAL de base en supprimant /document si présent
 */
const getHalBaseUrl = url => {
  if (!url) return null;
  // Supprimer /document à la fin de l'URL si présent
  return url.replace(/\/document\/?$/, '');
};

/**
 * Composant PDFViewer utilisant Google Docs Viewer
 * Solution fiable pour contourner les problèmes CORS avec HAL
 */
const PDFViewerEmbed = ({
  halUrl,
  title = '',
  className = '',
  height = '700px',
}) => {
  const { t } = useTranslation(['project', 'common']);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extraire l'URL HAL de base (sans /document)
  const halBaseUrl = useMemo(() => getHalBaseUrl(halUrl), [halUrl]);

  // Utiliser Google Docs Viewer pour contourner CORS
  const viewerUrl = useMemo(() => {
    if (!halUrl) return null;

    const pdfUrl = getHalPdfUrl(halUrl);
    // Google Docs Viewer peut charger des PDFs externes
    const encodedUrl = encodeURIComponent(pdfUrl);
    return `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
  }, [halUrl]);

  // Gérer le chargement de l'iframe
  useEffect(() => {
    if (viewerUrl) {
      setIsLoading(true);
      setHasError(false);

      // Timeout pour détecter les erreurs de chargement
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000); // 5 secondes pour charger

      return () => clearTimeout(timeoutId);
    }
  }, [viewerUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!viewerUrl) {
    return (
      <div className={`${styles.pdfViewer} ${className}`}>
        <div className={styles.noDocument}>
          <AlertIcon />
          <h3>{t('project:scientificPublications.noPdfAvailable')}</h3>
          <p>{t('project:scientificPublications.noPdfAvailableDesc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.pdfViewer} ${className}`} style={{ height }}>
      {/* Header avec titre et contrôles */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>

        <div className={styles.controls}>
          <a
            href={halUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.halButton}
            title={t('project:publication.openInHal')}
          >
            <ExternalLinkIcon />
            <span>{t('project:publication.open')}</span>
          </a>
        </div>
      </div>

      {/* Container du viewer */}
      <div
        className={styles.pdfContainer}
        style={{ height: 'calc(100% - 120px)' }}
      >
        {/* État de chargement */}
        {isLoading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loading}>
              <div className={styles.spinnerContainer}>
                <div className={styles.spinner} />
              </div>
              <p>{t('project:publication.loadingPdf')}</p>
              <small>{t('project:publication.loadingNote')}</small>
            </div>
          </div>
        )}

        {/* État d'erreur */}
        {hasError && (
          <div className={styles.errorState}>
            <AlertIcon />
            <h3>{t('project:publication.pdfError')}</h3>
            <p>{t('project:publication.pdfErrorMessage')}</p>
            <div className={styles.errorActions}>
              <a
                href={halUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                <ExternalLinkIcon />
                {t('project:publication.open')}
              </a>
            </div>
          </div>
        )}

        {/* Google Docs Viewer Embed */}
        {!hasError && (
          <iframe
            src={viewerUrl}
            title={title || 'PDF Document'}
            width="100%"
            height="100%"
            className={styles.iframe}
            frameBorder="0"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        )}
      </div>

      {/* Footer avec informations */}
      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <small>
            {t('project:publication.pdfNote')}{' '}
            <a
              href={halBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.halLink}
            >
              HAL
            </a>
          </small>
          <small className={styles.viewerNote}>
            {t('project:publication.viewerNote')} Google Docs Viewer
          </small>
        </div>
      </div>
    </div>
  );
};

PDFViewerEmbed.propTypes = {
  halUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.string,
};

PDFViewerEmbed.defaultProps = {
  title: '',
  className: '',
  height: '700px',
};

export default memo(PDFViewerEmbed);
