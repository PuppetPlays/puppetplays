import PropTypes from 'prop-types';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import LanguageSelector from 'components/LanguageSelector';
import DropdownMenu from 'components/DropdownMenu';
import styles from './header.module.scss';

const renderNavButton = (props) => {
  return (
    <button {...props} className={styles.navButton}>
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <line x1="8" y1="12.5" x2="32" y2="12.5" strokeWidth="3" />
        <line x1="8" y1="18.5" x2="32" y2="18.5" strokeWidth="3" />
        <line x1="8" y1="24.5" x2="32" y2="24.5" strokeWidth="3" />
      </svg>
    </button>
  );
};

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => {
  return (
    <nav className={styles.nav}>
      <ul>{children}</ul>
    </nav>
  );
};

function Header({ children }) {
  const { t } = useTranslation();

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

      <DropdownMenu
        itemsCount={3}
        renderButton={renderNavButton}
        childrenWrapperComponent={Wrapper}
      >
        {[
          <li key="repertoire">
            <Link href="/repertoire">
              <a>{t('common:repertoire')}</a>
            </Link>
          </li>,
          <li key="auteurs">
            <Link href="/auteurs">
              <a>{t('common:authors')}</a>
            </Link>
          </li>,
          <li key="techniques">
            <Link href="/techniques-d-animation">
              <a>{t('common:animationTechniques')}</a>
            </Link>
          </li>,
        ]}
      </DropdownMenu>
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
