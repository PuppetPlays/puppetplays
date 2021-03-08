import { Fragment } from 'react';
import Head from 'next/head';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import { getWorkById } from 'lib/api';
import Work from 'components/Work/Work';
import WorkPageHeader from 'components/Work/WorkPageHeader';
import styles from 'styles/Work.module.css';

const WorkPage = ({ initialData }) => {
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
        <Work {...initialData} />
      </div>
    </Fragment>
  );
};

export default WorkPage;

export async function getServerSideProps({ locale, req, res, params, query }) {
  useCraftAuthMiddleware(req, res);

  const token = query && query.token;
  const data = await getWorkById(params.id, locale, token);
  return {
    props: { initialData: data.entry },
  };
}
