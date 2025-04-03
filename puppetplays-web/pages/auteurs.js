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
  
  // Vérifie si les données sont vides
  const hasNoData = !uniqueAuthorsIds || uniqueAuthorsIds.length === 0 || Object.keys(initialData?.entries || {}).length === 0;
  
  const [currentLetter, handleScroll] = useLetterPaginationSelector(
    Object.keys(initialData.entries || {})[0],
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
      const authors = (data?.entries || []).filter(({ id }) =>
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

      {hasNoData ? (
        <div style={{
          maxWidth: '800px',
          margin: '60px auto',
          textAlign: 'center',
          backgroundColor: 'var(--color-bg-depth-1)',
          padding: '40px 30px',
          borderRadius: '8px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
        }}>
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none"
            style={{ margin: '0 auto 24px' }}
          >
            <path d="M12 6V12L16 14" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="var(--color-brand)" strokeWidth="2"/>
          </svg>
          
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '500', 
            marginBottom: '16px',
            color: 'var(--color-text-default)'
          }}>
            {t('common:contentNotAvailable')}
          </h2>
          
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.6', 
            color: 'var(--color-text-subtle)', 
            maxWidth: '640px', 
            margin: '0 auto 24px' 
          }}>
            {t('common:authorsSectionComingSoon')}
          </p>
          
          <div style={{ 
            width: '120px', 
            height: '4px', 
            background: 'var(--color-brand-light)', 
            margin: '0 auto',
            opacity: 0.3,
            borderRadius: '2px'
          }}></div>
        </div>
      ) : (
        <>
          <div className={styles.authors} onScroll={handleScroll}>
            {data?.entries &&
              Object.entries(data.entries).map(([key, authors]) => (
                <div
                  key={`authors-letter-${key}`}
                  className={styles.letterContainer}
                  id={`authors-letter-${key}`}
                  data-paginate-letter={key}
                >
                  <div className={styles.letter}>{key}</div>
                  <ol className={styles.authorsList}>
                    {authors && Array.isArray(authors) && authors.map(
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

            {data?.entries && Object.keys(data?.entries || {}).length === 0 && (
              <p className={styles.noResult}>
                {t('common:results', { count: Object.keys(data?.entries || {}).length })}
              </p>
            )}
          </div>
          <ol className={styles.lettersPagination}>
            {Object.keys(data?.entries || {}).map((key) => (
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
        </>
      )}
    </Layout>
  );
}

Authors.propTypes = {
  initialData: PropTypes.object.isRequired,
  uniqueAuthorsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Authors;

export async function getServerSideProps({ locale, req, res, query }) {
  try {
    const filtersState = queryParamsToState(query);

    const authorsIds = await getFetchAPIClient({
      variables: { locale },
    })(getAllWorksAuthorsIdsQuery);
    
    // Ajouter null safety pour éviter l'erreur
    const uniqueAuthorsIds = uniq(
      (authorsIds?.entries || []).flatMap((entry) =>
        (entry?.authors || []).map((author) => author?.id).filter(Boolean)
      ),
    );
    
    const personsRelatedToWorks = await getFetchAPIClient({
      variables: { locale, ...stateToGraphqlVariables(filtersState) },
    })(getAllAuthorsQuery(filtersState));
    
    const authors = (personsRelatedToWorks?.entries || []).filter(({ id }) =>
      uniqueAuthorsIds.includes(id)
    );

    return {
      props: {
        initialData: { entries: groupBy(authors, getFirstLetter) },
        uniqueAuthorsIds,
      },
    };
  } catch (error) {
    console.error('Error fetching authors:', error);
    return {
      props: {
        initialData: { entries: {} },
        uniqueAuthorsIds: [],
      },
    };
  }
}
