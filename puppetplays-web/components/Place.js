import { Fragment } from 'react';
import { hasAtLeastOneItem } from 'lib/utils';

const Place = ({ title, country }) => {
  return (
    <Fragment>
      <span>{title}</span>
      {hasAtLeastOneItem(country) && country[0].title !== title && (
        <span>, {country[0].title}</span>
      )}
    </Fragment>
  );
};

export default Place;
