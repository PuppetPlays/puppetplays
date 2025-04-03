import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './languageSelector.module.scss';

function LanguageSelector({ inverse, path }) {
  const { locale, locales } = useRouter();

  return (
    <ul
      className={`${styles.container} ${
        inverse && styles['container--inverse']
      }`}
    >
      {locales.map(l => (
        <li key={l} className={l === locale ? 'is-current' : ''}>
          <Link href={path} locale={l}>
            <a>{l}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}

LanguageSelector.defaultProps = {
  inverse: false,
  path: '/',
};

LanguageSelector.propTypes = {
  inverse: PropTypes.bool,
  path: PropTypes.string,
};

export default LanguageSelector;
