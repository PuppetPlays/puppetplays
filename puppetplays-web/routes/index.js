import { Fragment, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { getAllWorks, WORKS_PAGE_SIZE } from 'lib/api';
import WorkInList from 'components/WorkInList';
import Pagination from 'components/Pagination';
import styles from 'styles/Home.module.css';

export default function Home({ works, count }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const { data } = useSWR(
    ['/api', currentPage],
    (url, locale, offset) => {
      console.log(url, locale, offset);
      return getAllWorks(url, locale, offset);
    },
    { initialData: { works, count } },
  );

  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page.selected);
      router.push({ pathname: '/', query: { page: page.selected + 1 } });
    },
    [router, setCurrentPage],
  );

  return (
    <Fragment>
      <Head>
        <title>Puppetplays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.worksHeader}>
        <div>{t('common:results', { count: data.count })}</div>
        <div>Current page {currentPage}</div>
        <Pagination
          pageCount={Math.ceil(data.count / WORKS_PAGE_SIZE)}
          onPageChange={handlePageChange}
        />
      </div>
      <div className={styles.works}>
        {data.works.map((work) => (
          <WorkInList key={work.id} {...work} />
        ))}
      </div>
    </Fragment>
  );
}

export async function getServerSideProps({ locale }) {
  const apiUrl = `${process.env.API_URL}/api`;
  const allWorks = (await getAllWorks(apiUrl, locale)) || [];
  return {
    props: { works: allWorks.works, count: allWorks.count },
  };
}
