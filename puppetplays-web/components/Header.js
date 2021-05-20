import PropTypes from 'prop-types';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import LanguageSelector from 'components/LanguageSelector';
import styles from './header.module.scss';

function Header({ children }) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/">
          <a>
            <img src="/logo.png" alt="Puppetplays" width="72" />
          </a>
        </Link>
      </h1>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/auteurs">
              <a>{t('common:authors')}</a>
            </Link>
          </li>
          <li>
            <Link href="/techniques-d-animation">
              <a>{t('common:animationTechniques')}</a>
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.content}>{children}</div>
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
