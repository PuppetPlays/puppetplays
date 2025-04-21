import ProjectLayout from 'components/Project/ProjectLayout';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from 'styles/ProjectPresentation.module.scss';

const TeamPage = () => {
  const { t } = useTranslation('project');
  const router = useRouter();

  // Temporary redirect to external team page
  const redirectToExternalTeam = () => {
    window.open('https://puppetplays.www.univ-montp3.fr/fr/lequipe', '_blank');
  };

  return (
    <ProjectLayout title={t('mainNav.team')}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('mainNav.team')}</h1>
        </header>

        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p style={{ marginBottom: '2rem' }}>
            This page is under construction. Currently redirecting to the
            external team page.
          </p>
          <button
            onClick={redirectToExternalTeam}
            style={{
              backgroundColor: '#01055B',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            View Team Page
          </button>
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

export default TeamPage;
