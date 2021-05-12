import PropTypes from 'prop-types';
import styles from './contentLayout.module.scss';

function ContentLayout({ children, style }) {
  return (
    <div className={styles.container}>
      <div className={styles.content} style={style}>
        {children}
      </div>
    </div>
  );
}

ContentLayout.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object.isRequired,
};

export default ContentLayout;
