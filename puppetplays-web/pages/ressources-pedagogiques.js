import FilterSelect from 'components/FilterSelect';
import Footer from 'components/Footer';
import Keywords, { Tag } from 'components/Keywords';
import Layout from 'components/Layout';
import { getAllEducationalResources } from 'lib/api';
import { hasAtLeastOneItem } from 'lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import styles from 'styles/EducationalResources.module.scss';

function EducationalResources({ initialData }) {
  const { t } = useTranslation('common');
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const resources = initialData?.entries || [];

  // Extract all unique keywords
  const allKeywords = resources.reduce((acc, resource) => {
    if (resource.keywords && Array.isArray(resource.keywords)) {
      resource.keywords.forEach(keyword => {
        if (!acc.find(k => k.id === keyword.id)) {
          acc.push(keyword);
        }
      });
    }
    return acc;
  }, []);

  // Filter resources by selected keywords (multiple selection)
  const filteredResources =
    selectedKeywords.length > 0
      ? resources.filter(resource =>
          selectedKeywords.some(selectedKeyword =>
            resource.keywords?.some(
              keyword => keyword.id === selectedKeyword.id,
            ),
          ),
        )
      : resources;

  const handleKeywordChange = value => {
    setSelectedKeywords(value || []);
  };

  const clearAllFilters = () => {
    setSelectedKeywords([]);
  };

  const getResourceExcerpt = resource => {
    if (resource.contentBlock && Array.isArray(resource.contentBlock)) {
      const textBlock = resource.contentBlock.find(
        block => block.contentDescription,
      );
      if (textBlock?.contentDescription) {
        // Strip HTML and limit to 150 characters
        const plainText = textBlock.contentDescription.replace(/<[^>]*>/g, '');
        return plainText.length > 150
          ? plainText.substring(0, 150) + '...'
          : plainText;
      }
    }
    return '';
  };

  return (
    <Fragment>
      <Layout>
        <Head>
          <title>{t('educationalResources.title')} | Puppetplays</title>
          <meta
            name="description"
            content={t('educationalResources.metaDescription')}
          />
        </Head>

        <div className={styles.container}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>
              {t('educationalResources.sidebarTitle')}
            </h2>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarSectionTitle}>
                {t('educationalResources.sidebar.allResources')}
              </h3>
              <button
                className={`${styles.sidebarButton} ${selectedKeywords.length === 0 ? styles.active : ''}`}
                onClick={clearAllFilters}
              >
                {t('educationalResources.sidebar.allResources')} (
                {resources.length})
              </button>
            </div>

            {allKeywords.length > 0 && (
              <div className={styles.sidebarSection}>
                <FilterSelect
                  name="keywords"
                  placeholder="Sélectionnez des mots-clés..."
                  options={allKeywords}
                  value={selectedKeywords}
                  onChange={handleKeywordChange}
                  isMulti={true}
                  isSearchable={true}
                  inverse={false}
                />

                {selectedKeywords.length > 0 && (
                  <button
                    className={styles.clearAllButton}
                    onClick={clearAllFilters}
                  >
                    Effacer tous les filtres
                  </button>
                )}
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            <div className={styles.header}>
              <h1 className={styles.title}>
                {t('educationalResources.title')}
              </h1>
              <p className={styles.description}>
                {t('educationalResources.pageDescription')}
              </p>
            </div>

            <div className={styles.resourcesGrid}>
              {filteredResources.length > 0 ? (
                filteredResources.map(resource => (
                  <article key={resource.id} className={styles.resourceCard}>
                    {hasAtLeastOneItem(resource.mainImage) && (
                      <div className={styles.resourceImage}>
                        <img
                          src={resource.mainImage[0].url}
                          alt={resource.mainImage[0].alt || resource.title}
                        />
                      </div>
                    )}

                    <div className={styles.resourceContent}>
                      <h2 className={styles.resourceTitle}>
                        <Link
                          href={`/ressources-pedagogiques/${resource.id}/${resource.slug}`}
                        >
                          {resource.title}
                        </Link>
                      </h2>

                      {getResourceExcerpt(resource) && (
                        <p className={styles.resourceExcerpt}>
                          {getResourceExcerpt(resource)}
                        </p>
                      )}

                      {resource.keywords && resource.keywords.length > 0 && (
                        <div className={styles.resourceKeywords}>
                          <Keywords
                            keywords={resource.keywords}
                            component={Tag}
                          />
                        </div>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className={styles.noResults}>
                  <h3>{t('educationalResources.noResourcesFound')}</h3>
                  <p>{t('educationalResources.exploreIntro')}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </Layout>

      <Footer />
    </Fragment>
  );
}

EducationalResources.propTypes = {
  initialData: PropTypes.object,
};

export async function getServerSideProps({ locale }) {
  try {
    const data = await getAllEducationalResources(locale);

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
        initialData: data,
      },
    };
  } catch (error) {
    console.error('Error fetching educational resources:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
        initialData: { entries: [] },
      },
    };
  }
}

export default EducationalResources;
