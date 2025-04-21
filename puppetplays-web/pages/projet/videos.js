import ProjectLayout from 'components/Project/ProjectLayout';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from 'styles/ProjectPresentation.module.scss';

const VideosPage = () => {
  const { t } = useTranslation('project');

  return (
    <ProjectLayout title={t('mainNav.videos')}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('mainNav.videos')}</h1>
        </header>

        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>This page is under construction.</p>
        </div>
      </div>
    </ProjectLayout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'project'])),
    },
  };
}

export default VideosPage;
