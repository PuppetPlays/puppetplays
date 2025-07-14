import { useFormattedTranslation } from 'hooks/useFormattedTranslation';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import Pagination from '../../components/Pagination';
import PressReviews from '../../components/Project/PressReviews';
import ProjectLayout from '../../components/Project/ProjectLayout';
import { fetchAPI } from '../../lib/api';
import styles from '../../styles/Communications.module.scss';

// Composant pour afficher les parties d'un article
const ArticleParts = ({ parts }) => {
  const { t } = useFormattedTranslation(['project', 'common']);

  if (!parts || parts.length === 0) {
    return null;
  }

  // Fonction pour formater la date avec le mois traduit
  const formatDate = dateString => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();

    // Utiliser la traduction pour le nom du mois
    const translatedMonth = t(`common:months.${month}`);

    return `${day} ${translatedMonth} ${year}`;
  };

  return (
    <div className={styles.articleParts}>
      <div className={styles.partsList}>
        {parts.map(part => (
          <div className={styles.partItem} key={part.id}>
            <Link
              href={part.urlBlock || '#'}
              className={styles.partLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.partImageContainer}>
                {part.thumbnailBlock && part.thumbnailBlock.length > 0 ? (
                  <img
                    src={part.thumbnailBlock[0].url}
                    alt={part.titleBlock}
                    className={styles.partImage}
                  />
                ) : (
                  <div className={styles.partImagePlaceholder} />
                )}
              </div>
              <div className={styles.partContent}>
                <h5 className={styles.partTitle}>{part.titleBlock}</h5>
                {part.dateBlock && (
                  <div className={styles.partDate}>
                    {formatDate(part.dateBlock)}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArticleCard = ({ article }) => {
  const { t } = useFormattedTranslation(['project', 'common']);

  // Extraire les données depuis la structure GraphQL
  const {
    title,
    dateCommunications,
    authorsCommunications,
    excerptComunications,
    urlCommunications,
    thumbnail,
    parts,
  } = article;

  const authors = authorsCommunications
    ? authorsCommunications.split(',').map(author => author.trim())
    : [];

  const imageUrl =
    thumbnail && thumbnail.length > 0
      ? thumbnail[0].url
      : '/project-thumbnail.jpg';

  const hasParts = parts && parts.length > 0;

  // Fonction pour formater la date avec le mois traduit
  const formatDate = dateString => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = date.getDate();
    const month = date.getMonth(); // 0-11
    const year = date.getFullYear();

    // Utiliser la traduction pour le nom du mois
    const translatedMonth = t(`common:months.${month}`);

    return `${day} ${translatedMonth} ${year}`;
  };

  return (
    <div className={styles.articleCard}>
      <Link
        href={urlCommunications || '#'}
        className={styles.thumbnailContainer}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={imageUrl}
          alt={`${title} - ${t('common:image')}`}
          className={styles.thumbnail}
        />
      </Link>

      <div className={styles.contentContainer}>
        <div className={styles.articleCardHeader}>
          <div className={styles.date}>
            {dateCommunications ? formatDate(dateCommunications) : ''}
          </div>
        </div>

        <h3 className={styles.cardTitle}>
          <Link
            href={urlCommunications || '#'}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        </h3>

        <p
          className={styles.excerpt}
          dangerouslySetInnerHTML={{
            __html: excerptComunications,
          }}
        />

        <div className={styles.metaContainer}>
          {authors && authors.length > 0 && (
            <span className={styles.author}>
              {t('project:communications.par')} {authors.join(', ')}
            </span>
          )}
        </div>

        {/* Afficher les parties de l'article si elles existent */}
        {hasParts && <ArticleParts parts={parts} />}
      </div>
    </div>
  );
};

// Requête GraphQL pour récupérer les communications et les revues de presse
const getCommunicationsQuery = `
query GetCommunications($locale: [String]) {
  entries(section: "communications", site: $locale) {
    id,
    title,
    slug,
    ... on communications_communications_Entry {
      excerptComunications,
      authorsCommunications,
      dateCommunications,
      urlCommunications,
      thumbnail {
        id,
        url,
        width,
        height
      },
      parts {
        ... on parts_partsBlock_BlockType {
          id,
          typeHandle,
          titleBlock,
          urlBlock,
          dateBlock,
          thumbnailBlock {
            id,
            url,
            width,
            height
          }
        }
      }
    }
  }
  entryCount(section: "communications", site: $locale)
  
  pressReviews: entries(section: "newsletters", site: $locale) {
    id,
    title,
    slug,
    ... on newsletters_default_Entry {
      authorsPress,
      publicationName,
      publicationDate,
      consultationDate,
      articleLink,
      thumbnail {
        id,
        url,
        width,
        height
      }
    }
  }
  pressReviewsCount: entryCount(section: "newsletters", site: $locale)
}
`;

const CommunicationsPage = ({ initialCommunications, initialPressReviews }) => {
  const { t } = useFormattedTranslation(['project', 'common']);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState('pressReviews'); // 'newsletters' ou 'pressReviews'
  const ARTICLES_PER_PAGE = 5; // Show 5 articles per page for press review style

  // Determine which data to use based on active tab - INVERSÉ
  const currentData =
    activeTab === 'newsletters' ? initialPressReviews : initialCommunications;

  // Calculate pagination values
  const pageCount = Math.ceil(currentData.length / ARTICLES_PER_PAGE);
  const paginatedArticles = currentData.slice(
    currentPage * ARTICLES_PER_PAGE,
    (currentPage + 1) * ARTICLES_PER_PAGE,
  );

  const handlePageChange = page => {
    setCurrentPage(page.selected);
    // Scroll to the top of the articles grid when page changes
    const articlesTop = document.getElementById('articles-top');
    if (articlesTop) {
      articlesTop.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = tab => {
    setActiveTab(tab);
    setCurrentPage(0); // Reset to first page when changing tabs
  };

  return (
    <ProjectLayout
      title={t('project:mainNav.communications')}
      metaDescription={t('project:communications.metaDescription')}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1
            className={styles.title}
            dangerouslySetInnerHTML={{
              __html: t('project:mainNav.communications'),
            }}
          />
          <p
            className={styles.subtitle}
            dangerouslySetInnerHTML={{
              __html: t('project:communications.subtitle'),
            }}
          />
        </header>

        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'pressReviews' ? styles.active : ''}`}
              onClick={() => handleTabChange('pressReviews')}
            >
              {t('project:communications.tabs.pressReviews')}
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'newsletters' ? styles.active : ''}`}
              onClick={() => handleTabChange('newsletters')}
            >
              {t('project:communications.tabs.newsletters')}
            </button>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Articles list */}
        <div id="articles-top" />
        {activeTab === 'newsletters' ? (
          // Newsletters content - maintenant affiche Press Reviews
          <PressReviews reviews={paginatedArticles} />
        ) : paginatedArticles.length > 0 ? (
          <div className={styles.articleGrid}>
            {paginatedArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>{t('project:communications.noArticlesFound')}</p>
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className={styles.paginationContainer}>
            <Pagination
              forcePage={currentPage}
              pageCount={pageCount}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </ProjectLayout>
  );
};

export async function getStaticProps({ locale }) {
  try {
    // Récupérer les données des communications et revues de presse
    const data = await fetchAPI(getCommunicationsQuery, {
      variables: {
        locale,
      },
    });

    // Trier les communications par date, de la plus récente à la plus ancienne
    const sortedCommunications = (data?.entries || []).sort((a, b) => {
      const dateA = new Date(a.dateCommunications || '1900-01-01');
      const dateB = new Date(b.dateCommunications || '1900-01-01');
      return dateB - dateA; // Tri décroissant (plus récent en premier)
    });

    // Trier les revues de presse par date de publication
    const sortedPressReviews = (data?.pressReviews || []).sort((a, b) => {
      const dateA = new Date(a.publicationDate || '1900-01-01');
      const dateB = new Date(b.publicationDate || '1900-01-01');
      return dateB - dateA; // Tri décroissant (plus récent en premier)
    });

    return {
      props: {
        initialCommunications: sortedCommunications,
        initialPressReviews: sortedPressReviews,
        ...(await serverSideTranslations(locale, ['common', 'project', 'home'])),
      },
      // Revalidation toutes les heures pour mettre à jour le contenu
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching communications:', error);
    return {
      props: {
        initialCommunications: [],
        initialPressReviews: [],
        ...(await serverSideTranslations(locale, ['common', 'project'])),
      },
      revalidate: 60, // Réessayer plus fréquemment en cas d'erreur
    };
  }
}

export default CommunicationsPage;
