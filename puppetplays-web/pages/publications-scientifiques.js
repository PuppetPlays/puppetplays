import Layout from 'components/Layout';
import NoResults from 'components/NoResults';
import { getAllScientificPublications } from 'lib/api';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useMemo } from 'react';
import Head from 'next/head';
import styles from 'styles/ScientificPublications.module.scss';

const PublicationCard = ({ publication }) => {
  const { t } = useTranslation(['common', 'project']);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.getFullYear();
  };

  const year = formatDate(publication.dateCreated || publication.dateUpdated);

  return (
    <div className={styles.publicationCard}>
      <div className={styles.publicationHeader}>
        <div className={styles.publicationMeta}>
          {year && <span className={styles.year}>{year}</span>}
        </div>
      </div>

      <h3 className={styles.publicationTitle}>
        <Link
          href={`/publications-scientifiques/${publication.id}/${publication.slug || 'details'}`}
          className={styles.titleLink}
        >
          {publication.title}
        </Link>
      </h3>

      <div className={styles.publicationDetails}>
        <p>{t('project:scientificPublications.loadingPublications')}...</p>
      </div>

      <div className={styles.publicationActions}>
        <Link
          href={`/publications-scientifiques/${publication.id}/${publication.slug || 'details'}`}
          className={styles.secondaryButton}
        >
          {t('common:readMore')}
        </Link>
      </div>
    </div>
  );
};

const PublicationSection = ({ title, publications, isExpanded, onToggle }) => {
  const { t } = useTranslation(['common', 'project']);

  if (!publications || publications.length === 0) {
    return null;
  }

  return (
    <div className={styles.publicationSection}>
      <button
        className={styles.sectionHeader}
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.sectionMeta}>
          <span className={styles.publicationCount}>
            {t('project:scientificPublications.publicationCount', { count: publications.length })}
          </span>
          <span className={`${styles.toggleIcon} ${isExpanded ? styles.expanded : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className={styles.publicationGrid}>
          {publications.map(publication => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </div>
      )}
    </div>
  );
};

const ScientificPublicationsPage = ({ initialPublications, error }) => {
  const { t } = useTranslation(['common', 'project']);
  const [searchTerms, setSearchTerms] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    didierPlassardsMonography: true,
    peerReviewedPublications: true,
    phds: true,
    conferenceProceedings: true,
    nonPeerReviewed: true,
  });

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const filteredAndGroupedPublications = useMemo(() => {
    if (!initialPublications || initialPublications.length === 0) {
      return {};
    }

    let filtered = initialPublications;

    // Apply search filter
    if (searchTerms.trim()) {
      const searchLower = searchTerms.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.title?.toLowerCase().includes(searchLower)
      );
    }

    // For now, group all publications under one category until we get the GraphQL schema working
    const grouped = filtered.reduce((acc, publication) => {
      const category = 'peerReviewedPublications'; // Default category for now
      
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(publication);
      return acc;
    }, {});

    // Sort each group by date (most recent first)
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        const dateA = new Date(a.dateCreated || a.dateUpdated);
        const dateB = new Date(b.dateCreated || b.dateUpdated);
        return dateB - dateA;
      });
    });

    return grouped;
  }, [initialPublications, searchTerms]);

  const totalPublications = useMemo(() => {
    return Object.values(filteredAndGroupedPublications).reduce(
      (total, pubs) => total + pubs.length, 0
    );
  }, [filteredAndGroupedPublications]);

  if (error) {
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
          <p className={styles.subtitle}>
            {t('project:scientificPublications.subtitle')}
          </p>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={t('project:scientificPublications.filters.searchPlaceholder')}
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {totalPublications > 0 && (
            <div className={styles.resultsCount}>
              {t('project:scientificPublications.totalPublicationCount', { count: totalPublications })}
            </div>
          )}
        </div>

        <div className={styles.divider} />

        <div className={styles.publicationsContainer}>
          {totalPublications === 0 ? (
            <NoResults
              icon="search"
              title={t('project:scientificPublications.noPublicationsFound')}
              message={searchTerms ? t('common:tryAnotherSearch') : ''}
            />
          ) : (
            <>
              <PublicationSection
                title={t('project:scientificPublications.categories.didierPlassardsMonography')}
                publications={filteredAndGroupedPublications.didierPlassardsMonography}
                isExpanded={expandedSections.didierPlassardsMonography}
                onToggle={() => toggleSection('didierPlassardsMonography')}
              />

              <PublicationSection
                title={t('project:scientificPublications.categories.peerReviewedPublications')}
                publications={filteredAndGroupedPublications.peerReviewedPublications}
                isExpanded={expandedSections.peerReviewedPublications}
                onToggle={() => toggleSection('peerReviewedPublications')}
              />

              <PublicationSection
                title={t('project:scientificPublications.categories.phds')}
                publications={filteredAndGroupedPublications.phds}
                isExpanded={expandedSections.phds}
                onToggle={() => toggleSection('phds')}
              />

              <PublicationSection
                title={t('project:scientificPublications.categories.conferenceProceedings')}
                publications={filteredAndGroupedPublications.conferenceProceedings}
                isExpanded={expandedSections.conferenceProceedings}
                onToggle={() => toggleSection('conferenceProceedings')}
              />

              <PublicationSection
                title={t('project:scientificPublications.categories.nonPeerReviewed')}
                publications={filteredAndGroupedPublications.nonPeerReviewed}
                isExpanded={expandedSections.nonPeerReviewed}
                onToggle={() => toggleSection('nonPeerReviewed')}
              />
            </>
          )}
        </div>
      </div>
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
        ...(await serverSideTranslations(locale, ['common', 'project', 'home'])),
        error: null,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching scientific publications:', error);
    return {
      props: {
        initialPublications: [],
        ...(await serverSideTranslations(locale, ['common', 'project', 'home'])),
        error: error.message || error.toString(),
      },
      revalidate: 60, // Try again more frequently on error
    };
  }
}

export default ScientificPublicationsPage; 