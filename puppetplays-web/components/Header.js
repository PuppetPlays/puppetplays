import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import styles from './header.module.scss';

function Header() {
  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/">
          <a>PuppetPlays</a>
        </Link>
      </h1>
      <div className={styles.spacer} />
      <div className={styles.languageSelector}>
        <LanguageSelector />
      </div>
    </div>
  );
}

export default Header;
