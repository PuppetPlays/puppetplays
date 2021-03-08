import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { getTitle, getFirstItemTitle, hasAtLeastOneItem } from 'lib/utils';
import Place from 'components/Place';
import Section from 'components/Section';
import Author from 'components/Author';
import Info from 'components/Info';
import Keywords from 'components/Keywords';
import CommaSepList from 'components/CommaSepList';
import AuthorCard from 'components/AuthorCard';
import CompanyCard from 'components/CompanyCard';
import WorkHeader from './WorkHeader';
import Abstract from './Abstract';
import Hypotexts from './Hypotexts';
import FirstPerformance from './FirstPerformance';
import styles from './workSummary.module.scss';

function Work({
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
        {pageCount && <p>{t('common:pageCount', { count: pageCount })}</p>}

        <Section title={t('common:theAuthors')} show={authors}>
          {authors.map(({ typeHandle, ...rest }) => {
            if (typeHandle === 'persons') {
              return <AuthorCard key={rest.id} {...rest} />;
            } else if (typeHandle === 'companies') {
              return <CompanyCard key={rest.id} {...rest} />;
            }
          })}
        </Section>
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
          <Info label={t('common:genre')} show={genre}>
            {genre}
          </Info>
          <Info
            label={t('common:characters')}
            show={hasAtLeastOneItem(characters)}
          >
            <CommaSepList list={characters} listTransform={getTitle} />
          </Info>
          <Info label={t('common:actsCount')} show={actsCount}>
            {actsCount}
          </Info>
          <Info label={t('common:notice')} fill show={notice}>
            <div dangerouslySetInnerHTML={{ __html: notice }} />
          </Info>
          <Abstract mainTheme={mainTheme} abstract={abstract} />
          <Hypotexts hypotexts={hypotexts} />
          <Info label={t('common:writingDate')} show={writingDisplayDate}>
            {writingDisplayDate}
          </Info>
        </section>

        <Section title={t('common:otherTitles')} show={otherTitles}>
          {otherTitles}
        </Section>

        <FirstPerformance
          place={firstPerformancePlace}
          date={firstPerformanceDate}
          extraInfo={firstPerformanceExtraInfo}
        />

        <Section
          title={t('common:publicationsAndTranslations')}
          show={edition || modernEditions || onlineEdition}
        >
          <Info label={t('common:edition')} show={edition}>
            <div dangerouslySetInnerHTML={{ __html: edition }} />
          </Info>
          <Info
            label={t('common:transcriptors')}
            show={hasAtLeastOneItem(transcriptors)}
          >
            <CommaSepList list={transcriptors} itemComponent={Author} />
          </Info>
          <Info
            label={t('common:compilators')}
            show={hasAtLeastOneItem(compilators)}
          >
            <CommaSepList list={compilators} itemComponent={Author} />
          </Info>
          <Info label={t('common:modernEditions')} show={modernEditions}>
            <div dangerouslySetInnerHTML={{ __html: modernEditions }} />
          </Info>
          {onlineEdition && (
            <div className={styles.onlineEdition}>
              <a href={onlineEdition} target="_blank" rel="noopener noreferrer">
                {t('common:onlineEdition')}
              </a>
            </div>
          )}
          <Info
            label={t('common:translations')}
            show={hasAtLeastOneItem(translations)}
          >
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
          </Info>
        </Section>

        <Section title={t('common:preservedPlace')}>
          {hasAtLeastOneItem(preservedIn) && (
            <Fragment>
              <span>{getFirstItemTitle(preservedIn)}</span>
              <span> - </span>
              {preservedIn[0].place.length > 0 && (
                <Place {...preservedIn[0].place[0]} />
              )}
            </Fragment>
          )}
        </Section>
      </div>

      <div className={styles.extra}>
        <section>
          <Info
            label={t('common:language')}
            show={hasAtLeastOneItem(mainLanguage)}
          >
            {getFirstItemTitle(mainLanguage)}
          </Info>
          <Info
            label={t('common:registers')}
            show={hasAtLeastOneItem(registers)}
          >
            <CommaSepList list={registers} listTransform={getTitle} />
          </Info>
          <Info
            label={t('common:handlingTechniques')}
            show={hasAtLeastOneItem(handlingTechniques)}
          >
            <CommaSepList list={handlingTechniques} listTransform={getTitle} />
          </Info>
          <Info label={t('common:audience')} show={hasAtLeastOneItem(audience)}>
            {getFirstItemTitle(audience)}
          </Info>
          <Info
            label={t('common:license')}
            show={publicDomain || additionalLicenseInformation}
          >
            {publicDomain
              ? t('common:publicDomain')
              : additionalLicenseInformation}
          </Info>
        </section>

        <Section
          title={t('common:keywords')}
          show={hasAtLeastOneItem(keywords)}
        >
          <Keywords keywords={keywords} />
        </Section>

        <Section
          title={t('common:dramaturgicTechniques')}
          show={hasAtLeastOneItem(dramaturgicTechniques)}
        >
          <Keywords keywords={dramaturgicTechniques} fill />
        </Section>

        <Section title={t('common:ids')} show={doi || viafId || arkId}>
          <Info label="DOI" show={doi}>
            {doi}
          </Info>
          <Info label="VIAF" show={viafId}>
            {viafId}
          </Info>
          <Info label="ARK" show={arkId}>
            {arkId}
          </Info>
        </Section>
      </div>
    </article>
  );
}

Work.defaultProps = {
  doi: null,
  viafId: null,
  arkId: null,
  subtitle: null,
  translatedTitle: null,
  genre: null,
  keywords: [],
  authors: [],
  referenceDate: null,
  writingPlace: [],
  mainLanguage: [],
  notice: null,
  mainTheme: null,
  abstract: null,
  hypotexts: [],
  otherTitles: null,
  firstPerformancePlace: [],
  firstPerformanceDate: null,
  firstPerformanceExtraInfo: null,
  edition: null,
  modernEditions: null,
  onlineEdition: null,
  translations: [],
  transcriptors: [],
  compilators: [],
  registers: [],
  handlingTechniques: [],
  dramaturgicTechniques: [],
  audience: [],
  characters: [],
  actsCount: null,
  pageCount: null,
  formats: [],
  publicDomain: false,
  additionalLicenseInformation: null,
  preservedIn: [],
};

Work.propTypes = {
  title: PropTypes.string.isRequired,
  doi: PropTypes.string,
  viafId: PropTypes.string,
  arkId: PropTypes.string,
  subtitle: PropTypes.string,
  translatedTitle: PropTypes.string,
  genre: PropTypes.string,
  keywords: PropTypes.array,
  authors: PropTypes.array,
  referenceDate: PropTypes.string,
  writingPlace: PropTypes.array,
  mainLanguage: PropTypes.array,
  notice: PropTypes.string,
  mainTheme: PropTypes.string,
  abstract: PropTypes.string,
  hypotexts: PropTypes.array,
  otherTitles: PropTypes.string,
  firstPerformancePlace: PropTypes.array,
  firstPerformanceDate: PropTypes.string,
  firstPerformanceExtraInfo: PropTypes.string,
  edition: PropTypes.string,
  modernEditions: PropTypes.string,
  onlineEdition: PropTypes.string,
  translations: PropTypes.array,
  transcriptors: PropTypes.array,
  compilators: PropTypes.array,
  registers: PropTypes.array,
  handlingTechniques: PropTypes.array,
  dramaturgicTechniques: PropTypes.array,
  audience: PropTypes.array,
  characters: PropTypes.array,
  actsCount: PropTypes.number,
  pageCount: PropTypes.number,
  formats: PropTypes.array,
  publicDomain: PropTypes.bool,
  additionalLicenseInformation: PropTypes.string,
  preservedIn: PropTypes.array,
};

export default Work;
