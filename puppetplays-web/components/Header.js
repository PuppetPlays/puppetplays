import Link from 'next/link';
import LanguageSelector from 'components/LanguageSelector';
import styles from './header.module.scss';

function Header({ children }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/">
          <img src="/logo.png" alt="Puppetplays" width="72" />
        </Link>
      </h1>
      {children}
      <div className={styles.languageSelector}>
        <LanguageSelector />
      </div>
    </div>
  );
}

export default Header;
