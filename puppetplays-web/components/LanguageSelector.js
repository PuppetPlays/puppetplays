import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './languageSelector.module.scss';

function LanguageSelector({ translations }) {
  const { locale, locales, defaultLocale } = useRouter();

  return (
    <div className={styles.container}>
      <i className={styles.icon} />
      <div className={styles.menu}>
        <ul className={styles.menuContent}>
          {locales.map((l) => (
            <li key={l} className={l === locale ? 'is-current' : ''}>
              <Link href="/" locale={l}>
                <a>{translations[l]}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LanguageSelector;
