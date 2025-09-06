import Footer from 'components/Footer';
import Layout from 'components/Layout';
import { useFormattedTranslation } from 'hooks/useFormattedTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from 'styles/Privacy.module.scss';

const PrivacyPage = () => {
  const { t } = useFormattedTranslation(['privacy', 'common']);

  return (
    <Layout>
      <Head>
        <title>{t('privacy:title')} | PuppetPlays</title>
        <meta name="description" content={t('privacy:metaDescription')} />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('privacy:pageTitle')}</h1>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:dataProcessing.title')}
          </h2>
          <p className={styles.paragraph}>
            {t('privacy:dataProcessing.content')}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:dataController.title')}
          </h2>
          <p className={styles.paragraph}>
            {t('privacy:dataController.content')}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:legalBasis.title')}
          </h2>
          <p className={styles.paragraph}>{t('privacy:legalBasis.content')}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:dataRecipients.title')}
          </h2>
          <p className={styles.paragraph}>
            {t('privacy:dataRecipients.content')}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:dataRetention.title')}
          </h2>
          <p className={styles.paragraph}>
            {t('privacy:dataRetention.content')}
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:userRights.title')}
          </h2>
          <p className={styles.paragraph}>{t('privacy:userRights.content')}</p>
          <p className={styles.paragraph}>
            {t('privacy:userRights.opposition')}
          </p>
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={{
              __html: t('privacy:userRights.moreInfo'),
            }}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:exerciseRights.title')}
          </h2>
          <p className={styles.paragraph}>
            {t('privacy:exerciseRights.content')}
          </p>
          <p className={styles.paragraph}>
            <a href="mailto:dpo@univ-montp3.fr" className={styles.link}>
              {t('privacy:exerciseRights.contact')}
            </a>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('privacy:complaints.title')}
          </h2>
          <p className={styles.paragraph}>{t('privacy:complaints.content')}</p>
          <p className={styles.paragraph}>
            <strong>{t('privacy:complaints.phone')}</strong>
          </p>
        </section>
      </div>

      <Footer />
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'privacy', 'home'])),
    },
  };
}

export default PrivacyPage;
