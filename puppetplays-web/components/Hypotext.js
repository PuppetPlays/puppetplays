import PropTypes from 'prop-types';
import Author from 'components/Author';
import Company from 'components/Company';
import CommaSepList from 'components/CommaSepList';
import { Fragment } from 'react';

function Hypotext({ title, date, authors }) {
  return (
    <Fragment>
      {title}
      {authors && authors.length > 0 && ', '}
      {authors && authors.length > 0 && (
        <CommaSepList
          list={authors}
          itemComponents={{ persons: Author, companies: Company }}
        />
      )}
      {date && ', '}
      {date && date}
    </Fragment>
  );
}

Hypotext.defaultProps = {
  date: null,
  authors: null,
};

Hypotext.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  authors: PropTypes.arrayOf(PropTypes.object),
};

export default Hypotext;
