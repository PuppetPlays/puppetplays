import AnimationTechnique from 'components/AnimationTechnique';
import CommaSepList from 'components/CommaSepList';
import Info from 'components/Info';
import Keywords, { Tag, TheatricalTechniqueTag } from 'components/Keywords';
import Section from 'components/Section';
import {
  getTitle,
  getFirstItemTitle,
  hasAtLeastOneItem,
  getProperty,
} from 'lib/utils';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';

import Abstract from './Abstract';
import CoverImage from './CoverImage';
import FirstPerformance from './FirstPerformance';
import WorkHeader from './WorkHeader';
import styles from './workSummary.module.scss';

function WorkSummary({
  id = null,
  slug = null,
  title = null,
  subtitle = null,
  translatedTitle = null,
  theatricalTechniques = [],
  mainImage = [],
  keywords = [],
  authors = [],
  mostRelevantDate = null,
  compositionMinDate = null,
  compositionPlace = [],
  mainLanguage = [],
  note = null,
  mainTheme = null,
  abstract = null,
  otherTitles = null,
  firstPerformancePlace = [],
  firstPerformanceDate = null,
  firstPerformanceComplementaryInformation = null,
  publication = null,
  modernEdition = null,
  onlineCopy = null,
  literaryTones = [],
  animationTechniques = [],
  audience = [],
  textCharacters = [],
  actsCount = null,
  pagesCount = null,
  formats = [],
  publicDomain = false,
  additionalLicenseInformation = null,
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className={`${styles.container} ${isExpanded ? 'is-expanded' : ''}`}
    >
      <div className={styles.media}>
        <CoverImage image={mainImage} year={compositionMinDate} />
        <p>
          <CommaSepList list={formats} listTransform={getTitle} />
        </p>
        {pagesCount && <p>{t('common:pagesCount', { count: pagesCount })}</p>}
      </div>
      <div className={styles.body}>
        <WorkHeader
          title={
            <Link href={`/oeuvres/${id}/${slug}`}>
              <p>{title}</p>
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
          <Keywords
            keywords={theatricalTechniques}
            component={TheatricalTechniqueTag}
            fill
          />
          <Keywords keywords={keywords} component={Tag} />
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
              show={!!publication || !!modernEdition || !!onlineCopy}
            >
              <Info label={t('common:publication')} show={!!publication}>
                <div dangerouslySetInnerHTML={{ __html: publication }} />
              </Info>
              <Info label={t('common:modernEdition')} show={!!modernEdition}>
                <div dangerouslySetInnerHTML={{ __html: modernEdition }} />
              </Info>
              {onlineCopy && (
                <div className={styles.onlineCopy}>
                  <Link
                    href={onlineCopy}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('common:onlineCopy')}
                  </Link>
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
        aria-label={t(`common:${isExpanded ? 'closeNote' : 'expandNote'}`)}
      >
        <svg
          focusable="false"
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

WorkSummary.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  mainImage: PropTypes.array,
  translatedTitle: PropTypes.string,
  theatricalTechniques: PropTypes.array,
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
  onlineCopy: PropTypes.string,
  literaryTones: PropTypes.array,
  animationTechniques: PropTypes.array,
  audience: PropTypes.array,
  textCharacters: PropTypes.array,
  actsCount: PropTypes.number,
  pagesCount: PropTypes.number,
  formats: PropTypes.array,
  publicDomain: PropTypes.bool,
  additionalLicenseInformation: PropTypes.string,
};

export default WorkSummary;
