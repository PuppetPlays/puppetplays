import { Fragment } from 'react';
import Head from 'next/head';
import { getWorkById } from 'lib/api';
import WorkInPage from 'components/Work/WorkInPage';
import WorkPageHeader from 'components/Work/WorkPageHeader';
import styles from 'styles/Work.module.css';

const Work = ({ initialData }) => {
  return (
    <Fragment>
      <Head>
        <title>{initialData.title} | Puppetplays</title>
      </Head>

      <div className={styles.workHeader}>
        <WorkPageHeader
          title={initialData.title}
          authors={initialData.authors}
          writingPlace={initialData.writingPlace}
        />
      </div>
      <div className={styles.work}>
        <WorkInPage {...initialData} />
      </div>
    </Fragment>
  );
};

export default Work;

export async function getServerSideProps({ locale, params, query }) {
  const token = query && query.token;
  const data = await getWorkById(params.id, locale, token);
  return {
    props: { initialData: data.entry },
  };
}
