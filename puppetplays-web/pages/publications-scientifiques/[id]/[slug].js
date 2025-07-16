import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import PDFViewer from 'components/PDF/PDFViewer';
import { getScientificPublicationById } from 'lib/api';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from 'styles/PublicationDetail.module.scss';

// Le composant PDFViewer est maintenant importé depuis components/PDF/PDFViewer
// Il inclut le proxy HAL pour contourner les problèmes CORS

const MetadataRow = ({ label, value, isLink = false, linkProps = {} }) => {
  if (!value) return null;

  return (
    <div className={styles.metadataRow}>
      <dt className={styles.metadataLabel}>{label}:</dt>
      <dd className={styles.metadataValue}>
        {isLink ? (
          <a {...linkProps}>{value}</a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
};

const PublicationDetailPage = ({ publication, error }) => {
  const { t } = useTranslation(['common', 'project']);
  const router = useRouter();

  if (error) {
    return (
      <Layout>
        <Head>
          <title>{t('project:scientificPublications.title')} | Puppetplays</title>
        </Head>
        <div className={styles.container}>
          <NoResults
            icon="error"
            title={t('common:error.title')}
            message={error}
          />
        </div>
      </Layout>
    );
  }

  if (!publication) {
    return (
      <Layout>
        <Head>
          <title>{t('project:scientificPublications.title')} | Puppetplays</title>
        </Head>
        <div className={styles.container}>
          <NoResults
            icon="search"
            title={t('project:scientificPublications.publicationNotFound')}
            message={t('project:scientificPublications.publicationNotFoundDesc')}
          />
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString(router.locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Helper function to construct PDF URL from HAL CV Link
  const constructHalPdfUrl = (halCvLink) => {
    if (!halCvLink) return null;
    
    // If it already ends with /document, use as is
    if (halCvLink.endsWith('/document')) {
      return halCvLink;
    }
    
    // Add /document to the end of the HAL link
    return `${halCvLink}/document`;
  };

  // Use real data from CraftCMS
  const pdfUrl = constructHalPdfUrl(publication.halCvLink);
  const authors = publication.authorAndOrcidIdentifier;
  const doi = publication.doi;
  const publisher = publication.editorName;
  const publicationDate = publication.date ? formatDate(publication.date) : null;
  const createdDate = publication.dateCreated ? formatDate(publication.dateCreated) : null;
  const year = publicationDate || createdDate;
  const category = publication.scientificCategory;
  const languages = publication.languages?.map(lang => lang.title).join(', ');
  const license = publication.license;
  const peerReview = publication.peerReview;
  const nakalaLink = publication.nakalaLink;

  return (
    <Layout>
      <Head>
        <title>{`${publication.title} | ${t('project:scientificPublications.title')} | Puppetplays`}</title>
        <meta
          name="description"
          content={`${publication.title} - ${t('project:scientificPublications.metaDescription')}`}
        />
      </Head>

      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/publications-scientifiques" className={styles.breadcrumbLink}>
            ← {t('project:scientificPublications.backToList')}
          </Link>
        </div>

        <div className={styles.publicationLayout}>
          {/* Left Column - Metadata */}
          <div className={styles.metadataSection}>
            <header className={styles.publicationHeader}>
              <h1 className={styles.publicationTitle}>{publication.title}</h1>
              
              <div className={styles.publicationMeta}>
                <span className={styles.metaBadge}>
                  {t('project:scientificPublications.categories.peerReviewedPublications')}
                </span>
                <span className={styles.metaDate}>
                  {formatDate(publication.dateCreated)}
                </span>
              </div>
            </header>

            <div className={styles.metadataContent}>
              <dl className={styles.metadataList}>
                <MetadataRow
                  label={t('project:scientificPublications.authors')}
                  value={authors}
                />
                
                <MetadataRow
                  label={t('project:scientificPublications.publicationDate')}
                  value={year}
                />

                <MetadataRow
                  label={t('project:scientificPublications.editor')}
                  value={publisher}
                />

                <MetadataRow
                  label={t('project:scientificPublications.doi')}
                  value={doi}
                  isLink={true}
                  linkProps={{
                    href: `https://doi.org/${doi}`,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: styles.metadataLink
                  }}
                />

                <MetadataRow
                  label={t('project:scientificPublications.languages')}
                  value={languages}
                />

                {license && (
                  <MetadataRow
                    label={t('project:scientificPublications.license')}
                    value={license}
                  />
                )}

                {peerReview !== null && (
                  <MetadataRow
                    label={t('project:scientificPublications.peerReview')}
                    value={peerReview ? t('common:yes') : t('common:no')}
                  />
                )}

                {category && (
                  <MetadataRow
                    label={t('project:scientificPublications.category')}
                    value={category}
                  />
                )}
              </dl>

              <div className={styles.externalLinks}>
                <h3 className={styles.linksTitle}>{t('project:scientificPublications.externalAccess')}</h3>
                
                <div className={styles.linksList}>
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      <span className={styles.linkIcon}>🔗</span>
                      {t('project:scientificPublications.readOnHal')}
                    </a>
                  )}
                  
                  {doi && (
                    <a
                      href={`https://doi.org/${doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      <span className={styles.linkIcon}>📄</span>
                      {t('project:scientificPublications.accessViaDoi')}
                    </a>
                  )}

                  {nakalaLink && (
                    <a
                      href={nakalaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      <span className={styles.linkIcon}>🔗</span>
                      {t('project:scientificPublications.accessViaNakala')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - PDF Viewer */}
          <div className={styles.pdfSection}>
            <PDFViewer 
              halUrl={pdfUrl}
              title={publication.title}
              height="700px"
              showControls={true}
              showDownloadButton={true}
              showHalMetadata={true}
              enableMetadataFallback={true}
              className={styles.pdfViewer}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths({ locales }) {
  // For now, return empty paths since we don't have GraphQL working
  // Once GraphQL is configured, we'll fetch all publication IDs here
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export async function getStaticProps({ params, locale }) {
  const { id, slug } = params;

  try {
    const data = await getScientificPublicationById(id, locale);
    
    if (!data?.entry) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        publication: data.entry,
        ...(await serverSideTranslations(locale, ['common', 'project', 'home'])),
        error: null,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching scientific publication:', error);
    
    // For development, return mock data
    const mockPublication = {
      id: parseInt(id),
      slug,
      title: 'Publication de test - ' + slug,
      dateCreated: '2023-01-01',
      dateUpdated: '2023-01-01'
    };

    return {
      props: {
        publication: mockPublication,
        ...(await serverSideTranslations(locale, ['common', 'project', 'home'])),
        error: null,
      },
      revalidate: 60,
    };
  }
}

export default PublicationDetailPage; 