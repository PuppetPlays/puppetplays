import ErrorMessage from 'components/ErrorMessage';
import LoadingSpinner from 'components/LoadingSpinner';
import ProjectLayout from 'components/Project/ProjectLayout';
import { useFormattedTranslation } from 'hooks/useFormattedTranslation';
import { fetchAPI } from 'lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from 'styles/ResearchProject.module.scss';
import useSWR from 'swr';

const getResearchProjectQuery = `
query GetResearchProject($slug: [String], $locale: [String]) {
  researchProject: entries(section: "researchProjects", slug: $slug, site: $locale) {
    id
    title
    slug
    ... on researchProjects_default_Entry {
      postdoctorant {
        ... on team_team_Entry {
          id
          fullName
          profileImage {
            id
            url
            width
            height
            ... on images_Asset {
              alt
            }
          }
          role
        }
      }
      projectTitle
      projectSummary
      startDate
      endDate
      historicalPeriod
      studiedRegions {
        ... on studiedRegions_TableRow {
          paysRegion
          description
        }
      }
      puppetTradition
      projectDescription
      bibliography
      relatedPublications
    }
  }
}`;

const ResearchProjectDetail = () => {
  const { t } = useFormattedTranslation(['project', 'common', 'team']);
  const { locale, query } = useRouter();
  const { slug } = query;

  const { data, error } = useSWR(
    slug ? [`getResearchProject`, slug, locale] : null,
    ([_, slug, locale]) =>
      fetchAPI(getResearchProjectQuery, {
        variables: { slug, locale },
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const project = data?.researchProject?.[0];

  if (error) {
    return (
      <ProjectLayout title={t('common:error')} metaDescription="">
        <ErrorMessage message={t('common:errorLoading')} />
      </ProjectLayout>
    );
  }

  if (!data && !error) {
    return (
      <ProjectLayout title={t('common:loading')} metaDescription="">
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      </ProjectLayout>
    );
  }

  if (!project) {
    return (
      <ProjectLayout title={t('common:notFound')} metaDescription="">
        <ErrorMessage message={t('common:projectNotFound')} />
      </ProjectLayout>
    );
  }

  const postdoc = project.postdoctorant?.[0];
  const startDate = project.startDate
    ? new Date(project.startDate).getFullYear()
    : null;
  const endDate = project.endDate
    ? new Date(project.endDate).getFullYear()
    : null;

  return (
    <ProjectLayout
      title={project.projectTitle || project.title}
      metaDescription={project.projectSummary || ''}
    >
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            <Link href="/projet/equipe" className={styles.breadcrumbLink}>
              {t('team:title')}
            </Link>
            <span className={styles.breadcrumbSeparator}>→</span>
            <span className={styles.breadcrumbCurrent}>
              {t('team:researchProject')}
            </span>
          </div>

          <h1 className={styles.title}>
            {project.projectTitle || project.title}
          </h1>

          {/* Unified Project Information */}
          <div className={styles.projectInfoContainer}>
            {/* Postdoc Info */}
            {postdoc && (
              <div className={styles.postdocSection}>
                <div className={styles.postdocInfo}>
                  {postdoc.profileImage && (
                    <div className={styles.postdocImage}>
                      <Image
                        src={postdoc.profileImage.url}
                        alt={postdoc.profileImage.alt || postdoc.fullName}
                        width={60}
                        height={60}
                      />
                    </div>
                  )}
                  <div className={styles.postdocDetails}>
                    <h2 className={styles.postdocName}>{postdoc.fullName}</h2>
                    {postdoc.role && (
                      <p className={styles.postdocRole}>{postdoc.role}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* All Project Metadata in one unified section */}
            <div className={styles.allProjectMeta}>
              {(startDate || endDate) && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>
                    {t('team:contractPeriod')}:
                  </span>
                  <span className={styles.metaValue}>
                    {startDate && endDate
                      ? `${startDate} - ${endDate}`
                      : startDate
                        ? `${startDate}`
                        : endDate
                          ? `${endDate}`
                          : ''}
                  </span>
                </div>
              )}

              {project.historicalPeriod && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>
                    {t('team:historicalPeriod')}:
                  </span>
                  <span className={styles.metaValue}>
                    {project.historicalPeriod}
                  </span>
                </div>
              )}

              {project.puppetTradition && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>
                    {t('team:puppetTradition')}:
                  </span>
                  <span className={styles.metaValue}>
                    {project.puppetTradition}
                  </span>
                </div>
              )}

              {project.studiedRegions && project.studiedRegions.length > 0 && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>
                    {t('team:studiedRegions')}:
                  </span>
                  <div className={styles.metaRegions}>
                    {project.studiedRegions.map((region, index) => (
                      <span key={index} className={styles.metaRegion}>
                        {region.paysRegion}
                        {region.description && (
                          <span className={styles.regionDescription}>
                            {' '}
                            ({region.description})
                          </span>
                        )}
                        {index < project.studiedRegions.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Summary Section */}
        {project.projectSummary && (
          <section className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>{t('team:projectSummary')}</h2>
            <div
              className={styles.summaryContent}
              dangerouslySetInnerHTML={{ __html: project.projectSummary }}
            />
          </section>
        )}

        {/* Main Content */}
        {project.projectDescription && (
          <section className={styles.contentSection}>
            <h2 className={styles.sectionTitle}>
              {t('team:projectDescription')}
            </h2>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: project.projectDescription }}
            />
          </section>
        )}

        {/* Bibliography */}
        {project.bibliography && (
          <section className={styles.bibliographySection}>
            <h2 className={styles.sectionTitle}>{t('team:bibliography')}</h2>
            <div
              className={styles.bibliography}
              dangerouslySetInnerHTML={{ __html: project.bibliography }}
            />
          </section>
        )}

        {/* Related Publications */}
        {project.relatedPublications && (
          <section className={styles.publicationsSection}>
            <h2 className={styles.sectionTitle}>
              {t('team:relatedPublications')}
            </h2>
            <div
              className={styles.publications}
              dangerouslySetInnerHTML={{ __html: project.relatedPublications }}
            />
          </section>
        )}
      </div>
    </ProjectLayout>
  );
};

export async function getStaticPaths({ locales }) {
  // For now, we'll generate paths on-demand
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params, locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'project', 'team'])),
    },
    revalidate: 3600, // Revalidate every hour
  };
}

export default ResearchProjectDetail;
