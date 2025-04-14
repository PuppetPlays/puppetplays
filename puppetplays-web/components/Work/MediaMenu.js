import { getMediaKindIcon } from 'components/Work/MediaSection';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

import styles from './mediaMenu.module.scss';

const MediaMenu = ({ sections, activeAnchor = null }) => {
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
            <Link href={`#media-${section}`}>
              <span className={styles.icon}>{getMediaKindIcon(section)}</span>
              <span>{t(`common:mediaKinds.${section}`)}</span>
            </Link>
          </li>
        ))}
    </ul>
  );
};

MediaMenu.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeAnchor: PropTypes.string,
};

export default MediaMenu;
