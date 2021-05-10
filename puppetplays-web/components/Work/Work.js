import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import {
  getTitle,
  getFirstItemTitle,
  hasAtLeastOneItem,
  getProperty,
} from 'lib/utils';
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
import CoverImage from './CoverImage';
import styles from './workSummary.module.scss';

function Work({
  doi,
  viafId,
  arkId,
  title,
  subtitle,
  translatedTitle,
  mainImage,
  genre,
  keywords,
  authors,
  mostRelevantDate,
  compositionMinDate,
  compositionDisplayDate,
  compositionPlace,
  mainLanguage,
  note,
  mainTheme,
  abstract,
  hypotexts,
  otherTitles,
  firstPerformancePlace,
  firstPerformanceDate,
  firstPerformanceComplementaryInformation,
  publication,
  modernEdition,
  onlineEdition,
  translations,
  transcribers,
  editors,
  literaryTones,
  animationTechniques,
  dramaticDevices,
  audience,
  characters,
  actsCount,
  pagesCount,
  formats,
  publicDomain,
  additionalLicenseInformation,
  conservationPlace,
}) {
  const { t } = useTranslation();

  return (
    <article
      className={`${styles.container} ${styles['container--full']} work-page-container`}
    >
      <div className={styles.media}>
        <CoverImage image={mainImage} year={compositionMinDate} height={340} />
        <p>
          <CommaSepList list={formats} listTransform={getTitle} />
        </p>
        {pagesCount && <p>{t('common:pagesCount', { count: pagesCount })}</p>}

        <Section
          title={t('common:theAuthors')}
          show={hasAtLeastOneItem(authors)}
        >
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
          mostRelevantDate={mostRelevantDate}
          compositionPlace={compositionPlace}
          translatedTitle={translatedTitle}
        />

        <section>
          <Info label={t('common:genre')} show={!!genre}>
            {genre}
          </Info>
          <Info
            label={t('common:characters')}
            show={hasAtLeastOneItem(characters)}
          >
            <CommaSepList
              list={characters}
              listTransform={getProperty('textName')}
            />
          </Info>
          <Info label={t('common:actsCount')} show={!!actsCount}>
            {actsCount}
          </Info>
          <Info label={t('common:note')} fill show={!!note}>
            <div dangerouslySetInnerHTML={{ __html: note }} />
          </Info>
          <Abstract mainTheme={mainTheme} abstract={abstract} />
          <Hypotexts hypotexts={hypotexts} />
          <Info
            label={t('common:compositionDate')}
            show={!!compositionDisplayDate}
          >
            {compositionDisplayDate}
          </Info>
        </section>

        <Section title={t('common:otherTitles')} show={!!otherTitles}>
          {otherTitles}
        </Section>

        <FirstPerformance
          place={firstPerformancePlace}
          date={firstPerformanceDate}
          extraInfo={firstPerformanceComplementaryInformation}
        />

        <Section
          title={t('common:publicationsAndTranslations')}
          show={
            !!publication ||
            hasAtLeastOneItem(transcribers) ||
            hasAtLeastOneItem(editors) ||
            !!modernEdition ||
            !!onlineEdition ||
            hasAtLeastOneItem(translations)
          }
        >
          <Info label={t('common:publication')} show={!!publication}>
            <div dangerouslySetInnerHTML={{ __html: publication }} />
          </Info>
          <Info
            label={t('common:transcribers')}
            show={hasAtLeastOneItem(transcribers)}
          >
            <CommaSepList list={transcribers} itemComponent={Author} />
          </Info>
          <Info label={t('common:editors')} show={hasAtLeastOneItem(editors)}>
            <CommaSepList list={editors} itemComponent={Author} />
          </Info>
          <Info label={t('common:modernEdition')} show={!!modernEdition}>
            <div dangerouslySetInnerHTML={{ __html: modernEdition }} />
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
                      <span
                        dangerouslySetInnerHTML={{
                          __html: bibliographicRecord,
                        }}
                      />{' '}
                      ({translationLanguage[0].title})
                    </li>
                  ),
                )}
              </ul>
            </div>
          </Info>
        </Section>

        <Section
          title={t('common:conservationPlace')}
          show={hasAtLeastOneItem(conservationPlace)}
        >
          {hasAtLeastOneItem(conservationPlace) && (
            <Fragment>
              <span>{getFirstItemTitle(conservationPlace)}</span>
              {conservationPlace[0].place.length > 0 && (
                <Fragment>
                  <span> - </span>
                  <Place {...conservationPlace[0].place[0]} />
                </Fragment>
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
            label={t('common:literaryTones')}
            show={hasAtLeastOneItem(literaryTones)}
          >
            <CommaSepList list={literaryTones} listTransform={getTitle} />
          </Info>
          <Info
            label={t('common:animationTechniques')}
            show={hasAtLeastOneItem(animationTechniques)}
          >
            <CommaSepList list={animationTechniques} listTransform={getTitle} />
          </Info>
          <Info label={t('common:audience')} show={hasAtLeastOneItem(audience)}>
            {getFirstItemTitle(audience)}
          </Info>
          <Info
            label={t('common:license')}
            show={publicDomain || !!additionalLicenseInformation}
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
          title={t('common:dramaticDevices')}
          show={hasAtLeastOneItem(dramaticDevices)}
        >
          <Keywords keywords={dramaticDevices} fill />
        </Section>

        <Section title={t('common:ids')} show={!!doi || !!viafId || !!arkId}>
          <Info label="DOI" show={!!doi}>
            {doi}
          </Info>
          <Info label="VIAF" show={!!viafId}>
            {viafId}
          </Info>
          <Info label="ARK" show={!!arkId}>
            {arkId}
          </Info>
        </Section>
      </div>
    </article>
  );
}

Work.defaultProps = {
  mainImage: [],
  doi: null,
  viafId: null,
  arkId: null,
  subtitle: null,
  translatedTitle: null,
  genre: null,
  keywords: [],
  authors: [],
  mostRelevantDate: null,
  compositionMinDate: null,
  compositionDisplayDate: null,
  compositionPlace: [],
  mainLanguage: [],
  note: null,
  mainTheme: null,
  abstract: null,
  hypotexts: [],
  otherTitles: null,
  firstPerformancePlace: [],
  firstPerformanceDate: null,
  firstPerformanceComplementaryInformation: null,
  publication: null,
  modernEdition: null,
  onlineEdition: null,
  translations: [],
  transcribers: [],
  editors: [],
  literaryTones: [],
  animationTechniques: [],
  dramaticDevices: [],
  audience: [],
  characters: [],
  actsCount: null,
  pagesCount: null,
  formats: [],
  publicDomain: false,
  additionalLicenseInformation: null,
  conservationPlace: [],
};

Work.propTypes = {
  title: PropTypes.string.isRequired,
  mainImage: PropTypes.array,
  doi: PropTypes.string,
  viafId: PropTypes.string,
  arkId: PropTypes.string,
  subtitle: PropTypes.string,
  translatedTitle: PropTypes.string,
  genre: PropTypes.string,
  keywords: PropTypes.array,
  authors: PropTypes.array,
  mostRelevantDate: PropTypes.string,
  compositionMinDate: PropTypes.number,
  compositionDisplayDate: PropTypes.string,
  compositionPlace: PropTypes.array,
  mainLanguage: PropTypes.array,
  note: PropTypes.string,
  mainTheme: PropTypes.string,
  abstract: PropTypes.string,
  hypotexts: PropTypes.array,
  otherTitles: PropTypes.string,
  firstPerformancePlace: PropTypes.array,
  firstPerformanceDate: PropTypes.string,
  firstPerformanceComplementaryInformation: PropTypes.string,
  publication: PropTypes.string,
  modernEdition: PropTypes.string,
  onlineEdition: PropTypes.string,
  translations: PropTypes.array,
  transcribers: PropTypes.array,
  editors: PropTypes.array,
  literaryTones: PropTypes.array,
  animationTechniques: PropTypes.array,
  dramaticDevices: PropTypes.array,
  audience: PropTypes.array,
  characters: PropTypes.array,
  actsCount: PropTypes.number,
  pagesCount: PropTypes.number,
  formats: PropTypes.array,
  publicDomain: PropTypes.bool,
  additionalLicenseInformation: PropTypes.string,
  conservationPlace: PropTypes.array,
};

export default Work;
