import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import DropdownMenu from 'components/DropdownMenu';
import styles from './mainNav.module.scss';

const NavButton = (props) => {
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
  const { locale } = useRouter();
  const urlLocalePrefix = locale === 'fr' ? '' : '/' + locale;

  return (
    <nav className={`${styles.nav} ${inverse ? styles.isInverse : ''}`}>
      <DropdownMenu
        itemsCount={3}
        renderButton={NavButton}
        childrenWrapperComponent={Wrapper}
      >
        {[
          <li key="database">
            <Link href="/base-de-donnees">
              <a>{t('common:database')}</a>
            </Link>
          </li>,
          <li key="map">
            <a href={`${urlLocalePrefix}/base-de-donnees?view=MAP`}>
              {t('common:map')}
            </a>
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
    </nav>
  );
}

MainNav.defaultProps = {
  inverse: false,
};

MainNav.propTypes = {
  inverse: PropTypes.bool,
};

export default MainNav;
