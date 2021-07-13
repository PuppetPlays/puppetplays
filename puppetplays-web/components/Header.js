import PropTypes from 'prop-types';
import Link from 'next/link';
import LanguageSelector from 'components/LanguageSelector';
import MainNav from 'components/MainNav';
import styles from './header.module.scss';

function Header({ children }) {
  return (
    <header className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/">
          <a>
            <img src="/logo.png" alt="Puppetplays" width="72" />
          </a>
        </Link>
      </h1>
      <div className={styles.content}>{children}</div>
      <div className={styles.languageSelector}>
        <LanguageSelector />
      </div>

      <MainNav />
    </header>
  );
}

Header.defaultProps = {
  children: null,
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
