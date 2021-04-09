import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './languageSelector.module.scss';

function LanguageSelector({ inverse = false }) {
  const { locale, locales } = useRouter();

  return (
    <ul
      className={`${styles.container} ${
        inverse && styles['container--inverse']
      }`}
    >
      {locales.map((l) => (
        <li key={l} className={l === locale ? 'is-current' : ''}>
          <Link href="/" locale={l}>
            <a>{l}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default LanguageSelector;
