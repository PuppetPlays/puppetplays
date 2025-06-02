import ErrorMessage from 'components/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import ProjectLayout from 'components/Project/ProjectLayout';
import ScientificCommittee from 'components/Team/ScientificCommittee';
import TeamGrid, { Acknowledgments } from 'components/Team/TeamGrid';
import { fetchAPI } from 'lib/api';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from 'styles/Team.module.scss';
import useSWR from 'swr';

// Query with direct field access to avoid unregistered type errors
const getTeamDataQuery = `
query GetAllTeamData($locale: [String]) {
  teamEntries: entries(section: "team", site: $locale) {
    id
    title
    ... on team_team_Entry {
      fullName
      role
      startDate
      endDate
      biography
      profileImage {
        id
        url
        width
        height
        ... on images_Asset {
          alt
        }
      }
      orcid
      halCvLink
      researchProject {
        ... on researchProject_project_BlockType {
          id
          researchTitle
          researchContent
          researchLink
        }
      }
    }
  }
  
  scientificCommitteeEntries: entries(section: "scientificCommittee", site: $locale) {
    id
    title
    ... on scientificCommittee_scientificCommittee_Entry {
      memberName
      affiliation
    }
  }
}`;

const TeamPage = () => {
  const { t } = useTranslation(['project', 'common', 'team']);
  const { locale } = useRouter();

  const { data, error } = useSWR(
    [`getTeamData`, locale],
    ([_, locale]) =>
      fetchAPI(getTeamDataQuery, {
        variables: { locale },
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // Process team data - sort alphabetically with Didier Plassard first
  const sortedTeamData = data?.teamEntries
    ? [...data.teamEntries].sort((a, b) => {
        const nameA = a.fullName || a.title || '';
        const nameB = b.fullName || b.title || '';

        // Didier Plassard always first
        if (nameA === 'Plassard Didier') return -1;
        if (nameB === 'Plassard Didier') return 1;

        // Alphabetical order for the rest
        return nameA.localeCompare(nameB);
      })
    : [];

  // Process scientific committee data - using alphabetical order by name
  const scientificCommitteeData = data?.scientificCommitteeEntries || [];
  const sortedCommitteeData = [...scientificCommitteeData].sort((a, b) => {
    const nameA = (a.memberName || a.title || '').toLowerCase();
    const nameB = (b.memberName || b.title || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <ProjectLayout
      title={t('team:title')}
      metaDescription={t('team:metaDescription')}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t('team:teamMembers.title')}</h1>
          <p className={styles.paragraph}>
            {t('team:teamMembers.description')}
          </p>
        </header>

        <section className={styles.teamSection}>
          {error && <ErrorMessage message={t('common:errorLoading')} />}

          {!data && !error && (
            <div className={styles.loadingContainer}>
              <LoadingSpinner />
            </div>
          )}

          {data && data.teamEntries && data.teamEntries.length > 0 && (
            <TeamGrid members={sortedTeamData} />
          )}
        </section>

        <section className={styles.committeeSection}>
          <h2 className={styles.sectionTitle}>
            {t('team:scientificCommittee.title')}
          </h2>

          {/* Use dynamic data from CraftCMS instead of translation file */}
          {data && sortedCommitteeData.length > 0 ? (
            <ScientificCommittee members={sortedCommitteeData} />
          ) : (
            <p>{t('common:noData')}</p>
          )}
        </section>

        <Acknowledgments />
      </div>
    </ProjectLayout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'project', 'team'])),
    },
  };
}

export default TeamPage;
