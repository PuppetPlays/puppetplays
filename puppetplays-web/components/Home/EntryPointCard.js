import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './entryPointCard.module.scss';
import { useCallback, useRef } from 'react';

const EntryPointCard = ({ title, description, thumbnailUrl, to, href }) => {
  const linkRef = useRef(null);

  const handleClick = useCallback(() => {
    if (linkRef && linkRef.current) {
      linkRef.current.click();
    }
  }, [linkRef]);

  return (
    <li
      className={`${styles.container} ${
        !href && !to ? styles.isComingSoon : ''
      }`}
    >
      <div
        className={styles.media}
        onClick={to || href ? handleClick : undefined}
        role="presentation"
        style={!to && !href ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
      >
        <img src={thumbnailUrl} alt="" />
      </div>
      <h2>
        {to && (
          <Link href={to} ref={linkRef}>
            {title}
          </Link>
        )}
        {href && (
          <Link
            href={href}
            ref={linkRef}
            legacyBehavior
          >
            <Link
              rel="noopener noreferrer"
              target="_blank"
            >
              {title}
            </Link>
          </Link>
        )}
        {!href && !to && title}
      </h2>
      {description && <p>{description}</p>}
    </li>
  );
};

EntryPointCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  thumbnailUrl: PropTypes.string.isRequired,
  to: PropTypes.string,
  href: PropTypes.string,
};

EntryPointCard.defaultProps = {
  description: null,
  to: null,
  href: null,
};

export default EntryPointCard;
