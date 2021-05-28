import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useSWR, { mutate } from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  fetchAPI,
  getAllWorksQuery,
  getAllWorks,
  WORKS_PAGE_SIZE,
  buildSearchQuery,
} from 'lib/api';
import {
  getAllAnimationTechniquesQuery,
  getAllAudiencesQuery,
  getAllFormatsQuery,
  getAllLanguagesQuery,
  getAllPersonsQuery,
  getAllLiteraryTonesQuery,
  getAllPlacesQuery,
  getPeriodBoundsQuery,
} from 'lib/filtersApi';
import {
  worksQueryParamsToState as queryParamsToState,
  worksStateToGraphqlVariables as stateToGraphqlVariables,
} from 'lib/filters';
import { hasAtLeastOneItem, stringifyQuery } from 'lib/utils';
import Layout from 'components/Layout';
import WorkSummary from 'components/Work/WorkSummary';
import Pagination from 'components/Pagination';
import Filters from 'components/WorksFilters';
import SearchBar from 'components/SearchBar';
import styles from 'styles/Home.module.css';

function Home({
  initialData,
  languages,
  places,
  periodBounds,
  authors,
  literaryTones,
  animationTechniques,
  audiences,
  formats,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [filters, setFilters] = useState(() => {
    return queryParamsToState(router.query);
  });
  const [searchTerms, setSearchTerms] = useState(router.query.search);
  const [currentPage, setCurrentPage] = useState(
    router.query.page ? parseInt(router.query.page, 10) - 1 : 0,
  );
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

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page.selected);
      router.push(
        `/?${stringifyQuery({
          search: searchTerms,
          page: page.selected + 1,
          ...filters,
        })}`,
        undefined,
        {
          shallow: true,
        },
      );
    },
    [router, filters, searchTerms],
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
      } else if (name === 'publicDomain') {
        newFilters = {
          ...filters,
          publicDomain: value,
        };
      } else {
        newFilters = {
          ...filters,
          [name]: value.length > 0 ? value.map((v) => v.id) : null,
        };
      }
      setFilters(newFilters);
      setCurrentPage(0);
      router.push(
        `/?${stringifyQuery({
          search: searchTerms,
          page: 1,
          ...newFilters,
        })}`,
        undefined,
        {
          shallow: true,
        },
      );
    },
    [router, filters, searchTerms],
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
      router.push(
        `/?${stringifyQuery({
          search,
          page: 1,
          ...filters,
        })}`,
        undefined,
        {
          shallow: true,
        },
      );
    },
    [router, filters],
  );

  const handleClearAllFilters = useCallback(() => {
    setCurrentPage(0);
    setFilters({});
    router.push(
      `/?${stringifyQuery({
        search: searchTerms,
        page: 1,
      })}`,
      undefined,
      {
        shallow: true,
      },
    );
  }, [router, searchTerms]);

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
          authorsOptions={authors}
          literaryTonesOptions={literaryTones}
          animationTechniquesOptions={animationTechniques}
          audiencesOptions={audiences}
          formatsOptions={formats}
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
          selectedAuthors={
            filters.authors &&
            authors.filter(({ id }) => filters.authors.includes(id))
          }
          selectedLiteraryTones={
            filters.literaryTones &&
            literaryTones.filter(({ id }) => filters.literaryTones.includes(id))
          }
          selectedAnimationTechniques={
            filters.animationTechniques &&
            animationTechniques.filter(({ id }) =>
              filters.animationTechniques.includes(id),
            )
          }
          selectedAudiences={
            filters.audience &&
            audiences.filter(({ id }) => filters.audience.includes(id))
          }
          selectedFormats={
            filters.formats &&
            formats.filter(({ id }) => filters.formats.includes(id))
          }
          publicDomain={!!filters.publicDomain}
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
        <div className={styles.worksScroll}>
          {data.entries &&
            data.entries.map((work) => <WorkSummary key={work.id} {...work} />)}
        </div>
      </div>
    </Layout>
  );
}

Home.propTypes = {
  initialData: PropTypes.object.isRequired,
  languages: PropTypes.arrayOf(PropTypes.object).isRequired,
  places: PropTypes.arrayOf(PropTypes.object).isRequired,
  periodBounds: PropTypes.arrayOf(PropTypes.number).isRequired,
  authors: PropTypes.arrayOf(PropTypes.object).isRequired,
  literaryTones: PropTypes.arrayOf(PropTypes.object).isRequired,
  animationTechniques: PropTypes.arrayOf(PropTypes.object).isRequired,
  audiences: PropTypes.arrayOf(PropTypes.object).isRequired,
  formats: PropTypes.arrayOf(PropTypes.object).isRequired,
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
  const authors = await fetchAPI(getAllPersonsQuery, {
    variables: { locale },
  });
  const literaryTones = await fetchAPI(getAllLiteraryTonesQuery, {
    variables: { locale },
  });
  const animationTechniques = await fetchAPI(getAllAnimationTechniquesQuery, {
    variables: { locale },
  });
  const audiences = await fetchAPI(getAllAudiencesQuery, {
    variables: { locale },
  });
  const formats = await fetchAPI(getAllFormatsQuery, {
    variables: { locale },
  });
  const data = await getAllWorks(
    locale,
    query.page * WORKS_PAGE_SIZE,
    buildSearchQuery(query.search),
    query,
  );
  const getSafelyPeriodBound = (bound) =>
    hasAtLeastOneItem(bound) ? bound[0].value : null;

  return {
    props: {
      initialData: data,
      languages: languages.entries,
      places: places.entries,
      periodBounds: [
        getSafelyPeriodBound(periodBounds.min),
        getSafelyPeriodBound(periodBounds.max),
      ],
      authors: authors.entries,
      literaryTones: literaryTones.entries,
      animationTechniques: animationTechniques.entries,
      audiences: audiences.entries,
      formats: formats.entries,
    },
  };
}
