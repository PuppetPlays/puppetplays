import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import groupBy from 'lodash/groupBy';
import cond from 'lodash/cond';
import constant from 'lodash/constant';
import stubTrue from 'lodash/stubTrue';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
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
  authorsQueryParamsToState as queryParamsToState,
  authorsStateToGraphqlVariables as stateToGraphqlVariables,
} from 'lib/filters';
import { stringifyQuery } from 'lib/utils';
import useLetterPaginationSelector from 'hooks/useLetterPaginationSelector';
import Layout from 'components/Layout';
import Author from 'components/Author';
import Company from 'components/Company';
import Filters from 'components/AuthorsFilters';
import styles from 'styles/Authors.module.scss';
import identity from 'lodash/identity';
import negate from 'lodash/negate';
import map from 'lodash/fp/map';
import get from 'lodash/fp/get';

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
  const { t } = useTranslation();
  const router = useRouter();
  const [genderOptions] = useState([
    { id: 'female', title: t('common:filters.female') },
    { id: 'male', title: t('common:filters.male') },
  ]);
  const [typeOptions] = useState([
    { id: 'persons', title: t('common:filters.author') },
    { id: 'companies', title: t('common:filters.company') },
  ]);
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
      const getNewFilterValue = cond([
        [(v) => isArray(v) && v.length > 0, map(get('id'))],
        [isArray, constant(null)],
        [negate(isNil), get('id')],
        [stubTrue, constant(null)],
      ]);
      const newFilters = {
        ...filters,
        [name]: getNewFilterValue(value),
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
          genderOptions={genderOptions}
          typeOptions={typeOptions}
          selectedLanguages={
            filters.languages &&
            languages.filter(({ id }) => filters.languages.includes(id))
          }
          selectedPlaces={
            filters.places &&
            places.filter(({ id }) => filters.places.includes(id))
          }
          selectedGender={
            filters.gender &&
            genderOptions.find(({ id }) => filters.gender === id)
          }
          selectedType={
            filters.type && typeOptions.find(({ id }) => filters.type === id)
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
