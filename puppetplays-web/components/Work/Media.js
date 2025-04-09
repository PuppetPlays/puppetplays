import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { getTitle, hasAtLeastOneItem } from 'lib/utils';
import CommaSepList from 'components/CommaSepList';
import ZoomableImage from 'components/ZoomableImage';
import styles from './media.module.scss';

/* eslint-disable jsx-a11y/media-has-caption */
const Media = ({ kind = null, url = null, alt = null, description = null, copyright = null, languages = null }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {kind === 'image' && (
        <ZoomableImage>
          <img src={url} alt={alt} />
        </ZoomableImage>
      )}
      {kind === 'video' && <video controls src={url} />}
      {kind === 'audio' && <audio controls src={url} />}
      {(hasAtLeastOneItem(languages) || description || copyright) && (
        <div className={styles.infos}>
          {(kind === 'video' || kind === 'audio') &&
            hasAtLeastOneItem(languages) && (
              <div className={styles.languages}>
                {t('common:languageWithColon', { count: languages.length })}{' '}
                <CommaSepList list={languages} listTransform={getTitle} />
              </div>
            )}
          {description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {copyright && <div className={styles.copyright}>© {copyright}</div>}
        </div>
      )}
    </div>
  );
};


Media.propTypes = {
  kind: PropTypes.oneOf(['photo', 'illustration', 'video', 'audio']).isRequired,
  url: PropTypes.string.isRequired,
  alt: PropTypes.string,
  description: PropTypes.string,
  copyright: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.object),
};

export default Media;
