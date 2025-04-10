import PropTypes from 'prop-types';
import styles from './htmlContent.module.scss';

function HtmlContent({ html = null }) {
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

HtmlContent.propTypes = {
  html: PropTypes.string,
};

export default HtmlContent;
