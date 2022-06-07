import { useState, useCallback, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import cond from 'lodash/cond';
import constant from 'lodash/constant';
import stubTrue from 'lodash/stubTrue';
import useSWR, { mutate } from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  fetchAPI,
  getAllAuthorsQuery,
  getAllWorksAuthorsIdsQuery,
  getFetchAPIClient,
} from 'lib/api';
import {
  authorsQueryParamsToState as queryParamsToState,
  authorsStateToGraphqlVariables as stateToGraphqlVariables,
} from 'lib/filters';
import { stringifyQuery } from 'lib/utils';
import useLetterPaginationSelector from 'hooks/useLetterPaginationSelector';
import Layout from 'components/Layout';
import Author from 'components/Author';
import Company from 'components/Company';
import BirthDeathDates from 'components/BirthDeathDates';
import styles from 'styles/Authors.module.scss';

const Filters = dynamic(() => import('../components/AuthorsFilters'), {
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

const isOfType =
  (type) =>
  ({ typeHandle }) =>
    typeHandle === type;

const getFirstLetter = cond([
  [
    isOfType('persons'),
    ({ usualName, lastName }) => (usualName ? usualName[0] : lastName[0]),
  ],
  [isOfType('companies'), ({ title }) => title[0]],
  [stubTrue, constant('?')],
]);

function Authors({ initialData, uniqueAuthorsIds }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [filters, setFilters] = useState(() => {
    return queryParamsToState(router.query);
  });
  const [currentLetter, handleScroll] = useLetterPaginationSelector(
    Object.keys(initialData.entries)[0],
  );
  const { data } = useSWR(
    [getAllAuthorsQuery(filters), router.locale, filters],
    async (query, locale, filtersState) => {
      const data = await fetchAPI(query, {
        variables: {
          locale,
          ...stateToGraphqlVariables(filtersState),
        },
      });
      const authors = data.entries.filter(({ id }) =>
        uniqueAuthorsIds.includes(id),
      );
      return {
        entries: groupBy(authors, getFirstLetter),
      };
    },
    {
      initialData,
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    mutate([getAllAuthorsQuery(filters), router.locale, filters]);
  }, [router.locale, filters]);

  const handleChangeFilters = useCallback(
    (value, { name }) => {
      const newFilters = {
        ...filters,
        [name]: value,
      };
      setFilters(newFilters);
      router.push(`/auteurs?${stringifyQuery({ ...newFilters })}`, undefined, {
        shallow: true,
      });
    },
    [router, filters],
  );

  const handleClearAllFilters = useCallback(() => {
    setFilters({});
    router.push(`/auteurs`, undefined, {
      shallow: true,
    });
  }, [router]);

  return (
    <Layout
      aside={
        <Suspense fallback={`loading`}>
          <Filters
            filters={filters}
            onChange={handleChangeFilters}
            onClearAll={handleClearAllFilters}
          />
        </Suspense>
      }
    >
      <Head>
        <title>{t('common:authors')} | Puppetplays</title>
        <meta
          name="description"
          content={t('common:meta.authors.description')}
        />
      </Head>

      <div className={styles.authors} onScroll={handleScroll}>
        {data.entries &&
          Object.entries(data.entries).map(([key, authors]) => (
            <div
              key={`authors-letter-${key}`}
              className={styles.letterContainer}
              id={`authors-letter-${key}`}
              data-paginate-letter={key}
            >
              <div className={styles.letter}>{key}</div>
              <ol className={styles.authorsList}>
                {authors.map(
                  ({ typeHandle, birthDate, deathDate, ...author }) => (
                    <li key={author.id} className={styles.authorsListItem}>
                      {typeHandle === 'persons' && (
                        <Link href={`/auteurs/${author.id}/${author.slug}`}>
                          <a>
                            <Author {...author} lastNameFirst />{' '}
                            <BirthDeathDates
                              birthDate={birthDate}
                              deathDate={deathDate}
                            />
                          </a>
                        </Link>
                      )}
                      {typeHandle === 'companies' && (
                        <Link href={`/auteurs/${author.id}/${author.slug}`}>
                          <a>
                            <Company {...author} />
                          </a>
                        </Link>
                      )}
                    </li>
                  ),
                )}
              </ol>
            </div>
          ))}

        {data.entries && Object.keys(data.entries).length === 0 && (
          <p className={styles.noResult}>
            {t('common:results', { count: Object.keys(data.entries).length })}
          </p>
        )}
      </div>
      <ol className={styles.lettersPagination}>
        {Object.keys(data.entries).map((key) => (
          <li
            key={`authors-pagination-letter-${key}`}
            className={
              currentLetter === key ? styles.letterPaginationCurrent : ''
            }
          >
            <a href={`#authors-letter-${key}`}>{key}</a>
          </li>
        ))}
      </ol>
    </Layout>
  );
}

Authors.propTypes = {
  initialData: PropTypes.object.isRequired,
  uniqueAuthorsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Authors;

export async function getServerSideProps({ locale, req, res, query }) {
  const filtersState = queryParamsToState(query);

  const authorsIds = await getFetchAPIClient({
    variables: { locale },
  })(getAllWorksAuthorsIdsQuery);
  const uniqueAuthorsIds = uniq(
    authorsIds.entries.flatMap((entry) =>
      entry.authors.map((author) => author.id),
    ),
  );
  const personsRelatedToWorks = await getFetchAPIClient({
    variables: { locale, ...filtersState },
  })(getAllAuthorsQuery(filtersState));
  const authors = personsRelatedToWorks.entries.filter(({ id }) =>
    uniqueAuthorsIds.includes(id),
  );

  return {
    props: {
      initialData: { entries: groupBy(authors, getFirstLetter) },
      uniqueAuthorsIds,
    },
  };
}
