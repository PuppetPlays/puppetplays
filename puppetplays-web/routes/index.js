import { Fragment, useCallback, useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import {
  fetchAPI,
  getAllWorksQuery,
  getAllWorks,
  WORKS_PAGE_SIZE,
} from 'lib/api';
import WorkInList from 'components/WorkInList';
import Pagination from 'components/Pagination';
import styles from 'styles/Home.module.css';

export default function Home({ initialData }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const { data } = useSWR(
    [getAllWorksQuery, router.locale, currentPage * WORKS_PAGE_SIZE],
    (query, locale, offset) =>
      fetchAPI(query, {
        variables: { locale, offset, limit: WORKS_PAGE_SIZE },
      }),
    {
      initialData,
    },
  );

  const handlePageChange = useCallback(
    (page) => {
      router.push(`/?page=${page.selected + 1}`, undefined, { shallow: true });
    },
    [router],
  );

  useEffect(() => {
    if (router.query && router.query.page) {
      setCurrentPage(router.query.page - 1);
    } else {
      setCurrentPage(0);
    }
  }, [router.query, setCurrentPage]);

  useEffect(() => {
    mutate([getAllWorksQuery, router.locale, currentPage * WORKS_PAGE_SIZE]);
  }, [router.locale, currentPage]);

  return (
    <Fragment>
      <Head>
        <title>Puppetplays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.worksHeader}>
        <div>{t('common:results', { count: data.entryCount })}</div>
        <Pagination
          forcePage={currentPage}
          pageCount={Math.ceil(data.entryCount / WORKS_PAGE_SIZE)}
          onPageChange={handlePageChange}
        />
      </div>
      <div className={styles.works}>
        {data.entries.map((work) => (
          <WorkInList key={work.id} {...work} />
        ))}
      </div>
    </Fragment>
  );
}

export async function getServerSideProps({ locale }) {
  const apiUrl = `${process.env.API_URL}/api`;
  const data = await getAllWorks(apiUrl, locale);
  return {
    props: { initialData: data },
  };
}
