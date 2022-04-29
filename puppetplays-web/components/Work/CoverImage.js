import PropTypes from 'prop-types';
import { hasAtLeastOneItem } from 'lib/utils';
import Tooltip from 'components/Tooltip';
import styles from './coverImage.module.scss';

function CoverImage({ image, year, hasPlaceholder }) {
  const {
    url,
    alt,
    description,
    copyright,
    width: w,
    height: h,
  } = hasAtLeastOneItem(image) ? image[0] : {};

  return (
    <div className={styles.container}>
      {hasAtLeastOneItem(image) && (
        <Tooltip
          content={
            (description || copyright) && (
              <div className={styles.caption}>
                {description && (
                  <div dangerouslySetInnerHTML={{ __html: description }} />
                )}
                {copyright && (
                  <div className={styles.captionCopyright}>© {copyright}</div>
                )}
              </div>
            )
          }
          placement="left"
        >
          <img src={url} alt={alt} />
        </Tooltip>
      )}
      {hasPlaceholder &&
        !hasAtLeastOneItem(image) &&
        (!year || year <= 1824) && (
          <img src="/work-script-thumbnail.svg" alt="" />
        )}
      {hasPlaceholder && !hasAtLeastOneItem(image) && year > 1824 && (
        <img src="/work-thumbnail.svg" alt="" />
      )}
    </div>
  );
}

CoverImage.defaultProps = {
  image: null,
  year: null,
  hasPlaceholder: true,
};

CoverImage.propTypes = {
  image: PropTypes.arrayOf(PropTypes.object),
  year: PropTypes.number,
  hasPlaceholder: PropTypes.bool,
};

export default CoverImage;
