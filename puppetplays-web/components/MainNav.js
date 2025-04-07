import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import useWindowSize from 'hooks/useWindowSize';
import DropdownMenu from 'components/DropdownMenu';
import styles from './mainNav.module.scss';

const NavButton = props => {
  const { t } = useTranslation();

  return (
    <button
      {...props}
      className={styles.navButton}
      aria-label={t('common:navMenu')}
    >
      <svg
        focusable="false"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="8" y1="12.5" x2="32" y2="12.5" strokeWidth="3" />
        <line x1="8" y1="18.5" x2="32" y2="18.5" strokeWidth="3" />
        <line x1="8" y1="24.5" x2="32" y2="24.5" strokeWidth="3" />
      </svg>
    </button>
  );
};

// eslint-disable-next-line react/prop-types
const Wrapper = ({ children }) => {
  return <ul>{children}</ul>;
};

function MainNav({ inverse }) {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { locale } = useRouter();

  const languageItems =
    width < 480
      ? [
          <li key="lang-fr" className={locale === 'fr' ? styles.isCurrent : ''}>
            <Link href="/" locale="fr" legacyBehavior>
              <a>Français</a>
            </Link>
          </li>,
          <li key="lang-en" className={locale === 'en' ? styles.isCurrent : ''}>
            <Link href="/" locale="en" legacyBehavior>
              <a>English</a>
            </Link>
          </li>,
        ]
      : null;

  return (
    <nav className={`${styles.container} ${inverse ? styles.inverse : ''}`}>
      <DropdownMenu
        renderButton={buttonProps => <NavButton {...buttonProps} />}
        itemsCount={6}
      >
        <li key="home">
          <Link href="/">{t('common:home')}</Link>
        </li>
        <li key="database">
          <Link href="/base-de-donnees">{t('common:database')}</Link>
        </li>
        <li key="authors">
          <Link href="/auteurs">{t('common:authors')}</Link>
        </li>
        <li key="about">
          <Link href="/a-propos">{t('common:about')}</Link>
        </li>
        <li key="contact">
          <Link href="/contact">{t('common:contact')}</Link>
        </li>
        {languageItems}
      </DropdownMenu>
    </nav>
  );
}

MainNav.propTypes = {
  inverse: PropTypes.bool,
};

MainNav.defaultProps = {
  inverse: false,
};

export default MainNav;
