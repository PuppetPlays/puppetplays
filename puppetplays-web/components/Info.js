import PropTypes from 'prop-types';
import styles from './info.module.scss';

function Info({ label, children, fill, show }) {
  if (!show) {
    return null;
  }
  return (
    <div className={styles.container} data-fill={fill}>
      <div className={styles.label}>{label}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

Info.defaultProps = {
  fill: false,
  show: true,
  children: null,
};

Info.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
  fill: PropTypes.bool,
  show: PropTypes.bool,
};

export default Info;
