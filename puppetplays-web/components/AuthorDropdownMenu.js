import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import DropdownMenu, { DropdownMenuItem } from 'components/DropdownMenu';
import { modalTypes, useModal } from 'components/modalContext';

function AuthorDropdownMenu({ id }) {
  const { t } = useTranslation();

  const [, dispatch] = useModal();

  const handleClick = useCallback(() => {
    dispatch({
      type: 'open',
      payload: { type: modalTypes.author, meta: { id } },
    });
  }, [dispatch, id]);

  return (
    <DropdownMenu itemsCount={1}>
      {[
        <DropdownMenuItem
          key="note"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M5.3 7.1v-.6l.8-.2A12.4 12.4 0 019.2 6l.4.2-1.8 7.4h1.4v.6a5.7 5.7 0 01-2.1.7h-.8c-.5 0-.8 0-1-.2-.2-.1-.3-.3-.3-.5v-.7l.2-.7 1.4-5.4-1.3-.2zM7 3.2c0-.4.1-.7.4-.9.3-.2.7-.3 1.2-.3s.9.1 1.1.3c.3.2.5.5.5 1 0 .3-.2.6-.5.8a2 2 0 01-1.1.3c-.5 0-.9 0-1.2-.3a1 1 0 01-.4-.9z" />
            </svg>
          }
          onClick={handleClick}
        >
          {t('common:openNote')}
        </DropdownMenuItem>,
      ]}
    </DropdownMenu>
  );
}

AuthorDropdownMenu.propTypes = {
  id: PropTypes.string.isRequired,
};

export default AuthorDropdownMenu;
