import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import styles from './projectNav.module.scss';

const ProjectNav = ({ currentPath }) => {
  const { t } = useTranslation('project');
  const { locale } = useRouter();
  const navRef = useRef(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Find the current active item
  const activeItem = navKeys.find(item => item.path === currentPath);

  // Detect if scrolling is needed
  useEffect(() => {
    const checkOverflow = () => {
      if (navRef.current && window.innerWidth > 480) {
        const { scrollWidth, clientWidth } = navRef.current;
        setHasOverflow(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);

    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);

  // Scroll active item into view on mobile
  useEffect(() => {
    if (window.innerWidth <= 768 && window.innerWidth > 480 && navRef.current) {
      const activeItem = navRef.current.querySelector(`.${styles.active}`);
      if (activeItem) {
        const itemRect = activeItem.getBoundingClientRect();
        const containerRect = navRef.current.getBoundingClientRect();

        // Check if item is not fully visible
        if (
          itemRect.left < containerRect.left ||
          itemRect.right > containerRect.right
        ) {
          activeItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }
    }
  }, [currentPath]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (isMobileMenuOpen && !event.target.closest(`.${styles.mobileNav}`)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile dropdown version for very small screens */}
      <div className={styles.mobileNav}>
        <button
          className={styles.mobileNavToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.currentSection}>
            {activeItem ? t(activeItem.key) : t('mainNav.menu')}
          </span>
          <div className={styles.menuIcon}>
            <span
              className={`${styles.menuIconBar} ${isMobileMenuOpen ? styles.open : ''}`}
            />
            <span
              className={`${styles.menuIconBar} ${isMobileMenuOpen ? styles.open : ''}`}
            />
            <span
              className={`${styles.menuIconBar} ${isMobileMenuOpen ? styles.open : ''}`}
            />
          </div>
        </button>
        {isMobileMenuOpen && (
          <>
            <div
              className={styles.mobileBackdrop}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className={styles.mobileDropdown}>
              {navKeys.map(item => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    locale={locale}
                    className={`${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Regular navigation for larger screens */}
      <nav
        className={`${styles.nav} ${hasOverflow ? styles.hasScroll : ''}`}
        aria-label="Project sections navigation"
      >
        <ul className={styles.navList} ref={navRef}>
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
    </>
  );
};

ProjectNav.propTypes = {
  currentPath: PropTypes.string.isRequired,
};

export default ProjectNav;
