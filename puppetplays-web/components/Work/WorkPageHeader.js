import Author from 'components/Author';
import Button from 'components/Button';
import ButtonLink from 'components/ButtonLink';
import CommaSepList from 'components/CommaSepList';
import Company from 'components/Company';
import Place from 'components/Place';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { Fragment, useCallback } from 'react';

import styles from './workPageHeader.module.scss';

const NoteIcon = () => {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.4 8.6v-.7l.9-.2a15.1 15.1 0 013.5-.5l.5.3-2 8h1.5v.7l-.7.3a6.9 6.9 0 01-1.7.4l-.9.1c-.6 0-1 0-1.2-.3-.2-.1-.3-.3-.3-.6v-.7l.2-.8 1.6-5.8-1.4-.2zm1.9-4.3c0-.4.2-.7.5-1 .4-.2.8-.3 1.3-.3.6 0 1 .1 1.4.4.3.2.5.5.5 1 0 .3-.2.7-.5.9-.4.2-.8.4-1.4.4-.5 0-1-.2-1.3-.4-.3-.2-.5-.6-.5-1z" />
    </svg>
  );
};

const MediaIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.6 3.6A2 2 0 0 1 4 3h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5c0-.5.2-1 .6-1.4ZM14 10 8 6.5v7l6-3.5Z"
      />
    </svg>
  );
};

const OriginalWorkIcon = () => {
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7372 16H19V5H18.5V4.13559C18.5 3.88482 18.3142 3.67284 18.0656 3.63992C17.7138 3.59654 17.3604 3.56639 17.0067 3.54391C16.3686 3.50335 15.4971 3.476 14.5706 3.53052C13.6478 3.58483 12.6489 3.72148 11.7653 4.0193C11.1067 4.24128 10.4784 4.56437 10 5.03877C9.52161 4.56437 8.89327 4.24128 8.2347 4.0193C7.35109 3.72148 6.35216 3.58483 5.42937 3.53052C4.50292 3.476 3.63144 3.50335 2.99328 3.54391C2.64168 3.56626 2.2904 3.59619 1.94067 3.6391C1.69475 3.67102 1.5 3.88602 1.5 4.13559V5H1V16H9.26279C9.39488 16.1057 9.5191 16.2192 9.6343 16.341L9.81533 16.4646C9.93645 16.5128 10.0684 16.5108 10.1847 16.4646C10.2539 16.4371 10.3145 16.3952 10.3636 16.3432L10.3657 16.341C10.4809 16.2192 10.6051 16.1057 10.7372 16ZM2.5 4.58497V13.7445C2.61208 13.734 2.73848 13.7234 2.87728 13.7136C3.45524 13.6728 4.25326 13.6454 5.1311 13.7001C6.51877 13.7866 8.19825 14.0831 9.49886 14.9374L9.5 14.9375V5.98432C9.17403 5.54281 8.62832 5.20725 7.9153 4.96692C7.14891 4.70861 6.24784 4.58042 5.37063 4.5288C4.49708 4.47739 3.66856 4.50301 3.05672 4.54189C2.84085 4.55561 2.65272 4.57094 2.5 4.58497ZM10.5011 14.9374L10.5 14.9375V5.98432C10.826 5.54281 11.3717 5.20725 12.0847 4.96692C12.8511 4.70861 13.7522 4.58042 14.6294 4.5288C15.5029 4.47739 16.3314 4.50301 16.9433 4.54189C17.1591 4.55561 17.3473 4.57094 17.5 4.58497V13.7445C17.3879 13.734 17.2615 13.7234 17.1227 13.7136C16.5448 13.6728 15.7467 13.6454 14.8689 13.7001C13.4812 13.7866 11.8018 14.0831 10.5011 14.9374Z"
      />
    </svg>
  );
};

const WorkPageHeader = ({
  id = null,
  slug = null,
  title = null,
  authors = [],
  compositionPlace = [],
  hasMedia = false,
  hasDocument = false,
  onOpenDocument = null,
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
      <div className={styles.content} data-testid="work-page-header-content">
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
      {(hasMedia || hasDocument) && (
        <div className={styles.nav}>
          <ButtonLink
            icon={<NoteIcon />}
            href={`/oeuvres/${id}/${slug}`}
            inverse={router.asPath !== `/oeuvres/${id}/${slug}`}
          >
            {t('common:presentation')}
          </ButtonLink>
          {hasMedia && (
            <ButtonLink
              icon={<MediaIcon fillRule="evenodd" />}
              href={`/oeuvres/${id}/${slug}/medias`}
              inverse={router.asPath !== `/oeuvres/${id}/${slug}/medias`}
            >
              {t('common:medias')}
            </ButtonLink>
          )}
          {hasDocument && (
            <Button
              icon={<OriginalWorkIcon fillRule="evenodd" />}
              onClick={onOpenDocument}
              inverse={false}
            >
              {t('common:document')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

WorkPageHeader.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(PropTypes.object),
  compositionPlace: PropTypes.arrayOf(PropTypes.object),
  hasMedia: PropTypes.bool,
  hasDocument: PropTypes.bool,
  isDocumentOpen: PropTypes.bool,
  onOpenDocument: PropTypes.func.isRequired,
};

export default WorkPageHeader;
