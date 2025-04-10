import PropTypes from 'prop-types';
import { cond, constant, stubTrue } from 'lodash';
import { useTranslation } from 'next-i18next';
import Media from './Media';
import NoResults from 'components/NoResults';
import styles from './mediaSection.module.scss';

const PhotoIcon = () => {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.0014 9.00009C11.5498 9.00009 11.9944 8.55236 11.9944 8.00005C11.9944 7.44774 11.5498 7 11.0014 7C10.453 7 10.0085 7.44774 10.0085 8.00005C10.0085 8.55236 10.453 9.00009 11.0014 9.00009Z" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9987 13.0004V4H3V5.9995H3.00366V13.0004L13.9987 13.0004ZM13.0057 5.00005H3.99294V8.01916L5.50284 6.1943L9.82644 12.0004H13.0057V5.00005ZM3.99294 12.0004H8.58527L5.46184 7.80598L3.99294 9.58129V12.0004Z" />
    </svg>
  )
};

const VideoIcon = () => {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.98611 4C3.88921 4 3 4.89543 3 6V11C3 12.1046 3.88921 13 4.98611 13H12.0139C13.1108 13 14 12.1046 14 11V6C14 4.89543 13.1108 4 12.0139 4H4.98611ZM7.10413 10.5981L11.1647 8.49969L7.10413 6.40125V10.5981Z" />
    </svg>
  )
};

const AudioIcon = () => {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H7V11H4V6Z" />
      <path d="M8 5.7L13 4V13L8 11.3V5.7Z" />
    </svg>
  )
};

const isOfKind = kind => value => kind === value;

export const getMediaKindIcon = cond([
  [isOfKind('image'), constant(<PhotoIcon />)],
  [isOfKind('video'), constant(<VideoIcon />)],
  [isOfKind('audio'), constant(<AudioIcon />)],
  [stubTrue, constant(null)],
]);

const MediaSection = ({ kind = null, medias = [], showTitle = false }) => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.container}
      data-media-section={kind}
      id={`media-${kind}`}
    >
      {showTitle && (
        <h2 className={styles.title}>
          <span className={styles.titleIcon}>{getMediaKindIcon(kind)}</span>
          <span>{t(`common:mediaKinds.${kind}`)}</span>
        </h2>
      )}
      <div>
        {medias && Array.isArray(medias) && medias.length > 0 ? (
          medias.map(({ id, ...media }) => (
            <Media key={id} {...media} kind={kind} />
          ))
        ) : (
          <NoResults
            icon="info"
            title={t('common:error.dataNotFound')}
            message={t(
              `common:no${
                kind.charAt(0).toUpperCase() + kind.slice(1)
              }Available`,
              {
                fallback: t('common:error.noResultsFound'),
              },
            )}
            customStyles={{ margin: '20px auto', padding: '20px' }}
          />
        )}
      </div>
    </div>
  );
};


MediaSection.propTypes = {
  kind: PropTypes.oneOf(['photo', 'illustration', 'video', 'audio']).isRequired,
  medias: PropTypes.arrayOf(PropTypes.object).isRequired,
  showTitle: PropTypes.bool,
};

export default MediaSection;
