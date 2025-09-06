import Footer from 'components/Footer';
import HtmlContent from 'components/HtmlContent';
import Keywords, { Tag } from 'components/Keywords';
import Layout from 'components/Layout';
import { getEducationalResourceById } from 'lib/api';
import { hasAtLeastOneItem } from 'lib/utils';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import styles from 'styles/EducationalResourceDetail.module.scss';

function EducationalResourceDetail({ resourceData }) {
  const { t } = useTranslation('common');
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <div className={styles.loading}>
          {t('educationalResources.loadingResources')}
        </div>
      </Layout>
    );
  }

  if (!resourceData) {
    return (
      <Layout>
        <Head>
          <title>
            {t('educationalResources.resourceNotFound')} | Puppetplays
          </title>
        </Head>
        <div className={styles.notFound}>
          <h1>{t('educationalResources.resourceNotFound')}</h1>
          <p>{t('educationalResources.resourceNotFoundDescription')}</p>
          <Link href="/ressources-pedagogiques" className={styles.backLink}>
            {t('educationalResources.backToResources')}
          </Link>
        </div>
      </Layout>
    );
  }

  const renderContentBlocks = contentBlocks => {
    if (!contentBlocks || !Array.isArray(contentBlocks)) {
      return null;
    }

    return contentBlocks.map((block, index) => {
      return (
        <div key={index} className={styles.textBlock}>
          {block.contentTitle && (
            <h2 className={styles.blockTitle}>{block.contentTitle}</h2>
          )}
          {block.contentDescription && (
            <HtmlContent html={block.contentDescription} />
          )}
        </div>
      );
    });
  };

  return (
    <Fragment>
      <Layout>
        <Head>
          <title>{resourceData.title} | Puppetplays</title>
          <meta
            name="description"
            content={t('educationalResources.metaDescription')}
          />
        </Head>

        <div className={styles.container}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link
              href="/ressources-pedagogiques"
              className={styles.breadcrumbLink}
            >
              {t('educationalResources.title')}
            </Link>
            <span className={styles.breadcrumbSeparator}>›</span>
            <span className={styles.breadcrumbCurrent}>
              {resourceData.title}
            </span>
          </nav>

          {/* Header */}
          <header className={styles.header}>
            <h1 className={styles.title}>{resourceData.title}</h1>

            {resourceData.keywords && resourceData.keywords.length > 0 && (
              <div className={styles.headerKeywords}>
                <Keywords keywords={resourceData.keywords} component={Tag} />
              </div>
            )}
          </header>

          {/* Main content - centered */}
          <main className={styles.mainContent}>
            {hasAtLeastOneItem(resourceData.mainImage) && (
              <div className={styles.heroImage}>
                <img
                  src={resourceData.mainImage[0].url}
                  alt={resourceData.mainImage[0].alt || resourceData.title}
                  className={styles.heroImageImg}
                />
                {resourceData.mainImage[0].caption && (
                  <p className={styles.heroImageCaption}>
                    {resourceData.mainImage[0].caption}
                  </p>
                )}
              </div>
            )}

            <div className={styles.content}>
              {resourceData.contentBlock && (
                <div className={styles.contentBlocks}>
                  {renderContentBlocks(resourceData.contentBlock)}
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

EducationalResourceDetail.propTypes = {
  resourceData: PropTypes.object,
};

export async function getServerSideProps({ locale, params }) {
  try {
    const data = await getEducationalResourceById(locale, params.id);

    if (!data.entry) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        ...(await serverSideTranslations(locale, ['common', 'home'])),
        resourceData: data.entry,
      },
    };
  } catch (error) {
    console.error('Error fetching educational resource detail:', error);
    return {
      notFound: true,
    };
  }
}

export default EducationalResourceDetail;
