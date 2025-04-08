import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSelector from 'components/LanguageSelector';
import MainNav from 'components/MainNav';
import Logo from './logo.svg';
import styles from './header.module.scss';

function Header({ children }) {
  const { t } = useTranslation();

  return (
    <header className={styles.container}>
      <h1 className={styles.logo}>
        <Link href="/" title={t('common:backToHome')}>
          <Logo />
        </Link>
      </h1>
      <div className={styles.content}>{children}</div>
      <div className={styles.languageSelector}>
        <LanguageSelector path="/" />
      </div>

      <MainNav />
    </header>
  );
}

Header.propTypes = {
  children: PropTypes.node,
};

Header.defaultProps = {
  children: null,
};

export default Header;
