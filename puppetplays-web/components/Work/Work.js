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
import Keywords, { Tag } from 'components/Keywords';
import CommaSepList from 'components/CommaSepList';
import AuthorCard from 'components/AuthorCard';
import CompanyCard from 'components/CompanyCard';
import AnimationTechnique from 'components/AnimationTechnique';
import WorkHeader from './WorkHeader';
import Abstract from './Abstract';
import Hypotexts from './Hypotexts';
import FirstPerformance from './FirstPerformance';
import CoverImage from './CoverImage';
import ArkId from './ArkId';
import styles from './workSummary.module.scss';

function Work(props) {
  const {
    writtenBy,
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
    onlineCopy,
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
  } = props;
  const { t } = useTranslation();

  return (
    <article
      className={`${styles.container} ${styles['container--full']} work-page-container`}
    >
      <div className={styles.media}>
        <CoverImage
          image={mainImage}
          year={compositionMinDate}
          height={340}
          hasPlaceholder={false}
        />
        <p>
          <CommaSepList list={formats} listTransform={getTitle} />
        </p>
        {pagesCount && <p>{t('common:pagesCount', { count: pagesCount })}</p>}

        <Section
          title={t('common:author(s)')}
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
            !!onlineCopy ||
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
          {onlineCopy && (
            <div className={styles.onlineCopy}>
              <a href={onlineCopy} target="_blank" rel="noopener noreferrer">
                {t('common:onlineCopy')}
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
            <CommaSepList
              list={animationTechniques}
              itemComponent={AnimationTechnique}
              listTransform={getTitle}
            />
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
          <Keywords keywords={keywords} component={Tag} />
        </Section>

        <Section
          title={t('common:dramaticDevices')}
          show={hasAtLeastOneItem(dramaticDevices)}
        >
          <Keywords keywords={dramaticDevices} fill />
        </Section>

        {/* <button type="button">
          {t('common:downloadNotice')}
        </button> */}

        <Section title={t('common:ids')} show={!!doi || !!viafId || !!arkId}>
          <Info label="DOI" show={!!doi}>
            {doi}
          </Info>
          <Info label="VIAF" show={!!viafId}>
            {viafId}
          </Info>
          <Info label="ARK" show={!!arkId}>
            <ArkId id={arkId} />
          </Info>
        </Section>

        <Section
          title={t('common:writtenBy')}
          show={writtenBy.firstName || writtenBy.lastName}
        >
          {writtenBy.firstName} {writtenBy.lastName}
        </Section>
      </div>
    </article>
  );
}

Work.defaultProps = {
  writtenBy: {},
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
  onlineCopy: null,
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
  writtenBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
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
  onlineCopy: PropTypes.string,
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
