import ErrorMessage from 'components/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import ProjectLayout from 'components/Project/ProjectLayout';
import PartnersBanner from 'components/Team/PartnersBanner';
import ScientificCommittee from 'components/Team/ScientificCommittee';
import TeamGrid from 'components/Team/TeamGrid';
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
    ... on team_default_Entry {
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
    ... on scientificCommittee_default_Entry {
      memberName
      affiliation
    }
  }
  
  partnerEntries: entries(section: "partners", site: $locale) {
    id
    title
    ... on partners_default_Entry {
      partnerName
      partnerLink
      partnerLogo {
        id
        url
        width
        height
        ... on images_Asset {
          alt
        }
      }
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

  // Process scientific committee data - using alphabetical order by name
  const scientificCommitteeData = data?.scientificCommitteeEntries || [];
  const sortedCommitteeData = [...scientificCommitteeData].sort((a, b) => {
    const nameA = (a.memberName || a.title || '').toLowerCase();
    const nameB = (b.memberName || b.title || '').toLowerCase();
    return nameA.localeCompare(nameB);
  });

  // Process partners data - keep original order
  const partnersData = data?.partnerEntries || [];

  // Map partners data to the format expected by PartnersBanner component
  const formattedPartnersData = partnersData.map(partner => ({
    name: partner.partnerName || partner.title,
    link: partner.partnerLink || '#',
    logo:
      partner.partnerLogo && partner.partnerLogo.length > 0
        ? partner.partnerLogo[0].url
        : '',
    alt:
      partner.partnerLogo && partner.partnerLogo.length > 0
        ? partner.partnerLogo[0].alt || partner.partnerName
        : partner.partnerName,
  }));

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
            <TeamGrid members={data.teamEntries} />
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

        <section className={styles.partnersSection}>
          <h2 className={styles.sectionTitle}>{t('team:partners.title')}</h2>

          {/* Pass the dynamic partners data to PartnersBanner */}
          {data && formattedPartnersData.length > 0 ? (
            <PartnersBanner partners={formattedPartnersData} />
          ) : (
            <p>{t('common:noData')}</p>
          )}
        </section>
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
