import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { getHalPdfUrl } from 'lib/hal-config';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useState, useCallback, memo, useMemo } from 'react';

// Import des styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import styles from './PDFViewer.module.scss';

/**
 * Composant PDFViewer utilisant react-pdf-viewer
 * Évite les problèmes CORS en chargeant le PDF directement
 */
const PDFViewerReact = ({
  halUrl,
  title = '',
  className = '',
  height = '700px',
  showToolbar = true,
}) => {
  const { t } = useTranslation(['project', 'common']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // S'assurer que l'URL pointe vers le document PDF
  const pdfUrl = useMemo(() => {
    return getHalPdfUrl(halUrl);
  }, [halUrl]);

  // Plugin de layout par défaut avec configuration
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: showToolbar ? defaultLayoutPlugin.defaultTabs : [],
    toolbarPlugin: {
      fullScreenPlugin: {
        // Activer le mode plein écran
        getFullScreenTarget: () => document.body,
      },
    },
  });

  // Gestionnaire de chargement du document
  const handleDocumentLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  // Gestionnaire d'erreur
  const handleDocumentLoadError = useCallback((error) => {
    console.error('🔍 [PDFViewerReact] Error loading PDF:', error);
    setIsLoading(false);
    setError(error);
  }, []);

  // Si pas d'URL, afficher un placeholder
  if (!pdfUrl) {
    return (
      <div className={`${styles.pdfViewer} ${className}`}>
        <div className={styles.noDocument}>
          <p>{t('project:scientificPublications.noPdfAvailable')}</p>
        </div>
      </div>
    );
  }

  console.log('🔍 [PDFViewerReact] Loading PDF from:', pdfUrl);

  return (
    <div className={`${styles.pdfViewer} ${className}`} style={{ height }}>
      {/* Header avec titre */}
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      )}

      {/* Viewer PDF */}
      <div className={styles.pdfContainer} style={{ height: title ? 'calc(100% - 60px)' : '100%' }}>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={pdfUrl}
            plugins={showToolbar ? [defaultLayoutPluginInstance] : []}
            onDocumentLoad={handleDocumentLoad}
            onDocumentLoadError={handleDocumentLoadError}
            renderError={(error) => (
              <div className={styles.error}>
                <h3>{t('project:publication.pdfError')}</h3>
                <p>{error.message || t('project:publication.pdfErrorMessage')}</p>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  {t('project:publication.openInHal')}
                </a>
              </div>
            )}
            renderLoader={() => (
              <div className={styles.loading}>
                <div className={styles.spinnerContainer}>
                  <div className={styles.spinner} />
                </div>
                <p>{t('project:publication.loadingPdf')}</p>
              </div>
            )}
          />
        </Worker>
      </div>

      {/* Footer avec lien HAL */}
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
        </small>
      </div>
    </div>
  );
};

PDFViewerReact.propTypes = {
  halUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.string,
  showToolbar: PropTypes.bool,
};

PDFViewerReact.defaultProps = {
  title: '',
  className: '',
  height: '700px',
  showToolbar: true,
};

export default memo(PDFViewerReact); 