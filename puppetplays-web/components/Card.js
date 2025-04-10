import PropTypes from 'prop-types';
import Link from 'next/link';
import classNames from 'classnames/bind';
import { hasAtLeastOneItem } from 'lib/utils';
import styles from './card.module.scss';

function Card({ href = null, title = null, subtitle = null, mainImage = null, imageUrl = null, fixedHeight = false }) {
  const cx = classNames.bind(styles);

  // Handle different image sources (backward compatibility + new pattern)
  const hasImage = imageUrl || hasAtLeastOneItem(mainImage);
  const imageSource =
    imageUrl || (hasAtLeastOneItem(mainImage) ? mainImage[0].url : null);

  const cardContent = (
    <>
      {hasImage && imageSource && (
        <div className={styles.image}>
          <img src={imageSource} alt="" loading="lazy" />
        </div>
      )}
      <div className={styles.body}>
        {title && <div className={styles.title}>{title}</div>}
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
    </>
  );

  // If no href is provided or it's invalid, render a div instead of a link
  if (!href || href === '#') {
    return (
      <div
        className={cx({
          container: true,
          fixedHeight: fixedHeight || hasImage,
        })}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={cx({
        container: true,
        fixedHeight: fixedHeight || hasImage,
      })}
    >
      {cardContent}
    </Link>
  );
}

Card.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  mainImage: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
    }),
  ),
  imageUrl: PropTypes.string,
  fixedHeight: PropTypes.bool,
};

export default Card;
