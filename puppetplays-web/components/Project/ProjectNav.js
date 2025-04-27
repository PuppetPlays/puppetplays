import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

import styles from './projectNav.module.scss';

const ProjectNav = ({ currentPath }) => {
  const { t } = useTranslation('project');
  const { locale } = useRouter();

  // Define the navigation items structure without translation
  const navKeys = [
    {
      key: 'mainNav.presentation',
      path: '/projet/presentation',
    },
    {
      key: 'mainNav.team',
      path: '/projet/equipe',
    },
    {
      key: 'mainNav.videos',
      path: '/projet/videos',
    },
    {
      key: 'mainNav.communications',
      path: '/projet/communications',
    },
  ];

  return (
    <nav className={styles.nav} aria-label="Project sections navigation">
      <ul className={styles.navList}>
        {navKeys.map(item => {
          const isActive = currentPath === item.path;
          // Use key for both server and client rendering
          return (
            <li key={item.path} className={styles.navItem}>
              <Link
                href={item.path}
                locale={locale}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {t(item.key)}
                {isActive && <span className={styles.activeIndicator} />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

ProjectNav.propTypes = {
  currentPath: PropTypes.string.isRequired,
};

export default ProjectNav;
