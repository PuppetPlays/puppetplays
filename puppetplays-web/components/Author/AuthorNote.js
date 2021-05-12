import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Figure from 'components/Figure';
import Hypotext from 'components/Hypotext';
import Section from 'components/Section';
import Info from 'components/Info';
import { PageIntertitle } from 'components/Primitives';
import styles from './authorNote.module.scss';

function AuthorNote({
  birthDate,
  deathDate,
  biographicalNote,
  mainImage,
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
          {birthDate} – {deathDate}
        </div>
        {biographicalNote && (
          <div
            className={styles.biographicalNote}
            dangerouslySetInnerHTML={{
              __html: biographicalNote,
            }}
          />
        )}
        {hasAtLeastOneItem(mainImage) && <Figure {...mainImage[0]} />}
      </div>

      {hasAtLeastOneItem(works) && (
        <div className={styles.works}>
          <PageIntertitle>{t('common:works')}</PageIntertitle>
          {works.map((entry) => (
            <div key={entry.id}>
              <Hypotext {...entry} />
            </div>
          ))}
        </div>
      )}

      <Section
        title={t('common:ids')}
        show={!!idrefId || !!viafId || !!arkId || !!isniId}
      >
        <Info label="ARK" show={!!arkId}>
          {arkId}
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
  mainImage: null,
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
  idrefId: PropTypes.string,
  viafId: PropTypes.string,
  arkId: PropTypes.string,
  isniId: PropTypes.string,
  works: PropTypes.arrayOf(PropTypes.object),
};

export default AuthorNote;
