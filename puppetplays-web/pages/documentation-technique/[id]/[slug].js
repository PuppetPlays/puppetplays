import Footer from 'components/Footer';
import Layout from 'components/Layout';
import { getTechnicalDocumentationEntry } from 'lib/api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import styles from 'styles/TechnicalDocumentationDetail.module.scss';

function TechnicalDocumentationDetail({ entry, error }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isClientSide, setIsClientSide] = useState(false);

  // Fix hydration issues by ensuring client-side rendering
  useEffect(() => {
    setIsClientSide(true);
  }, []);

  if (error) {
    return (
      <Fragment>
        <Layout>
          <Head>
            <title>{t('error.title')} | Puppetplays</title>
          </Head>
          <div className={styles.wrapper}>
            <div className={styles.container}>
              <div className={styles.error}>
                <h2>{t('error.documentNotFound')}</h2>
                <p>{t('error.documentNotFoundDescription')}</p>
                        <Link href="/documentation-technique" className={styles.backLink}>
          ← {t('common:technicalDocumentation.backToList')}
                </Link>
              </div>
            </div>
          </div>
        </Layout>
        <Footer />
      </Fragment>
    );
  }

  // Show loading state on server-side and until client-side hydration is complete
  if (!entry || !isClientSide) {
    return (
      <Fragment>
        <Layout>
          <Head>
            <title>{t('loading')} | Puppetplays</title>
          </Head>
          <div className={styles.wrapper}>
            <div className={styles.container}>
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>{t('loading')}...</p>
              </div>
            </div>
          </div>
        </Layout>
        <Footer />
      </Fragment>
    );
  }

  // Parse the content if it contains HTML
  const renderContent = () => {
    // Use introduction as main content since it's a Redactor field
    const contentToRender = entry.introduction;
    
    if (!contentToRender) return null;
    
    // Introduction is a Redactor field, so it contains HTML
    return <div className={styles.body} dangerouslySetInnerHTML={{ __html: contentToRender }} />;
  };
  
  // Render Sheet Table if present
  const renderSheetTable = () => {
    if (!entry.sheetTable || entry.sheetTable.length === 0) return null;
    
    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Dublin Element</th>
              <th>Database Field</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {entry.sheetTable.map((row, index) => (
              <tr key={index}>
                <td>{row.col1 || ''}</td>
                <td>{row.col2 || ''}</td>
                <td>{row.col3 || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Fragment>
      <Layout>
        <Head>
          <title>{entry.title} | {t('common:technicalDocumentation.title')} | Puppetplays</title>
          <meta
            name="description"
            content={entry.description || t('common:technicalDocumentation.metaDescription')}
          />
        </Head>

        <div className={styles.wrapper}>
          <div className={styles.container}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>
                {t('common:home')}
              </Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <Link href="/documentation-technique" className={styles.breadcrumbLink}>
                {t('common:technicalDocumentation.title')}
              </Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbCurrent}>
                {entry.title}
              </span>
            </nav>

            {/* Content */}
            <div className={styles.content}>
              {/* Header */}
              <header className={styles.header}>
                <h1 className={styles.title}>{entry.title}</h1>
                
                {entry.subtitle && (
                  <p className={styles.subtitle}>{entry.subtitle}</p>
                )}
                
                {/* Meta information */}
                {(entry.author || entry.date || entry.version || entry.category) && (
                  <div className={styles.meta}>
                    {entry.author && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('common:technicalDocumentation.author')}</span>
                        <span className={styles.metaValue}>{entry.author}</span>
                      </div>
                    )}
                    {entry.date && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('common:technicalDocumentation.date')}</span>
                        <span className={styles.metaValue}>
                          {new Date(entry.date).toLocaleDateString(router.locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    {entry.version && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('common:technicalDocumentation.version')}</span>
                        <span className={styles.metaValue}>{entry.version}</span>
                      </div>
                    )}
                    {entry.category && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('common:technicalDocumentation.category')}</span>
                        <span className={styles.metaValue}>{entry.category}</span>
                      </div>
                    )}
                  </div>
                )}
              </header>

              {/* Body content */}
              {renderContent()}
              
              {/* Sheet Table if present */}
              {renderSheetTable()}

              {/* Navigation */}
              <nav className={styles.navigation}>
                {entry.previousEntry ? (
                  <Link
                    href={`/documentation-technique/${entry.previousEntry.id}/${entry.previousEntry.slug}`}
                    className={styles.navButton}
                  >
                    ← {entry.previousEntry.title}
                  </Link>
                ) : (
                  <span className={`${styles.navButton} ${styles.disabled}`}>
                    ← {t('common:technicalDocumentation.noPrevious')}
                  </span>
                )}

                <Link href="/documentation-technique" className={styles.backLink}>
                  {t('common:technicalDocumentation.backToList')}
                </Link>

                {entry.nextEntry ? (
                  <Link
                    href={`/documentation-technique/${entry.nextEntry.id}/${entry.nextEntry.slug}`}
                    className={styles.navButton}
                  >
                    {entry.nextEntry.title} →
                  </Link>
                ) : (
                  <span className={`${styles.navButton} ${styles.disabled}`}>
                    {t('common:technicalDocumentation.noNext')} →
                  </span>
                )}
              </nav>
            </div>
          </div>
        </div>
      </Layout>

      <Footer />
    </Fragment>
  );
}

TechnicalDocumentationDetail.propTypes = {
  entry: PropTypes.object,
  error: PropTypes.bool,
};

export async function getServerSideProps({ params, locale }) {
  try {
    const entry = await getTechnicalDocumentationEntry(params.id, params.slug, locale);

    if (!entry) {
      return {
        props: {
          ...(await serverSideTranslations(locale, ['common'])),
          entry: null,
          error: true,
        },
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        entry,
        error: false,
      },
    };
  } catch (error) {
    console.error('Error fetching technical documentation entry:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        entry: null,
        error: true,
      },
    };
  }
}

export default TechnicalDocumentationDetail;