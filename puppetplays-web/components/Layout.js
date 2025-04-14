import AnimationTechniqueModal from 'components/AnimationTechnique/AnimationTechniqueModal';
import AuthorModal from 'components/Author/AuthorModal';
import Header from 'components/Header';
import ImageModal from 'components/ImageModal';
import SearchBarStateful from 'components/SearchBarStateful';
import PropTypes from 'prop-types';

import styles from './layout.module.scss';

function Layout({ aside = null, header = <SearchBarStateful />, children }) {
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
      <ImageModal />
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  aside: PropTypes.node,
  header: PropTypes.node,
};

export default Layout;
