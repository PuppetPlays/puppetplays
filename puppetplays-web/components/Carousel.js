import PropTypes from 'prop-types';
import { hasAtLeastOneItem } from 'lib/utils';
import styles from './carousel.module.scss';

function Carousel({ images }) {
  if (!hasAtLeastOneItem(images)) {
    return null;
  }

  return (
    <div className={styles.container}>
      {images.map((image, index) => (
        <div
          key={`${image.id}-${index}`}
          className={styles.image}
          style={{ width: image.width }}
        >
          <img
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
          />
          {image.description && (
            <p className={styles.caption}>
              {image.description}
              {image.copyright && (
                <span className={styles.copyright}> – {image.copyright}</span>
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

Carousel.defaultProps = {
  images: null,
};

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default Carousel;
