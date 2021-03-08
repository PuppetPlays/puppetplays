import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { getTitle, getFirstItemTitle, hasAtLeastOneItem } from 'lib/utils';
import Keywords from 'components/Keywords';
import CommaSepList from 'components/CommaSepList';
import Section from 'components/Section';
import Info from 'components/Info';
import Abstract from './Abstract';
import WorkHeader from './WorkHeader';
import FirstPerformance from './FirstPerformance';
import styles from './workSummary.module.scss';

function WorkSummary({
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
        />

        <section>
          <Keywords keywords={dramaturgicTechniques} fill />
          <Keywords keywords={keywords} />
        </section>

        {isExpanded && (
          <Fragment>
            <section>
              <Info label={t('common:notice')} show={notice}>
                <div dangerouslySetInnerHTML={{ __html: notice }} />
              </Info>
              <Abstract mainTheme={mainTheme} abstract={abstract} />
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
              title={t('common:publications')}
              show={edition || modernEditions || onlineEdition}
            >
              <Info label={t('common:edition')} show={edition}>
                <div dangerouslySetInnerHTML={{ __html: edition }} />
              </Info>
              <Info label={t('common:modernEditions')} show={modernEditions}>
                <div dangerouslySetInnerHTML={{ __html: modernEditions }} />
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
        <Info label={t('common:registers')} show={hasAtLeastOneItem(registers)}>
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
        {isExpanded && (
          <Fragment>
            <Info
              label={t('common:characters')}
              show={hasAtLeastOneItem(characters)}
            >
              <CommaSepList list={characters} listTransform={getTitle} />
            </Info>
            <Info label={t('common:actsCount')} show={actsCount}>
              {actsCount}
            </Info>
            <Info
              label={t('common:license')}
              show={publicDomain || additionalLicenseInformation}
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
  translatedTitle: null,
  dramaturgicTechniques: [],
  keywords: [],
  authors: [],
  referenceDate: null,
  writingPlace: [],
  mainLanguage: [],
  notice: null,
  mainTheme: null,
  abstract: null,
  otherTitles: null,
  firstPerformancePlace: [],
  firstPerformanceDate: null,
  firstPerformanceExtraInfo: null,
  edition: null,
  modernEditions: null,
  onlineEdition: null,
  registers: [],
  handlingTechniques: [],
  audience: [],
  characters: [],
  actsCount: null,
  pageCount: null,
  formats: [],
  publicDomain: false,
  additionalLicenseInformation: null,
};

WorkSummary.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  translatedTitle: PropTypes.string,
  dramaturgicTechniques: PropTypes.array,
  keywords: PropTypes.array,
  authors: PropTypes.array,
  referenceDate: PropTypes.string,
  writingPlace: PropTypes.array,
  mainLanguage: PropTypes.array,
  notice: PropTypes.string,
  mainTheme: PropTypes.string,
  abstract: PropTypes.string,
  otherTitles: PropTypes.string,
  firstPerformancePlace: PropTypes.array,
  firstPerformanceDate: PropTypes.string,
  firstPerformanceExtraInfo: PropTypes.string,
  edition: PropTypes.string,
  modernEditions: PropTypes.string,
  onlineEdition: PropTypes.string,
  registers: PropTypes.array,
  handlingTechniques: PropTypes.array,
  audience: PropTypes.array,
  characters: PropTypes.array,
  actsCount: PropTypes.number,
  pageCount: PropTypes.number,
  formats: PropTypes.array,
  publicDomain: PropTypes.bool,
  additionalLicenseInformation: PropTypes.string,
};

export default WorkSummary;
