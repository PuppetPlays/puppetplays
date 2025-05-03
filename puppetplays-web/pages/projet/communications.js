import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import Pagination from '../../components/Pagination';
import ProjectLayout from '../../components/Project/ProjectLayout';
import { fetchAPI } from '../../lib/api';
import styles from '../../styles/Communications.module.scss';

// Composant pour afficher les parties d'un article
const ArticleParts = ({ parts }) => {
  const { t } = useTranslation(['project', 'common']);

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
  const { t } = useTranslation(['project', 'common']);

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
          >
            {title}
          </Link>
        </h3>

        <p className={styles.excerpt}>{excerptComunications}</p>

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

// Requête GraphQL pour récupérer les communications
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
}
`;

const CommunicationsPage = ({ initialCommunications }) => {
  const { t } = useTranslation(['project', 'common']);
  const [currentPage, setCurrentPage] = useState(0);
  const ARTICLES_PER_PAGE = 5; // Show 5 articles per page for press review style

  // Calculate pagination values
  const pageCount = Math.ceil(initialCommunications.length / ARTICLES_PER_PAGE);
  const paginatedArticles = initialCommunications.slice(
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

  return (
    <ProjectLayout
      title={t('project:mainNav.communications')}
      metaDescription={t('project:communications.metaDescription')}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {t('project:mainNav.communications')}
          </h1>
          <p className={styles.subtitle}>
            {t('project:communications.subtitle')}
          </p>
        </header>

        <div className={styles.divider} />

        {/* Articles list */}
        <div id="articles-top" />
        {paginatedArticles.length > 0 ? (
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
    // Récupérer les données des communications
    const data = await fetchAPI(getCommunicationsQuery, {
      variables: {
        locale,
      },
    });

    return {
      props: {
        initialCommunications: data?.entries || [],
        ...(await serverSideTranslations(locale, ['common', 'project'])),
      },
      // Revalidation toutes les heures pour mettre à jour le contenu
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching communications:', error);
    return {
      props: {
        initialCommunications: [],
        ...(await serverSideTranslations(locale, ['common', 'project'])),
      },
      revalidate: 60, // Réessayer plus fréquemment en cas d'erreur
    };
  }
}

export default CommunicationsPage;
