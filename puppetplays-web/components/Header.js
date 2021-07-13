import PropTypes from 'prop-types';
import Link from 'next/link';
import { useTranslation } from 'next-translate';
import LanguageSelector from 'components/LanguageSelector';
import MainNav from 'components/MainNav';
import Logo from './logo.svg';
import styles from './header.module.scss';

function Header({ children }) {
  const { t } = useTranslation();

  return (
    <header className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/">
          <a title={t('common:backToHome')}>
            <Logo />
          </a>
        </Link>
      </h1>
      <div className={styles.content}>{children}</div>
      <div className={styles.languageSelector}>
        <LanguageSelector />
      </div>

      <MainNav />
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
