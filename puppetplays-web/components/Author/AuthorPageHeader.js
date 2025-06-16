import Author from 'components/Author';
import Button from 'components/Button';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import styles from './authorPageHeader.module.scss';

const PdfDownloadIcon = () => {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 12V15H15V12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M10 4V11"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 8.5L10 11L12.5 8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const AuthorPageHeader = ({ authorData }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = router;

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleDownloadPdf = useCallback(() => {
    const pdfUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/pdf/${authorData?.id}/${locale}`;
    window.open(pdfUrl, '_blank');
  }, [authorData?.id, locale]);

  return (
    <div className={styles.container}>
      <button
        onClick={handleGoBack}
        type="button"
        className={styles.backButton}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 8L3 8" strokeWidth="1.5" />
          <path
            d="M8 3L3 8L8 13"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={styles.content}>
        <span className={styles.title}>
          {authorData && <Author {...authorData} />}
        </span>
      </div>
      {authorData?.id && (
        <div className={styles.nav}>
          <Button
            icon={<PdfDownloadIcon />}
            onClick={handleDownloadPdf}
            inverse={false}
          >
            PDF
          </Button>
        </div>
      )}
    </div>
  );
};

AuthorPageHeader.propTypes = {
  authorData: PropTypes.object,
};

export default AuthorPageHeader; 