import { useCallback, useEffect, useState } from 'react';
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
import Layout from 'components/Layout';
import WorkSummary from 'components/Work/WorkSummary';
import Pagination from 'components/Pagination';
import styles from 'styles/Home.module.css';

export default function Home({ initialData }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerms, setSearchTerms] = useState(router.query.search);
  const [currentPage, setCurrentPage] = useState(0);
  const { data } = useSWR(
    [
      getAllWorksQuery,
      router.locale,
      currentPage * WORKS_PAGE_SIZE,
      searchTerms,
    ],
    (query, locale, offset, searchTerms) => {
      return fetchAPI(query, {
        variables: {
          locale,
          offset,
          limit: WORKS_PAGE_SIZE,
          search: buildSearchQuery(searchTerms),
        },
      });
    },
    {
      initialData,
      revalidateOnFocus: false,
    },
  );

  const handlePageChange = useCallback(
    (page) => {
      router.push(`/?page=${page.selected + 1}`, undefined, { shallow: true });
    },
    [router],
  );

  useEffect(() => {
    if (router.query) {
      if (router.query.search) {
        setSearchTerms(router.query.search);
      } else {
        setSearchTerms('');
      }
      if (router.query.page) {
        setCurrentPage(router.query.page - 1);
      } else {
        setCurrentPage(0);
      }
    }
  }, [router.query, setSearchTerms, setCurrentPage]);

  useEffect(() => {
    mutate([
      getAllWorksQuery,
      router.locale,
      currentPage * WORKS_PAGE_SIZE,
      searchTerms,
    ]);
  }, [router.locale, currentPage, searchTerms]);

  return (
    <Layout>
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

export async function getServerSideProps({ locale, req, res, query }) {
  useCraftAuthMiddleware(req, res, locale);

  const data = await getAllWorks(
    locale,
    query.page * WORKS_PAGE_SIZE,
    buildSearchQuery(query.search),
  );
  return {
    props: { initialData: data },
  };
}
