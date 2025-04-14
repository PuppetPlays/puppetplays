import PropTypes from 'prop-types';

import styles from './contentLayout.module.scss';

function ContentLayout({ children, style = {}, onScroll = null }) {
  return (
    <div className={styles.container} onScroll={onScroll}>
      <div className={styles.content} style={style}>
        {children}
      </div>
    </div>
  );
}

ContentLayout.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object.isRequired,
  onScroll: PropTypes.func,
};

export default ContentLayout;
