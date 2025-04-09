import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { hasAtLeastOneItem } from 'lib/utils';
import ZoomableImage from 'components/ZoomableImage';
import styles from './carousel.module.scss';

function Carousel({ images = [], bleed = false }) {
  const innerRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const cx = classNames.bind(styles);

  const reduceImagesWidth = index => {
    return images.slice(0, index).reduce((acc, image) => {
      return (acc += image.width);
    }, 0);
  };
  const handleBackwardNav = () => {
    setCurrentImage(currentImage - 1);
    innerRef.current.scrollLeft = reduceImagesWidth(currentImage - 1);
  };
  const handleForwardNav = () => {
    setCurrentImage(currentImage + 1);
    innerRef.current.scrollLeft = reduceImagesWidth(currentImage + 1);
  };

  if (!hasAtLeastOneItem(images)) {
    return null;
  }

  return (
    <div className={cx({ container: true, isBleeding: bleed })}>
      <button
        type="button"
        className={styles.navButtonBackward}
        disabled={currentImage === 0}
        onClick={handleBackwardNav}
      >
        ‹
      </button>
      <button
        type="button"
        className={styles.navButtonForward}
        disabled={currentImage === images.length - 1}
        onClick={handleForwardNav}
      >
        ›
      </button>
      <div className={styles.inner} ref={innerRef}>
        {images &&
          Array.isArray(images) &&
          images.map((image, index) => (
            <div
              key={`${image.id}-${index}`}
              className={styles.image}
              style={{ width: image.width }}
            >
              <ZoomableImage>
                <img src={image.url} alt={image.alt} width={image.width} />
              </ZoomableImage>
              {(image.description || image.copyright) && (
                <div className={styles.caption}>
                  {image.description && (
                    <div
                      className={styles.captionDescription}
                      dangerouslySetInnerHTML={{ __html: image.description }}
                    />
                  )}
                  {image.copyright && (
                    <div className={styles.captionCopyright}>
                      © {image.copyright}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
  bleed: PropTypes.bool,
};

export default Carousel;
