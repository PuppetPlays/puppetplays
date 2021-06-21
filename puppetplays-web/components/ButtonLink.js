import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './buttonLink.module.scss';

const ButtonLink = React.forwardRef(({ children, href }, ref) => {
  return (
    <Link href={href}>
      <a ref={ref} className={styles.link}>
        {children}
      </a>
    </Link>
  );
});

ButtonLink.displayName = 'ButtonLink';

ButtonLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default ButtonLink;
