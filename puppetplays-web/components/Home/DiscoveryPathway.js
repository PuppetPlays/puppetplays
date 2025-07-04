import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import styles from './discoveryPathway.module.scss';

const DiscoveryPathwayItem = ({ resource, type, index, isActive, onHover }) => {
  const { t } = useTranslation();

  const handleMouseEnter = useCallback(() => {
    onHover(index);
  }, [index, onHover]);

  const getResourceUrl = () => {
    switch (type) {
      case 'person':
        return `/auteurs/${resource.id}/${resource.slug}`;
      case 'work':
        return `/oeuvres/${resource.id}/${resource.slug}`;
      case 'animationTechnique':
        return `/techniques-d-animation/${resource.id}/${resource.slug}`;
      case 'video':
        return `/projet/videos/${encodeURIComponent(resource.id)}`;
      default:
        return '#';
    }
  };

  const getResourceTitle = () => {
    if (type === 'person') {
      return (
        resource.usualName ||
        `${resource.firstName || ''} ${resource.lastName || ''}`.trim() ||
        resource.title
      );
    }
    return resource.title;
  };

  const getResourceImage = () => {
    // CraftCMS images are returned as arrays, need to access first element
    if (
      resource.mainImage &&
      Array.isArray(resource.mainImage) &&
      resource.mainImage.length > 0
    ) {
      return resource.mainImage[0].url;
    }

    // For videos from Nakala, thumbnail might be an object with url property
    if (type === 'video' && resource.thumbnail) {
      if (resource.thumbnail.url) {
        return resource.thumbnail.url;
      }
      // If thumbnail is an array (like CraftCMS)
      if (Array.isArray(resource.thumbnail) && resource.thumbnail.length > 0) {
        return resource.thumbnail[0].url;
      }
    }

    // Fallback images based on type
    switch (type) {
      case 'person':
        return '/default-person.jpg';
      case 'work':
        return '/default-work.jpg';
      case 'animationTechnique':
        return '/default-technique.jpg';
      case 'video':
        return '/default-video.jpg';
      default:
        return '/default-placeholder.jpg';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'person':
        return t('common:author');
      case 'work':
        return t('common:work');
      case 'animationTechnique':
        return t('common:animationTechnique');
      case 'video':
        return t('common:video');
      default:
        return '';
    }
  };

  const getResourceSubtitle = () => {
    switch (type) {
      case 'person': {
        const birthYear = resource.birthDate
          ? new Date(resource.birthDate).getFullYear()
          : null;
        const deathYear = resource.deathDate
          ? new Date(resource.deathDate).getFullYear()
          : null;
        if (birthYear || deathYear) {
          return `${birthYear || '?'} — ${deathYear || '?'}`;
        }
        return null;
      }
      case 'work': {
        let subtitle = '';
        if (resource.authors && resource.authors.length > 0) {
          const author = resource.authors[0];
          const authorName =
            author.usualName ||
            `${author.firstName || ''} ${author.lastName || ''}`.trim() ||
            author.title;
          subtitle = authorName;
        }
        if (resource.mostRelevantDate) {
          subtitle += subtitle
            ? `, ${resource.mostRelevantDate}`
            : resource.mostRelevantDate;
        }
        return subtitle || null;
      }
      case 'animationTechnique':
        return null; // No subtitle for animation techniques
      case 'video':
        return null; // No subtitle for videos, only title
      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.pathwayItem} ${isActive ? styles.active : ''}`}
      onMouseEnter={handleMouseEnter}
    >
      <Link href={getResourceUrl()} className={styles.pathwayLink}>
        <div
          className={styles.pathwayContainer}
          style={{
            backgroundImage: `url(${getResourceImage()})`,
          }}
        >
          <div className={styles.pathwayOverlay}>
            <div className={styles.pathwayTypeLabel}>{getTypeLabel()}</div>
          </div>
          <div className={styles.pathwayContent}>
            <h3 className={styles.pathwayTitle}>{getResourceTitle()}</h3>
            {getResourceSubtitle() && (
              <p className={styles.pathwaySubtitle}>{getResourceSubtitle()}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

const DiscoveryPathway = ({ resources = [] }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Start with second item active

  const handleItemHover = useCallback(index => {
    setActiveIndex(index);
  }, []);

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className={styles.discoveryPathway}>
      <div className={styles.pathwayGrid}>
        {resources.map((resource, index) => (
          <DiscoveryPathwayItem
            key={`${resource.type}-${resource.data.id}`}
            resource={resource.data}
            type={resource.type}
            index={index}
            isActive={index === activeIndex}
            onHover={handleItemHover}
          />
        ))}
      </div>
    </div>
  );
};

DiscoveryPathwayItem.propTypes = {
  resource: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onHover: PropTypes.func.isRequired,
};

DiscoveryPathway.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      data: PropTypes.object.isRequired,
    }),
  ),
};

export default DiscoveryPathway;
