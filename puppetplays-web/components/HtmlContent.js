import PropTypes from 'prop-types';
import styles from './htmlContent.module.scss';

function MainNav({ html }) {
  if (!html) {
    return null;
  }

  return (
    <div
      className={styles.container}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

MainNav.defaultProps = {
  html: null,
};

MainNav.propTypes = {
  html: PropTypes.string,
};

export default MainNav;
