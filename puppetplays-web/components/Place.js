import { Fragment } from 'react';

const Place = ({ place }) => {
  return (
    <Fragment>
      <span> - {place.title}</span>
      {place.country.length > 0 && place.country[0].title !== place.title && (
        <span>, {place.country[0].title}</span>
      )}
    </Fragment>
  );
};

export default Place;
