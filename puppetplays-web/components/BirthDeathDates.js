import PropTypes from 'prop-types';

const BirthDeathDates = ({ birthDate = null, deathDate = null }) => {
  if (!birthDate && !deathDate) {
    return null;
  }

  return (
    <span>
      {birthDate && birthDate}&nbsp;–&nbsp;{deathDate && deathDate}
    </span>
  );
};


BirthDeathDates.propTypes = {
  birthDate: PropTypes.string,
  deathDate: PropTypes.string,
};

export default BirthDeathDates;
