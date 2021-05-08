import PropTypes from 'prop-types';
import { hasAtLeastOneItem } from 'lib/utils';
import styles from './coverImage.module.scss';

function CoverImage({ image, year, height }) {
  const { url, alt, copyright } = hasAtLeastOneItem(image) ? image[0] : {};

  return (
    <div className={styles.container}>
      {hasAtLeastOneItem(image) && (
        <img src={url} alt={alt} title={copyright} height={height} />
      )}
      {!hasAtLeastOneItem(image) && (!year || year <= 1824) && (
        <img src="/work-script-thumbnail.svg" alt="" height={height} />
      )}
      {!hasAtLeastOneItem(image) && year > 1824 && (
        <img src="/work-thumbnail.svg" alt="" height={height} />
      )}
    </div>
  );
}

CoverImage.defaultProps = {
  image: null,
  year: null,
  height: null,
};

CoverImage.propTypes = {
  image: PropTypes.arrayOf(PropTypes.object),
  year: PropTypes.number,
  height: PropTypes.number,
};

export default CoverImage;
