import { getHalPdfUrl } from 'lib/hal-config';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { memo } from 'react';

import styles from './PDFViewer.module.scss';

const ExternalLinkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const DocumentIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

/**
 * Carte d'accès au PDF d'une publication déposée sur HAL.
 *
 * HAL protège ses fichiers avec Anubis : toute requête faite depuis un
 * serveur (Google Docs Viewer, proxy) reçoit une page anti-robot au lieu du
 * PDF. Seul le navigateur du lecteur peut ouvrir le document, donc on
 * propose un lien plutôt qu'un aperçu intégré.
 */
const PDFViewerEmbed = ({ halUrl, title = '', className = '' }) => {
  const { t } = useTranslation(['project', 'common']);
  const pdfUrl = getHalPdfUrl(halUrl);

  return (
    <div className={`${styles.pdfViewer} ${className}`}>
      {title && (
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        </div>
      )}

      <div className={styles.halDocument}>
        <DocumentIcon />
        <p>{t('project:publication.pdfOnHalDesc')}</p>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primaryButton}
        >
          <ExternalLinkIcon />
          {t('project:publication.readPdfOnHal')}
        </a>
      </div>
    </div>
  );
};

PDFViewerEmbed.propTypes = {
  halUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

export default memo(PDFViewerEmbed);
