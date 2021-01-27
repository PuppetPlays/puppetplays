import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import styles from './header.module.scss';

function Header({ translations }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/">
          <img src="/logo.png" alt="Puppetplays" width="72" />
        </Link>
      </h1>
      <div className={styles.spacer} />
      <div className={styles.languageSelector}>
        <LanguageSelector translations={translations} />
      </div>
    </div>
  );
}

export default Header;
