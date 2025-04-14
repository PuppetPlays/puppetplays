import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

import styles from './section.module.scss';

const Section = ({
  title = null,
  subtitle = null,
  children = null,
  footer = null,
  isComingSoon = false,
}) => {
  const { t } = useTranslation();

  return (
    <section
      className={`${styles.container} ${
        isComingSoon ? styles.isComingSoon : null
      }`}
      data-coming-soon={isComingSoon}
    >
      {title && (
        <header className={styles.header}>
          {subtitle && (
            <Fragment>
              <h1 className={styles.subtitle}>{subtitle}</h1>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>{title}</h2>
                {isComingSoon && (
                  <span className={styles.comingSoonBadge}>
                    {t('common:comingSoon')}
                  </span>
                )}
              </div>
            </Fragment>
          )}
          {!subtitle && (
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>{title}</h1>
              {isComingSoon && (
                <span className={styles.comingSoonBadge}>
                  {t('common:comingSoon')}
                </span>
              )}
            </div>
          )}
        </header>
      )}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </section>
  );
};

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  isComingSoon: PropTypes.bool,
};

export default Section;
