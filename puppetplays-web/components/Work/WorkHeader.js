import { Fragment } from 'react';
import PropTypes from 'prop-types';
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
  mostRelevantDate,
  compositionPlace,
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
        {mostRelevantDate && (
          <Fragment>
            <span className="pipe-separator">|</span>
            <span className={styles.date}>{mostRelevantDate}</span>
          </Fragment>
        )}
        {compositionPlace && compositionPlace.length > 0 && (
          <Fragment>
            <span className="pipe-separator">|</span>
            <span className={styles.place}>
              <Place {...compositionPlace[0]} />
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

WorkHeader.defaultProps = {
  subtitle: null,
  authors: null,
  mostRelevantDate: null,
  compositionPlace: null,
  mainLanguage: null,
};

WorkHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.object),
  mostRelevantDate: PropTypes.string,
  compositionPlace: PropTypes.arrayOf(PropTypes.object),
  mainLanguage: PropTypes.arrayOf(PropTypes.object),
};

export default WorkHeader;
