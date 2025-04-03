import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { getMediaKindIcon } from 'components/Work/MediaSection';
import styles from './mediaMenu.module.scss';

const MediaMenu = ({ sections, activeAnchor }) => {
  const { t } = useTranslation();

  if (sections.length < 2) {
    return null;
  }

  return (
    <ul className={styles.container}>
      {sections &&
        Array.isArray(sections) &&
        sections.map(section => (
          <li
            key={section}
            className={`${
              activeAnchor === `media-${section}` ? styles.isActive : ''
            }`}
          >
            <a href={`#media-${section}`}>
              <span className={styles.icon}>{getMediaKindIcon(section)}</span>
              <span>{t(`common:mediaKinds.${section}`)}</span>
            </a>
          </li>
        ))}
    </ul>
  );
};

MediaMenu.defaultProps = {
  activeAnchor: null,
};

MediaMenu.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeAnchor: PropTypes.string,
};

export default MediaMenu;
