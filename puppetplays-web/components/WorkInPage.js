import useTranslation from 'next-translate/useTranslation';
import { getTitle, getFirstItemProp, getFirstItemTitle } from 'lib/utils';
import WorkHeader from './WorkHeader';
import WorkSection from './WorkSection';
import WorkInfo from './WorkInfo';
import Keywords from './Keywords';
import CommaSepList from './CommaSepList';
import styles from './workInList.module.scss';
import { Fragment } from 'react';

function WorkInList({
  title,
  translatedTitle,
  genre,
  keywords,
  authors,
  writingDisplayDate,
  writingPlace,
  mainLanguage,
  abstract,
  note,
  hypotexts,
  firstPerformance,
  firstPublication,
  modernEditions,
  translations,
  register,
  handlingTechniques,
  dramaturgicTechniques,
  audience,
  characters,
  actsCount,
  pageCount,
  formats,
  license,
  preservedIn,
}) {
  const { t } = useTranslation();

  return (
    <article className={`${styles.container} ${styles['container--page']}`}>
      <div className={styles.media}>
        <p>
          <CommaSepList list={formats} listTransform={getTitle} />
        </p>
        <p>{t('common:pageCount', { count: pageCount })}</p>
      </div>
      <div className={styles.body}>
        <WorkHeader
          title={title}
          authors={authors}
          writingDisplayDate={writingDisplayDate}
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
          <WorkInfo label={t('common:abstract')} info={abstract} />
          <WorkInfo label={t('common:note')} info={note} />
        </section>

        <WorkSection title={t('common:otherTitles')}>
          <CommaSepList list={hypotexts} listTransform={getTitle} />
        </WorkSection>

        <WorkSection title={t('common:performances')}>
          <WorkInfo
            label={t('common:firstPerformance')}
            info={firstPerformance}
          />
        </WorkSection>

        <WorkSection title={t('common:publicationsAndTraductions')}>
          <WorkInfo
            label={t('common:firstPublication')}
            info={firstPublication}
          />
          <WorkInfo label={t('common:modernEditions')} info={modernEditions} />
          <WorkInfo label={t('common:translations')} info={translations} />
        </WorkSection>

        <WorkSection title={t('common:preservedPlace')}>
          {preservedIn.length > 0 && (
            <Fragment>
              <span>{getFirstItemTitle(preservedIn)}</span>
              <span> - </span>
              {preservedIn[0].place.length > 0 && (
                <Fragment>
                  <span>
                    {getFirstItemTitle(getFirstItemProp('place')(preservedIn))}
                  </span>
                  {preservedIn[0].place[0].country.length > 0 && (
                    <Fragment>
                      <span>, </span>
                      <span>
                        {getFirstItemTitle(
                          getFirstItemProp('country')(
                            getFirstItemProp('place')(preservedIn),
                          ),
                        )}
                      </span>
                    </Fragment>
                  )}
                </Fragment>
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
            label={t('common:register')}
            info={getFirstItemTitle(register)}
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
          <WorkInfo label={t('common:license')} info={license} />
        </section>

        <WorkSection title={t('common:keywords')}>
          <Keywords keywords={keywords} />
        </WorkSection>

        <WorkSection title={t('common:dramaturgicTechniques')}>
          <Keywords keywords={dramaturgicTechniques} />
        </WorkSection>
      </div>
    </article>
  );
}

export default WorkInList;
