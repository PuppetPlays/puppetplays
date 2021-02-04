import { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { getFirstItemTitle } from 'lib/utils';
import Place from '../Place';
import WorkAuthor from './WorkAuthor';
import WorkCompany from './WorkCompany';
import CommaSepList from '../CommaSepList';
import styles from './workHeader.module.scss';

const WorkHeader = ({
  title,
  subtitle,
  authors,
  referenceDate,
  writingPlace,
  mainLanguage,
}) => {
  const { t } = useTranslation();

  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
      <h3 className={styles.authors}>
        <span>
          <CommaSepList
            list={authors}
            itemComponents={{ persons: WorkAuthor, companies: WorkCompany }}
          />
        </span>
        {referenceDate && (
          <Fragment>
            <span className="pipe-separator">|</span>
            <span className={styles.date}>{referenceDate}</span>
          </Fragment>
        )}
        {writingPlace.length > 0 && (
          <Fragment>
            <span className="pipe-separator">|</span>
            <span className={styles.place}>
              <Place {...writingPlace[0]} />
            </span>
          </Fragment>
        )}
        {mainLanguage && mainLanguage.length > 0 && (
          <Fragment>
            <span className="pipe-separator">|</span>
            <span className={styles.language}>
              {getFirstItemTitle(mainLanguage)}
            </span>
          </Fragment>
        )}
      </h3>
    </header>
  );
};

export default WorkHeader;
