import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import styles from './worksInList.module.scss';
import { Fragment, useState } from 'react';

function WorkInList({
  id,
  title,
  author,
  authorNickName,
  writingDate,
  writingPlace,
  language,
  keywords,
  summary,
  otherTitles,
  firstRepresentations,
  publication,
  otherPublication,
  register,
  manipulationTechnic,
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
            <Link href={`/oeuvres/${id}`}>
              <a>{title}</a>
            </Link>
          </h1>
          <h2>
            {author} ({t('common:alias')} {authorNickName}), {writingDate} -{' '}
            {writingPlace} - {t('common:language')} {language}
          </h2>
        </header>

        <section>
          <ul className={styles.keywords}>
            {keywords.map((keyword) => (
              <li className={styles.keyword}>{keyword}</li>
            ))}
          </ul>
        </section>

        {isExpanded && (
          <Fragment>
            <div>
              <span>{t('common:summary')}</span> {summary}
            </div>
            <div>
              <span>{t('common:otherTitles')}</span> {otherTitles}
            </div>
            <div>
              <span>{t('common:firstRepresentations')}</span>{' '}
              {firstRepresentations}
            </div>
            <div>
              <span>{t('common:publication')}</span> {publication}
            </div>
            <div>
              <span>{t('common:otherPublication')}</span> {otherPublication}
            </div>
          </Fragment>
        )}
      </div>
      <section className={styles.extra}>
        <div>
          <span>{t('common:register')}</span> {register}
        </div>
        <div>
          <span>{t('common:manipulationTechnic')}</span> {manipulationTechnic}
        </div>
        <div>
          <span>{t('common:audience')}</span> {audience}
        </div>
        {isExpanded && (
          <Fragment>
            <div>
              <span>{t('common:characters')}</span> {characters.join(', ')}
            </div>
            <div>
              <span>{t('common:actsCount')}</span> {actsCount}
            </div>
            <div>
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
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </article>
  );
}

export default WorkInList;
