import { Fragment } from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import cond from 'lodash/cond';
import constant from 'lodash/constant';
import stubTrue from 'lodash/stubTrue';
import useSWR from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import { fetchAPI, getAllAuthorsQuery } from 'lib/api';
import useLetterPaginationSelector from 'hooks/useLetterPaginationSelector';
import Layout from 'components/Layout';
import Author from 'components/Author';
import Company from 'components/Company';
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

function Authors({ initialData }) {
  const { t } = useTranslation();
  const [currentLetter, handleScroll] = useLetterPaginationSelector(
    Object.keys(initialData.entries)[0],
  );
  const router = useRouter();
  const { data } = useSWR(
    [getAllAuthorsQuery, router.locale],
    async (query, locale) => {
      const data = await fetchAPI(query, {
        variables: {
          locale,
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

  return (
    <Layout>
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
                        <Fragment>
                          <Author {...author} lastNameFirst />{' '}
                          <span>
                            {birthDate} - {deathDate}
                          </span>
                        </Fragment>
                      )}
                      {typeHandle === 'companies' && <Company {...author} />}
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
};

export default Authors;

export async function getServerSideProps({ locale, req, res }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const data = await fetchAPI(getAllAuthorsQuery, {
    variables: { locale },
  });

  return {
    props: {
      initialData: { entries: groupBy(data.entries, getFirstLetter) },
    },
  };
}
