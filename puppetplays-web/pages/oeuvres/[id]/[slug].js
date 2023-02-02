import { useState } from 'react';
import Head from 'next/head';
import { getWorkById } from 'lib/api';
import Layout from 'components/Layout';
import PropTypes from 'prop-types';
import Work from 'components/Work/Work';
import ContentLayout from 'components/ContentLayout';
import WorkPageHeader from 'components/Work/WorkPageHeader';
import WorkDocument from 'components/Work/WorkDocument';
import styles from 'styles/Work.module.scss';

const WorkPage = ({ initialData }) => {
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);

  return (
    <>
      <Layout>
        <Head>
          <title>{initialData.title} | Puppetplays</title>
        </Head>

        <div className={styles.workHeader}>
          <WorkPageHeader
            id={initialData.id}
            slug={initialData.slug}
            title={initialData.title}
            authors={initialData.authors}
            writingPlace={initialData.writingPlace}
            hasMedia={initialData.mediasCount > 0}
            hasDocument={initialData.scannedDocumentPagesCount > 0}
            onOpenDocument={() => setIsDocumentOpen(true)}
          />
        </div>
        <ContentLayout style={{ maxWidth: 1200 }}>
          <Work {...initialData} />
        </ContentLayout>
      </Layout>
      {isDocumentOpen && (
        <WorkDocument
          workId={initialData.id}
          onClose={() => setIsDocumentOpen(false)}
        />
      )}
    </>
  );
};

WorkPage.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default WorkPage;

export async function getServerSideProps({ locale, req, res, params, query }) {
  const token = query && query.token;
  const data = await getWorkById(params.id, locale, token);
  return {
    props: { initialData: data.entry },
  };
}
