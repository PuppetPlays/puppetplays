import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './buttonLink.module.scss';

const ButtonLink = React.forwardRef(
  ({ children, href, icon, inverse }, ref) => {
    return (
      <Link href={href}>
        <a ref={ref} className={styles.link} data-inverse={inverse}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.label}>{children}</span>
        </a>
      </Link>
    );
  },
);

ButtonLink.displayName = 'ButtonLink';

ButtonLink.defaultProps = {
  icon: null,
  inverse: false,
};

ButtonLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  icon: PropTypes.node,
  inverse: PropTypes.bool,
};

export default ButtonLink;
