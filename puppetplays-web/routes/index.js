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
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  fetchAPI,
  getHomeQuery,
  getAuthorsByIdsQuery,
  getAllWorksKeywordsQuery,
  getWorksKeywordsByIdsQuery,
  getAnimationTechniqueByIdQuery,
  getWorkByIdQuery,
} from 'lib/api';
import {
  getAllAnimationTechniquesQuery,
  getAllPersonsQuery,
} from 'lib/filtersApi';
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
import styles from 'styles/Home.module.scss';

const FINANCERS = ['ue', 'erc'];
const PARTNERS = ['rir', 'upvm', 'intactile', 'humanum'];
const PUBLICATIONS = ['pulcinella', 'drama', 'roberto'];

export default function Home({ animationTechnique, authors, work, keywords }) {
  const { t } = useTranslation('home');
  const headerRef = useRef(null);
  const topBarRef = useRef(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [EXPLORE_BY] = useState({
    database: { to: '/repertoire' },
    authors: { to: '/auteurs' },
    pathways: {},
    publications: {},
    project: { href: t('ourSiteUrl') },
  });

  const handleScroll = useCallback(() => {
    if (!headerRef.current || !topBarRef.current) {
      return;
    }

    const header = headerRef.current;
    const stickyHeader = topBarRef.current;
    const headerHeight = header.offsetHeight;

    console.log(window.pageYOffset, headerHeight);
    if (window.pageYOffset > headerHeight) {
      if (!isHeaderSticky) {
        stickyHeader.classList.add(styles.sticky);
        setIsHeaderSticky(true);
      }
    } else {
      stickyHeader.classList.remove(styles.sticky);
      setIsHeaderSticky(false);
    }
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }, [handleScroll]);

  return (
    <Fragment>
      <Head>
        <title>Puppetplays | {t('title')}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.topBar} ref={topBarRef}>
          {!isHeaderSticky ? (
            <header>
              <div className={styles.LanguageSelector}>
                <LanguageSelector inverse path="/" />
              </div>
            </header>
          ) : (
            <Header>
              <SearchBarStateful />
            </Header>
          )}
        </div>

        <main>
          <div className={styles.header} ref={headerRef}>
            <div className={styles.headerInner}>
              <div className={styles.headerMain}>
                <div>
                  <img
                    src="/logo-stamp-white.png"
                    width="205"
                    alt="Puppetplays - A Research Program Founded by the European Union"
                  />
                </div>
                <h1 className={styles.title}>{t('title')}</h1>
                <h2 className={styles.subtitle}>{t('subtitle')}</h2>
                <SearchBarStateful />
              </div>

              <div className={styles.partnersBar}>
                <ul className={styles.logosBar}>
                  {FINANCERS.map((partner) => (
                    <li key={partner}>
                      <a
                        href={t(`${partner}.url`)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          height="49"
                          src={`/logo-${partner}.png`}
                          alt={t(`${partner}.alt`)}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                <div>{t('ercLabel')}</div>
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
                          height="44"
                          src={`/logo-${partner}.png`}
                          alt={t(`${partner}.alt`)}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.contentInner}>
              <Section title={t('explore')}>
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
              </Section>

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
                >
                  <p>{animationTechnique.excerpt}</p>
                  <ButtonLink
                    href={`/techniques-d-animation/${animationTechnique.id}/${animationTechnique.slug}`}
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
                      buttonLabel={t('common:openNote')}
                      subtitle={`${entry.birthDate} - ${entry.deathDate}`}
                      href={`/auteurs/${entry.id}/${entry.slug}`}
                      {...entry}
                    />
                  ))}
                </div>
              </Section>

              <Section>
                <SplitLayout
                  title={work.title}
                  subtitle={t('lightOnWork')}
                  image={work.mainImage && work.mainImage[0]}
                >
                  <div style={{ marginBottom: 20 }}>
                    <div dangerouslySetInnerHTML={{ __html: work.note }} />
                    <Keywords keywords={work.keywords} component={Tag} />
                  </div>
                  <ButtonLink href={`/oeuvres/${work.id}/${work.slug}`}>
                    {t('common:readNote')}
                  </ButtonLink>
                </SplitLayout>
              </Section>

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
                        src={`/logo-${partner}.png`}
                        alt={t(`${partner}.alt`)}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section className={styles.intro}>
            <div className={styles.footerInner}>
              <div className={styles.introContent}>
                <h2 className={styles.introSubtitle}>
                  {t('aboutPuppetplays')}
                </h2>
                <h3 className={styles.introTitle}>{t('introTitle')}</h3>
                <p>{t('introText1')}</p>
                <p>{t('introText2')}</p>
                <p>{t('introText3')}</p>
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
                  <a href="mailto:contact@puppetplays.eu">
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

  const { entries: personEntries } = await fetchAPI(getAllPersonsQuery, {
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
