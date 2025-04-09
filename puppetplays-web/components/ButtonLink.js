import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import styles from './buttonLink.module.scss';

const ButtonLink = React.forwardRef(
  ({ children, href, icon = null, inverse = false }, ref) => {
    return (
      <Link href={href} ref={ref} className={styles.link} data-inverse={inverse}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{children}</span>
      </Link>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';

ButtonLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.node,
  inverse: PropTypes.bool,
};

export default ButtonLink;
