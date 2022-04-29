import PropTypes from 'prop-types';
import styles from './filterLabel.module.scss';

function FilterLabel({ id, htmlFor, children }) {
  return (
    <label id={id} htmlFor={htmlFor} className={styles.container}>
      {children}
    </label>
  );
}

FilterLabel.propTypes = {
  id: PropTypes.string.isRequired,
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FilterLabel;
