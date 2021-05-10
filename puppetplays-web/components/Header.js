import PropTypes from 'prop-types';
import Link from 'next/link';
import LanguageSelector from 'components/LanguageSelector';
import styles from './header.module.scss';

function Header({ children }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/">
          <a>
            <img src="/logo.png" alt="Puppetplays" width="72" />
          </a>
        </Link>
      </h1>
      {children}
      <div className={styles.languageSelector}>
        <LanguageSelector />
      </div>
    </div>
  );
}

Header.defaultProps = {
  children: null,
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
