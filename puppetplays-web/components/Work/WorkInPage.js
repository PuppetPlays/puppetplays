import { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { getTitle, getFirstItemTitle } from 'lib/utils';
import Place from '../Place';
import WorkHeader from './WorkHeader';
import WorkSection from './WorkSection';
import WorkAuthor from './WorkAuthor';
import WorkInfo from './WorkInfo';
import Keywords from '../Keywords';
import CommaSepList from '../CommaSepList';
import AuthorCard from '../AuthorCard';
import CompanyCard from '../CompanyCard';
import styles from './workInList.module.scss';

function WorkInPage({
  doi,
  viafId,
  arkId,
  title,
  subtitle,
  translatedTitle,
  genre,
  keywords,
  authors,
  referenceDate,
  writingDisplayDate,
  writingPlace,
  mainLanguage,
  notice,
  mainTheme,
  abstract,
  hypotexts,
  otherTitles,
  firstPerformancePlace,
  firstPerformanceDate,
  firstPerformanceExtraInfo,
  edition,
  modernEditions,
  onlineEdition,
  translations,
  transcriptors,
  compilators,
  registers,
  handlingTechniques,
  dramaturgicTechniques,
  audience,
  characters,
  actsCount,
  pageCount,
  formats,
  publicDomain,
  additionalLicenseInformation,
  preservedIn,
}) {
  const { t } = useTranslation();

  return (
    <article className={`${styles.container} work-page-container`}>
      <div className={styles.media}>
        <p>
          <CommaSepList list={formats} listTransform={getTitle} />
        </p>
        <p>{t('common:pageCount', { count: pageCount })}</p>

        <WorkSection title={t('common:theAuthors')} show={authors}>
          {authors.map(({ typeHandle, ...rest }) => {
            if (typeHandle === 'persons') {
              return <AuthorCard key={rest.id} {...rest} />;
            } else if (typeHandle === 'companies') {
              return <CompanyCard key={rest.id} {...rest} />;
            }
          })}
        </WorkSection>
      </div>
      <div className={styles.body}>
        <WorkHeader
          title={title}
          subtitle={subtitle}
          authors={authors}
          referenceDate={referenceDate}
          writingPlace={writingPlace}
          translatedTitle={translatedTitle}
        />

        <section>
          <WorkInfo label={t('common:genre')} info={genre} />
          <WorkInfo
            label={t('common:characters')}
            info={<CommaSepList list={characters} listTransform={getTitle} />}
            infoExist={characters.length > 0}
          />
          <WorkInfo label={t('common:actsCount')} info={actsCount} />
          <WorkInfo
            label={t('common:notice')}
            info={<div dangerouslySetInnerHTML={{ __html: notice }} />}
            fill
          />
          <WorkInfo
            label={t('common:abstract')}
            info={
              <Fragment>
                {mainTheme && <h3 className={styles.mainTheme}>{mainTheme}</h3>}
                <div dangerouslySetInnerHTML={{ __html: abstract }} />
              </Fragment>
            }
            fill
          />
          <WorkInfo
            label={t('common:hypotexts')}
            info={<CommaSepList list={hypotexts} listTransform={getTitle} />}
          />
          <WorkInfo label={t('common:writingDate')} info={writingDisplayDate} />
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
          title={t('common:publicationsAndTranslations')}
          show={edition || modernEditions || onlineEdition}
        >
          <WorkInfo
            label={t('common:edition')}
            info={<div dangerouslySetInnerHTML={{ __html: edition }} />}
          />
          <WorkInfo
            label={t('common:transcriptors')}
            info={
              <CommaSepList list={transcriptors} itemComponent={WorkAuthor} />
            }
          />
          <WorkInfo
            label={t('common:compilators')}
            info={
              <CommaSepList list={compilators} itemComponent={WorkAuthor} />
            }
          />
          <WorkInfo
            label={t('common:modernEditions')}
            info={<div dangerouslySetInnerHTML={{ __html: modernEditions }} />}
          />
          {onlineEdition && (
            <div className={styles.onlineEdition}>
              <a href={onlineEdition} target="_blank" rel="noopener noreferrer">
                {t('common:onlineEdition')}
              </a>
            </div>
          )}
          <WorkInfo
            label={t('common:translations')}
            info={
              <div className={styles.translations}>
                <ul>
                  {translations.map(
                    ({ bibliographicRecord, translationLanguage }) => (
                      <li key={translationLanguage}>
                        {bibliographicRecord} ({translationLanguage[0].title})
                      </li>
                    ),
                  )}
                </ul>
              </div>
            }
          />
        </WorkSection>

        <WorkSection title={t('common:preservedPlace')}>
          {preservedIn.length > 0 && (
            <Fragment>
              <span>{getFirstItemTitle(preservedIn)}</span>
              <span> - </span>
              {preservedIn[0].place.length > 0 && (
                <Place {...preservedIn[0].place[0]} />
              )}
            </Fragment>
          )}
        </WorkSection>
      </div>

      <div className={styles.extra}>
        <section>
          <WorkInfo
            label={t('common:language')}
            info={getFirstItemTitle(mainLanguage)}
          />
          <WorkInfo
            label={t('common:registers')}
            info={<CommaSepList list={registers} listTransform={getTitle} />}
          />
          <WorkInfo
            label={t('common:handlingTechniques')}
            info={
              <CommaSepList
                list={handlingTechniques}
                listTransform={getTitle}
              />
            }
            infoExist={handlingTechniques.length > 0}
          />
          <WorkInfo
            label={t('common:audience')}
            info={getFirstItemTitle(audience)}
          />
          <WorkInfo
            label={t('common:license')}
            info={
              publicDomain
                ? t('common:publicDomain')
                : additionalLicenseInformation
            }
          />
        </section>

        <WorkSection title={t('common:keywords')}>
          <Keywords keywords={keywords} />
        </WorkSection>

        <WorkSection title={t('common:dramaturgicTechniques')}>
          <Keywords keywords={dramaturgicTechniques} fill />
        </WorkSection>

        <WorkSection title={t('common:ids')}>
          <WorkInfo label="DOI" info={doi} />
          <WorkInfo label="VIAF" info={viafId} />
          <WorkInfo label="ARK" info={arkId} />
        </WorkSection>
      </div>
    </article>
  );
}

export default WorkInPage;
