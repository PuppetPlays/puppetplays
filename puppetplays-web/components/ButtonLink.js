import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './buttonLink.module.scss';

function ButtonLink({ children, href }) {
  return (
    <Link href={href}>
      <a className={styles.link}>{children}</a>
    </Link>
  );
}

ButtonLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default ButtonLink;
