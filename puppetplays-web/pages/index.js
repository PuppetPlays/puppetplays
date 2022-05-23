import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import clip from 'text-clipper';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  fetchAPI,
  getHomeQuery,
  getAuthorsByIdsQuery,
  getAllAuthorsIdsQuery,
  getAllWorksKeywordsQuery,
  getWorksKeywordsByIdsQuery,
  getAnimationTechniqueByIdQuery,
  getWorkByIdQuery,
} from 'lib/api';
import { getAllAnimationTechniquesQuery } from 'lib/filtersApi';
import { getRandom } from 'lib/utils';
import LanguageSelector from 'components/LanguageSelector';
import SearchBarStateful from 'components/SearchBarStateful';
import EntryPointCard from 'components/Home/EntryPointCard';
import ButtonLink from 'components/ButtonLink';
import Card from 'components/Card';
import Section from 'components/Home/Section';
import SplitLayout from 'components/Home/SplitLayout';
import Keywords, { Tag } from 'components/Keywords';
import Header from 'components/Header';
import MainNav from 'components/MainNav';
import HtmlContent from 'components/HtmlContent';
import BirthDeathDates from 'components/BirthDeathDates';
import NewsletterForm from 'components/NewsletterForm';
import styles from 'styles/Home.module.scss';

const PARTNERS = ['rir', 'upvm'];
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
    </div>
  );
};

const PartnersBar = ({ t }) => {
  return (
    <div className={styles.partnersBar}>
      <ul className={styles.logosBar}>
        <li>
          <a
            href="https://erc.europa.eu"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img height="86" src="/logo-erc-full.png" alt="ERC - GA 835193" />
          </a>
        </li>
      </ul>
      <div className={styles.logosBarSpacer} />
      <ul className={styles.logosBar}>
        {PARTNERS.map((partner) => (
          <li key={partner}>
            <a
              href={t(`${partner}.url`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                height="52"
                src={`/logo-${partner}.svg`}
                alt={t(`${partner}.alt`)}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Home({ animationTechnique, authors, work, keywords }) {
  const { t } = useTranslation('home');
  const headerRef = useRef(null);
  const topBarRef = useRef(null);
  const workLinkRef = useRef(null);
  const animationTechniqueLinkRef = useRef(null);
  const [EXPLORE_BY] = useState({
    database: { to: '/base-de-donnees' },
    authors: { to: '/auteurs' },
    pathways: {},
    publications: {},
    project: { href: t('ourSiteUrl') },
  });

  return (
    <Fragment>
      <Head>
        <title>Puppetplays | {t('title')}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.topBar} ref={topBarRef}>
          <header>
            <div className={styles.LanguageSelector}>
              <LanguageSelector path="/" />
            </div>
            <MainNav />
          </header>
        </div>

        <main>
          <div className={styles.header} ref={headerRef}>
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
                    {Object.entries(EXPLORE_BY).map(([key, props]) => (
                      <EntryPointCard
                        key={key}
                        title={t(`exploreBy.${key}.title`)}
                        description={t(`exploreBy.${key}.subtitle`)}
                        thumbnailUrl={`/${key}-thumbnail.png`}
                        {...props}
                      />
                    ))}
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
                <img src="/home-integral-works.png" alt="" />
              </Section>

              <Section>
                <SplitLayout
                  title={animationTechnique.title}
                  subtitle={t('common:animationTechnique')}
                  image={
                    animationTechnique.mainImage &&
                    animationTechnique.mainImage[0]
                  }
                  linkRef={animationTechniqueLinkRef}
                >
                  <HtmlContent html={animationTechnique.excerpt} />
                  <ButtonLink
                    href={`/techniques-d-animation/${animationTechnique.id}/${animationTechnique.slug}`}
                    ref={animationTechniqueLinkRef}
                  >
                    {t('common:readNote')}
                  </ButtonLink>
                  <div className={styles.blockLink}>
                    <Link href="/techniques-d-animation">
                      <a>{t('seeAllAnimationTechniques')}</a>
                    </Link>
                  </div>
                </SplitLayout>
              </Section>

              <div className={styles.keywords}>
                <Section title={t('exploreByKeywords')}>
                  <Keywords keywords={keywords} component={Tag} />
                </Section>
              </div>

              <Section
                title={t('exploreByAuthors')}
                footer={
                  <Link href="/auteurs">
                    <a>{t('browseAllAuthors')}</a>
                  </Link>
                }
              >
                <div className={styles.authors}>
                  {authors.map((entry) => (
                    <Card
                      key={entry.id}
                      fixedHeight
                      subtitle={
                        <BirthDeathDates
                          birthDate={entry.birthDate}
                          deathDate={entry.deathDate}
                        />
                      }
                      href={`/auteurs/${entry.id}/${entry.slug}`}
                      {...entry}
                    />
                  ))}
                </div>
              </Section>

              {work && (
                <Section>
                  <SplitLayout
                    title={work.title}
                    subtitle={t('lightOnWork')}
                    image={work.mainImage && work.mainImage[0]}
                    linkRef={workLinkRef}
                  >
                    <div style={{ marginBottom: 20 }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: clip(work.note, 250, {
                            html: true,
                            maxLines: 5,
                          }),
                        }}
                      />
                      <Keywords keywords={work.keywords} component={Tag} />
                    </div>
                    <ButtonLink
                      href={`/oeuvres/${work.id}/${work.slug}`}
                      ref={workLinkRef}
                    >
                      {t('common:readNote')}
                    </ButtonLink>
                  </SplitLayout>
                </Section>
              )}

              <Section title={t('ourPublications')}>
                <ul className={styles.publications}>
                  {PUBLICATIONS.map((key, index) => (
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
        </main>
        <footer className={styles.footer}>
          <section className={styles.footerPartners}>
            <div className={styles.footerPartnersInner}>
              <div className={styles.footerPartnersFinancers}>
                <img src="/logo-ue.png" height="80" alt={t('ue.alt')} />
                <img src="/logo-erc.png" height="80" alt={t('erc.alt')} />
                <p>{t('projectFinancedBy')}</p>
              </div>
              <ul className={styles.footerPartnersPartners}>
                {PARTNERS.map((partner) => (
                  <li key={partner}>
                    <a
                      href={t(`${partner}.url`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        height="50"
                        src={`/logo-${partner}.svg`}
                        alt={t(`${partner}.alt`)}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className={styles.intro}>
            <div className={styles.footerTopBar}>
              <a
                href="https://www.facebook.com/ERCPuppetPlays"
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            </div>
            <div className={styles.footerInner}>
              <div className={styles.introContent}>
                <h2 className={styles.introSubtitle}>
                  {t('aboutPuppetplays')}
                </h2>
                <h3 className={styles.introTitle}>{t('introTitle')}</h3>
                <p>{t('introText1')}</p>
                <p>{t('introText2')}</p>
                <p>{t('introText3')}</p>

                <NewsletterForm />

                <div className={styles.introContentLinks}>
                  <a
                    href={t('ourSiteUrl')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.buttonLink}
                  >
                    {t('common:knowMore')}
                  </a>
                  <a
                    href={t('theTeamUrl')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('theTeam')}
                  </a>
                  <a
                    href={t('projectNewsUrl')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('projectNews')}
                  </a>
                  <a href="mailto:puppetplays@univ-montp3.fr">
                    {t('common:contactUs')}
                  </a>
                </div>
              </div>
              <div className={styles.introMedia}>
                <img src="/home-intro-illustration.png" alt="" />
                <p className={styles.introMediaCaption}>
                  {t('introImageCaption')}
                </p>
              </div>
            </div>
          </section>
        </footer>
      </div>
    </Fragment>
  );
}

Home.defaultProps = {
  animationTechnique: null,
  work: null,
  keywords: [],
  authors: [],
};

Home.propTypes = {
  animationTechnique: PropTypes.object,
  work: PropTypes.object,
  keywords: PropTypes.arrayOf(PropTypes.object),
  authors: PropTypes.arrayOf(PropTypes.object),
};

export async function getServerSideProps({ locale, req, res }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const { entry: homeEntry } = await fetchAPI(getHomeQuery, {
    variables: { locale },
  });
  const randomWorkId = getRandom(homeEntry.works, 1).map((p) => p.id);
  const { entry: homeWorkEntry } = await fetchAPI(getWorkByIdQuery, {
    variables: { locale, id: randomWorkId[0] },
  });

  const { tags: keywords } = await fetchAPI(getAllWorksKeywordsQuery, {
    variables: { locale },
  });
  const randomKeywordsIds = getRandom(keywords, 20).map((p) => p.id);
  const { tags: homeKeywords } = await fetchAPI(getWorksKeywordsByIdsQuery, {
    variables: { locale, id: randomKeywordsIds },
  });

  const { entries: animationTechniquesEntries } = await fetchAPI(
    getAllAnimationTechniquesQuery,
    {
      variables: { locale },
    },
  );
  const randomAnimationTechninquesId = getRandom(
    animationTechniquesEntries,
    1,
  ).map((p) => p.id);
  const { entry: homeAnimationTechninqueEntry } = await fetchAPI(
    getAnimationTechniqueByIdQuery,
    {
      variables: { locale, id: randomAnimationTechninquesId[0] },
    },
  );

  const { entries: personEntries } = await fetchAPI(getAllAuthorsIdsQuery, {
    variables: { locale },
  });

  const randomPersonIds = getRandom(personEntries, 4).map((p) => p.id);
  const { entries: homePersonEntries } = await fetchAPI(getAuthorsByIdsQuery, {
    variables: { locale, id: randomPersonIds },
  });

  return {
    props: {
      animationTechnique: homeAnimationTechninqueEntry,
      work: homeWorkEntry,
      keywords: homeKeywords,
      authors: homePersonEntries,
    },
  };
}
