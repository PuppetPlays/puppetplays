import Footer from 'components/Footer';
import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import { getAllScientificPublications } from 'lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMemo } from 'react';
import styles from 'styles/ScientificPublications.module.scss';

const PublicationItem = ({ publication }) => {
  const { i18n } = useTranslation(['common', 'project']);

  // Early return if publication is not provided
  if (!publication) {
    return null;
  }

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.getFullYear();
  };

  const year =
    publication.date ||
    formatDate(publication.dateCreated || publication.dateUpdated);

  // Format authors from Table field
  const formatAuthors = authorData => {
    if (!authorData || !Array.isArray(authorData)) return '';
    return authorData
      .map(row => row.author)
      .filter(author => author && author.trim())
      .join(', ');
  };

  const authors = formatAuthors(publication.authorAndOrcidIdentifier);
  const journal = publication.editorName;
  const bookTitle = publication.bookTitle;
  const bookAuthor = publication.bookAuthor; // Assuming this field exists
  const volume = publication.volume;
  const pages = publication.pagesCount;

  // Get quotes based on locale
  const quotes =
    i18n.language === 'fr'
      ? { open: '« ', close: ' »' }
      : { open: '"', close: '"' };

  // Format pages with padding (Pages 01 - 150 format)
  const formatPages = pagesStr => {
    if (!pagesStr) return '';

    // Convert to string if it's not already
    const pagesString = String(pagesStr);

    // Try to extract page numbers if it's a range like "1-150" or "1 - 150"
    const rangeMatch = pagesString.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (rangeMatch) {
      const startPage = parseInt(rangeMatch[1]);
      const endPage = parseInt(rangeMatch[2]);
      const paddedStart = startPage.toString().padStart(2, '0');
      const paddedEnd = endPage.toString().padStart(2, '0');
      return `Pages ${paddedStart} - ${paddedEnd}`;
    }

    // If it's just a number, assume it starts from page 1
    const pageMatch = pagesString.match(/(\d+)/);
    if (pageMatch) {
      const pageCount = parseInt(pageMatch[1]);
      return `Pages 01 - ${pageCount.toString().padStart(2, '0')}`;
    }

    return `Pages ${pagesString}`;
  };

  return (
    <div className={styles.publicationItem}>
      {year && <div className={styles.publicationDate}>{year}</div>}

      <h3 className={styles.publicationTitle}>
        <Link
          href={`/publications-scientifiques/${publication.id}/${
            publication.slug || 'details'
          }`}
          className={styles.titleLink}
        >
          {authors && <span className={styles.authors}>{authors}, </span>}
          <span className={styles.titleQuoted}>
            {quotes.open}
            {publication.title}
            {quotes.close}
          </span>
          {(bookTitle || journal) && (
            <span className={styles.inPublication}>
              {' '}
              dans {bookAuthor && `${bookAuthor}, `}
              <em>{bookTitle || journal}</em>
            </span>
          )}
        </Link>
      </h3>

      <div className={styles.publicationContent}>
        {(journal || volume || pages) && (
          <p className={styles.publicationDetails}>
            {journal && (
              <span className={styles.publisher}>
                Publié par <em>{journal}</em>
              </span>
            )}
            {volume && (
              <span className={styles.volume}>
                {journal ? ' ' : ''}
                {volume}
              </span>
            )}
            {pages && (
              <span className={styles.pages}>
                {journal || volume ? ' ' : ''}
                {formatPages(pages)}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

const PublicationSection = ({ title, publications }) => {
  if (!publications || publications.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.publicationsList}>
        {publications.map(publication => (
          <PublicationItem key={publication.id} publication={publication} />
        ))}
      </div>
    </section>
  );
};

const ScientificPublicationsPage = ({ initialPublications, error }) => {
  const { t } = useTranslation(['common', 'project']);

  const groupedPublications = useMemo(() => {
    if (!initialPublications || initialPublications.length === 0) {
      return {};
    }

    // Group by scientific category
    const grouped = initialPublications.reduce((acc, publication) => {
      const category =
        publication.scientificCategory || 'peerReviewedPublications';

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(publication);
      return acc;
    }, {});

    // Sort each group by date (most recent first)
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        const dateA = new Date(a.date || a.dateCreated || a.dateUpdated);
        const dateB = new Date(b.date || b.dateCreated || b.dateUpdated);
        return dateB - dateA;
      });
    });

    return grouped;
  }, [initialPublications]);

  if (error) {
    return (
      <Layout>
        <Head>
          <title>
            {t('project:scientificPublications.title')} | Puppetplays
          </title>
          <meta
            name="description"
            content={t('project:scientificPublications.metaDescription')}
          />
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

  return (
    <Layout>
      <Head>
        <title>{t('project:scientificPublications.title')} | Puppetplays</title>
        <meta
          name="description"
          content={t('project:scientificPublications.metaDescription')}
        />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {t('project:scientificPublications.title')}
          </h1>
          <p className={styles.description}>
            {t('project:scientificPublications.pageDescription')}
          </p>
        </header>

        {Object.keys(groupedPublications).length === 0 ? (
          <NoResults
            icon="search"
            title={t('project:scientificPublications.noPublicationsFound')}
          />
        ) : (
          <>
            {/* Didier Plassard's monography */}
            <PublicationSection
              title={t(
                'project:scientificPublications.categories.didierPlassardsMonography',
              )}
              publications={groupedPublications.didierPlassardsMonography}
            />

            {/* Peer-reviewed publications */}
            <PublicationSection
              title={t(
                'project:scientificPublications.categories.peerReviewedPublications',
              )}
              publications={groupedPublications.peerReviewedPublications}
            />

            {/* PhDs */}
            <PublicationSection
              title={t('project:scientificPublications.categories.phds')}
              publications={groupedPublications.phds}
            />

            {/* Conference proceedings */}
            {groupedPublications.conferenceProceedings && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {t(
                    'project:scientificPublications.categories.conferenceProceedings',
                  )}
                </h2>

                {/* Conference 1 */}
                <h3 className={styles.subsectionTitle}>
                  {t('project:scientificPublications.conferences.conference1')}
                </h3>
                <div className={styles.publicationsList}>
                  {groupedPublications.conferenceProceedings
                    .filter(pub => pub.conferenceGroup === '1')
                    .map(publication => (
                      <PublicationItem
                        key={publication.id}
                        publication={publication}
                      />
                    ))}
                </div>

                {/* Conference 2 */}
                <h3 className={styles.subsectionTitle}>
                  {t('project:scientificPublications.conferences.conference2')}
                </h3>
                <div className={styles.publicationsList}>
                  {groupedPublications.conferenceProceedings
                    .filter(pub => pub.conferenceGroup === '2')
                    .map(publication => (
                      <PublicationItem
                        key={publication.id}
                        publication={publication}
                      />
                    ))}
                </div>

                {/* Conference 3 */}
                <h3 className={styles.subsectionTitle}>
                  {t('project:scientificPublications.conferences.conference3')}
                </h3>
                <div className={styles.publicationsList}>
                  {groupedPublications.conferenceProceedings
                    .filter(pub => pub.conferenceGroup === '3')
                    .map(publication => (
                      <PublicationItem
                        key={publication.id}
                        publication={publication}
                      />
                    ))}
                </div>
              </section>
            )}

            {/* Cahiers Élisabéthains */}
            <PublicationSection
              title={t(
                'project:scientificPublications.categories.cahiersElizabethains',
              )}
              publications={groupedPublications.cahiersElizabethains}
            />

            {/* Non peer-reviewed publications */}
            <PublicationSection
              title={t(
                'project:scientificPublications.categories.nonPeerReviewed',
              )}
              publications={groupedPublications.nonPeerReviewed}
            />
          </>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    const data = await getAllScientificPublications(locale);

    const sortedPublications = (data?.entries || []).sort((a, b) => {
      const dateA = new Date(a.dateCreated || a.dateUpdated);
      const dateB = new Date(b.dateCreated || b.dateUpdated);
      return dateB - dateA; // Most recent first
    });

    return {
      props: {
        initialPublications: sortedPublications,
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
    console.error('Error fetching scientific publications:', error);
    return {
      props: {
        initialPublications: [],
        ...(await serverSideTranslations(locale, [
          'common',
          'project',
          'home',
        ])),
        error: error.message || error.toString(),
      },
      revalidate: 60, // Try again more frequently on error
    };
  }
}

export default ScientificPublicationsPage;
