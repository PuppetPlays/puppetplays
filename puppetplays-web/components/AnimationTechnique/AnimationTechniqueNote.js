import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Hypotext from 'components/Hypotext';
import { PageIntertitle } from 'components/Primitives';
import Reel from 'components/Reel';
import HtmlContent from 'components/HtmlContent';
import ZoomableImage from 'components/ZoomableImage';
import NoResults from 'components/NoResults';
import styles from 'components/Author/authorNote.module.scss';

function AnimationTechniqueNote({
  description,
  mainImage,
  images,
  works,
  bleedCarousel,
  onCloseModal,
}) {
  const { t } = useTranslation();

  const handleClickOnLink = () => {
    if (onCloseModal) {
      onCloseModal();
    }
  };

  return (
    <Fragment>
      <div>
        {description && (
          <div className={styles.biographicalNote}>
            <HtmlContent html={description} />
          </div>
        )}
        {images.length === 0 && hasAtLeastOneItem(mainImage) && (
          <div className={styles.image} style={{ textAlign: 'center' }}>
            <ZoomableImage>
              <img
                src={mainImage[0].url}
                alt={mainImage[0].alt}
                width={mainImage[0].width}
              />
            </ZoomableImage>
            {(mainImage[0].description || mainImage[0].copyright) && (
              <div className={styles.caption}>
                {mainImage[0].description && (
                  <div
                    className={styles.captionDescription}
                    dangerouslySetInnerHTML={{
                      __html: mainImage[0].description,
                    }}
                  />
                )}
                {mainImage[0].copyright && (
                  <div className={styles.captionCopyright}>
                    © {mainImage[0].copyright}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {images.length > 0 && (
          <Reel images={mainImage.concat(images)} bleed={bleedCarousel} />
        )}
      </div>

      {works && Array.isArray(works) && (
        <div className={styles.works}>
          <PageIntertitle>{t('common:works')}</PageIntertitle>
          {works.length > 0 ? (
            <ul>
              {works &&
                Array.isArray(works) &&
                works.map(entry => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                  <li key={entry.id} onClick={handleClickOnLink}>
                    <Hypotext {...entry} />
                  </li>
                ))}
            </ul>
          ) : (
            <NoResults
              icon="info"
              title={t('common:error.dataNotFound')}
              message={t('common:noWorksForTechnique', {
                fallback: t('common:error.noResultsFound'),
              })}
              customStyles={{ margin: '20px auto', padding: '20px' }}
            />
          )}
        </div>
      )}
    </Fragment>
  );
}

AnimationTechniqueNote.defaultProps = {
  description: null,
  mainImage: [],
  images: [],
  works: null,
  bleedCarousel: false,
  onCloseModal: null,
};

AnimationTechniqueNote.propTypes = {
  description: PropTypes.string,
  mainImage: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.arrayOf(PropTypes.object),
  works: PropTypes.arrayOf(PropTypes.object),
  bleedCarousel: PropTypes.bool,
  onCloseModal: PropTypes.func,
};

export default AnimationTechniqueNote;
