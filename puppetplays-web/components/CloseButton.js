import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';

import styles from './closeButton.module.scss';

function CloseButton({ onClick }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={t('common:close')}
    >
      <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path d="m3.4 12.6 9.2-9.2m-9.2 0 9.2 9.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CloseButton;
