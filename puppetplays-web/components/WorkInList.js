import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import styles from './worksInList.module.scss';
import { Fragment, useState } from 'react';

function Author({ firstName, lastName, nickname, t }) {
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
            {authors.map((author, index) => (
              <Fragment>
                <Author {...author} t={t} />
                {index < authors.length - 1 && ', '}
              </Fragment>
            ))}
            , {writingDisplayDate} - {writingPlace[0].title},{' '}
            {writingPlace[0].country[0].title} - {t('common:language')}{' '}
            {mainLanguage[0].title}
          </h2>
          {translatedTitle && <h3>{translatedTitle}</h3>}
        </header>

        <section>
          <ul className={styles.keywords}>
            {keywords.map((keyword) => (
              <li key={keyword.title} className={styles.keyword}>
                {keyword.title}
              </li>
            ))}
          </ul>
        </section>

        {isExpanded && (
          <section>
            <div className={styles.info}>
              <span>{t('common:abstract')}</span> {abstract}
            </div>
            <div className={styles.info}>
              <span>{t('common:otherTitles')}</span>{' '}
              {hypotexts.map((h) => h.title).join(', ')}
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
          <span>{t('common:register')}</span> {register[0].title}
        </div>
        <div className={styles.info}>
          <span>{t('common:handlingTechniques')}</span>{' '}
          {handlingTechniques.map((t) => t.title).join(', ')}
        </div>
        <div className={styles.info}>
          <span>{t('common:audience')}</span> {audience[0].title}
        </div>
        {isExpanded && (
          <Fragment>
            <div className={styles.info}>
              <span>{t('common:characters')}</span>{' '}
              {characters.map((t) => t.title).join(', ')}
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
