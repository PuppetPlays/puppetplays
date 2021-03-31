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

export default CoverImage;
