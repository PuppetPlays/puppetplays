import WorkAuthor from './WorkAuthor';
import WorkCompany from './WorkCompany';
import CommaSepList from '../CommaSepList';
import { Fragment } from 'react';

function Hypotext({ title, date, authors }) {
  return (
    <Fragment>
      {title}
      {authors && authors.length > 0 && ', '}
      {authors && authors.length > 0 && (
        <CommaSepList
          list={authors}
          itemComponents={{ persons: WorkAuthor, companies: WorkCompany }}
        />
      )}
      {date && ', '}
      {date && date}
    </Fragment>
  );
}

export default Hypotext;
