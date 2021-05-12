import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import {
  getTitle,
  getFirstItemTitle,
  hasAtLeastOneItem,
  getProperty,
} from 'lib/utils';
import Keywords from 'components/Keywords';
import CommaSepList from 'components/CommaSepList';
import Section from 'components/Section';
import Info from 'components/Info';
import AnimationTechnique from 'components/AnimationTechnique';
import Abstract from './Abstract';
import WorkHeader from './WorkHeader';
import FirstPerformance from './FirstPerformance';
import CoverImage from './CoverImage';
import styles from './workSummary.module.scss';

function WorkSummary({
  id,
  slug,
  title,
  subtitle,
  translatedTitle,
  dramaticDevices,
  mainImage,
  keywords,
  authors,
  mostRelevantDate,
  compositionMinDate,
  compositionPlace,
  mainLanguage,
  note,
  mainTheme,
  abstract,
  otherTitles,
  firstPerformancePlace,
  firstPerformanceDate,
  firstPerformanceComplementaryInformation,
  publication,
  modernEdition,
  onlineEdition,
  literaryTones,
  animationTechniques,
  audience,
  characters,
  actsCount,
  pagesCount,
  formats,
  publicDomain,
  additionalLicenseInformation,
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className={`${styles.container} ${isExpanded ? 'is-expanded' : ''}`}
    >
      <div className={styles.media}>
        <CoverImage image={mainImage} year={compositionMinDate} height={150} />
        <p>
          <CommaSepList list={formats} listTransform={getTitle} />
        </p>
        {pagesCount && <p>{t('common:pagesCount', { count: pagesCount })}</p>}
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
          mostRelevantDate={mostRelevantDate}
          compositionPlace={compositionPlace}
          translatedTitle={translatedTitle}
          mainLanguage={mainLanguage}
        />

        <section>
          <Keywords keywords={dramaticDevices} fill />
          <Keywords keywords={keywords} />
        </section>

        {isExpanded && (
          <Fragment>
            <section>
              <Info label={t('common:note')} show={!!note}>
                <div dangerouslySetInnerHTML={{ __html: note }} />
              </Info>
              <Abstract mainTheme={mainTheme} abstract={abstract} />
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
              title={t('common:publications')}
              show={!!publication || !!modernEdition || !!onlineEdition}
            >
              <Info label={t('common:publication')} show={!!publication}>
                <div dangerouslySetInnerHTML={{ __html: publication }} />
              </Info>
              <Info label={t('common:modernEdition')} show={!!modernEdition}>
                <div dangerouslySetInnerHTML={{ __html: modernEdition }} />
              </Info>
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
            </Section>
          </Fragment>
        )}
      </div>
      <section className={styles.extra}>
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
        {isExpanded && (
          <Fragment>
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
            <Info
              label={t('common:license')}
              show={publicDomain || !!additionalLicenseInformation}
            >
              {publicDomain
                ? t('common:publicDomain')
                : additionalLicenseInformation}
            </Info>
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

WorkSummary.defaultProps = {
  subtitle: null,
  mainImage: [],
  translatedTitle: null,
  dramaticDevices: [],
  keywords: [],
  authors: [],
  mostRelevantDate: null,
  compositionMinDate: null,
  compositionPlace: [],
  mainLanguage: [],
  note: null,
  mainTheme: null,
  abstract: null,
  otherTitles: null,
  firstPerformancePlace: [],
  firstPerformanceDate: null,
  firstPerformanceComplementaryInformation: null,
  publication: null,
  modernEdition: null,
  onlineEdition: null,
  literaryTones: [],
  animationTechniques: [],
  audience: [],
  characters: [],
  actsCount: null,
  pagesCount: null,
  formats: [],
  publicDomain: false,
  additionalLicenseInformation: null,
};

WorkSummary.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  mainImage: PropTypes.array,
  translatedTitle: PropTypes.string,
  dramaticDevices: PropTypes.array,
  keywords: PropTypes.array,
  authors: PropTypes.array,
  mostRelevantDate: PropTypes.string,
  compositionMinDate: PropTypes.number,
  compositionPlace: PropTypes.array,
  mainLanguage: PropTypes.array,
  note: PropTypes.string,
  mainTheme: PropTypes.string,
  abstract: PropTypes.string,
  otherTitles: PropTypes.string,
  firstPerformancePlace: PropTypes.array,
  firstPerformanceDate: PropTypes.string,
  firstPerformanceComplementaryInformation: PropTypes.string,
  publication: PropTypes.string,
  modernEdition: PropTypes.string,
  onlineEdition: PropTypes.string,
  literaryTones: PropTypes.array,
  animationTechniques: PropTypes.array,
  audience: PropTypes.array,
  characters: PropTypes.array,
  actsCount: PropTypes.number,
  pagesCount: PropTypes.number,
  formats: PropTypes.array,
  publicDomain: PropTypes.bool,
  additionalLicenseInformation: PropTypes.string,
};

export default WorkSummary;
