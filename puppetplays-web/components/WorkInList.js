import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import styles from './worksInList.module.scss';
import { Fragment, useState } from 'react';

function WorkInList({
  id,
  slug,
  title,
  authors,
  writingDisplayDate,
  writingPlace,
  mainLanguage,
  keywords,
  abstract,
  otherTitles = '',
  firstPerformanceDisplayDate,
  publication = '',
  otherPublication = '',
  register,
  handlingTechniques,
  audience,
  characters,
  actsCount,
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
            {authors.map((a) => a.title).join(', ')}, {writingDisplayDate} -{' '}
            {writingPlace[0].title}, {writingPlace[0].country[0].title} -{' '}
            {t('common:language')} {mainLanguage[0].title}
          </h2>
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
              <span>{t('common:otherTitles')}</span> {otherTitles}
            </div>
            <div className={styles.info}>
              <span>{t('common:firstPerformance')}</span>{' '}
              {firstPerformanceDisplayDate}
            </div>
            <div className={styles.info}>
              <span>{t('common:publication')}</span> {publication}
            </div>
            <div className={styles.info}>
              <span>{t('common:otherPublication')}</span> {otherPublication}
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
