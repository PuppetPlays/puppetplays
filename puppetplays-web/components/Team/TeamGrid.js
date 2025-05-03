import { useTranslation } from 'next-i18next';
import { useState, useRef, useEffect } from 'react';

import styles from './TeamGrid.module.scss';

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const TeamMemberCard = ({ member }) => {
  const { t, i18n } = useTranslation(['team', 'common']);
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

  // Close expanded view on escape key
  useEffect(() => {
    const handleEsc = e => {
      if (e.key === 'Escape' && expanded) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [expanded]);

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      setExpanded(true);
      e.preventDefault();
    }
  };

  const formatDateRange = () => {
    if (!member.startDate) return '';

    // Fonction pour formater la date (mois et année)
    const formatDate = dateValue => {
      let date;

      try {
        // Si c'est une chaîne au format ISO avec fuseau horaire
        if (typeof dateValue === 'string' && dateValue.includes('T')) {
          // Extraire juste la date (YYYY-MM-DD) de la chaîne ISO
          // et ajouter un temps fixe à midi pour éviter les problèmes de fuseau horaire
          const datePart = dateValue.split('T')[0];
          date = new Date(`${datePart}T12:00:00Z`);
        }
        // Pour les autres formats
        else if (typeof dateValue === 'number' || !isNaN(Number(dateValue))) {
          const timestamp = Number(dateValue);
          // Si c'est un timestamp en secondes, le convertir en millisecondes
          if (timestamp < 10000000000) {
            date = new Date(timestamp * 1000);
          } else {
            date = new Date(timestamp);
          }
        } else {
          // Traiter comme une chaîne de date standard
          date = new Date(dateValue);
        }
      } catch (e) {
        console.error('Error parsing date:', e, dateValue);
        return '';
      }

      // Vérifier que la date est valide
      if (isNaN(date.getTime())) {
        console.error('Invalid date value:', dateValue);
        return '';
      }

      // Extraire mois et année en UTC pour éviter les décalages de fuseau horaire
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth(); // 0-11

      // Utiliser la traduction pour le nom du mois (en s'assurant de l'existence de la clé)
      const monthKey = `common:months.${month}`;
      const translatedMonth = t(monthKey, { defaultValue: monthKey });

      return `${translatedMonth} ${year}`;
    };

    const start = formatDate(member.startDate);
    const end = member.endDate ? formatDate(member.endDate) : t('present');

    return `${start} - ${end}`;
  };

  return (
    <>
      <div className={styles.memberCard}>
        {member.profileImage && member.profileImage.length > 0 && (
          <div className={styles.memberImageContainer}>
            <img
              src={member.profileImage[0].url}
              alt={
                member.profileImage[0].alt || member.fullName || member.title
              }
              className={styles.memberImage}
            />
          </div>
        )}

        <div className={styles.memberDetails}>
          <h3 className={styles.memberName}>
            {member.fullName || member.title}
          </h3>
          {member.role && <p className={styles.memberRole}>{member.role}</p>}
          {(member.startDate || member.endDate) && (
            <p className={styles.memberDates}>{formatDateRange()}</p>
          )}

          {member.biography && (
            <div
              className={styles.memberBioPreview}
              dangerouslySetInnerHTML={{ __html: member.biography }}
            />
          )}

          <div className={styles.memberLinks}>
            {member.orcid && (
              <a
                href={member.orcid}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.memberLink}
                aria-label={`${t('viewOrcid')} ${member.fullName || member.title}`}
              >
                ORCID <ExternalLinkIcon />
              </a>
            )}

            {member.halCvLink && (
              <a
                href={member.halCvLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.memberLink}
                aria-label={`${t('viewCV')} ${member.fullName || member.title}`}
              >
                HAL CV <ExternalLinkIcon />
              </a>
            )}
          </div>

          <button
            type="button"
            className={styles.showMoreButton}
            onClick={() => setExpanded(true)}
            onKeyDown={handleKeyDown}
            tabIndex="0"
            aria-label={`${t('viewProfile')} ${member.fullName || member.title}`}
          >
            {t('viewProfile')} <ChevronDownIcon />
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className={styles.memberCardExpanded}
          onClick={e => {
            if (e.target === e.currentTarget) {
              setExpanded(false);
            }
          }}
        >
          <div className={styles.memberExpandedContent} ref={contentRef}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setExpanded(false)}
              aria-label={t('close')}
            >
              <CloseIcon />
            </button>

            <div className={styles.memberExpandedLayout}>
              {member.profileImage && member.profileImage.length > 0 && (
                <div className={styles.memberImageContainerLarge}>
                  <img
                    src={member.profileImage[0].url}
                    alt={
                      member.profileImage[0].alt ||
                      member.fullName ||
                      member.title
                    }
                    className={styles.memberImageLarge}
                  />
                </div>
              )}

              <div className={styles.memberExpandedDetails}>
                <h2 className={styles.memberNameLarge}>
                  {member.fullName || member.title}
                </h2>
                {member.role && (
                  <p className={styles.memberRoleLarge}>{member.role}</p>
                )}
                {(member.startDate || member.endDate) && (
                  <p className={styles.memberDatesLarge}>{formatDateRange()}</p>
                )}

                {member.biography && (
                  <div
                    className={styles.memberBioFull}
                    dangerouslySetInnerHTML={{ __html: member.biography }}
                  />
                )}

                <div className={styles.memberLinksFull}>
                  {member.orcid && (
                    <a
                      href={member.orcid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.memberLink}
                      aria-label={`${t('viewOrcid')} ${member.fullName || member.title}`}
                    >
                      ORCID <ExternalLinkIcon />
                    </a>
                  )}

                  {member.halCvLink && (
                    <a
                      href={member.halCvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.memberLink}
                      aria-label={`${t('viewCV')} ${member.fullName || member.title}`}
                    >
                      HAL CV <ExternalLinkIcon />
                    </a>
                  )}
                </div>

                {/* Affichage des projets de recherche */}
                {member.researchProject &&
                  member.researchProject.length > 0 && (
                    <div className={styles.researchProject}>
                      <h3>{t('researchProjects', 'Projets de recherche')}</h3>

                      {member.researchProject.map(project => (
                        <div
                          key={project.id}
                          className={styles.researchProjectItem}
                        >
                          <h4 className={styles.researchTitle}>
                            {project.researchTitle}
                          </h4>
                          <p>{project.researchContent}</p>

                          {project.researchLink && (
                            <a
                              href={project.researchLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.researchLink}
                            >
                              {t('viewProject', 'Voir le projet')}{' '}
                              <ExternalLinkIcon />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TeamGrid = ({ members }) => {
  return (
    <div className={styles.teamGrid}>
      {members.map(member => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
};

export default TeamGrid;
