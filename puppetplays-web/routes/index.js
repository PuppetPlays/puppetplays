import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import useSWR, { mutate } from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  fetchAPI,
  getAllWorksQuery,
  getAllWorks,
  getAllLanguagesQuery,
  getAllPlacesQuery,
  getPeriodBoundsQuery,
  WORKS_PAGE_SIZE,
  buildSearchQuery,
} from 'lib/api';
import { queryParamsToState, stateToGraphqlVariables } from 'lib/worksFilters';
import Layout from 'components/Layout';
import WorkSummary from 'components/Work/WorkSummary';
import Pagination from 'components/Pagination';
import Filters from 'components/Filters';
import SearchBar from 'components/SearchBar';
import styles from 'styles/Home.module.css';

function Home({ initialData, languages, places, periodBounds }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [filters, setFilters] = useState(queryParamsToState(router.query));
  const [searchTerms, setSearchTerms] = useState(router.query.search);
  const [currentPage, setCurrentPage] = useState(0);
  const { data } = useSWR(
    [
      getAllWorksQuery(filters),
      router.locale,
      currentPage * WORKS_PAGE_SIZE,
      searchTerms,
      filters,
    ],
    (query, locale, offset, searchTerms, filtersState) => {
      return fetchAPI(query, {
        variables: {
          locale,
          offset,
          limit: WORKS_PAGE_SIZE,
          search: buildSearchQuery(searchTerms),
          ...stateToGraphqlVariables(filtersState),
        },
      });
    },
    {
      initialData,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    mutate([
      getAllWorksQuery(filters),
      router.locale,
      currentPage * WORKS_PAGE_SIZE,
      searchTerms,
      filters,
    ]);
  }, [router.locale, currentPage, searchTerms, filters]);

  const updateRoute = useCallback(
    (values) => {
      const queryParams = queryString.stringify(values, {
        arrayFormat: 'comma',
        skipNull: true,
      });
      router.push(`/?${queryParams}`, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page.selected);
      updateRoute({
        search: searchTerms,
        page: page.selected + 1,
        ...filters,
      });
    },
    [updateRoute, searchTerms, filters],
  );

  const handleChangeFilters = useCallback(
    (value, { name }) => {
      let newFilters;
      if (name === 'period') {
        newFilters = {
          ...filters,
          compositionMinDate: value[0],
          compositionMaxDate: value[1],
        };
      } else {
        newFilters = {
          ...filters,
          [name]: value.length > 0 ? value.map((v) => v.id) : null,
        };
      }
      setFilters(newFilters);
      setCurrentPage(0);
      updateRoute({
        search: searchTerms,
        page: 1,
        ...newFilters,
      });
    },
    [updateRoute, searchTerms, filters],
  );

  const handleChangeSearchQuery = useCallback(
    (search) => {
      setSearchTerms(search);
    },
    [setSearchTerms],
  );

  const handleAfterChangeSearchQuery = useCallback(
    (search) => {
      setCurrentPage(0);
      updateRoute({
        search,
        page: 1,
        ...filters,
      });
    },
    [updateRoute, filters],
  );

  const handleClearAllFilters = useCallback(() => {
    setCurrentPage(0);
    setFilters({});
    updateRoute({
      search: searchTerms,
      page: 1,
    });
  }, [updateRoute, searchTerms]);

  return (
    <Layout
      header={
        <SearchBar
          value={searchTerms}
          onChange={handleChangeSearchQuery}
          onAfterChange={handleAfterChangeSearchQuery}
        />
      }
      aside={
        <Filters
          languageOptions={languages}
          placeOptions={places}
          periodMinMax={periodBounds}
          selectedLanguages={
            filters.mainLanguage &&
            languages.filter(({ id }) => filters.mainLanguage.includes(id))
          }
          selectedPlaces={
            filters.compositionPlace &&
            places.filter(({ id }) => filters.compositionPlace.includes(id))
          }
          selectedPeriodMin={filters.compositionMinDate}
          selectedPeriodMax={filters.compositionMaxDate}
          onChange={handleChangeFilters}
          onClearAll={handleClearAllFilters}
        />
      }
    >
      <Head>
        <title>Puppetplays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.worksHeader}>
        <div className={styles.worksHeaderPageCount}>
          {t('common:results', { count: data.entryCount })}
        </div>
        <Pagination
          forcePage={currentPage}
          pageCount={Math.ceil(data.entryCount / WORKS_PAGE_SIZE)}
          onPageChange={handlePageChange}
        />
      </div>

      <div className={styles.works}>
        {data.entries &&
          data.entries.map((work) => <WorkSummary key={work.id} {...work} />)}
      </div>
    </Layout>
  );
}

Home.propTypes = {
  initialData: PropTypes.object.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object).isRequired,
  places: PropTypes.arrayOf(PropTypes.object).isRequired,
  periodBounds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Home;

export async function getServerSideProps({ locale, req, res, query }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const languages = await fetchAPI(getAllLanguagesQuery, {
    variables: { locale },
  });
  const places = await fetchAPI(getAllPlacesQuery, {
    variables: { locale },
  });
  const periodBounds = await fetchAPI(getPeriodBoundsQuery, {
    variables: { locale },
  });
  const data = await getAllWorks(
    locale,
    query.page * WORKS_PAGE_SIZE,
    buildSearchQuery(query.search),
    query,
  );
  return {
    props: {
      initialData: data,
      languages: languages.entries,
      places: places.entries,
      periodBounds: [periodBounds.min[0].value, periodBounds.max[0].value],
    },
  };
}
