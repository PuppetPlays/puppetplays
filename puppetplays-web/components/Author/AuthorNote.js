import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { hasAtLeastOneItem } from 'lib/utils';
import Reel from 'components/Reel';
import Hypotext from 'components/Hypotext';
import Section from 'components/Section';
import Info from 'components/Info';
import HtmlContent from 'components/HtmlContent';
import { PageIntertitle } from 'components/Primitives';
import BirthDeathDates from 'components/BirthDeathDates';
import ZoomableImage from 'components/ZoomableImage';
import NoResults from 'components/NoResults';
import ArkId from 'components/Work/ArkId';
import styles from './authorNote.module.scss';

function AuthorNote({
  birthDate = null,
  deathDate = null,
  biographicalNote = null,
  mainImage = [],
  images = [],
  idrefId = null,
  viafId = null,
  arkId = null,
  isniId = null,
  works = [],
  bleedCarousel = false,
  onCloseModal = null,
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
        <div className={styles.dates}>
          <BirthDeathDates birthDate={birthDate} deathDate={deathDate} />
        </div>
        {biographicalNote && (
          <div className={styles.biographicalNote}>
            <HtmlContent html={biographicalNote} />
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
              message={t('common:noWorksForAuthor', {
                fallback: t('common:error.noResultsFound'),
              })}
              customStyles={{ margin: '20px auto', padding: '20px' }}
            />
          )}
        </div>
      )}

      <div className={styles.ids}>
        <Section
          title={t('common:ids')}
          show={!!idrefId || !!viafId || !!arkId || !!isniId}
        >
          <Info label="ARK" show={!!arkId}>
            <ArkId id={arkId} />
          </Info>
          <Info label="VIAF" show={!!viafId}>
            {viafId}
          </Info>
          <Info label="IDREF" show={!!idrefId}>
            {idrefId}
          </Info>
          <Info label="ISNI" show={!!isniId}>
            {isniId}
          </Info>
        </Section>
      </div>
    </Fragment>
  );
}

AuthorNote.propTypes = {
  birthDate: PropTypes.string,
  deathDate: PropTypes.string,
  biographicalNote: PropTypes.string,
  mainImage: PropTypes.arrayOf(PropTypes.object),
  images: PropTypes.arrayOf(PropTypes.object),
  idrefId: PropTypes.string,
  viafId: PropTypes.string,
  arkId: PropTypes.string,
  isniId: PropTypes.string,
  works: PropTypes.arrayOf(PropTypes.object),
  bleedCarousel: PropTypes.bool,
  onCloseModal: PropTypes.func,
};

export default AuthorNote;
