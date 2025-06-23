import cond from 'lodash/cond';
import constant from 'lodash/constant';
import stubTrue from 'lodash/stubTrue';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { modalTypes, useModal } from './modalContext';
import styles from './noteDropdownMenu.module.scss';

function NoteDropdownMenu({ id, modalType }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [, dispatch] = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOpenNote = useCallback(() => {
    // Close any existing modal before opening new one
    dispatch({
      type: 'close',
      payload: { type: modalType },
    });

    // Ensure the close is processed before opening
    requestAnimationFrame(() => {
    dispatch({
      type: 'open',
        payload: {
          type: modalType,
          meta: {
            id,
          },
        },
    });
    });

    setIsOpen(false);
  }, [dispatch, id, modalType]);

  const handleSearchWith = useCallback(() => {
    const isAuthorMenu = () => modalType === modalTypes.author;
    const isAnimationTechniqueMenu = () =>
      modalType === modalTypes.animationTechnique;
    const url = cond([
      [isAuthorMenu, constant(`/base-de-donnees?authors=${id}`)],
      [
        isAnimationTechniqueMenu,
        constant(`/base-de-donnees?animationTechniques=${id}`),
      ],
      [stubTrue, constant(null)],
    ])();

    if (url) {
      router.push(url);
      setIsOpen(false);
    }
  }, [id, modalType, router]);

  const toggleDropdown = e => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Handle outside clicks
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={styles.container}>
      <button
        className={styles.button}
        aria-label={t('common:menu')}
        onClick={toggleDropdown}
      >
        <svg
          focusable="false"
          viewBox="0 0 8 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6.5L0.5 1.5L7.5 1.5L4 6.5Z" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menuAdvanced}>
          <button className={styles.menuItem} onClick={handleSearchWith}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M11 10.4c1-1.1 1.6-2.6 1.6-4.1a6.3 6.3 0 10-2.8 5.2l4.4 4.4 1.2-1.1-4.4-4.4zM11 6.3a4.6 4.6 0 11-9.2 0 4.6 4.6 0 019.2 0z" />
            </svg>
            <span>{t('common:launchSearch')}</span>
          </button>
          <button className={styles.menuItem} onClick={handleOpenNote}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M5.3 7.1v-.6l.8-.2A12.4 12.4 0 019.2 6l.4.2-1.8 7.4h1.4v.6a5.7 5.7 0 01-2.1.7h-.8c-.5 0-.8 0-1-.2-.2-.1-.3-.3-.3-.5v-.7l.2-.7 1.4-5.4-1.3-.2zM7 3.2c0-.4.1-.7.4-.9.3-.2.7-.3 1.2-.3s.9.1 1.1.3c.3.2.5.5.5 1 0 .3-.2.6-.5.8a2 2 0 01-1.1.3c-.5 0-.9 0-1.2-.3a1 1 0 01-.4-.9z" />
            </svg>
            <span>{t('common:openNote')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

NoteDropdownMenu.propTypes = {
  id: PropTypes.string.isRequired,
  modalType: PropTypes.oneOf(Object.values(modalTypes)).isRequired,
};

export default NoteDropdownMenu;
