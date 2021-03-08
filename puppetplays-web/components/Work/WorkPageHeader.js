import { useRouter } from 'next/router';
import { Fragment, useCallback } from 'react';
import Author from 'components/Author';
import Company from 'components/Company';
import CommaSepList from 'components/CommaSepList';
import Place from 'components/Place';
import styles from './workPageHeader.module.scss';

const WorkPageHeader = ({ title, authors, writingPlace }) => {
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    router.back();
  });

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
      <div data-testid="work-page-header-content">
        <span className={styles.title}>{title}</span>
        {authors && authors.length > 0 && (
          <Fragment>
            <span className="dash-separator">-</span>
            <CommaSepList
              list={authors}
              itemComponents={{ persons: Author, companies: Company }}
            />
          </Fragment>
        )}
        {writingPlace && writingPlace.length > 0 && (
          <Fragment>
            <span className="dash-separator">-</span>
            <Place {...writingPlace[0]} />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default WorkPageHeader;
