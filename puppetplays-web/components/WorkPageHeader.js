import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { getFirstItemProp, getFirstItemTitle } from 'lib/utils';
import WorkAuthor from './WorkAuthor';
import CommaSepList from './CommaSepList';
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
          width="23"
          height="16"
          viewBox="0 0 23 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 7.74922C19.6226 7.94813 16.234 8.11246 12.8566 8.23354C11.1679 8.29408 9.4792 8.4757 7.77925 8.37192C6.09056 8.27678 4.40186 8.12976 2.70191 7.74922L2.70191 7.61084C4.3906 7.2303 6.0793 7.08327 7.77925 6.98814C9.46794 6.88435 11.1566 7.06597 12.8566 7.12651C16.234 7.25624 19.6226 7.42057 23 7.61949L23 7.74922Z"
            fill="black"
          />
          <path
            d="M7.58787 16C5.09986 13.3535 2.65689 10.6724 0.247687 7.9827L-0.0112474 7.6973L0.258943 7.36865C1.31719 6.05405 2.28537 4.69622 3.53501 3.47676C4.76212 2.2573 6.05679 1.06378 7.58787 -1.89455e-06L7.73422 0.077836C7.00245 1.55676 6.02301 2.91459 4.99854 4.24649C3.98533 5.57838 2.6794 6.76324 1.4748 8.00865L1.48606 7.39459C3.60255 10.2227 5.69653 13.0681 7.73422 15.9395L7.58787 16Z"
            fill="black"
          />
        </svg>
      </button>
      <div>
        <span>{title}</span>
        <span> - </span>
        <span>
          <CommaSepList list={authors} itemComponent={WorkAuthor} /> -{' '}
          {getFirstItemTitle(writingPlace)},{' '}
          {getFirstItemTitle(getFirstItemProp('country')(writingPlace))}
        </span>
      </div>
    </div>
  );
};

export default WorkPageHeader;
