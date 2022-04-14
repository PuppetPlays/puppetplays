import { useCallback, useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { useCookies } from 'react-cookie';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  fetchAPI,
  getAllWorksQuery,
  getAllWorks,
  WORKS_PAGE_SIZE,
  buildSearchQuery,
  getAllWorksKeywordsQuery,
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
import { hasAtLeastOneItem, parseCookies, stringifyQuery } from 'lib/utils';
import { FiltersProvider } from 'components/FiltersContext';
import Layout from 'components/Layout';
import WorkSummary from 'components/Work/WorkSummary';
import Pagination from 'components/Pagination';
import Filters from 'components/WorksFilters';
import SearchBar from 'components/SearchBar';
import Button from 'components/Button';
import styles from 'styles/Database.module.css';

const MapView = dynamic(() => import('components/Map/MapView'), { ssr: false });

const VIEWS = {
  list: 'LIST',
  map: 'MAP',
};

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
  tags,
  isFiltersBarOpened,
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [, setCookie] = useCookies(['isWorksFiltersBarOpened']);
  const [isOpen, setIsOpen] = useState(isFiltersBarOpened);
  const [filters, setFilters] = useState(() => {
    return queryParamsToState(router.query);
  });
  const [data, setData] = useState(initialData);
  const [searchTerms, setSearchTerms] = useState(router.query.search);
  const [currentPage, setCurrentPage] = useState(
    router.query.page ? parseInt(router.query.page, 10) - 1 : 0,
  );

  const handleToggleFiltersBar = useCallback(() => {
    setIsOpen(!isOpen);
    setCookie('isWorksFiltersBarOpened', !isOpen);
  }, [isOpen, setCookie]);

  useEffect(() => {
    fetchAPI(getAllWorksQuery(filters), {
      variables: {
        locale: router.locale,
        offset: currentPage * WORKS_PAGE_SIZE,
        limit: WORKS_PAGE_SIZE,
        search: buildSearchQuery(searchTerms),
        ...stateToGraphqlVariables(filters),
      },
    }).then((newData) => {
      setData(newData);
    });
  }, [router.locale, currentPage, searchTerms, filters]);

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page.selected);
      router.push(
        `base-de-donnes/?${stringifyQuery({
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
        if (value[0] !== periodBounds[0] && value[1] !== periodBounds[1]) {
          newFilters = {
            ...filters,
            compositionMinDate: value[0],
            compositionMaxDate: value[1],
          };
        } else if (value[0] !== periodBounds[0]) {
          newFilters = {
            ...filters,
            compositionMinDate: value[0],
            compositionMaxDate: null,
          };
        } else if (value[1] !== periodBounds[1]) {
          newFilters = {
            ...filters,
            compositionMinDate: null,
            compositionMaxDate: value[1],
          };
        } else {
          newFilters = {
            ...filters,
            compositionMinDate: null,
            compositionMaxDate: null,
          };
        }
      } else if (name === 'publicDomain') {
        newFilters = {
          ...filters,
          publicDomain: value ? value : undefined,
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
        `base-de-donnes/?${stringifyQuery({
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
        `base-de-donnes/?${stringifyQuery({
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
      `base-de-donnes/?${stringifyQuery({
        search: searchTerms,
        page: 1,
      })}`,
      undefined,
      {
        shallow: true,
      },
    );
  }, [router, searchTerms]);

  const handleSetMapView = useCallback(() => {
    setCurrentPage(0);
    setFilters({ ...filters, view: VIEWS.map });
    router.push(
      `base-de-donnes/?${stringifyQuery({
        ...filters,
        view: VIEWS.map,
        search: searchTerms,
        page: 1,
      })}`,
      undefined,
      {
        shallow: true,
      },
    );
  }, [router, filters, searchTerms]);

  const handleSetListView = useCallback(() => {
    setCurrentPage(0);
    setFilters({ ...filters, view: VIEWS.list });
    router.push(
      `base-de-donnes/?${stringifyQuery({
        ...filters,
        view: VIEWS.list,
        search: searchTerms,
        page: 1,
      })}`,
      undefined,
      {
        shallow: true,
      },
    );
  }, [router, filters, searchTerms]);

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
          tagsOptions={tags}
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
          selectedTags={
            filters.relatedToTags &&
            tags.filter(({ id }) => filters.relatedToTags.includes(id))
          }
          publicDomain={!!filters.publicDomain}
          onChange={handleChangeFilters}
          onClearAll={handleClearAllFilters}
          isOpen={isOpen}
          onToggle={handleToggleFiltersBar}
        />
      }
    >
      <Head>
        <title>Puppetplays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {(filters.view === VIEWS.list || !filters.view) && (
        <Fragment>
          <div className={styles.worksHeader}>
            <div className={styles.worksHeaderPageCount}>
              {t('common:results', { count: data.entryCount })}
            </div>
            <Pagination
              forcePage={currentPage}
              pageCount={Math.ceil(data.entryCount / WORKS_PAGE_SIZE)}
              onPageChange={handlePageChange}
            />
            <Button
              onClick={handleSetMapView}
              icon={<img src="/icon-map.svg" alt="" />}
            >
              {t('common:showMap')}
            </Button>
          </div>

          <div className={styles.works}>
            <div className={styles.worksScroll}>
              {data.entries &&
                data.entries.map((work) => (
                  <WorkSummary key={work.id} {...work} />
                ))}
            </div>
          </div>
        </Fragment>
      )}
      {filters.view === VIEWS.map && (
        <FiltersProvider isOpen={isOpen}>
          <div className={styles.map}>
            <Button
              onClick={handleSetListView}
              icon={<img src="/icon-list.svg" alt="" />}
            >
              {t('common:showList')}
            </Button>
            <MapView
              locale={router.locale}
              filters={filters}
              searchTerms={searchTerms}
            />
          </div>
        </FiltersProvider>
      )}
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
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFiltersBarOpened: PropTypes.bool.isRequired,
};

export default Home;

export async function getServerSideProps({ locale, req, res, query }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const cookies = parseCookies(req);
  const isFiltersBarOpened =
    get(cookies, 'isWorksFiltersBarOpened', true) === 'false' ? false : true;

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

  const { tags } = await fetchAPI(getAllWorksKeywordsQuery, {
    variables: { locale },
  });

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
      tags,
      isFiltersBarOpened,
    },
  };
}
