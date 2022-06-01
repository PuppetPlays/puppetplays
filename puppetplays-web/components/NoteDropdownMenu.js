import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import cond from 'lodash/cond';
import constant from 'lodash/constant';
import stubTrue from 'lodash/stubTrue';
import useTranslation from 'next-translate/useTranslation';
import { Menu, MenuItem } from 'components/DropdownMenuAdvanced';
import { modalTypes, useModal } from 'components/modalContext';
import styles from './noteDropdownMenu.module.scss';
import { useRouter } from 'next/router';

const NoteDropdownMenuButton = (props) => {
  const { t } = useTranslation();

  return (
    <button {...props} className={styles.button} aria-label={t('common:menu')}>
      <svg
        focusable="false"
        viewBox="0 0 8 8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 6.5L0.5 1.5L7.5 1.5L4 6.5Z" />
      </svg>
    </button>
  );
};

function NoteDropdownMenu({ id, modalType }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [, dispatch] = useModal();

  const handleOpenNote = useCallback(() => {
    dispatch({
      type: 'open',
      payload: { type: modalType, meta: { id } },
    });
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
      // const { protocol, host } = window.location;
      // window.location = `${protocol}//${host}${url}`;
    }
  }, [id, modalType, router]);

  return (
    <Menu renderButton={NoteDropdownMenuButton}>
      <MenuItem
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M11 10.4c1-1.1 1.6-2.6 1.6-4.1a6.3 6.3 0 10-2.8 5.2l4.4 4.4 1.2-1.1-4.4-4.4zM11 6.3a4.6 4.6 0 11-9.2 0 4.6 4.6 0 019.2 0z" />
          </svg>
        }
        onClick={handleSearchWith}
      >
        {t('common:launchSearch')}
      </MenuItem>
      <MenuItem
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M5.3 7.1v-.6l.8-.2A12.4 12.4 0 019.2 6l.4.2-1.8 7.4h1.4v.6a5.7 5.7 0 01-2.1.7h-.8c-.5 0-.8 0-1-.2-.2-.1-.3-.3-.3-.5v-.7l.2-.7 1.4-5.4-1.3-.2zM7 3.2c0-.4.1-.7.4-.9.3-.2.7-.3 1.2-.3s.9.1 1.1.3c.3.2.5.5.5 1 0 .3-.2.6-.5.8a2 2 0 01-1.1.3c-.5 0-.9 0-1.2-.3a1 1 0 01-.4-.9z" />
          </svg>
        }
        onClick={handleOpenNote}
      >
        {t('common:openNote')}
      </MenuItem>
    </Menu>
  );
}

NoteDropdownMenu.propTypes = {
  id: PropTypes.string.isRequired,
  modalType: PropTypes.oneOf(Object.values(modalTypes)).isRequired,
};

export default NoteDropdownMenu;
