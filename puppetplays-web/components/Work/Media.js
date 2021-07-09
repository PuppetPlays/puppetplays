import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { getTitle } from 'lib/utils';
import CommaSepList from 'components/CommaSepList';
import styles from './media.module.scss';

/* eslint-disable jsx-a11y/media-has-caption */
const Media = ({ kind, url, alt, description, copyright, languages }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {(kind === 'photo' || kind === 'illustration') && (
        <img src={url} alt={alt} />
      )}
      {kind === 'video' && <video controls src={url} />}
      {kind === 'sound' && <audio controls src={url} />}
      {(languages || description || copyright) && (
        <div className={styles.infos}>
          {(kind === 'video' || kind === 'sound') && languages && (
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

Media.defaultProps = {
  alt: null,
  description: null,
  copyright: null,
  languages: null,
};

Media.propTypes = {
  kind: PropTypes.oneOf(['photo', 'illustration', 'video', 'sound']).isRequired,
  url: PropTypes.string.isRequired,
  alt: PropTypes.string,
  description: PropTypes.string,
  copyright: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.object),
};

export default Media;
