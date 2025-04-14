import { hasAtLeastOneItem } from 'lib/utils';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

const Place = ({ title = null, country = null }) => {
  return (
    <Fragment>
      <span>{title}</span>
      {hasAtLeastOneItem(country) && country[0].title !== title && (
        <span>, {country[0].title}</span>
      )}
    </Fragment>
  );
};

Place.propTypes = {
  title: PropTypes.string.isRequired,
  country: PropTypes.arrayOf(PropTypes.object),
};

export default Place;
