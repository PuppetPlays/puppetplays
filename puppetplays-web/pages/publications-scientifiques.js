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
  const { t } = useTranslation(['common', 'project']);

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
  const volume = publication.volume;
  const pages = publication.pagesCount;

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
          {publication.title}
        </Link>
        {authors && (
          <span className={styles.authorsSuffix}>
            {' '}
            produits par <em>{authors}</em>
          </span>
        )}
      </h3>

      <div className={styles.publicationContent}>
        {journal && (
          <p className={styles.publicationDetails}>
            <span className={styles.journal}>
              Publié dans <em>{journal}</em>
            </span>
            {volume && (
              <span className={styles.volume}>
                {t('project:scientificPublications.volume')} {volume}
              </span>
            )}
            {pages && (
              <span className={styles.pages}>
                {pages} {t('project:scientificPublications.pages')}
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
