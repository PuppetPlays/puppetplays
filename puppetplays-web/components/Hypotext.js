import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stopEventPropagation } from 'lib/utils';
import Author from 'components/Author';
import Company from 'components/Company';
import CommaSepList from 'components/CommaSepList';
import styles from './hypotext.module.scss';

/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
function Hypotext({ id, title, slug, date, authors }) {
  const { asPath } = useRouter();

  return (
    <Fragment>
      <span className={styles.title}>
        {id && asPath !== `/oeuvres/${id}/${slug}` && (
          <Link href={`/oeuvres/${id}/${slug}`}>
            <a>{title}</a>
          </Link>
        )}
        <span onClick={stopEventPropagation}>
          {(!id || asPath === `/oeuvres/${id}/${slug}`) && title}
        </span>
      </span>
      {authors && authors.length > 0 && (
        <span className={styles.authors} onClick={stopEventPropagation}>
          {', '}

          <CommaSepList
            list={authors}
            itemComponents={{ persons: Author, companies: Company }}
          />
        </span>
      )}
      {date && (
        <span className={styles.date} onClick={stopEventPropagation}>
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
