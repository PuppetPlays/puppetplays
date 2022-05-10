import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Hypotext from 'components/Hypotext';
import { PageIntertitle } from 'components/Primitives';
import Carousel from 'components/Carousel';
import HtmlContent from 'components/HtmlContent';
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
        <Carousel images={mainImage.concat(images)} bleed={bleedCarousel} />
      </div>

      {hasAtLeastOneItem(works) && (
        <div className={styles.works}>
          <PageIntertitle>{t('common:works')}</PageIntertitle>
          <ul>
            {works.map((entry) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <li key={entry.id} onClick={handleClickOnLink}>
                <Hypotext {...entry} />
              </li>
            ))}
          </ul>
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
