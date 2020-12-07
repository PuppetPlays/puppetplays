import { Fragment, useState } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { getTitle, getFirstItemProp, getFirstItemTitle } from 'lib/utils';
import WorkHeader from './WorkHeader';
import Keywords from './Keywords';
import WorkInfo from './WorkInfo';
import CommaSepList from './CommaSepList';
import styles from './workInList.module.scss';

function Info({ label, info, infoExist = true }) {
  if (!info || !infoExist) {
    return null;
  }
  return (
    <div className={styles.info}>
      <span>{label}</span> {info}
    </div>
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
      <div className={styles.media}>
        <p>
          <CommaSepList list={formats} listTransform={getTitle} />
        </p>
        <p>{t('common:pageCount', { count: pageCount })}</p>
      </div>
      <div className={styles.body}>
        <WorkHeader
          title={
            <Link href={`/oeuvres/${id}/${slug}`}>
              <a>{title}</a>
            </Link>
          }
          authors={authors}
          writingDisplayDate={writingDisplayDate}
          writingPlace={writingPlace}
          translatedTitle={translatedTitle}
          mainLanguage={mainLanguage}
          t={t}
        />

        <section>
          <Keywords keywords={keywords} />
        </section>

        {isExpanded && (
          <section>
            <WorkInfo label={t('common:abstract')} info={abstract} />
            <WorkInfo
              label={t('common:otherTitles')}
              info={<CommaSepList list={hypotexts} listTransform={getTitle} />}
              infoExist={hypotexts.length > 0}
            />
            <WorkInfo
              label={t('common:firstPerformance')}
              info={firstPerformance}
            />
            <WorkInfo
              label={t('common:firstPublication')}
              info={firstPublication}
            />
            <WorkInfo
              label={t('common:modernEditions')}
              info={modernEditions}
            />
            <WorkInfo label={t('common:translations')} info={translations} />
          </section>
        )}
      </div>
      <section className={styles.extra}>
        <WorkInfo
          label={t('common:register')}
          info={getFirstItemTitle(register)}
        />
        <WorkInfo
          label={t('common:handlingTechniques')}
          info={
            <CommaSepList list={handlingTechniques} listTransform={getTitle} />
          }
          infoExist={handlingTechniques.length > 0}
        />
        <WorkInfo
          label={t('common:audience')}
          info={getFirstItemTitle(audience)}
        />
        {isExpanded && (
          <Fragment>
            <WorkInfo
              label={t('common:characters')}
              info={<CommaSepList list={characters} listTransform={getTitle} />}
              infoExist={characters.length > 0}
            />
            <WorkInfo label={t('common:actsCount')} info={actsCount} />
            <WorkInfo label={t('common:license')} info={license} />
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
