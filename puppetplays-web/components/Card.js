import PropTypes from 'prop-types';
import Link from 'next/link';
import classNames from 'classnames/bind';
import { hasAtLeastOneItem } from 'lib/utils';
import styles from './card.module.scss';

function Card({ href, title, subtitle, mainImage, fixedHeight }) {
  const cx = classNames.bind(styles);

  return (
    <Link href={href}>
      <a
        className={cx({
          container: true,
          fixedHeight: fixedHeight || hasAtLeastOneItem(mainImage),
        })}
      >
        {hasAtLeastOneItem(mainImage) && (
          <div className={styles.image}>
            <img src={mainImage[0].url} alt="" />
          </div>
        )}
        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </a>
    </Link>
  );
}

Card.defaultProps = {
  fixedHeight: false,
  mainImage: null,
  subtitle: null,
};

Card.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  fixedHeight: PropTypes.bool,
  subtitle: PropTypes.node,
  mainImage: PropTypes.array,
};

export default Card;
