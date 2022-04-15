import PropTypes from 'prop-types';
import Header from 'components/Header';
import AuthorModal from 'components/Author/AuthorModal';
import ImageModal from 'components/ImageModal';
import AnimationTechniqueModal from 'components/AnimationTechnique/AnimationTechniqueModal';
import SearchBarStateful from 'components/SearchBarStateful';
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
      <ImageModal />
      <AuthorModal />
      <AnimationTechniqueModal />
    </div>
  );
}

Layout.defaultProps = {
  aside: null,
  header: <SearchBarStateful />,
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  aside: PropTypes.node,
  header: PropTypes.node,
};

export default Layout;
