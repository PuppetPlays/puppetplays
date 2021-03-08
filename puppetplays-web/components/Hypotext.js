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

export default Hypotext;
