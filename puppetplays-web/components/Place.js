import { Fragment } from 'react';

const Place = ({ title, country }) => {
  return (
    <Fragment>
      <span>{title}</span>
      {country.length > 0 && country[0].title !== title && (
        <span>, {country[0].title}</span>
      )}
    </Fragment>
  );
};

export default Place;
