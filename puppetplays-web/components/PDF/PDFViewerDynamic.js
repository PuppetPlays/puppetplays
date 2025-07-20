import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';

import styles from './PDFViewer.module.scss';

// Charger le composant PDFViewerReact uniquement côté client
// pour éviter les erreurs SSR avec pdfjs
const PDFViewerReact = dynamic(() => import('./PDFViewerReact'), {
  ssr: false,
  loading: () => {
    const LoadingComponent = () => {
      const { t } = useTranslation('project');
      return (
        <div className={styles.pdfViewer}>
          <div className={styles.loading}>
            <div className={styles.spinnerContainer}>
              <div className={styles.spinner} />
            </div>
            <p>{t('publication.loadingPdf')}</p>
          </div>
        </div>
      );
    };
    return <LoadingComponent />;
  },
});

export default PDFViewerReact; 