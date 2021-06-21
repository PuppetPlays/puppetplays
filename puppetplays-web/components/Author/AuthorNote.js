import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { formatBirthDeathDates, hasAtLeastOneItem } from 'lib/utils';
import Carousel from 'components/Carousel';
import Hypotext from 'components/Hypotext';
import Section from 'components/Section';
import Info from 'components/Info';
import { PageIntertitle } from 'components/Primitives';
import ArkId from 'components/Work/ArkId';
import styles from './authorNote.module.scss';

function AuthorNote({
  birthDate,
  deathDate,
  biographicalNote,
  mainImage,
  images,
  idrefId,
  viafId,
  arkId,
  isniId,
  works,
}) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div>
        <div className={styles.dates}>
          {formatBirthDeathDates(birthDate, deathDate)}
        </div>
        {biographicalNote && (
          <div
            className={styles.biographicalNote}
            dangerouslySetInnerHTML={{
              __html: biographicalNote,
            }}
          />
        )}
        <Carousel images={mainImage.concat(images)} />
      </div>

      {hasAtLeastOneItem(works) && (
        <div className={styles.works}>
          <PageIntertitle>{t('common:works')}</PageIntertitle>
          <ul>
            {works.map((entry) => (
              <li key={entry.id}>
                <Hypotext {...entry} />
              </li>
            ))}
          </ul>
        </div>
      )}

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
    </Fragment>
  );
}

AuthorNote.defaultProps = {
  birthDate: null,
  deathDate: null,
  biographicalNote: null,
  mainImage: [],
  images: [],
  idrefId: null,
  viafId: null,
  arkId: null,
  isniId: null,
  works: null,
};

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
};

export default AuthorNote;
