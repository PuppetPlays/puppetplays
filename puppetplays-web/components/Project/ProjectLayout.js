import Footer from 'components/Footer';
import Layout from 'components/Layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

import styles from './projectLayout.module.scss';
import ProjectNav from './ProjectNav';

const ProjectLayout = ({
  children,
  title,
  metaDescription,
  hideNav = false,
}) => {
  const { t } = useTranslation('project');
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>{title || t('title')} | Puppetplays</title>
        <meta
          name="description"
          content={metaDescription || t('metaDescription')}
        />
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.background}>
          <div className={styles.backgroundShape} />
        </div>
        <div className={styles.container}>
          {!hideNav && <ProjectNav currentPath={router.pathname} />}
          <main className={styles.content}>{children}</main>
        </div>
        <Footer />
      </div>
    </Layout>
  );
};

ProjectLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  metaDescription: PropTypes.string,
  hideNav: PropTypes.bool,
};

export default ProjectLayout;
