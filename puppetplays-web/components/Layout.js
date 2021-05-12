import PropTypes from 'prop-types';
import Header from 'components/Header';
import AuthorModal from 'components/Author/AuthorModal';
import AnimationTechniqueModal from 'components/AnimationTechnique/AnimationTechniqueModal';
import styles from './layout.module.scss';

function Layout({ aside, header, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {!header && <Header />}
        {header && <Header>{header}</Header>}
      </div>
      <div className={styles.content}>
        {aside && <aside className={styles.aside}>{aside}</aside>}
        <main className={styles.main}>{children}</main>
      </div>
      <AuthorModal />
      <AnimationTechniqueModal />
    </div>
  );
}

Layout.defaultProps = {
  aside: null,
  header: null,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  aside: PropTypes.node,
  header: PropTypes.node,
};

export default Layout;
