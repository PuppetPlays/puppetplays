import ErrorMessage from 'components/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import ProjectLayout from 'components/Project/ProjectLayout';
import ScientificCommittee from 'components/Team/ScientificCommittee';
import TeamGrid, { Acknowledgments } from 'components/Team/TeamGrid';
import { useFormattedTranslation } from 'hooks/useFormattedTranslation';
import { fetchAPI } from 'lib/api';
import { useRouter } from 'next/router';
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

  researchProjects: entries(section: "researchProjects", site: $locale) {
    id
    title
    slug
    ... on researchProjects_default_Entry {
      postdoctorant {
        ... on team_team_Entry {
          id
          fullName
        }
      }
      projectTitle
      projectSummary
      startDate
      endDate
      historicalPeriod
      puppetTradition
    }
  }
}`;

const TeamPage = () => {
  const { t } = useFormattedTranslation(['project', 'common', 'team']);
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

  // Associate research projects with team members
  const teamWithProjects = sortedTeamData.map(member => {
    const relatedProjects =
      data?.researchProjects?.filter(project =>
        project.postdoctorant?.some(postdoc => postdoc.id === member.id),
      ) || [];

    return {
      ...member,
      relatedResearchProjects: relatedProjects,
    };
  });

  // Process scientific committee data - using alphabetical order by name
  const scientificCommitteeData = data?.scientificCommitteeEntries || [];
  const sortedCommitteeData = [...scientificCommitteeData].sort((a, b) => {
    // Obtenir le nom pour le tri (memberName en priorité, sinon title)
    const nameA = (a.memberName || a.title || '').trim();
    const nameB = (b.memberName || b.title || '').trim();

    // Si les noms sont vides, on les place à la fin
    if (!nameA && !nameB) return 0;
    if (!nameA) return 1;
    if (!nameB) return -1;

    // Tri alphabétique en ignorant la casse et les accents
    return nameA.localeCompare(nameB, 'fr', {
      sensitivity: 'base',
      numeric: true,
      ignorePunctuation: true,
    });
  });

  return (
    <ProjectLayout
      title={t('team:title')}
      metaDescription={t('team:metaDescription')}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1
            className={styles.title}
            dangerouslySetInnerHTML={{
              __html: t('team:teamMembers.title'),
            }}
          />
          <p
            className={styles.paragraph}
            dangerouslySetInnerHTML={{
              __html: t('team:teamMembers.description'),
            }}
          />
        </header>

        <section className={styles.teamSection}>
          {error && <ErrorMessage message={t('common:errorLoading')} />}

          {!data && !error && (
            <div className={styles.loadingContainer}>
              <LoadingSpinner />
            </div>
          )}

          {data && data.teamEntries && data.teamEntries.length > 0 && (
            <TeamGrid members={teamWithProjects} />
          )}
        </section>

        <section className={styles.committeeSection}>
          <h2
            className={styles.sectionTitle}
            dangerouslySetInnerHTML={{
              __html: t('team:scientificCommittee.title'),
            }}
          />

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
      ...(await serverSideTranslations(locale, [
        'common',
        'project',
        'team',
        'home',
      ])),
    },
  };
}

export default TeamPage;
