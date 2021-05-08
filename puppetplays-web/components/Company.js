import PropTypes from 'prop-types';

function Company({ title }) {
  return <span>{title}</span>;
}

Company.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Company;
