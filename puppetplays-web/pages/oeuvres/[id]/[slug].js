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
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const WorkPage = ({ initialData }) => {
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const { t } = useTranslation();

  // Vérifie si les données initiales sont complètes
  const hasAllRequiredData = initialData && initialData.id && initialData.title;

  if (!hasAllRequiredData) {
    return (
      <Layout>
        <Head>
          <title>{t('common:database')} | Puppetplays</title>
        </Head>
        <ContentLayout style={{ maxWidth: 800, padding: '60px 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '500',
                marginBottom: '20px',
                color: 'var(--color-text-default)',
              }}
            >
              {t('common:error.dataNotFound')}
            </h1>
            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: 'var(--color-text-subtle)',
                maxWidth: '600px',
                margin: '0 auto 30px',
              }}
            >
              {t('common:error.notFound')}
            </p>
          </div>
        </ContentLayout>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <Head>
          <title>
            {initialData?.title || t('common:database')} | Puppetplays
          </title>
        </Head>

        <div className={styles.workHeader}>
          <WorkPageHeader
            id={initialData?.id}
            slug={initialData?.slug}
            title={initialData?.title}
            authors={initialData?.authors || []}
            writingPlace={initialData?.writingPlace || ''}
            hasMedia={(initialData?.mediasCount || 0) > 0}
            hasDocument={(initialData?.scannedDocumentPagesCount || 0) > 0}
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
  try {
    const token = query && query.token;
    const data = await getWorkById(params?.id, locale, token);

    // Vérifier si les données sont valides
    if (!data || !data.entry) {
      return {
        props: { initialData: {} },
      };
    }

    return {
      props: { initialData: data.entry || {} },
    };
  } catch (error) {
    console.error('Error fetching work:', error);
    return {
      props: { initialData: {} },
    };
  }
}
