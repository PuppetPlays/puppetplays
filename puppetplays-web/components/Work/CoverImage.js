import PropTypes from 'prop-types';
import { hasAtLeastOneItem } from 'lib/utils';
import Tooltip from 'components/Tooltip';
import styles from './coverImage.module.scss';

function CoverImage({ image = [], year = null, hasPlaceholder = true }) {
  const { url, alt, description, copyright } = hasAtLeastOneItem(image)
    ? image[0]
    : {};

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
          <img
            src="/work-script-thumbnail.svg"
            alt=""
            width="100"
            height="134"
          />
        )}
      {hasPlaceholder && !hasAtLeastOneItem(image) && year > 1824 && (
        <img src="/work-thumbnail.svg" alt="" width="100" height="134" />
      )}
    </div>
  );
}


CoverImage.propTypes = {
  image: PropTypes.arrayOf(PropTypes.object),
  year: PropTypes.number,
  hasPlaceholder: PropTypes.bool,
};

export default CoverImage;
