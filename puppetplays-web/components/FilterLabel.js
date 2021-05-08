import PropTypes from 'prop-types';
import styles from './filterLabel.module.scss';

function FilterLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className={styles.container}>
      {children}
    </label>
  );
}

FilterLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FilterLabel;
