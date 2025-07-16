import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import useHalMetadata from 'hooks/useHalMetadata';
import useErrorHandler, { ERROR_TYPES } from 'hooks/useErrorHandler';
import styles from './PDFViewer.module.scss';

/**
 * Composant pour afficher les boutons d'action du PDF
 */
const PDFActions = memo(({ halUrl, title, onDownload, onOpenHal, disabled = false }) => {
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
        📥 {t('project:publication.download')}
      </button>

      <a 
        href={halUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.halButton}
        title={t('project:publication.openInHal')}
        aria-label={t('project:publication.openInHal')}
      >
        🔗 HAL
      </a>
    </div>
  );
});

PDFActions.displayName = 'PDFActions';
PDFActions.propTypes = {
  halUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
  onOpenHal: PropTypes.func,
  disabled: PropTypes.bool
};

/**
 * Composant pour l'état de chargement
 */
const LoadingState = memo(({ message }) => {
  const { t } = useTranslation('project');
  
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      <p>{message || t('project:publication.loadingPdf')}</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';
LoadingState.propTypes = {
  message: PropTypes.string
};

/**
 * Composant pour l'état d'erreur
 */
const ErrorState = memo(({ error, onRetry, halUrl }) => {
  const { t } = useTranslation('project');

  return (
    <div className={styles.error} role="alert">
      <div className={styles.icon} aria-hidden="true">⚠️</div>
      <h3>{t('project:publication.pdfError')}</h3>
      <p>{error?.message || t('project:publication.pdfErrorMessage')}</p>
      
      <div className={styles.errorActions}>
        {error?.canRetry && onRetry && (
          <button 
            onClick={onRetry}
            className={styles.retryButton}
            aria-label={t('common:retry')}
          >
            🔄 {t('common:retry')} ({error.retryCount}/{error.maxRetries})
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
            {t('project:publication.openInHal')}
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
    maxRetries: PropTypes.number
  }),
  onRetry: PropTypes.func,
  halUrl: PropTypes.string
};

/**
 * Composant pour l'état "aucun document"
 */
const NoDocumentState = memo(() => {
  const { t } = useTranslation('project');
  
  return (
    <div className={styles.noDocument}>
      <div className={styles.icon} aria-hidden="true">📄</div>
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
  error: PropTypes.string
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
  enableMetadataFallback = true
}) => {
  const { t } = useTranslation(['project', 'common']);
  
  // États locaux
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(null);
  
  // Hooks personnalisés
  const errorHandler = useErrorHandler({
    maxRetries: 2,
    retryDelay: 1500
  });
  
  const halMetadata = useHalMetadata(halUrl, {
    autoFetch: showHalMetadata,
    retryCount: 1
  });

  // Validation de l'URL HAL
  const isValidHalUrl = useMemo(() => {
    if (!halUrl) return false;
    
    try {
      const url = new URL(halUrl);
      // Accepter les domaines HAL connus
      const validDomains = ['hal.science', 'hal.archives-ouvertes.fr', 'hal.inria.fr'];
      const isValidDomain = validDomains.some(domain => url.hostname.includes(domain));
      
      // Vérifier la présence d'un identifiant HAL dans l'URL
      const hasHalId = /hal-[\w\d]+/i.test(halUrl);
      
      return isValidDomain && hasHalId;
    } catch {
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

  // Gestionnaires d'événements
  const handleIframeLoad = useCallback(() => {
    setIsIframeLoading(false);
    setIframeError(null);
    errorHandler.clearError();
  }, [errorHandler.clearError]);

  const handleIframeError = useCallback(() => {
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
        const iframe = document.querySelector(`iframe[title="${displayTitle}"]`);
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

  // Réinitialisation lors du changement d'URL
  useEffect(() => {
    if (halUrl) {
      setIsIframeLoading(true);
      setIframeError(null);
      errorHandler.clearError();
    }
  }, [halUrl, errorHandler.clearError]);

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
      canRetry: false
    };
    
    return (
      <div className={`${styles.pdfViewer} ${className}`}>
        <ErrorState 
          error={validationError} 
          halUrl={halUrl}
        />
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
            display: isIframeLoading ? 'none' : 'block'
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
              {' • '}{t('project:hal.metadataEnriched')}
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
  enableMetadataFallback: PropTypes.bool
};

// Valeurs par défaut
PDFViewer.defaultProps = {
  title: '',
  className: '',
  height: '600px',
  showControls: true,
  showDownloadButton: true,
  showHalMetadata: false,
  enableMetadataFallback: true
};

export default memo(PDFViewer); 