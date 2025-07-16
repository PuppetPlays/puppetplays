import BirthDeathDates from 'components/BirthDeathDates';
import ButtonLink from 'components/ButtonLink';
import Card from 'components/Card';
import Footer from 'components/Footer';
import DiscoveryPathway from 'components/Home/DiscoveryPathway';
import EntryPointCard from 'components/Home/EntryPointCard';
import Section from 'components/Home/Section';
import SplitLayout from 'components/Home/SplitLayout';
import HtmlContent from 'components/HtmlContent';
import Keywords, { Tag } from 'components/Keywords';
import LanguageSelector from 'components/LanguageSelector';
import MainNav from 'components/MainNav';
import NewsletterForm from 'components/NewsletterForm';
import PartnersBanner from 'components/Team/PartnersBanner';
import {
  fetchAPI,
  getHomeQuery,
  getAuthorsByIdsQuery,
  getAllAuthorsIdsQuery,
  getAllWorksKeywordsQuery,
  getWorksKeywordsByIdsQuery,
  getAnimationTechniqueByIdQuery,
  getWorkByIdQuery,
  getFetchAPIClient,
  getPartnersQuery,
  getDiscoveryPathwayResources,
} from 'lib/api';
import { getAllAnimationTechniquesQuery } from 'lib/filtersApi';
import { safeObject, safeArray } from 'lib/safeAccess';
import { getRandom } from 'lib/utils';
import { get } from 'lodash/fp';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import { Fragment, useRef } from 'react';
import styles from 'styles/Home.module.scss';
import clip from 'text-clipper';

const PARTNERS = [
  {
    name: 'upvm',
    link: 'https://www.univ-montp3.fr/',
    logo: '/logo-upvm.svg',
    alt: 'UPVM',
  },
  {
    name: 'rir',
    link: 'https://rirra21.www.univ-montp3.fr/',
    logo: '/logo-rir.svg',
    alt: 'RIR',
  },
];
const PUBLICATIONS = ['pulcinella', 'drama', 'roberto'];

const HeaderImage = () => {
  return (
    <div className={styles.headerImage}>
      <svg
        width="100%"
        viewBox="0 0 1280 398"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 398V0H1280V75L0 398Z" fill="white" />
      </svg>
      <div className={styles.headerImageCopyright}>
        © Bibliothèque nationale de France
      </div>
    </div>
  );
};

const PartnersBar = ({ t }) => {
  return (
    <div className={styles.partnersBar}>
      <ul className={styles.logosBar}>
        <li>
          <Link
            href="https://european-union.europa.eu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/logo-ue.png" height="86" alt={t('home:ue.alt')} />
          </Link>
        </li>
        <li>
          <Link
            href="https://erc.europa.eu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/logo-erc.png" height="86" alt={t('home:erc.alt')} />
          </Link>
        </li>
        <p>{t('home:projectFinancedBy')}</p>
      </ul>
      <div className={styles.logosBarSpacer} />
      <ul className={styles.logosBar}>
        {PARTNERS &&
          Array.isArray(PARTNERS) &&
          PARTNERS.map(partner => (
            <li key={partner.name}>
              <Link
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  height="52"
                  src={partner.logo}
                  alt={partner.alt || `${partner.name} logo`}
                />
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default function Home({
  animationTechnique = null,
  authors = [],
  work = null,
  keywords = [],
  partners = [],
  discoveryPathwayResources = [],
}) {
  console.log('Home', {
    animationTechnique,
    authors,
    work,
    keywords,
    partners,
    discoveryPathwayResources,
  });
  const { t } = useTranslation('home');
  const { locale: _locale } = useRouter();
  const workLinkRef = useRef(null);
  const animationTechniqueLinkRef = useRef(null);

  // Create safe arrays with fallbacks
  const safeAuthors = authors || [];
  const _safeKeywords = keywords || [];
  const safePartners = partners || [];

  // Map partners data to the format expected by PartnersBanner component
  const formattedPartnersData = safePartners.map(partner => ({
    name: partner.partnerName || partner.title,
    link: partner.partnerLink || '#',
    logo:
      partner.partnerLogo && partner.partnerLogo.length > 0
        ? partner.partnerLogo[0].url
        : '',
    alt:
      partner.partnerLogo && partner.partnerLogo.length > 0
        ? partner.partnerLogo[0].alt || partner.partnerName
        : partner.partnerName,
  }));

  return (
    <Fragment>
      <Head>
        <title>{`Puppetplays | ${t('title')}`}</title>
        <meta name="description" content={t('metaDescription')} />
      </Head>

      <div className={styles.container}>
        <div className={styles.topBar}>
          <header>
            <div className={styles.LanguageSelector}>
              <LanguageSelector />
            </div>
            <MainNav />
          </header>
        </div>

        <main>
          <div className={styles.header}>
            <HeaderImage />
            <div className={styles.headerInner}>
              <div className={styles.headerMain}>
                <div className={styles.headerMainTop}>
                  <div className={styles.headerLogo}>
                    <img
                      src="/logo-stamp.png"
                      width="280"
                      alt="Puppetplays - A Research Program Founded by the European Union"
                    />
                  </div>
                  <div className={styles.headerTitles}>
                    <h1 className={styles.title}>
                      <svg
                        width="100%"
                        preserveAspectRatio="none"
                        viewBox="0 0 574 110"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M540 -67L0 0L-5 149L580 104L540 -67Z"
                          fill="#01055B"
                        />
                      </svg>

                      <span>{t('title')}</span>
                    </h1>
                    <h2 className={styles.subtitle}>{t('subtitle')}</h2>
                  </div>
                </div>
                <div className={styles.headerExploreSection}>
                  <ul className={styles.exploreSection}>
                    <EntryPointCard
                      title={t('exploreBy.database.title')}
                      thumbnailUrl="/database-thumbnail.jpg"
                      description={t('exploreBy.database.subtitle')}
                      to="/base-de-donnees?view=MAP"
                    />
                    <EntryPointCard
                      title={t('exploreBy.anthology.title')}
                      thumbnailUrl="/anthology-thumbnail.jpg"
                      description={t('exploreBy.anthology.subtitle')}
                    />
                    <EntryPointCard
                      title={t('exploreBy.pathways.title')}
                      thumbnailUrl="/pathways-thumbnail.jpg"
                    />
                    <EntryPointCard
                      title={t('exploreBy.publications.title')}
                      thumbnailUrl="/publications-thumbnail.jpg"
                      description={t('exploreBy.publications.subtitle')}
                      to="/publications-scientifiques"
                    />
                    <EntryPointCard
                      title={t('exploreBy.project.title')}
                      thumbnailUrl="/project-thumbnail.jpg"
                      to="/projet/presentation"
                    />
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.contentInner}>
              <PartnersBar t={t} />
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.contentInner}>
              <Section title={t('accessToIntregralWorks')} isComingSoon>
                <img src="/home-integral-works.jpg" alt="" />
              </Section>

              <Section isComingSoon={!animationTechnique}>
                <SplitLayout
                  title={
                    animationTechnique
                      ? animationTechnique.title || ''
                      : t('animationTechniqueTitle')
                  }
                  subtitle={t('common:animationTechnique')}
                  image={{
                    url:
                      animationTechnique &&
                      animationTechnique.mainImage &&
                      Array.isArray(animationTechnique.mainImage) &&
                      animationTechnique.mainImage.length > 0
                        ? animationTechnique.mainImage[0]
                        : '/photo-manuscrit.jpg',
                  }}
                >
                  {animationTechnique && animationTechnique.excerpt ? (
                    <>
                      <HtmlContent html={animationTechnique.excerpt} />
                      <ButtonLink
                        href={`/techniques-d-animation/${animationTechnique.id}/${animationTechnique.slug}`}
                        ref={animationTechniqueLinkRef}
                      >
                        {t('common:readNote')}
                      </ButtonLink>
                    </>
                  ) : (
                    <div className={styles.comingSoonContent}>
                      <p>{t('animationTechniqueDescription')}</p>
                    </div>
                  )}
                  <div className={styles.blockLink}>
                    <Link href="/techniques-d-animation">
                      {t('seeAllAnimationTechniques')}
                    </Link>
                  </div>
                </SplitLayout>
              </Section>

              {keywords.length > 0 && (
                <div className={styles.keywords}>
                  <Section title={t('exploreByKeywords')}>
                    <Keywords keywords={keywords} component={Tag} />
                  </Section>
                </div>
              )}

              <Section
                title={t('exploreByAuthors')}
                isComingSoon={safeAuthors.length === 0}
                footer={
                  <Link href="/auteurs">
                    <p>{t('browseAllAuthors')}</p>
                  </Link>
                }
              >
                {safeAuthors.length > 0 ? (
                  <div className={styles.authors}>
                    {safeAuthors &&
                      Array.isArray(safeAuthors) &&
                      safeAuthors.map(entry => (
                        <Card
                          key={entry.id}
                          fixedHeight
                          subtitle={
                            entry.birthDate || entry.deathDate ? (
                              <BirthDeathDates
                                birthDate={entry.birthDate}
                                deathDate={entry.deathDate}
                              />
                            ) : null
                          }
                          imageUrl={
                            entry.mainImage &&
                            Array.isArray(entry.mainImage) &&
                            entry.mainImage.length > 0
                              ? entry.mainImage[0].url
                              : null
                          }
                          mainImage={entry.mainImage}
                          title={entry.title || ''}
                          href={
                            entry.id && entry.slug
                              ? `/auteurs/${entry.id}/${entry.slug}`
                              : '#'
                          }
                        />
                      ))}
                  </div>
                ) : (
                  <div className={styles.authors}>
                    <Card
                      fixedHeight
                      subtitle={<span>1901 — 1983</span>}
                      imageUrl="/authors/Nino Pozzo.jpg"
                      title="Nino Pozzo"
                      href="#"
                    />
                    <Card
                      fixedHeight
                      subtitle={<span>1902 — 1977</span>}
                      imageUrl="/authors/Hermann Aicher.jpg"
                      title="Hermann Aicher"
                      href="#"
                    />
                    <Card
                      fixedHeight
                      subtitle={<span>1809 — 1866</span>}
                      imageUrl="/authors/Johann Scheible.jpg"
                      title="Johann Scheible"
                      href="#"
                    />
                    <Card
                      fixedHeight
                      subtitle={<span>1755 — 1835</span>}
                      imageUrl="/authors/Schink Johann Friedrich.gif"
                      title="Schink Johann Friedrich"
                      href="#"
                    />
                  </div>
                )}
              </Section>

              {work && (
                <Section>
                  <SplitLayout
                    title={work.title || ''}
                    subtitle={t('lightOnWork')}
                    linkRef={workLinkRef}
                    image={
                      work.mainImage &&
                      Array.isArray(work.mainImage) &&
                      work.mainImage.length > 0
                        ? work.mainImage[0]
                        : null
                    }
                  >
                    {work.note && (
                      <HtmlContent
                        html={
                          // Safe text clipping
                          typeof work.note === 'string'
                            ? clip(work.note, 250, { html: true })
                            : ''
                        }
                      />
                    )}
                    <div className={styles.workActions}>
                      <Keywords keywords={work.keywords} component={Tag} />
                      <ButtonLink
                        href={`/oeuvres/${work.id}/${work.slug}`}
                        ref={workLinkRef}
                      >
                        {t('common:readNote')}
                      </ButtonLink>
                    </div>
                  </SplitLayout>
                </Section>
              )}

              <Section title={t('ourPublications')}>
                <ul className={styles.publications}>
                  {PUBLICATIONS &&
                    Array.isArray(PUBLICATIONS) &&
                    PUBLICATIONS.map((key, index) => (
                      <EntryPointCard
                        key={index}
                        title={t(`publications.${key}.title`)}
                        description={t(`publications.${key}.subtitle`)}
                        thumbnailUrl={`/publications-${key}.png`}
                      />
                    ))}
                </ul>
              </Section>

              <Section
                title={t('discoveryPathwayTitle')}
                subtitle={t('pathway')}
                isComingSoon={discoveryPathwayResources.length === 0}
              >
                {discoveryPathwayResources.length > 0 ? (
                  <DiscoveryPathway resources={discoveryPathwayResources} />
                ) : (
                  <img
                    src="/pathway-pulcinella.png"
                    alt=""
                    style={{ opacity: 0.5 }}
                  />
                )}
              </Section>
            </div>
          </div>

          {/* Section partenaires au-dessus du footer */}
          {formattedPartnersData.length > 0 && (
            <div className={styles.content}>
              <div className={styles.contentInner}>
                <Section title={t('common:ourPartners')}>
                  <PartnersBanner partners={formattedPartnersData} />
                </Section>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </Fragment>
  );
}

Home.propTypes = {
  animationTechnique: PropTypes.object,
  work: PropTypes.object,
  keywords: PropTypes.arrayOf(PropTypes.object),
  authors: PropTypes.arrayOf(PropTypes.object),
  partners: PropTypes.arrayOf(PropTypes.object),
  discoveryPathwayResources: PropTypes.arrayOf(PropTypes.object),
};

export async function getServerSideProps({ locale }) {
  try {
    const apiClient = getFetchAPIClient({
      variables: { locale },
    });

    // Fetch initial data with null safety checks
    const [
      homeResult,
      keywordsResult,
      animationTechniquesResult,
      personEntriesResult,
      partnersResult,
      discoveryPathwayResult,
    ] = await Promise.all([
      apiClient(getHomeQuery).catch(() => ({})),
      apiClient(getAllWorksKeywordsQuery).catch(() => ({})),
      apiClient(getAllAnimationTechniquesQuery).catch(() => ({})),
      apiClient(getAllAuthorsIdsQuery).catch(() => ({})),
      apiClient(getPartnersQuery).catch(() => ({})),
      getDiscoveryPathwayResources(locale).catch(() => []),
    ]);

    // Apply null safety to the results
    const homeEntry = safeObject(homeResult).entry || {};
    const keywords = safeArray(safeObject(keywordsResult).tags);
    const animationTechniquesEntries = safeArray(
      safeObject(animationTechniquesResult).entries,
    );
    const personEntries = safeArray(safeObject(personEntriesResult).entries);
    const partnersEntries = safeArray(
      safeObject(partnersResult).partnerEntries,
    );
    const discoveryPathwayResources = Array.isArray(discoveryPathwayResult)
      ? discoveryPathwayResult
      : [];

    // Safe random selections with null checks
    const homeWorks = safeArray(homeEntry.works);
    const randomWorkId = homeWorks.length
      ? getRandom(homeWorks, 1).map(get('id'))
      : [];
    const randomKeywordsIds = keywords.length
      ? getRandom(keywords, 20).map(get('id'))
      : [];
    const randomAnimationTechninquesId = animationTechniquesEntries.length
      ? getRandom(animationTechniquesEntries, 1).map(get('id'))
      : [];
    const randomPersonIds = personEntries.length
      ? getRandom(personEntries, 4).map(get('id'))
      : [];

    // Fetch secondary data with null safety for keys
    const [
      workResult,
      keywordsIdsResult,
      animationTechniqueResult,
      authorsResult,
    ] = await Promise.all([
      randomWorkId.length > 0
        ? fetchAPI(getWorkByIdQuery, {
            variables: { locale, id: randomWorkId[0] },
          }).catch(() => ({}))
        : Promise.resolve({}),
      randomKeywordsIds.length > 0
        ? fetchAPI(getWorksKeywordsByIdsQuery, {
            variables: { locale, id: randomKeywordsIds },
          }).catch(() => ({}))
        : Promise.resolve({}),
      randomAnimationTechninquesId.length > 0
        ? fetchAPI(getAnimationTechniqueByIdQuery, {
            variables: { locale, id: randomAnimationTechninquesId[0] },
          }).catch(() => ({}))
        : Promise.resolve({}),
      randomPersonIds.length > 0
        ? fetchAPI(getAuthorsByIdsQuery, {
            variables: { locale, id: randomPersonIds },
          }).catch(() => ({}))
        : Promise.resolve({}),
    ]);

    // Apply null safety to secondary results
    const homeWorkEntry = safeObject(workResult).entry;
    const homeKeywords = safeArray(safeObject(keywordsIdsResult).tags);
    const homeAnimationTechniqueEntry = safeObject(
      animationTechniqueResult,
    ).entry;
    const homePersonEntries = safeArray(safeObject(authorsResult).entries);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'team'])),
        animationTechnique: homeAnimationTechniqueEntry || null,
        work: homeWorkEntry || null,
        keywords: homeKeywords || [],
        authors: homePersonEntries || [],
        partners: partnersEntries || [],
        discoveryPathwayResources: discoveryPathwayResources || [],
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    // Return safe default values
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home', 'team'])),
        animationTechnique: null,
        work: null,
        keywords: [],
        authors: [],
        partners: [],
        discoveryPathwayResources: [],
      },
    };
  }
}
