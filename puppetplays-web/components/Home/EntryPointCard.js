import Link from 'next/link';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import styles from './entryPointCard.module.scss';
import { useCallback, useRef } from 'react';

const EntryPointCard = ({ title, description, thumbnailUrl, to, href }) => {
  const linkRef = useRef(null);
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    if (linkRef) {
      linkRef.current.click();
    }
  }, [linkRef]);

  return (
    <li
      className={`${styles.container} ${
        !href && !to ? styles.isComingSoon : ''
      }`}
    >
      {!href && !to && (
        <div className={styles.comingSoonBadge}>{t('common:comingSoon')}</div>
      )}
      <div className={styles.media} onClick={handleClick} role="presentation">
        <img src={thumbnailUrl} alt="" />
      </div>
      <h2>
        {to && (
          <Link href={to}>
            <a ref={linkRef}>{title}</a>
          </Link>
        )}
        {href && (
          <a
            ref={linkRef}
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {title}
          </a>
        )}
        {!href && !to && title}
      </h2>
      <p>{description}</p>
    </li>
  );
};

EntryPointCard.defaultProps = {
  to: null,
  href: null,
};

EntryPointCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  thumbnailUrl: PropTypes.string.isRequired,
  to: PropTypes.string,
  href: PropTypes.string,
};

export default EntryPointCard;
