import { useState } from 'react';

import { useTranslation } from 'next-i18next';

import { useFormattedTranslation } from '../../hooks/useFormattedTranslation';

import styles from './ScientificCommittee.module.scss';

const ChevronIcon = () => (
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

const CommitteeMember = ({ member, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0); // Open first item by default

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleAccordion();
      e.preventDefault();
    }
  };

  // Get name from either memberName (CraftCMS) or name (translation file)
  const displayName = member.memberName || member.name || member.title;

  return (
    <div className={styles.committeeItem}>
      <div className={styles.committeeButtonContainer}>
        <button
          type="button"
          className={styles.committeeButton}
          onClick={toggleAccordion}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          tabIndex="0"
        >
          <div className={styles.committeeHeading}>{displayName}</div>
          <div
            className={`${styles.committeeIcon} ${isOpen ? styles.committeeIconOpen : ''}`}
          >
            <ChevronIcon />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className={styles.committeeContent}>
          <div className={styles.committeeBio}>{member.affiliation}</div>
        </div>
      )}
    </div>
  );
};

const ScientificCommittee = ({ members }) => {
  const { t } = useFormattedTranslation('team');

  if (!members || members.length === 0) {
    return <p>{t('common:noData')}</p>;
  }

  return (
    <div className={styles.committeeContainer}>
      <p 
        className={styles.paragraph}
        dangerouslySetInnerHTML={{ __html: t('scientificCommittee.description') }}
      />

      <div className={styles.committeeAccordion}>
        {members.map((member, index) => (
          <CommitteeMember
            key={member.id || index}
            member={member}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default ScientificCommittee;
