import Footer from 'components/Footer';
import Layout from 'components/Layout';
import { getAllTechnicalDocumentation } from 'lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';
import styles from 'styles/TechnicalDocumentation.module.scss';

function TechnicalDocumentation({ initialData }) {
  const { t } = useTranslation('common');
  const [activeItem, setActiveItem] = useState(null);

  const sidebarItems =
    initialData?.globalSets?.technicalDocumentation?.sidebar || [];

  // Process sidebar items - keep category and use sidebarLink as anchor
  const processedSidebarItems = sidebarItems.map(item => {
    // Parse anchor to extract id and slug if format is "id-slug" or just use as is
    let entryId = '';
    let entrySlug = '';
    const anchor = item.sidebarLink || '';

    if (/^\d+$/.test(anchor)) {
      // Just an ID
      entryId = anchor;
      entrySlug =
        item.sidebarTitle?.toLowerCase().replace(/\s+/g, '-') || 'entry';
    } else if (anchor.includes('-')) {
      // Format: id-slug
      const parts = anchor.split('-');
      if (/^\d+$/.test(parts[0])) {
        entryId = parts[0];
        entrySlug = parts.slice(1).join('-');
      } else {
        // Just a slug with dashes
        entrySlug = anchor;
      }
    } else {
      // Just a slug
      entrySlug = anchor;
    }

    return {
      title: item.sidebarTitle || '',
      content: item.sidebarContent || '',
      link: item.sidebarLink || '',
      anchor: anchor,
      entryId: entryId,
      entrySlug: entrySlug,
      category: item.category || item.sidebarContent || '',
      id: item.id,
    };
  });

  return (
    <Fragment>
      <Layout>
        <Head>
          <title>
            {t('common:technicalDocumentation.title')} | Puppetplays
          </title>
          <meta
            name="description"
            content={t('common:technicalDocumentation.metaDescription')}
          />
        </Head>

        <div className={styles.wrapper}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/" className={styles.breadcrumbLink}>
              {t('common:home')}
            </Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span className={styles.breadcrumbCurrent}>
              {t('common:technicalDocumentation.title')}
            </span>
          </nav>

          <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <h2 className={styles.sidebarTitle}>
                {t('common:technicalDocumentation.sidebarTitle')}
              </h2>

              {/* Sidebar Links from CMS grouped by category */}
              {processedSidebarItems.length > 0 &&
                (() => {
                  // Group items by category
                  const groupedItems = processedSidebarItems.reduce(
                    (acc, item) => {
                      const category =
                        item.category ||
                        t('common:technicalDocumentation.uncategorized');
                      if (!acc[category]) {
                        acc[category] = [];
                      }
                      acc[category].push(item);
                      return acc;
                    },
                    {},
                  );

                  return Object.entries(groupedItems).map(
                    ([category, items]) => (
                      <div key={category} className={styles.sidebarSection}>
                        <h3 className={styles.sidebarCategoryTitle}>
                          {category}
                        </h3>
                        <ul className={styles.sidebarList}>
                          {items.map(item => (
                            <li key={item.id}>
                              {item.link && item.link.startsWith('http') ? (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${styles.sidebarLink} ${activeItem === item.id ? styles.active : ''}`}
                                  onClick={() => setActiveItem(item.id)}
                                >
                                  {item.title}
                                  <span className={styles.externalIcon}>
                                    ↗
                                  </span>
                                </a>
                              ) : item.entryId ? (
                                <Link
                                  href={`/documentation-technique/${item.entryId}/${item.entrySlug}`}
                                  className={`${styles.sidebarLink} ${activeItem === item.id ? styles.active : ''}`}
                                  onClick={() => setActiveItem(item.id)}
                                >
                                  {item.title}
                                </Link>
                              ) : (
                                <span
                                  className={styles.sidebarLink}
                                  style={{
                                    opacity: 0.6,
                                    cursor: 'not-allowed',
                                  }}
                                >
                                  {item.title}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  );
                })()}
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
              <div className={styles.header}>
                <h1 className={styles.title}>
                  {t('common:technicalDocumentation.title')}
                </h1>
                <p className={styles.description}>
                  {t('common:technicalDocumentation.pageDescription')}
                </p>
              </div>

              {/* Content sections with anchors */}
              <div className={styles.contentSections}>
                <div className={styles.introSection}>
                  <p>{t('common:technicalDocumentation.exploreIntro')}</p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </Layout>

      <Footer />
    </Fragment>
  );
}

TechnicalDocumentation.propTypes = {
  initialData: PropTypes.object,
};

export async function getServerSideProps({ locale }) {
  console.log(
    '🚀 [TechnicalDoc Page] Getting server-side props for locale:',
    locale,
  );

  try {
    const data = await getAllTechnicalDocumentation(locale);

    console.log('📦 [TechnicalDoc Page] Data fetched:', {
      hasData: !!data,
      entriesCount: data?.entries?.length || 0,
      hasSidebar: !!data?.globalSets?.technicalDocumentation?.sidebar,
      sidebarItemsCount:
        data?.globalSets?.technicalDocumentation?.sidebar?.length || 0,
    });

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
        initialData: data,
      },
    };
  } catch (error) {
    console.error(
      '❌ [TechnicalDoc Page] Error fetching technical documentation:',
      error.message,
    );
    console.error('Full page error:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
        initialData: { entries: [], globalSets: {} },
      },
    };
  }
}

export default TechnicalDocumentation;
