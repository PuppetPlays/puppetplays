import BirthDeathDates from 'components/BirthDeathDates';
import Layout from 'components/Layout';
import useLetterPaginationSelector from 'hooks/useLetterPaginationSelector';
import { fetchAPI } from 'lib/api';
import { stringifyQuery } from 'lib/utils';
import cond from 'lodash/cond';
import constant from 'lodash/constant';
import groupBy from 'lodash/groupBy';
import stubTrue from 'lodash/stubTrue';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
import styles from 'styles/Authors.module.scss';
import useSWR, { mutate } from 'swr';

// Utility function to ensure safe serialization for Next.js JSON
const safeSerialize = (value, defaultValue = null) => {
  if (value === undefined || value === '') {
    return defaultValue;
  }
  return value;
};

// GraphQL query to get anthology entries directly
const getAnthologyEntriesQuery = () => `
query GetAnthologyEntries($locale: [String]) {
  entries(section: "anthology", site: $locale, orderBy: "title") {
    id,
    slug,
    title,
    url,
    ... on anthology_default_Entry {
      transcribers {
        id,
        title,
        ... on persons_persons_Entry { 
          firstName,
          lastName,
          nickname,
          usualName
        }
      },
      editors {
        id,
        title,
        ... on persons_persons_Entry { 
          firstName,
          lastName,
          nickname,
          usualName
        }
      },
      license,
      doi
    }
  }
}
`;

const getFirstLetter = cond([
  [anthology => anthology.title, anthology => anthology.title[0].toUpperCase()],
  [stubTrue, constant('?')],
]);

function Anthology({ initialData, totalAnthologies }) {
  const { t } = useTranslation(['common', 'anthology']);
  const router = useRouter();

  // Vérifie si les données sont vides
  const hasNoData =
    !totalAnthologies ||
    totalAnthologies === 0 ||
    Object.keys(initialData?.entries || {}).length === 0;

  const [currentLetter, handleScroll] = useLetterPaginationSelector(
    Object.keys(initialData.entries || {})[0],
  );

  const { data } = useSWR(
    [getAnthologyEntriesQuery(), router.locale],
    async (query, locale) => {
      try {
        const data = await fetchAPI(query, {
          variables: {
            locale: locale,
          },
        });

        // Process anthology entries
        const anthologies = data?.entries || [];

        const processedAnthologies = anthologies.map(anthology => {
          // Format editors (compilers) names
          let editors = 'Inconnu';
          if (
            anthology.editors &&
            Array.isArray(anthology.editors) &&
            anthology.editors.length > 0
          ) {
            const editorNames = anthology.editors.map(editor => {
              if (editor.firstName && editor.lastName) {
                return `${editor.firstName} ${editor.lastName}`;
              } else if (editor.usualName) {
                return editor.usualName;
              } else if (editor.title) {
                return editor.title;
              }
              return 'Inconnu';
            });
            editors = editorNames.join(', ');
          }

          // Format transcribers names
          let transcribers = '';
          if (
            anthology.transcribers &&
            Array.isArray(anthology.transcribers) &&
            anthology.transcribers.length > 0
          ) {
            const transcriberNames = anthology.transcribers.map(transcriber => {
              if (transcriber.firstName && transcriber.lastName) {
                return `${transcriber.firstName} ${transcriber.lastName}`;
              } else if (transcriber.usualName) {
                return transcriber.usualName;
              } else if (transcriber.title) {
                return transcriber.title;
              }
              return 'Inconnu';
            });
            transcribers = transcriberNames.join(', ');
          }

          return {
            id: safeSerialize(anthology.id, ''),
            slug: safeSerialize(anthology.slug, ''),
            title: safeSerialize(anthology.title, ''),
            editors: safeSerialize(editors, 'Inconnu'),
            transcribers: safeSerialize(transcribers),
            license: safeSerialize(anthology.license),
            doi: safeSerialize(anthology.doi),
            url: safeSerialize(anthology.url),
          };
        });

        return {
          entries: groupBy(processedAnthologies, getFirstLetter),
        };
      } catch (error) {
        console.error('Error fetching anthology data:', error);
        return initialData;
      }
    },
    {
      initialData,
      revalidateOnFocus: false,
      onError: error => {
        console.error('SWR error:', error);
      },
    },
  );

  useEffect(() => {
    mutate([getAnthologyEntriesQuery(), router.locale]);
  }, [router.locale]);

  return (
    <Layout>
      <Head>
        <title>{t('anthology:title')} | Puppetplays</title>
        <meta name="description" content={t('anthology:metaDescription')} />
      </Head>

      {hasNoData ? (
        <div
          style={{
            maxWidth: '800px',
            margin: '60px auto',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg-depth-1)',
            padding: '40px 30px',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            style={{ margin: '0 auto 24px' }}
          >
            <path
              d="M12 6V12L16 14"
              stroke="var(--color-brand)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="var(--color-brand)"
              strokeWidth="2"
            />
          </svg>

          <h2
            style={{
              fontSize: '24px',
              fontWeight: '500',
              marginBottom: '16px',
              color: 'var(--color-text-default)',
            }}
          >
            {t('common:contentNotAvailable')}
          </h2>

          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'var(--color-text-subtle)',
              maxWidth: '640px',
              margin: '0 auto 24px',
            }}
          >
            {t('anthology:description')}
          </p>

          <div
            style={{
              width: '120px',
              height: '4px',
              background: 'var(--color-brand-light)',
              margin: '0 auto',
              opacity: 0.3,
              borderRadius: '2px',
            }}
          />
        </div>
      ) : (
        <>
          <div className={styles.authors} onScroll={handleScroll}>
            {data?.entries &&
              Object.entries(data.entries).map(([key, anthologies]) => (
                <div
                  key={`authors-letter-${key}`}
                  className={styles.letterContainer}
                  id={`authors-letter-${key}`}
                  data-paginate-letter={key}
                >
                  <div className={styles.letter}>{key}</div>
                  <ol className={styles.authorsList}>
                    {anthologies &&
                      Array.isArray(anthologies) &&
                      anthologies.map(anthology => (
                        <li
                          key={anthology.id}
                          className={styles.authorsListItem}
                        >
                          <Link href={`/anthologie/${anthology.slug}`}>
                            <div>
                              <strong>{anthology.title}</strong>
                              {anthology.editors && (
                                <span> — {anthology.editors}</span>
                              )}
                              {anthology.transcribers && (
                                <span> ({anthology.transcribers})</span>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                  </ol>
                </div>
              ))}

            {data?.entries && Object.keys(data?.entries || {}).length === 0 && (
              <p className={styles.noResult}>
                {t('common:results', {
                  count: Object.keys(data?.entries || {}).length,
                })}
              </p>
            )}
          </div>
          <ol className={styles.lettersPagination}>
            {Object.keys(data?.entries || {}).map(key => (
              <li
                key={`authors-pagination-letter-${key}`}
                className={
                  currentLetter === key ? styles.letterPaginationCurrent : ''
                }
              >
                <Link href={`#authors-letter-${key}`}>
                  <p>{key}</p>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </Layout>
  );
}

Anthology.propTypes = {
  initialData: PropTypes.object.isRequired,
  totalAnthologies: PropTypes.number.isRequired,
};

export default Anthology;

export async function getStaticProps({ locale }) {
  try {
    // Fetch anthology entries directly from CraftCMS
    const data = await fetchAPI(getAnthologyEntriesQuery(), {
      variables: { locale },
    });

    // Process anthology entries
    const anthologies = data.entries || [];

    const processedAnthologies = anthologies.map(anthology => {
      // Format editors (compilers) names
      let editors = 'Inconnu';
      if (
        anthology.editors &&
        Array.isArray(anthology.editors) &&
        anthology.editors.length > 0
      ) {
        const editorNames = anthology.editors.map(editor => {
          if (editor.firstName && editor.lastName) {
            return `${editor.firstName} ${editor.lastName}`;
          } else if (editor.usualName) {
            return editor.usualName;
          } else if (editor.title) {
            return editor.title;
          }
          return 'Inconnu';
        });
        editors = editorNames.join(', ');
      }

      // Format transcribers names
      let transcribers = '';
      if (
        anthology.transcribers &&
        Array.isArray(anthology.transcribers) &&
        anthology.transcribers.length > 0
      ) {
        const transcriberNames = anthology.transcribers.map(transcriber => {
          if (transcriber.firstName && transcriber.lastName) {
            return `${transcriber.firstName} ${transcriber.lastName}`;
          } else if (transcriber.usualName) {
            return transcriber.usualName;
          } else if (transcriber.title) {
            return transcriber.title;
          }
          return 'Inconnu';
        });
        transcribers = transcriberNames.join(', ');
      }

      const mappedAnthology = {
        id: safeSerialize(anthology.id, ''),
        slug: safeSerialize(anthology.slug, ''),
        title: safeSerialize(anthology.title, ''),
        editors: safeSerialize(editors, 'Inconnu'),
        transcribers: safeSerialize(transcribers),
        license: safeSerialize(anthology.license),
        doi: safeSerialize(anthology.doi),
        url: safeSerialize(anthology.url),
      };

      return mappedAnthology;
    });

    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'anthology',
          'home',
        ])),
        initialData: { entries: groupBy(processedAnthologies, getFirstLetter) },
        totalAnthologies: processedAnthologies.length,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, [
          'common',
          'anthology',
          'home',
        ])),
        initialData: { entries: {} },
        totalAnthologies: 0,
      },
      revalidate: 60,
    };
  }
}
