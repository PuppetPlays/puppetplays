import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

import styles from './projectNav.module.scss';

const ProjectNav = ({ currentPath }) => {
  const { t } = useTranslation('project');
  const { locale } = useRouter();

  const navItems = [
    {
      label: t('mainNav.presentation'),
      path: '/projet/presentation',
    },
    {
      label: t('mainNav.team'),
      path: '/projet/equipe',
    },
    {
      label: t('mainNav.videos'),
      path: '/projet/videos',
    },
    {
      label: t('mainNav.communications'),
      path: '/projet/communications',
    },
  ];

  return (
    <nav className={styles.nav} aria-label="Project sections navigation">
      <ul className={styles.navList}>
        {navItems.map(item => {
          const isActive = currentPath === item.path;
          return (
            <li key={item.path} className={styles.navItem}>
              <Link
                href={item.path}
                locale={locale}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
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
