import { Fragment } from 'react';
import { getFirstItemTitle } from 'lib/utils';
import Place from 'components/Place';
import Author from 'components/Author';
import Company from 'components/Company';
import CommaSepList from 'components/CommaSepList';
import styles from './workHeader.module.scss';

const WorkHeader = ({
  title,
  subtitle,
  authors,
  referenceDate,
  writingPlace,
  mainLanguage,
}) => {
  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
      <h3 className={styles.authors}>
        {authors && authors.length > 0 && (
          <span>
            <CommaSepList
              list={authors}
              itemComponents={{ persons: Author, companies: Company }}
            />
          </span>
        )}
        {referenceDate && (
          <Fragment>
            <span className="pipe-separator">|</span>
            <span className={styles.date}>{referenceDate}</span>
          </Fragment>
        )}
        {writingPlace && writingPlace.length > 0 && (
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
