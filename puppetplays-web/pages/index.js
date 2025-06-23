import BirthDeathDates from 'components/BirthDeathDates';
import ButtonLink from 'components/ButtonLink';
import Card from 'components/Card';
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
}) {
  console.log('Home', {
    animationTechnique,
    authors,
    work,
    keywords,
    partners,
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
                title={t('pulcinellaPathwayTitle')}
                subtitle={t('pathway')}
                isComingSoon
              >
                <img
                  src="/pathway-pulcinella.png"
                  alt=""
                  style={{ opacity: 0.5 }}
                />
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
        <footer className={styles.footer}>
          <section className={styles.intro}>
            <div className={styles.footerInner}>
              <div className={styles.introContent}>
                <NewsletterForm />

                <div className={styles.introContentLinks}>
                  <Link
                    href={t('ourSiteUrl')}
                    className={styles.buttonLink}
                  >
                    {t('common:knowMore')}
                  </Link>
                  <Link href={t('theTeamUrl')}>
                    {t('theTeam')}
                  </Link>
                  <Link href={t('projectNewsUrl')}>
                    {t('projectNews')}
                  </Link>
                  <Link
                    href="https://tact.demarre-shs.fr/project/41"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('common:tactPlatform')}
                  </Link>
                  <Link href="mailto:puppetplays@univ-montp3.fr">
                    {t('common:contactUs')}
                  </Link>
                  <Link href="/accessibilite">{t('common:accessibility')}</Link>
                  <Link
                    href="https://www.facebook.com/ERCPuppetPlays"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.facebookButton}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32.0001 16.0032C32.0544 24.8285 24.7221 32.206 15.6084 31.9951C7.02749 31.797 -0.182823 24.6727 0.00353354 15.6332C0.180572 7.06862 7.26975 -0.189449 16.3809 0.00275566C24.9753 0.183953 32.034 7.23881 32.0001 16.0032ZM17.549 16.1014C18.2563 16.1014 18.9027 16.1014 19.5498 16.1014C20.136 16.1006 20.1538 16.1022 20.2199 15.5095C20.308 14.7119 20.3495 13.9084 20.4443 13.1108C20.4875 12.7459 20.363 12.6239 20.0149 12.629C19.3237 12.64 18.6307 12.6121 17.9404 12.6409C17.5939 12.6553 17.4897 12.5342 17.5067 12.209C17.5321 11.7306 17.5185 11.2506 17.5448 10.7722C17.577 10.1837 17.8701 9.86702 18.4673 9.8213C19.0009 9.78065 19.5388 9.78658 20.0742 9.79166C20.385 9.7942 20.5324 9.70784 20.5223 9.35645C20.4985 8.53852 20.5002 7.7189 20.5223 6.90097C20.5324 6.52079 20.3791 6.4031 20.0242 6.4141C19.0094 6.44628 17.9937 6.4539 16.9781 6.48607C15.1103 6.5445 13.7126 7.81373 13.5313 9.66973C13.45 10.4953 13.456 11.331 13.4653 12.1616C13.4695 12.5537 13.3873 12.7332 12.9553 12.6832C12.6072 12.6426 12.2506 12.6832 11.8973 12.6713C11.622 12.662 11.4831 12.7442 11.489 13.0541C11.5034 13.9431 11.5001 14.8322 11.4899 15.7212C11.4873 15.9778 11.5975 16.0845 11.838 16.0853C12.1913 16.087 12.5445 16.0955 12.8969 16.0853C13.4483 16.0692 13.4483 16.0641 13.4483 16.6306C13.4483 19.4671 13.4534 22.3045 13.4407 25.141C13.439 25.5457 13.5686 25.6913 13.9769 25.6829C14.979 25.6617 15.9811 25.6769 16.9832 25.6752C17.5295 25.6744 17.5566 25.6465 17.5566 25.0969C17.5558 22.8108 17.5524 20.5238 17.5507 18.2377C17.5482 17.5501 17.549 16.8601 17.549 16.1014Z"
                        fill="#F0F0F3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </footer>
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
    ] = await Promise.all([
      apiClient(getHomeQuery).catch(() => ({})),
      apiClient(getAllWorksKeywordsQuery).catch(() => ({})),
      apiClient(getAllAnimationTechniquesQuery).catch(() => ({})),
      apiClient(getAllAuthorsIdsQuery).catch(() => ({})),
      apiClient(getPartnersQuery).catch(() => ({})),
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
      },
    };
  }
}
