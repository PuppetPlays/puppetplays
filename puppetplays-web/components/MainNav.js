import DropdownMenu from 'components/DropdownMenu';
import useWindowSize from 'hooks/useWindowSize';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

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

const Wrapper = ({ children }) => {
  return <ul>{children}</ul>;
};

function MainNav({ inverse = false }) {
  const { t } = useTranslation(['common', 'project']);
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

          <li
            key="lang-en"
            className={
              locale === 'en'
                ? `${styles.isCurrent} ${styles.englishListItem}`
                : styles.englishListItem
            }
          >
            <Link href="/" locale="en" legacyBehavior>
              <a>English</a>
            </Link>
          </li>,
        ]
      : [];

  return (
    <nav className={`${styles.nav} ${inverse ? styles.isInverse : ''}`}>
      <DropdownMenu
        itemsCount={width < 480 ? 9 : 7}
        renderButton={NavButton}
        childrenWrapperComponent={Wrapper}
      >
        {[
          ...languageItems,
          <li key="database">
            <Link href="/base-de-donnees" legacyBehavior>
              <a>{t('common:database')}</a>
            </Link>
          </li>,
          <li key="map">
            <Link href="/base-de-donnees?view=MAP" legacyBehavior>
              <a>{t('common:map')}</a>
            </Link>
          </li>,
          <li key="anthologie">
            <Link href="/anthologie" legacyBehavior>
              <a>Anthologie</a>
            </Link>
          </li>,
          <li key="auteurs">
            <Link href="/auteurs" legacyBehavior>
              <a>{t('common:authors')}</a>
            </Link>
          </li>,
          <li key="techniques">
            <Link href="/techniques-d-animation" legacyBehavior>
              <a>{t('common:animationTechniques')}</a>
            </Link>
          </li>,
          <li key="documentation">
            <Link href="/documentation-technique" legacyBehavior>
              <a>{t('common:technicalDocumentation.title')}</a>
            </Link>
          </li>,
          <li key="tact" className={styles.externalLink}>
            <Link
              href="https://tact.demarre-shs.fr/project/41"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLinkAnchor}
            >
              {t('common:tactPlatform')}
              <span className={styles.externalLinkIcon}>↗</span>
            </Link>
          </li>,
        ]}
      </DropdownMenu>
    </nav>
  );
}

MainNav.propTypes = {
  inverse: PropTypes.bool,
};

export default MainNav;
