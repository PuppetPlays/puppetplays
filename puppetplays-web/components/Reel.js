import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ZoomableImage from 'components/ZoomableImage';
import styles from './reel.module.scss';

let debounced;

const Reel = ({ images, bleed }) => {
  const cx = classNames.bind(styles);
  const scrollableRef = useRef();
  const listRef = useRef();
  const [isNavButtonsHidden, setIsNavButtonsHidden] = useState(true);
  const [scrollAmount, setScrollAmount] = useState(0);
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(true);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

  useEffect(() => {
    if (listRef.current) {
      setScrollAmount(listRef.current.offsetWidth / 2);
    }
  }, [listRef]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      scrollableRef.current &&
      listRef.current
    ) {
      setIsNavButtonsHidden(
        listRef.current.scrollWidth <= scrollableRef.current.offsetWidth,
      );
    }
  }, [setIsNavButtonsHidden]);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.addEventListener('scroll', () => {
        window.clearTimeout(debounced);
        debounced = setTimeout(disableEnableNavButtons, 200);
      });
    }

    disableEnableNavButtons();

    return function cleanup() {
      window.clearTimeout(debounced);
    };
  }, []);

  useEffect(() => {
    if (
      'IntersectionObserver' in window &&
      scrollableRef.current &&
      listRef.current
    ) {
      const callback = function (items) {
        Array.prototype.forEach.call(items, item => {
          if (item.intersectionRatio > 0.5) {
            item.target.removeAttribute('inert');
          } else {
            item.target.setAttribute('inert', 'inert');
          }
        });
      };

      const observer = new IntersectionObserver(callback, {
        root: scrollableRef.current,
        threshold: 0.5,
      });

      Array.prototype.forEach.call(listRef.current.children, item => {
        observer.observe(item);
      });
    }
  }, [scrollableRef, listRef]);

  const disableEnableNavButtons = () => {
    if (scrollableRef.current) {
      setPrevButtonDisabled(scrollableRef.current.scrollLeft < 1);
    }

    if (scrollableRef.current && listRef.current) {
      setNextButtonDisabled(
        scrollableRef.current.scrollLeft ===
          listRef.current.scrollWidth - listRef.current.offsetWidth,
      );
    }
  };

  const handleBackwardNav = () => {
    scrollableRef.current.scrollLeft -= scrollAmount;
  };

  const handleForwardNav = () => {
    scrollableRef.current.scrollLeft += scrollAmount;
  };

  return (
    <div className={cx({ container: true, isBleeding: bleed })} role="group">
      <div className={styles.navButtons} hidden={isNavButtonsHidden}>
        <button
          className={styles.navButtonPrev}
          type="button"
          onClick={handleBackwardNav}
          disabled={prevButtonDisabled}
        >
          ‹
        </button>
        <button
          className={styles.navButtonNext}
          type="button"
          onClick={handleForwardNav}
          disabled={nextButtonDisabled}
        >
          ›
        </button>
      </div>
      <div className={styles.scrollable} ref={scrollableRef}>
        <ul className={styles.list} ref={listRef}>
          {images &&
            Array.isArray(images) &&
            images.map((image, index) => (
              <li
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
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

Reel.defaultProps = {
  images: null,
  bleed: false,
};

Reel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
  bleed: PropTypes.bool,
};

export default Reel;
