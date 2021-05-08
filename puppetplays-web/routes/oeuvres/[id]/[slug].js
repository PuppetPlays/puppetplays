import Head from 'next/head';
import useCraftAuthMiddleware from 'lib/craftAuthMiddleware';
import { getWorkById } from 'lib/api';
import Layout from 'components/Layout';
import PropTypes from 'prop-types';
import Work from 'components/Work/Work';
import WorkPageHeader from 'components/Work/WorkPageHeader';
import styles from 'styles/Work.module.css';

const WorkPage = ({ initialData }) => {
  return (
    <Layout>
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
    </Layout>
  );
};

WorkPage.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default WorkPage;

export async function getServerSideProps({ locale, req, res, params, query }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useCraftAuthMiddleware(req, res, locale);

  const token = query && query.token;
  const data = await getWorkById(params.id, locale, token);
  return {
    props: { initialData: data.entry },
  };
}
