import { Fragment, useState } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { getTitle, getFirstItemProp, getFirstItemTitle } from 'lib/utils';
import Keywords from './Keywords';
import CommaSepList from './CommaSepList';
import styles from './worksInList.module.scss';

function Author({ firstName, lastName, nickname }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <span>
        {firstName} {lastName}
      </span>
      {nickname && (
        <span>
          {' '}
          ({t('common:alias')} {nickname})
        </span>
      )}
    </Fragment>
  );
}

function WorkInList({
  id,
  slug,
  title,
  translatedTitle,
  keywords,
  authors,
  writingDisplayDate,
  writingPlace,
  mainLanguage,
  abstract,
  hypotexts,
  firstPerformance,
  firstPublication,
  modernEditions,
  translations,
  register,
  handlingTechniques,
  audience,
  characters,
  actsCount,
  pageCount,
  formats,
  license,
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className={`${styles.container} ${isExpanded ? 'is-expanded' : ''}`}
    >
      <div className={styles.body}>
        <header>
          <h1>
            <Link href={`/oeuvres/${id}/${slug}`}>
              <a>{title}</a>
            </Link>
          </h1>
          <h2>
            <CommaSepList list={authors} itemComponent={Author} />,{' '}
            {writingDisplayDate} - {getFirstItemTitle(writingPlace)},{' '}
            {getFirstItemTitle(getFirstItemProp('country')(writingPlace))} -{' '}
            {t('common:language')} {getFirstItemTitle(mainLanguage)}
          </h2>
          {translatedTitle && <h3>{translatedTitle}</h3>}
        </header>

        <section>
          <Keywords keywords={keywords} />
        </section>

        {isExpanded && (
          <section>
            <div className={styles.info}>
              <span>{t('common:abstract')}</span> {abstract}
            </div>
            <div className={styles.info}>
              <span>{t('common:otherTitles')}</span>{' '}
              <CommaSepList list={hypotexts} listTransform={getTitle} />
            </div>
            <div className={styles.info}>
              <span>{t('common:firstPerformance')}</span> {firstPerformance}
            </div>
            <div className={styles.info}>
              <span>{t('common:firstPublication')}</span> {firstPublication}
            </div>
            <div className={styles.info}>
              <span>{t('common:modernEditions')}</span> {modernEditions}
            </div>
            <div className={styles.info}>
              <span>{t('common:translations')}</span> {translations}
            </div>
          </section>
        )}
      </div>
      <section className={styles.extra}>
        <div className={styles.info}>
          <span>{t('common:register')}</span> {getFirstItemTitle(register)}
        </div>
        <div className={styles.info}>
          <span>{t('common:handlingTechniques')}</span>{' '}
          <CommaSepList list={handlingTechniques} listTransform={getTitle} />
        </div>
        <div className={styles.info}>
          <span>{t('common:audience')}</span> {getFirstItemTitle(audience)}
        </div>
        {isExpanded && (
          <Fragment>
            <div className={styles.info}>
              <span>{t('common:characters')}</span>{' '}
              <CommaSepList list={characters} listTransform={getTitle} />
            </div>
            <div className={styles.info}>
              <span>{t('common:actsCount')}</span> {actsCount}
            </div>
            <div className={styles.info}>
              <span>{t('common:license')}</span> {license}
            </div>
          </Fragment>
        )}
      </section>
      <button
        type="button"
        className={styles.expandButton}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <svg
          width="13"
          height="8"
          viewBox="0 0 13 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 7L6.5 1L1 7"
            stroke="#1F86FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </article>
  );
}

export default WorkInList;
