import PropTypes from 'prop-types';
import Author from 'components/Author';
import Company from 'components/Company';
import CommaSepList from 'components/CommaSepList';
import { Fragment } from 'react';
import Link from 'next/link';
import styles from './hypotext.module.scss';

function Hypotext({ id, title, slug, date, authors }) {
  return (
    <Fragment>
      <span className={styles.title}>
        {id && (
          <Link href={`/oeuvres/${id}/${slug}`}>
            <a>{title}</a>
          </Link>
        )}
        {!id && title}
      </span>
      {authors && authors.length > 0 && (
        <span className={styles.authors}>
          {', '}

          <CommaSepList
            list={authors}
            itemComponents={{ persons: Author, companies: Company }}
          />
        </span>
      )}
      {date && (
        <span className={styles.date}>
          {' – '}
          {date}
        </span>
      )}
    </Fragment>
  );
}

Hypotext.defaultProps = {
  id: null,
  slug: null,
  date: null,
  authors: null,
};

Hypotext.propTypes = {
  id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.object),
};

export default Hypotext;
