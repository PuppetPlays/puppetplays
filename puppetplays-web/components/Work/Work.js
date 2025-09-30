import AnimationTechnique from 'components/AnimationTechnique';
import Author from 'components/Author';
import AuthorCard from 'components/AuthorCard';
import CommaSepList from 'components/CommaSepList';
import CompanyCard from 'components/CompanyCard';
import Info from 'components/Info';
import Keywords, { Tag, TheatricalTechniqueTag } from 'components/Keywords';
import Place from 'components/Place';
import Section from 'components/Section';
import {
  getTitle,
  getFirstItemTitle,
  hasAtLeastOneItem,
  getProperty,
} from 'lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { Fragment, useState, useEffect } from 'react';

import Abstract from './Abstract';
import ArkId from './ArkId';
import CoverImage from './CoverImage';
import FirstPerformance from './FirstPerformance';
import Hypotexts from './Hypotexts';
import WorkHeader from './WorkHeader';
import styles from './workSummary.module.scss';

const PermalinkIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.3358 12.6891L18.5785 8.44648C19.5548 7.47017 19.5548 5.88725 18.5785 4.91094C17.6022 3.93463 16.0192 3.93463 15.0429 4.91094L12.1283 7.82555C11.2701 7.55078 10.3577 7.492 9.47626 7.6492L13.6287 3.49673C15.3861 1.73937 18.2353 1.73937 19.9927 3.49673C21.75 5.25409 21.75 8.10333 19.9927 9.86069L15.75 14.1033C13.9927 15.8607 11.1434 15.8607 9.38608 14.1033C9.30068 14.0179 9.21943 13.93 9.14233 13.8396L10.7405 12.6272C10.76 12.6481 10.7799 12.6687 10.8003 12.6891C11.7766 13.6654 13.3595 13.6654 14.3358 12.6891Z" />
      <path d="M7.97187 19.0738L10.8761 16.1696C11.7344 16.4443 12.6468 16.5031 13.5282 16.3459L9.38608 20.488C7.62872 22.2454 4.77948 22.2454 3.02212 20.488C1.26476 18.7306 1.26476 15.8814 3.02212 14.124L7.26476 9.88141C9.02212 8.12405 11.8714 8.12405 13.6287 9.88141C13.7121 9.96474 13.7914 10.0505 13.8669 10.1386L12.2737 11.3568C12.2544 11.3362 12.2347 11.3158 12.2145 11.2956C11.2382 10.3193 9.65529 10.3193 8.67898 11.2956L4.43633 15.5383C3.46002 16.5146 3.46002 18.0975 4.43633 19.0738C5.41265 20.0501 6.99556 20.0501 7.97187 19.0738Z" />
    </svg>
  );
};

function Work(props) {
  const {
    writtenBy = {},
    translatedBy = [],
    doi = null,
    viafId = null,
    arkId = null,
    title = null,
    subtitle = null,
    translatedTitle = null,
    mainImage = [],
    genre = null,
    keywords = [],
    authors = [],
    mostRelevantDate = null,
    compositionMinDate = null,
    compositionDisplayDate = null,
    compositionPlace = [],
    mainLanguage = [],
    note = null,
    mainTheme = null,
    abstract = null,
    hypotexts = [],
    otherTitles = null,
    firstPerformancePlace = [],
    firstPerformanceDate = null,
    firstPerformanceComplementaryInformation = null,
    publication = null,
    modernEdition = null,
    onlineCopy = null,
    translations = [],
    transcribers = [],
    editors = [],
    literaryTones = [],
    animationTechniques = [],
    theatricalTechniques = [],
    audience = [],
    textCharacters = [],
    actsCount = null,
    pagesCount = null,
    formats = [],
    publicDomain = false,
    additionalLicenseInformation = null,
    conservationPlace = [],
    translatedByGraphql = null,
  } = props;
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [permalinkUrl, setPermalinkUrl] = useState('');

  useEffect(() => {
    setPermalinkUrl(window.location.href);
  }, []);

  return (
    <article
      className={`${styles.container} ${styles['container--full']} work-page-container`}
    >
      <Head>
        <link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />
        <link rel="schema.DCTERMS" href="http://purl.org/dc/terms/" />
        <meta name="DC.title" lang={locale} content={title} />
        {authors &&
          Array.isArray(authors) &&
          authors.map(({ typeHandle, ...rest }) => {
            if (typeHandle === 'persons') {
              const author = `${rest.lastName} ${rest.firstName}`;
              return [
                <meta
                  key={`${rest.id}-DC`}
                  name="DC.creator"
                  content={author}
                />,
                <meta
                  key={`${rest.id}-Google`}
                  name="citation_author"
                  content={author}
                />,
              ];
            } else if (typeHandle === 'companies') {
              return [
                <meta
                  key={`${rest.id}-DC`}
                  name="DC.creator"
                  content={rest.title}
                />,
                <meta
                  key={`${rest.id}-Google`}
                  name="citation_author"
                  content={rest.title}
                />,
              ];
            }
          })}
        <meta
          name="DC.date"
          scheme="DCTERMS.W3CDTF"
          content={compositionDisplayDate}
        />
        <meta name="DC.identifier" scheme="DCTERMS.URI" content={doi} />
        <meta
          name="DCTERMS.abstract"
          content={abstract ? abstract.replace(/(<([^>]+)>)/g, '') : ''}
        />
        <meta
          name="DC.description"
          lang={locale}
          content={abstract ? abstract.replace(/(<([^>]+)>)/g, '') : ''}
        />
        <meta name="DC.format" scheme="DCTERMS.IMT" content="text/html" />
        <meta name="DC.type" scheme="DCTERMS.DCMIType" content="Text" />
        <meta
          name="DC.subject"
          lang="fr"
          content={
            keywords && Array.isArray(keywords)
              ? keywords.map(({ title }) => title).join(', ')
              : ''
          }
        />
        <meta
          name="DC.language"
          scheme="DCTERMS.RFC4646"
          content={
            hasAtLeastOneItem(mainLanguage)
              ? getFirstItemTitle(mainLanguage)
              : ''
          }
        />
        <meta
          name="DC.publisher"
          content={publication ? publication.replace(/(<([^>]+)>)/g, '') : ''}
        />
        <meta
          name="DC.rights"
          content={
            publicDomain
              ? t('common:publicDomain')
              : additionalLicenseInformation
          }
        />

        <meta property="og:title" content={title} />
        <meta property="og:type" content="book" />
        <meta property="og:url" content={doi} />
        <meta
          property="og:image"
          content={hasAtLeastOneItem(mainImage) ? mainImage[0].url : ''}
        />
        <meta
          property="og:description"
          content={abstract ? abstract.replace(/(<([^>]+)>)/g, '') : ''}
        />
        <meta property="og:site_name" content="PuppetPlays.eu" />

        <meta name="citation_title" content={title} />
        <meta
          name="citation_publication_date"
          content={compositionDisplayDate}
        />
      </Head>

      <div className={styles.media}>
        <CoverImage
          image={mainImage}
          year={compositionMinDate}
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
          {authors &&
            Array.isArray(authors) &&
            authors.map(({ typeHandle, ...rest }) => {
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
            show={hasAtLeastOneItem(textCharacters)}
          >
            <CommaSepList
              list={textCharacters}
              listTransform={getProperty('nameInText')}
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
              <Link href={onlineCopy} target="_blank" rel="noopener noreferrer">
                {t('common:onlineCopy')}
              </Link>
            </div>
          )}
          <Info
            label={t('common:translations')}
            show={hasAtLeastOneItem(translations)}
          >
            <div className={styles.translations}>
              <ul>
                {translations &&
                  Array.isArray(translations) &&
                  translations.map(
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
          title={t('common:theatricalTechniques')}
          show={hasAtLeastOneItem(theatricalTechniques)}
        >
          <Keywords
            keywords={theatricalTechniques}
            component={TheatricalTechniqueTag}
            fill
          />
        </Section>

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

        <Section title={t('common:permalink')} show>
          <div className={styles.permalink}>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              title={t('common:permalinkCopy')}
            >
              <PermalinkIcon />
            </button>
            <div className={styles.permalinkHref}>{permalinkUrl}</div>
          </div>
        </Section>

        <Section
          title={t('common:writtenBy')}
          show={writtenBy && (!!writtenBy.firstName || !!writtenBy.lastName)}
        >
          {writtenBy?.firstName} {writtenBy?.lastName}
        </Section>

        {/* Translator field from GraphQL plain text field */}
        {/* Display translatedBy Users if available, otherwise fallback to translatedByGraphql */}
        <Section
          title={t('common:translatedBy')}
          show={
            (translatedBy &&
              Array.isArray(translatedBy) &&
              translatedBy.length > 0) ||
            !!translatedByGraphql
          }
        >
          {translatedBy &&
          Array.isArray(translatedBy) &&
          translatedBy.length > 0 ? (
            translatedBy.map((translator, index) => (
              <span key={translator?.id || index}>
                {translator?.fullName ||
                  `${translator?.firstName || ''} ${translator?.lastName || ''}`.trim()}
                {index < translatedBy.length - 1 && ', '}
              </span>
            ))
          ) : (
            translatedByGraphql
          )}
        </Section>
      </div>
    </article>
  );
}

Work.propTypes = {
  writtenBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  translatedBy: PropTypes.arrayOf(
    PropTypes.shape({
      fullName: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  ),
  translatedByGraphql: PropTypes.string,
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
  theatricalTechniques: PropTypes.array,
  audience: PropTypes.array,
  textCharacters: PropTypes.array,
  actsCount: PropTypes.number,
  pagesCount: PropTypes.number,
  formats: PropTypes.array,
  publicDomain: PropTypes.bool,
  additionalLicenseInformation: PropTypes.string,
  conservationPlace: PropTypes.array,
};

export default Work;
