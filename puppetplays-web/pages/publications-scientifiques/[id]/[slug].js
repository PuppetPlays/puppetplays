import Footer from 'components/Footer';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import PDFViewer from 'components/PDF/PDFViewerDynamic';
import { getScientificPublicationById } from 'lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Fragment } from 'react';
import styles from 'styles/PublicationDetail.module.scss';

const PublicationDetailPage = ({ publication, error }) => {
  const { t } = useTranslation(['common', 'project']);
  const router = useRouter();

  if (error) {
    return (
      <Layout>
        <Head>
          <title>
            {t('project:scientificPublications.title')} | Puppetplays
          </title>
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
          <title>
            {t('project:scientificPublications.title')} | Puppetplays
          </title>
        </Head>
        <div className={styles.container}>
          <NoResults
            icon="search"
            title={t('project:scientificPublications.publicationNotFound')}
            message={t(
              'project:scientificPublications.publicationNotFoundDesc',
            )}
          />
        </div>
      </Layout>
    );
  }

  const formatDate = dateString => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.getFullYear();
    } catch {
      return '';
    }
  };

  // Helper function to construct PDF URL from HAL CV Link
  const constructHalPdfUrl = halCvLink => {
    if (!halCvLink) {
      return null;
    }

    // If it already ends with /document, use as is
    if (halCvLink.endsWith('/document')) {
      return halCvLink;
    }

    // Add /document to the end of the HAL link
    const finalUrl = `${halCvLink}/document`;
    return finalUrl;
  };

  // Obtenir les identifiants ORCID
  const getOrcidIdentifiers = authorData => {
    if (!authorData || !Array.isArray(authorData)) return [];
    return authorData
      .map(row => ({
        author: row.author,
        orcid: row.orcidIdentifier,
      }))
      .filter(item => item.author && item.author.trim());
  };

  // Obtenir la catégorie formatée
  const getCategoryLabel = category => {
    if (!category)
      return t(
        'project:scientificPublications.categories.peerReviewedPublications',
      );
    return t(`project:scientificPublications.categories.${category}`, category);
  };

  // Format book editors
  const formatBookEditors = editorsData => {
    if (!editorsData || !Array.isArray(editorsData)) return '';
    return editorsData
      .map(editor => {
        if (editor.firstName && editor.lastName) {
          return `${editor.firstName} ${editor.lastName}`;
        }
        return editor.title || '';
      })
      .filter(name => name.trim())
      .join(', ');
  };

  // Use real data from CraftCMS
  const pdfUrl = constructHalPdfUrl(publication.halCvLink);
  const authorsList = getOrcidIdentifiers(publication.authorAndOrcidIdentifier);
  const doi = publication.doi;
  const publisher = publication.editorName;
  const bookTitle = publication.bookTitle;
  const volume = publication.volume;
  const pages = publication.pages;
  const issn = publication.issn;
  const placeOfEdition = publication.placeOfEdition;
  const year =
    publication.date ||
    formatDate(publication.dateCreated) ||
    formatDate(publication.dateUpdated);
  const category = getCategoryLabel(publication.scientificCategory);
  const languages = publication.languages?.map(lang => lang.title).join(', ');
  const license = publication.license;
  const peerReview = publication.peerReview;
  const nakalaLink = publication.nakalaLink;
  const bookEditors = formatBookEditors(publication.authors);

  return (
    <Fragment>
      <div className={styles.pageContainer}>
        <Layout>
          <Head>
            <title>{`${publication.title} | ${t('project:scientificPublications.title')} | Puppetplays`}</title>
            <meta
              name="description"
              content={`${publication.title} - ${t('project:scientificPublications.metaDescription')}`}
            />
          </Head>

          <div className={styles.container}>
            {/* Breadcrumbs */}
            <div className={styles.breadcrumbs}>
              <Link href="/publications-scientifiques">
                <span className={styles.breadcrumbItemText}>
                  {t('project:scientificPublications.title')}
                </span>
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>
                <span className={styles.breadcrumbItemText}>
                  {publication.title}
                </span>
              </span>
            </div>

            {/* Publication Header */}
            <div className={styles.publicationHeader}>
              <h1 className={styles.publicationDetailTitle}>
                {publication.title}
              </h1>

              {/* Essential Metadata */}
              <div className={styles.essentialMetadata}>
                {authorsList.length > 0 && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>
                      {t('project:scientificPublications.authors')}:
                    </span>
                    <span className={styles.metaValue}>
                      {authorsList.map((author, index) => (
                        <span key={index}>
                          {author.orcid ? (
                            <a
                              href={`https://orcid.org/${author.orcid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.authorLink}
                            >
                              {author.author}
                            </a>
                          ) : (
                            author.author
                          )}
                          {index < authorsList.length - 1 && ', '}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
                {year && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>
                      {t('project:scientificPublications.publicationDate')}:
                    </span>
                    <span className={styles.metaValue}>{year}</span>
                  </div>
                )}
                {category && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>
                      {t('project:scientificPublications.category')}:
                    </span>
                    <span className={styles.categoryBadge}>{category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content Layout */}
            <div className={styles.mainLayout}>
              {/* PDF Viewer - Central Element */}
              <div className={styles.pdfContainer}>
                {pdfUrl ? (
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
                ) : (
                  <div className={styles.pdfViewerPlaceholder}>
                    <div className={styles.placeholderContent}>
                      <h3>
                        {t('project:scientificPublications.noPdfAvailable')}
                      </h3>
                      <p>
                        Le document PDF n&apos;est pas disponible pour cette
                        publication.
                      </p>
                    </div>
                  </div>
                )}

                {/* Volume and Pages Information */}
                {(volume || pages) && (
                  <div className={styles.volumePagesInfo}>
                    {volume && (
                      <div className={styles.infoItem}>
                        <span className={styles.infoValue}>{volume}</span>
                      </div>
                    )}
                    {pages && (
                      <div className={styles.infoItem}>
                        <span className={styles.infoValue}>{pages}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar - Publication Details */}
              <div className={styles.sidebar}>
                {/* Publication Information */}
                <div className={styles.sidebarBlock}>
                  <h3 className={styles.sidebarTitle}>
                    {t('project:scientificPublications.publicationDetails')}
                  </h3>
                  <div className={styles.detailsList}>
                    {bookEditors && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Direction</span>
                        <span>{bookEditors}</span>
                      </div>
                    )}

                    {bookTitle && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('project:scientificPublications.in')}
                        </span>
                        <span>{bookTitle}</span>
                      </div>
                    )}

                    {publisher && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('project:scientificPublications.editor')}
                        </span>
                        <span>{publisher}</span>
                      </div>
                    )}

                    {issn && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('project:scientificPublications.issn')}
                        </span>
                        <span>{issn}</span>
                      </div>
                    )}

                    {placeOfEdition && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('project:scientificPublications.placeOfEdition')}
                        </span>
                        <span>{placeOfEdition}</span>
                      </div>
                    )}

                    {languages && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('project:scientificPublications.languages')}
                        </span>
                        <span>{languages}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Information */}
                <div className={styles.sidebarBlock}>
                  <h3 className={styles.sidebarTitle}>
                    Informations académiques
                  </h3>
                  <div className={styles.detailsList}>
                    {peerReview !== null && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('project:scientificPublications.peerReview')}
                        </span>
                        <span
                          className={`${styles.peerReviewBadge} ${peerReview ? styles.reviewed : styles.notReviewed}`}
                        >
                          {peerReview ? t('common:yes') : t('common:no')}
                        </span>
                      </div>
                    )}

                    {license && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {t('project:scientificPublications.license')}
                        </span>
                        <span>{license}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* External Links */}
            {(pdfUrl || doi || nakalaLink) && (
              <div className={styles.externalLinksSection}>
                <h2 className={styles.sectionTitle}>
                  {t('project:scientificPublications.externalAccess')}
                </h2>
                <div className={styles.externalLinksGrid}>
                  {pdfUrl && (
                    <a
                      href={publication.halCvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLinkItem}
                    >
                      <div className={styles.linkTitle}>
                        {t('project:scientificPublications.readOnHal')}
                      </div>
                      <div className={styles.linkDescription}>
                        {t('project:scientificPublications.pdfNote')} HAL
                      </div>
                    </a>
                  )}

                  {doi && (
                    <a
                      href={`https://doi.org/${doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLinkItem}
                    >
                      <div className={styles.linkTitle}>
                        {t('project:scientificPublications.accessViaDoi')}
                      </div>
                      <div className={styles.linkDescription}>
                        {t('project:scientificPublications.doiNote')}
                      </div>
                    </a>
                  )}

                  {nakalaLink && (
                    <a
                      href={nakalaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLinkItem}
                    >
                      <div className={styles.linkTitle}>
                        {t('project:scientificPublications.accessViaNakala')}
                      </div>
                      <div className={styles.linkDescription}>
                        {t('project:scientificPublications.pdfNote')} Nakala
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Layout>
        <Footer />
      </div>
    </Fragment>
  );
};

export async function getStaticPaths({ locales }) {
  // For now, return empty paths since we don't have GraphQL working
  // Once GraphQL is configured, we'll fetch all publication IDs here
  return {
    paths: [],
    fallback: 'blocking',
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
        ...(await serverSideTranslations(locale, [
          'common',
          'project',
          'home',
        ])),
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
      dateUpdated: '2023-01-01',
    };

    return {
      props: {
        publication: mockPublication,
        ...(await serverSideTranslations(locale, [
          'common',
          'project',
          'home',
        ])),
        error: null,
      },
      revalidate: 60,
    };
  }
}

export default PublicationDetailPage;
