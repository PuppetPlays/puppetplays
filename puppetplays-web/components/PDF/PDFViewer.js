import useErrorHandler, { ERROR_TYPES } from 'hooks/useErrorHandler';
import useHalMetadata from 'hooks/useHalMetadata';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';

import styles from './PDFViewer.module.scss';

/**
 * Icônes SVG professionnelles
 */
const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
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
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const DocumentIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

/**
 * Composant pour afficher les boutons d'action du PDF
 */
const PDFActions = memo(
  ({ halUrl, title, onDownload, onOpenHal, disabled = false }) => {
    const { t } = useTranslation(['project', 'common']);

    return (
      <div className={styles.controls}>
        <button
          onClick={onDownload}
          disabled={disabled}
          className={styles.downloadButton}
          title={t('project:publication.downloadPdf')}
          aria-label={t('project:publication.downloadPdf')}
        >
          <DownloadIcon />
          <span>{t('project:publication.download')}</span>
        </button>

        <a
          href={halUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.halButton}
          title={t('project:publication.openInHal')}
          aria-label={t('project:publication.openInHal')}
        >
          <ExternalLinkIcon />
          <span>HAL</span>
        </a>
      </div>
    );
  },
);

PDFActions.displayName = 'PDFActions';
PDFActions.propTypes = {
  halUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
  onOpenHal: PropTypes.func,
  disabled: PropTypes.bool,
};

/**
 * Composant pour l'état de chargement
 */
const LoadingState = memo(({ message }) => {
  const { t } = useTranslation('project');

  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner} aria-hidden="true" />
      </div>
      <p>{message || t('project:publication.loadingPdf')}</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';
LoadingState.propTypes = {
  message: PropTypes.string,
};

/**
 * Composant pour l'état d'erreur
 */
const ErrorState = memo(({ error, onRetry, halUrl }) => {
  const { t } = useTranslation('project');

  return (
    <div className={styles.error} role="alert">
      <div className={styles.iconContainer} aria-hidden="true">
        <AlertIcon />
      </div>
      <h3>{t('project:publication.pdfError')}</h3>
      <p>{error?.message || t('project:publication.pdfErrorMessage')}</p>

      <div className={styles.errorActions}>
        {error?.canRetry && onRetry && (
          <button
            onClick={onRetry}
            className={styles.retryButton}
            aria-label={t('common:retry')}
          >
            <RefreshIcon />
            <span>
              {t('common:retry')} ({error.retryCount}/{error.maxRetries})
            </span>
          </button>
        )}

        {halUrl && (
          <a
            href={halUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLink}
            aria-label={t('project:publication.openInHal')}
          >
            <span>{t('project:publication.openInHal')}</span>
            <ExternalLinkIcon />
          </a>
        )}
      </div>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';
ErrorState.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
    canRetry: PropTypes.bool,
    retryCount: PropTypes.number,
    maxRetries: PropTypes.number,
  }),
  onRetry: PropTypes.func,
  halUrl: PropTypes.string,
};

/**
 * Composant pour l'état "aucun document"
 */
const NoDocumentState = memo(() => {
  const { t } = useTranslation('project');

  return (
    <div className={styles.noDocument}>
      <div className={styles.iconContainer} aria-hidden="true">
        <DocumentIcon />
      </div>
      <p>{t('project:scientificPublications.pdfNotAvailable')}</p>
    </div>
  );
});

NoDocumentState.displayName = 'NoDocumentState';

/**
 * Composant pour afficher les métadonnées enrichies HAL
 */
const HalMetadataDisplay = memo(({ metadata, isLoading, error }) => {
  const { t } = useTranslation('project');

  if (isLoading) {
    return (
      <div className={styles.metadataLoading}>
        <span>{t('project:hal.loadingMetadata')}</span>
      </div>
    );
  }

  if (error || !metadata) {
    return null; // Échec silencieux pour les métadonnées enrichies
  }

  return (
    <div className={styles.halMetadata}>
      <h4>{t('project:hal.enrichedMetadata')}</h4>
      {metadata.displayData && (
        <dl>
          {metadata.displayData.title && (
            <>
              <dt>{t('project:scientificPublications.title')}</dt>
              <dd>{metadata.displayData.title}</dd>
            </>
          )}
          {metadata.displayData.authors && (
            <>
              <dt>{t('project:scientificPublications.authors')}</dt>
              <dd>{metadata.displayData.authors}</dd>
            </>
          )}
          {metadata.displayData.journal && (
            <>
              <dt>{t('project:scientificPublications.journal')}</dt>
              <dd>{metadata.displayData.journal}</dd>
            </>
          )}
          {metadata.displayData.year && (
            <>
              <dt>{t('project:scientificPublications.year')}</dt>
              <dd>{metadata.displayData.year}</dd>
            </>
          )}
        </dl>
      )}
    </div>
  );
});

HalMetadataDisplay.displayName = 'HalMetadataDisplay';
HalMetadataDisplay.propTypes = {
  metadata: PropTypes.object,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

/**
 * Composant principal PDFViewer refactorisé
 * Affiche des PDFs HAL avec gestion d'erreurs robuste et métadonnées enrichies
 */
const PDFViewer = ({
  halUrl,
  title = '',
  className = '',
  height = '600px',
  showControls = true,
  showDownloadButton = true,
  showHalMetadata = false,
  enableMetadataFallback = true,
}) => {
  const { t } = useTranslation(['project', 'common']);

  // États locaux
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);
  const loadingTimeoutRef = useRef(null);

  // Hooks personnalisés
  const errorHandler = useErrorHandler({
    maxRetries: 2,
    retryDelay: 1500,
  });

  const halMetadata = useHalMetadata(halUrl, {
    autoFetch: showHalMetadata,
    retryCount: 1,
  });

  // Validation de l'URL HAL
  const isValidHalUrl = useMemo(() => {
    if (!halUrl) {
      console.log('🔍 [DEBUG PDFViewer] No HAL URL provided');
      return false;
    }

    console.log('🔍 [DEBUG PDFViewer] Validating HAL URL:', halUrl);

    try {
      const url = new URL(halUrl);
      // Accepter les domaines HAL connus
      const validDomains = [
        'hal.science',
        'hal.archives-ouvertes.fr',
        'hal.inria.fr',
      ];
      const isValidDomain = validDomains.some(domain =>
        url.hostname.includes(domain),
      );

      // Vérifier la présence d'un identifiant HAL dans l'URL
      const hasHalId = /hal-[\w\d]+/i.test(halUrl);

      console.log(
        '🔍 [DEBUG PDFViewer] Domain valid:',
        isValidDomain,
        'HAL ID found:',
        hasHalId,
      );
      const isValid = isValidDomain && hasHalId;
      console.log('🔍 [DEBUG PDFViewer] URL is valid:', isValid);

      return isValid;
    } catch (error) {
      console.log('🔍 [DEBUG PDFViewer] URL validation error:', error);
      return false;
    }
  }, [halUrl]);

  // URL de visualisation (pour l'instant directe HAL)
  const viewerUrl = useMemo(() => {
    if (!isValidHalUrl) return null;
    return halUrl;
  }, [halUrl, isValidHalUrl]);

  // Titre affiché (CraftCMS ou métadonnées HAL ou titre par défaut)
  const displayTitle = useMemo(() => {
    if (title) return title;
    if (enableMetadataFallback && halMetadata.displayData?.title) {
      return halMetadata.displayData.title;
    }
    return t('project:scientificPublications.documentPdf');
  }, [title, halMetadata.displayData, enableMetadataFallback, t]);

  // Réinitialisation lors du changement d'URL
  useEffect(() => {
    if (halUrl) {
      setIsIframeLoading(true);
      setIframeError(null);
      errorHandler.clearError();

      // Nettoyer le timeout précédent
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Timeout de 15 secondes pour éviter le loading infini
      const timeoutId = setTimeout(() => {
        console.warn('PDF loading timeout - forcing stop');
        setIsIframeLoading(false);
        setIframeError(
          new Error(
            'Le document PDF met trop de temps à charger. Vérifiez votre connexion internet.',
          ),
        );
      }, 15000);

      loadingTimeoutRef.current = timeoutId;
    }

    // Cleanup function
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [halUrl, errorHandler.clearError]);

  // Gestionnaires d'événements améliorés
  const handleIframeLoad = useCallback(() => {
    // Nettoyer le timeout si l'iframe se charge avec succès
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    setIsIframeLoading(false);
    setIframeError(null);
    errorHandler.clearError();
  }, [errorHandler.clearError]);

  const handleIframeError = useCallback(() => {
    // Nettoyer le timeout en cas d'erreur
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    const error = new Error('Impossible de charger le document PDF');
    error.type = ERROR_TYPES.PDF_LOAD;

    setIsIframeLoading(false);
    setIframeError(error);
    errorHandler.handleError(error, 'PDF iframe loading');
  }, [errorHandler.handleError]);

  const handleDownload = useCallback(() => {
    if (!viewerUrl) return;

    try {
      const link = document.createElement('a');
      link.href = viewerUrl;
      link.download = `${displayTitle}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      errorHandler.handleError(error, 'PDF download');
    }
  }, [viewerUrl, displayTitle, errorHandler.handleError]);

  const handleRetry = useCallback(async () => {
    try {
      await errorHandler.retryWithDelay(() => {
        setIsIframeLoading(true);
        setIframeError(null);

        // Re-déclencher le chargement de l'iframe
        const iframe = document.querySelector(
          `iframe[title="${displayTitle}"]`,
        );
        if (iframe) {
          const currentSrc = iframe.src;
          iframe.src = '';
          setTimeout(() => {
            iframe.src = currentSrc;
          }, 100);
        }
      });
    } catch (error) {
      console.error('Retry failed:', error);
    }
  }, [errorHandler.retryWithDelay, displayTitle]);

  // Rendu conditionnel
  if (!halUrl) {
    return (
      <div className={`${styles.pdfViewer} ${className}`}>
        <NoDocumentState />
      </div>
    );
  }

  if (!isValidHalUrl) {
    const validationError = {
      message: t('project:errors.invalidHalUrl'),
      canRetry: false,
    };

    return (
      <div className={`${styles.pdfViewer} ${className}`}>
        <ErrorState error={validationError} halUrl={halUrl} />
      </div>
    );
  }

  return (
    <div className={`${styles.pdfViewer} ${className}`} style={{ height }}>
      {/* Header avec contrôles */}
      {showControls && (
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{displayTitle}</h3>
            {showHalMetadata && (
              <HalMetadataDisplay
                metadata={halMetadata}
                isLoading={halMetadata.isLoading}
                error={halMetadata.error}
              />
            )}
          </div>

          {(showDownloadButton || halUrl) && (
            <PDFActions
              halUrl={halUrl}
              title={displayTitle}
              onDownload={handleDownload}
              disabled={isIframeLoading || !!errorHandler.hasError}
            />
          )}
        </div>
      )}

      {/* État de chargement */}
      {isIframeLoading && (
        <LoadingState message={t('project:publication.loadingPdf')} />
      )}

      {/* État d'erreur */}
      {(errorHandler.hasError || iframeError) && (
        <ErrorState
          error={errorHandler.displayError}
          onRetry={errorHandler.isRetryable ? handleRetry : null}
          halUrl={halUrl}
        />
      )}

      {/* Iframe PDF */}
      {viewerUrl && !errorHandler.hasError && !iframeError && (
        <iframe
          src={`${viewerUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
          title={displayTitle}
          className={styles.iframe}
          style={{
            height: showControls ? 'calc(100% - 80px)' : '100%',
            display: isIframeLoading ? 'none' : 'block',
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}

      {/* Footer informatif */}
      <div className={styles.footer}>
        <small>
          {t('project:publication.pdfNote')}{' '}
          <a
            href={halUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.halLink}
          >
            HAL
          </a>
          {halMetadata.hasMetadata && (
            <span className={styles.metadataIndicator}>
              {' • '}
              {t('project:hal.metadataEnriched')}
            </span>
          )}
        </small>
      </div>
    </div>
  );
};

// PropTypes pour la validation
PDFViewer.propTypes = {
  halUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.string,
  showControls: PropTypes.bool,
  showDownloadButton: PropTypes.bool,
  showHalMetadata: PropTypes.bool,
  enableMetadataFallback: PropTypes.bool,
};

// Valeurs par défaut
PDFViewer.defaultProps = {
  title: '',
  className: '',
  height: '600px',
  showControls: true,
  showDownloadButton: true,
  showHalMetadata: false,
  enableMetadataFallback: true,
};

export default memo(PDFViewer);
