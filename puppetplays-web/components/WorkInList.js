import { Fragment, useState } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { getTitle, getFirstItemTitle } from 'lib/utils';
import WorkHeader from './WorkHeader';
import Keywords from './Keywords';
import WorkSection from './WorkSection';
import WorkInfo from './WorkInfo';
import CommaSepList from './CommaSepList';
import styles from './workInList.module.scss';
import Place from './Place';

function WorkInList({
  id,
  slug,
  title,
  subtitle,
  translatedTitle,
  dramaturgicTechniques,
  keywords,
  authors,
  referenceDate,
  writingPlace,
  mainLanguage,
  notice,
  mainTheme,
  abstract,
  otherTitles,
  firstPerformancePlace,
  firstPerformanceDate,
  firstPerformanceExtraInfo,
  edition,
  modernEditions,
  onlineEdition,
  registers,
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
        {pageCount && <p>{t('common:pageCount', { count: pageCount })}</p>}
      </div>
      <div className={styles.body}>
        <WorkHeader
          title={
            <Link href={`/oeuvres/${id}/${slug}`}>
              <a>{title}</a>
            </Link>
          }
          subtitle={subtitle}
          authors={authors}
          referenceDate={referenceDate}
          writingPlace={writingPlace}
          translatedTitle={translatedTitle}
          mainLanguage={mainLanguage}
          t={t}
        />

        <section>
          <Keywords keywords={dramaturgicTechniques} fill />
          <Keywords keywords={keywords} />
        </section>

        {isExpanded && (
          <Fragment>
            <section>
              <WorkInfo label={t('common:notice')} info={notice} />
              <WorkInfo
                label={
                  <Fragment>
                    {t('common:abstract')} {mainTheme}
                  </Fragment>
                }
                info={<div>{abstract}</div>}
              />
            </section>
            <WorkSection title={t('common:otherTitles')} show={otherTitles}>
              {otherTitles}
            </WorkSection>

            <WorkSection
              title={t('common:firstPerformance')}
              show={
                firstPerformancePlace.length > 0 ||
                firstPerformanceDate ||
                firstPerformanceExtraInfo
              }
            >
              {firstPerformancePlace.length > 0 && (
                <Place {...firstPerformancePlace[0]} />
              )}
              {firstPerformanceDate && <span>, {firstPerformanceDate}</span>}
              {firstPerformanceExtraInfo && (
                <span> - {firstPerformanceExtraInfo}</span>
              )}
            </WorkSection>

            <WorkSection
              title={t('common:publications')}
              show={edition || modernEditions || onlineEdition}
            >
              <WorkInfo label={t('common:edition')} info={edition} />
              <WorkInfo
                label={t('common:modernEditions')}
                info={modernEditions}
              />
              {onlineEdition && (
                <div className={styles.onlineEdition}>
                  <a
                    href={onlineEdition}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('common:onlineEdition')}
                  </a>
                </div>
              )}
            </WorkSection>
          </Fragment>
        )}
      </div>
      <section className={styles.extra}>
        <WorkInfo
          label={t('common:registers')}
          info={<CommaSepList list={registers} listTransform={getTitle} />}
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
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 6L8 11L13 6" strokeWidth="2" strokeLinecap="square" />
        </svg>
      </button>
    </article>
  );
}

export default WorkInList;
