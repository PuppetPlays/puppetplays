import Button from 'components/Button';
import FilterSelect from 'components/FilterSelect';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import Pagination from 'components/Pagination';
import SearchBar from 'components/SearchBar';
import WorkSummary from 'components/Work/WorkSummary';
import {
  fetchAPI,
  getAllWorksQuery,
  getAllWorks,
  WORKS_PAGE_SIZE,
  buildSearchQuery,
} from 'lib/api';
import {
  worksQueryParamsToState as queryParamsToState,
  worksStateToGraphqlVariables as stateToGraphqlVariables,
} from 'lib/filters';
import { stringifyQuery } from 'lib/utils';
import { isEqual } from 'lodash';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useState,
  Fragment,
  useRef,
  Suspense,
} from 'react';
import styles from 'styles/Database.module.scss';

const MapView = dynamic(() => import('../components/Map/MapView'), {
  ssr: false,
});
const Filters = dynamic(() => import('../components/WorksFilters'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '100%',
        width: 290,
        backgroundColor: 'var(--color-brand)',
      }}
    />
  ),
});

const VIEWS = {
  list: 'LIST',
  map: 'MAP',
};

function Home({ initialData }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isClientSide, setIsClientSide] = useState(false);
  const [filters, setFilters] = useState(() => {
    return queryParamsToState(router.query);
  });
  const [data, setData] = useState(initialData);
  const [searchTerms, setSearchTerms] = useState(router.query.search);
  const [currentPage, setCurrentPage] = useState(
    router.query.page ? parseInt(router.query.page, 10) - 1 : 0,
  );
  const orderByOptions = [
    { id: 'compositionMinDate', title: t('common:chronology') },
    {
      id: 'compositionMinDate DESC',
      title: t('common:chronologyInverse'),
    },
    { id: 'score', title: t('common:score') },
    { id: 'title', title: t('common:title') },
    { id: 'firstAuthorTitle', title: t('common:author') },
  ];
  const scrollElementRef = useRef();

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    let newFilters = filters;

    if (
      router.query.view !== filters.view ||
      !isEqual(router.query.relatedToTags, filters.relatedToTags) ||
      !isEqual(
        router.query.theatricalTechniques,
        filters.theatricalTechniques,
      ) ||
      !isEqual(router.query.animationTechniques, filters.animationTechniques) ||
      !isEqual(router.query.authors, filters.authors)
    ) {
      newFilters = queryParamsToState(router.query);
      setFilters(newFilters);
    }

    fetchAPI(getAllWorksQuery(newFilters), {
      variables: {
        locale: router.locale,
        offset: currentPage * WORKS_PAGE_SIZE,
        limit: WORKS_PAGE_SIZE,
        search: buildSearchQuery(searchTerms, router.locale),
        ...stateToGraphqlVariables(newFilters),
      },
    }).then(newData => {
      setData(newData);
      if (scrollElementRef.current) {
        scrollElementRef.current.scrollTop = 0;
      }
    });
  }, [router.locale, router.query, scrollElementRef]);

  const handlePageChange = useCallback(
    page => {
      setCurrentPage(page.selected);
      router.push(
        `base-de-donnees/?${stringifyQuery({
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
      if (name === 'orderBy') {
        newFilters = {
          ...filters,
          orderBy: value ? value.id : undefined,
        };
      } else {
        newFilters = {
          ...filters,
          [name]: value,
        };
      }
      setFilters(newFilters);
      setCurrentPage(0);
      router.push(
        `base-de-donnees/?${stringifyQuery({
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
    search => {
      setSearchTerms(search);
    },
    [setSearchTerms],
  );

  const handleAfterChangeSearchQuery = useCallback(
    search => {
      setCurrentPage(0);
      router.push(
        `base-de-donnees/?${stringifyQuery({
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
    const resetFilters = filters.view ? { view: filters.view } : {};
    setFilters(resetFilters);
    router.push(
      `base-de-donnees/?${stringifyQuery({
        search: searchTerms,
        view: filters.view,
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
      `base-de-donnees/?${stringifyQuery({
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
      `base-de-donnees/?${stringifyQuery({
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
        <Suspense fallback="loading">
          <Filters
            filters={filters}
            onChange={handleChangeFilters}
            onClearAll={handleClearAllFilters}
          />
        </Suspense>
      }
    >
      <Head>
        <title>{`${t('common:database')} | Puppetplays`}</title>
        <meta
          name="description"
          content={t(
            `common:meta.${
              filters.view === VIEWS.map ? 'map' : 'database'
            }.description`,
          )}
        />
      </Head>

      {(filters.view === VIEWS.list || !filters.view) && (
        <Fragment>
          <div className={styles.worksHeader}>
            <div className={styles.worksHeaderPageCount}>
              {t('common:results', { count: data.entryCount })}
            </div>
            {Math.ceil(data.entryCount / WORKS_PAGE_SIZE) > 1 && (
              <Pagination
                forcePage={currentPage}
                pageCount={Math.ceil(data.entryCount / WORKS_PAGE_SIZE)}
                onPageChange={handlePageChange}
              />
            )}
            <div className={styles.worksHeaderRight}>
              <div className={styles.sortMenu}>
                <FilterSelect
                  inverse={false}
                  name="orderBy"
                  value={
                    orderByOptions.find(o => o.id === filters.orderBy) || {
                      id: 'chronology',
                      title: t('common:chronology'),
                    }
                  }
                  options={orderByOptions}
                  isMulti={false}
                  isClearable={false}
                  isSearchable={false}
                  isDisabled={data.entryCount === 0}
                  onChange={handleChangeFilters}
                />
              </div>
              <Button
                onClick={handleSetMapView}
                icon={<img src="/icon-map.svg" alt="" />}
                inverse={true}
              >
                {t('common:showMap')}
              </Button>
            </div>
          </div>

          <div className={styles.works} ref={scrollElementRef}>
            <div className={styles.worksScroll}>
              {data?.entries &&
              Array.isArray(data.entries) &&
              data.entries.length > 0 ? (
                data.entries.map(work => (
                  <WorkSummary key={work.id} {...work} />
                ))
              ) : (
                <NoResults
                  icon="search"
                  title={t('common:error.dataNotFound')}
                  message={t('common:error.noResultsFound')}
                />
              )}
            </div>
          </div>
        </Fragment>
      )}
      {filters.view === VIEWS.map && isClientSide && (
        <Suspense fallback="loading">
          <div className={styles.map}>
            <Button
              onClick={handleSetListView}
              icon={<img src="/icon-list.svg" alt="" />}
              inverse={true}
            >
              {t('common:showList')}
            </Button>
            <MapView
              locale={router.locale}
              filters={filters}
              searchTerms={searchTerms}
            />
          </div>
        </Suspense>
      )}
    </Layout>
  );
}

Home.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default Home;

export async function getServerSideProps({ locale, query }) {
  const data = await getAllWorks(
    locale,
    query.page * WORKS_PAGE_SIZE,
    buildSearchQuery(query.search, locale),
    query,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      initialData: data,
    },
  };
}
