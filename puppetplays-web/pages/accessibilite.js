import Footer from 'components/Footer';
import Layout from 'components/Layout';
import { useFormattedTranslation } from 'hooks/useFormattedTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from 'styles/Accessibility.module.scss';

const AccessibilityPage = () => {
  const { t } = useFormattedTranslation(['accessibility', 'common']);

  return (
    <Layout>
      <Head>
        <title>{t('accessibility:title')} | PuppetPlays</title>
        <meta name="description" content={t('accessibility:metaDescription')} />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('accessibility:pageTitle')}</h1>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('accessibility:lawReminder.title')}
          </h2>
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={{
              __html: t('accessibility:lawReminder.content'),
            }}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('accessibility:rgaaCompliance.title')}
          </h2>
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={{
              __html: t('accessibility:rgaaCompliance.content'),
            }}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {t('accessibility:publicRegister.title')}
          </h2>
          <p className={styles.paragraph}>
            <Link
              href="https://www.univ-montp3.fr/fr/universit%C3%A9/handicap/registre-public-accessibilit%C3%A9/introduction"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {t('accessibility:publicRegister.linkText')}
            </Link>
          </p>

          <h3 className={styles.subsectionTitle}>
            {t('accessibility:publicRegister.contactTitle')}
          </h3>
          <p className={styles.paragraph}>
            {t('accessibility:publicRegister.contactText')}{' '}
            <a href="mailto:rpa@univ-montp3.fr" className={styles.link}>
              rpa@univ-montp3.fr
            </a>
          </p>
          <p className={styles.paragraph}>
            <Link
              href="https://www.univ-montp3.fr/fr/handi-upvm3"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {t('accessibility:publicRegister.handiEtudesLinkText')}
            </Link>
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
      ...(await serverSideTranslations(locale, [
        'common',
        'accessibility',
        'home',
      ])),
    },
  };
}

export default AccessibilityPage;
