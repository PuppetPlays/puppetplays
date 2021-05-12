import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { hasAtLeastOneItem } from 'lib/utils';
import Figure from 'components/Figure';
import Hypotext from 'components/Hypotext';
import { PageIntertitle } from 'components/Primitives';
import styles from 'components/Author/authorNote.module.scss';

function AnimationTechniqueNote({ description, mainImage, works }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <div>
        {description && (
          <div
            className={styles.biographicalNote}
            dangerouslySetInnerHTML={{
              __html: description,
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
    </Fragment>
  );
}

AnimationTechniqueNote.defaultProps = {
  description: null,
  mainImage: null,
  works: null,
};

AnimationTechniqueNote.propTypes = {
  description: PropTypes.string,
  mainImage: PropTypes.arrayOf(PropTypes.object),
  works: PropTypes.arrayOf(PropTypes.object),
};

export default AnimationTechniqueNote;
