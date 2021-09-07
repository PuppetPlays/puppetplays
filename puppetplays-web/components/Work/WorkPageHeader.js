import { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import Author from 'components/Author';
import Company from 'components/Company';
import CommaSepList from 'components/CommaSepList';
import Place from 'components/Place';
import ButtonLink from 'components/ButtonLink';
import NoteIcon from './icons/icon-note.svg';
import MediaIcon from './icons/icon-media.svg';
import styles from './workPageHeader.module.scss';

const WorkPageHeader = ({
  id,
  slug,
  title,
  authors,
  compositionPlace,
  hasMedia,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className={styles.container}>
      <button
        onClick={handleGoBack}
        type="button"
        className={styles.backButton}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13 8L3 8" strokeWidth="1.5" />
          <path
            d="M8 3L3 8L8 13"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div data-testid="work-page-header-content">
        <span className={styles.title}>{title}</span>
        {authors && authors.length > 0 && (
          <Fragment>
            <span className="dash-separator"> - </span>
            <CommaSepList
              list={authors}
              itemComponents={{ persons: Author, companies: Company }}
            />
          </Fragment>
        )}
        {compositionPlace && compositionPlace.length > 0 && (
          <Fragment>
            <span className="dash-separator"> - </span>
            <Place {...compositionPlace[0]} />
          </Fragment>
        )}
      </div>
      {hasMedia && (
        <div className={styles.nav}>
          <ButtonLink
            icon={<NoteIcon />}
            href={`/oeuvres/${id}/${slug}`}
            inverse={router.asPath !== `/oeuvres/${id}/${slug}`}
          >
            {t('common:presentation')}
          </ButtonLink>
          <ButtonLink
            icon={<MediaIcon />}
            href={`/oeuvres/${id}/${slug}/medias`}
            inverse={router.asPath !== `/oeuvres/${id}/${slug}/medias`}
          >
            {t('common:medias')}
          </ButtonLink>
        </div>
      )}
    </div>
  );
};

WorkPageHeader.defaultProps = {
  authors: null,
  compositionPlace: null,
  hasMedia: false,
};

WorkPageHeader.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(PropTypes.object),
  compositionPlace: PropTypes.arrayOf(PropTypes.object),
  hasMedia: PropTypes.bool,
};

export default WorkPageHeader;
