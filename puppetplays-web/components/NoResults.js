import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Composant réutilisable pour afficher un message lorsqu'aucune donnée n'est disponible
 * Suit le design actuel de l'application avec une interface cohérente
 */
const NoResults = ({ title, message, icon = 'clock', customStyles = {} }) => {
  const { t } = useTranslation();

  // Différentes icônes disponibles pour différents contextes
  const icons = {
    clock: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        style={{ margin: '0 auto 24px' }}
      >
        <path
          d="M12 6V12L16 14"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--color-brand)"
          strokeWidth="2"
        />
      </svg>
    ),
    search: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        style={{ margin: '0 auto 24px' }}
      >
        <circle
          cx="11"
          cy="11"
          r="7"
          stroke="var(--color-brand)"
          strokeWidth="2"
        />
        <path
          d="M20 20L16 16"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    info: (
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        style={{ margin: '0 auto 24px' }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="var(--color-brand)"
          strokeWidth="2"
        />
        <path
          d="M12 7V12"
          stroke="var(--color-brand)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1" fill="var(--color-brand)" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '60px auto',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg-depth-1)',
        padding: '40px 30px',
        borderRadius: '8px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
        ...customStyles,
      }}
    >
      {icons[icon]}

      <h2
        style={{
          fontSize: '24px',
          fontWeight: '500',
          marginBottom: '16px',
          color: 'var(--color-text-default)',
        }}
      >
        {title || t('common:contentNotAvailable')}
      </h2>

      <p
        style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: 'var(--color-text-subtle)',
          maxWidth: '640px',
          margin: '0 auto 24px',
        }}
      >
        {message || t('common:error.noResultsFound')}
      </p>

      <div
        style={{
          width: '120px',
          height: '4px',
          background: 'var(--color-brand-light)',
          margin: '0 auto',
          opacity: 0.3,
          borderRadius: '2px',
        }}
      />
    </div>
  );
};

NoResults.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.oneOf(['clock', 'search', 'info']),
  customStyles: PropTypes.object,
};

export default NoResults;
