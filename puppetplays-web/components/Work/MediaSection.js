import PropTypes from 'prop-types';
import { cond, constant, stubTrue } from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import Media from './Media';
import PhotoIcon from './icons/icon-photo.svg';
import VideoIcon from './icons/icon-video.svg';
import AudioIcon from './icons/icon-sound.svg';
import styles from './mediaSection.module.scss';

const isOfKind = (kind) => (value) => kind === value;

export const getMediaKindIcon = cond([
  [isOfKind('image'), constant(<PhotoIcon />)],
  [isOfKind('video'), constant(<VideoIcon />)],
  [isOfKind('audio'), constant(<AudioIcon />)],
  [stubTrue, constant(null)],
]);

const MediaSection = ({ kind, medias, showTitle }) => {
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
        {medias.map(({ id, ...media }) => (
          <Media key={id} {...media} kind={kind} />
        ))}
      </div>
    </div>
  );
};

MediaSection.defaultProps = {
  showTitle: false,
};

MediaSection.propTypes = {
  kind: PropTypes.oneOf(['photo', 'illustration', 'video', 'audio']).isRequired,
  medias: PropTypes.arrayOf(PropTypes.object).isRequired,
  showTitle: PropTypes.bool,
};

export default MediaSection;
