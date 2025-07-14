import FilterSelect from 'components/FilterSelect';
import Footer from 'components/Footer';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import Pagination from 'components/Pagination';
import { fetchCollectionData, getMetaValue } from 'lib/nakala';
import { stringifyQuery } from 'lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useCallback, useEffect } from 'react';
import styles from 'styles/Anthology.module.scss';

const ANTHOLOGY_COLLECTION_ID = '10.34847/nkl.1ded03r2';

const AnthologyPage = ({ initialPlaysData, error }) => {
  const { t, i18n } = useTranslation(['common', 'anthology']);
  const router = useRouter();
  const [searchTerms, setSearchTerms] = useState(router.query.search || '');
  const [playsData, setPlaysData] = useState(initialPlaysData || []);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    router.query.page ? parseInt(router.query.page, 10) - 1 : 0,
  );
  const [filters, setFilters] = useState({
    language: router.query.language || '',
    century: router.query.century || '',
    sortBy: router.query.sortBy || 'title',
  });

  const PLAYS_PER_PAGE = 12;

  useEffect(() => {
    if (router.query.language) {
      setFilters(prev => ({
        ...prev,
        language: router.query.language,
      }));
    }

    if (router.query.century) {
      setFilters(prev => ({
        ...prev,
        century: router.query.century,
      }));
    }

    if (router.query.sortBy) {
      setFilters(prev => ({
        ...prev,
        sortBy: router.query.sortBy,
      }));
    }

    if (router.query.page) {
      setCurrentPage(parseInt(router.query.page, 10) - 1);
    }

    if (router.query.search) {
      setSearchTerms(router.query.search);
    }
  }, [router.query]);

  const filteredPlays = playsData.filter(play => {
    if (searchTerms) {
      const search = searchTerms.toLowerCase();
      if (
        !play.title.toLowerCase().includes(search) &&
        !play.author.toLowerCase().includes(search) &&
        !play.description.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    if (filters.language && play.language !== filters.language) {
      return false;
    }
    if (filters.century && play.century !== filters.century) {
      return false;
    }
    return true;
  });

  const sortedPlays = filteredPlays.sort((a, b) => {
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (filters.sortBy === 'author') {
      return a.author.localeCompare(b.author);
    } else if (filters.sortBy === 'date') {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  const pageCount = Math.ceil(sortedPlays.length / PLAYS_PER_PAGE);
  const paginatedPlays = sortedPlays.slice(
    currentPage * PLAYS_PER_PAGE,
    (currentPage + 1) * PLAYS_PER_PAGE,
  );

  const handlePageChange = useCallback(
    page => {
      const newPage = page.selected;
      setCurrentPage(newPage);
      router.push(
        `/anthologie?${stringifyQuery({
          page: newPage + 1,
          search: searchTerms,
          language: filters.language,
          century: filters.century,
          sortBy: filters.sortBy,
        })}`,
        undefined,
        { shallow: true },
      );
    },
    [router, searchTerms, filters],
  );

  const handleFilterChange = useCallback(
    (value, { name }) => {
      const newFilters = { ...filters };
      if (name === 'language') {
        newFilters.language = value ? value.id : '';
      } else if (name === 'century') {
        newFilters.century = value ? value.id : '';
      } else if (name === 'sortBy') {
        newFilters.sortBy = value ? value.id : 'title';
      }
      setFilters(newFilters);
      setCurrentPage(0);
      router.push(
        `/anthologie?${stringifyQuery({
          page: 1,
          search: searchTerms,
          language: newFilters.language,
          century: newFilters.century,
          sortBy: newFilters.sortBy,
        })}`,
        undefined,
        { shallow: true },
      );
    },
    [router, searchTerms, filters],
  );

  const getUniqueLanguages = plays => {
    const languages = new Set();
    plays.forEach(play => {
      if (play.language) languages.add(play.language);
    });
    return Array.from(languages).map(lang => ({ id: lang, title: lang }));
  };

  const getUniqueCenturies = plays => {
    const centuries = new Set();
    plays.forEach(play => {
      if (play.century) centuries.add(play.century);
    });
    return Array.from(centuries)
      .sort()
      .map(century => ({ id: century, title: `${century}e siècle` }));
  };

  const languageOptions = getUniqueLanguages(playsData);
  const centuryOptions = getUniqueCenturies(playsData);

  if (error) {
    return (
      <Layout
        title={t('anthology:title')}
        metaDescription={t('anthology:metaDescription')}
      >
        <Head>
          <title>{`${t('anthology:title')} | Puppetplays`}</title>
        </Head>
        <div className={styles.container}>
          <NoResults
            title={t('common:error.title')}
            message={t('common:error.loadingData', { error: error })}
          />
        </div>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout
      title={t('anthology:title')}
      metaDescription={t('anthology:metaDescription')}
    >
      <Head>
        <title>{`${t('anthology:title')} | Puppetplays`}</title>
        <meta name="description" content={t('anthology:metaDescription')} />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('anthology:title')}</h1>
          <p className={styles.paragraph}>{t('anthology:description')}</p>
        </header>

        <div className={styles.filtersSection}>
          <div className={styles.playsCount}>
            {sortedPlays.length === 0
              ? t('anthology:noPlays')
              : sortedPlays.length === 1
                ? t('anthology:onePlay')
                : t('anthology:playsCount', { count: sortedPlays.length })}
          </div>

          <div className={styles.filtersContainer}>
            <FilterSelect
              name="language"
              value={languageOptions.find(o => o.id === filters.language)}
              options={languageOptions}
              placeholder={t('common:filters.mainLanguagePlaceholder')}
              onChange={handleFilterChange}
              isClearable={true}
              className={styles.filterSelect}
            />

            <FilterSelect
              name="century"
              value={centuryOptions.find(o => o.id === filters.century)}
              options={centuryOptions}
              placeholder={t('anthology:filterByCentury')}
              onChange={handleFilterChange}
              isClearable={true}
              className={styles.filterSelect}
            />

            <FilterSelect
              name="sortBy"
              value={[
                { id: 'title', title: t('common:title') },
                { id: 'author', title: t('common:author') },
                { id: 'date', title: t('common:date') },
              ].find(o => o.id === filters.sortBy)}
              options={[
                { id: 'title', title: t('common:title') },
                { id: 'author', title: t('common:author') },
                { id: 'date', title: t('common:date') },
              ]}
              onChange={handleFilterChange}
              isClearable={false}
              className={styles.filterSelect}
            />
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <p>{t('common:loading')}</p>
          </div>
        ) : paginatedPlays.length > 0 ? (
          <>
            <div className={styles.playsGrid}>
              {paginatedPlays.map(play => (
                <Link
                  key={play.id}
                  href={`/anthologie/${encodeURIComponent(play.id)}`}
                  className={styles.playCard}
                >
                  <div className={styles.playThumbnail}>
                    {play.thumbnail ? (
                      <img
                        src={play.thumbnail}
                        alt={play.title}
                        className={styles.playImage}
                      />
                    ) : (
                      <div className={styles.playImagePlaceholder}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className={styles.playBadges}>
                      {play.language && (
                        <span className={styles.languageBadge}>
                          {play.language}
                        </span>
                      )}
                      {play.century && (
                        <span className={styles.centuryBadge}>
                          {play.century}e
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.playInfo}>
                    <h3 className={styles.playTitle}>{play.title}</h3>
                    <p className={styles.playAuthor}>{play.author}</p>
                    <p className={styles.playDate}>
                      {new Date(play.date).getFullYear()}
                    </p>
                    <p className={styles.playDescription}>{play.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {pageCount > 1 && (
              <div className={styles.paginationContainer}>
                <Pagination
                  forcePage={currentPage}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <NoResults
            icon="search"
            title={t('common:error.dataNotFound')}
            message={t('common:error.noResultsFound')}
          />
        )}
      </div>
      
      <Footer />
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  const currentLang = locale || 'fr';
  try {
    // Fetch the anthology collection data
    const collectionData = await fetchCollectionData(ANTHOLOGY_COLLECTION_ID, {
      page: 1,
      limit: 100, // Get all plays for now
    });

    const playsData = collectionData.data.map(item => {
      const title =
        getMetaValue(item.metas, 'http://nakala.fr/terms#title', currentLang) ||
        item.title ||
        'Titre non disponible';

      const author =
        getMetaValue(item.metas, 'http://purl.org/dc/terms/creator') ||
        'Auteur inconnu';

      const description =
        getMetaValue(
          item.metas,
          'http://purl.org/dc/terms/description',
          currentLang,
        ) || '';

      const language =
        getMetaValue(item.metas, 'http://purl.org/dc/terms/language') || '';

      const date = item.creDate || new Date().toISOString();

      // Extract century from date
      const year = new Date(date).getFullYear();
      const century = Math.ceil(year / 100);

      return {
        id: item.identifier,
        title,
        author,
        description,
        language,
        date,
        century,
        thumbnail: null, // Will be populated from IIIF manifest if available
      };
    });

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'anthology', 'home'])),
        initialPlaysData: playsData,
        error: null,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching anthology data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'anthology', 'home'])),
        initialPlaysData: [],
        error: error.message || error.toString(),
      },
      revalidate: 60,
    };
  }
}

export default AnthologyPage;
