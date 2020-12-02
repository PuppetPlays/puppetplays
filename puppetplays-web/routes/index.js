import { Fragment } from 'react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { getAllWorks } from 'lib/api';
import WorkInList from 'components/WorkInList';
import Pagination from 'components/Pagination';
import styles from 'styles/Home.module.css';

export default function Home({ allWorks }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Head>
        <title>Puppetplays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.worksHeader}>
        <div>{t('common:results', { count: allWorks.length })}</div>
        <Pagination pageCount={10} onPageChange={() => {}} />
      </div>
      <div className={styles.works}>
        {allWorks.map((work) => (
          <WorkInList {...work} />
        ))}
      </div>
    </Fragment>
  );
}

export async function getServerSideProps({ locale }) {
  const apiUrl = `${process.env.API_URL}/api`;
  const allWorks = (await getAllWorks(apiUrl, locale)) || [];
  return {
    props: { allWorks: data },
  };
}
