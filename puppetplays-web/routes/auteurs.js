import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import groupBy from 'lodash/groupBy';
import cond from 'lodash/cond';
import constant from 'lodash/constant';
import stubTrue from 'lodash/stubTrue';
import useSWR, { mutate } from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import {
  fetchAPI,
  getAllAuthorsQuery,
  getAllLanguagesQuery,
  getAllPlacesQuery,
} from 'lib/api';
import {
  queryParamsToState,
  stateToGraphqlVariables,
} from 'lib/authorsFilters';
import { stringifyQuery } from 'lib/utils';
import useLetterPaginationSelector from 'hooks/useLetterPaginationSelector';
import Layout from 'components/Layout';
import Author from 'components/Author';
import Company from 'components/Company';
import Filters from 'components/AuthorsFilters';
import styles from 'styles/Authors.module.scss';

const isOfType = (type) => ({ typeHandle }) => typeHandle === type;

const getFirstLetter = cond([
  [
    isOfType('persons'),
    ({ usualName, lastName }) => (usualName ? usualName[0] : lastName[0]),
  ],
  [isOfType('companies'), ({ title }) => title[0]],
  [stubTrue, constant('?')],
]);

function Authors({ initialData, languages, places }) {
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
      return {
        entries: groupBy(data.entries, getFirstLetter),
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
        [name]: value.length > 0 ? value.map((v) => v.id) : null,
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
        <Filters
          languageOptions={languages}
          placeOptions={places}
          selectedLanguages={
            filters.languages &&
            languages.filter(({ id }) => filters.languages.includes(id))
          }
          selectedPlaces={
            filters.places &&
            places.filter(({ id }) => filters.places.includes(id))
          }
          onChange={handleChangeFilters}
          onClearAll={handleClearAllFilters}
        />
      }
    >
      <Head>
        <title>Puppetplays | Auteurs</title>
        <link rel="icon" href="/favicon.ico" />
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
                            <span>
                              {birthDate} - {deathDate}
                            </span>
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
  languages: PropTypes.arrayOf(PropTypes.object).isRequired,
  places: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Authors;

export async function getServerSideProps({ locale, req, res, query }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const languages = await fetchAPI(getAllLanguagesQuery, {
    variables: { locale },
  });
  const places = await fetchAPI(getAllPlacesQuery, {
    variables: { locale },
  });
  const filtersState = queryParamsToState(query);
  const data = await fetchAPI(getAllAuthorsQuery(filtersState), {
    variables: { locale },
  });

  return {
    props: {
      initialData: { entries: groupBy(data.entries, getFirstLetter) },
      languages: languages.entries,
      places: places.entries,
    },
  };
}
