import PropTypes from 'prop-types';

const BirthDeathDates = ({ birthDate, deathDate }) => {
  if (!birthDate && !deathDate) {
    return null;
  }

  return (
    <span>
      {birthDate && birthDate}&nbsp;–&nbsp;{deathDate && deathDate}
    </span>
  );
};

BirthDeathDates.defaultProps = {
  birthDate: null,
  deathDate: null,
};

BirthDeathDates.propTypes = {
  birthDate: PropTypes.string,
  deathDate: PropTypes.string,
};

export default BirthDeathDates;
