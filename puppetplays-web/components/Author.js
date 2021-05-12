import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import NoteDropdownMenu from 'components/NoteDropdownMenu';
import { modalTypes } from 'components/modalContext';

function Author({
  id,
  usualName,
  firstName,
  lastName,
  nickname,
  lastNameFirst,
  showMenu,
}) {
  const { t } = useTranslation();

  return (
    <Fragment>
      {usualName && usualName}
      {usualName && ' ('}
      {!usualName && lastNameFirst && lastName && lastName}
      {!usualName && lastNameFirst && firstName && ' '}
      {firstName && firstName}
      {(!lastNameFirst || usualName) && lastName && ' '}
      {(!lastNameFirst || usualName) && lastName && lastName}
      {!usualName && nickname && ' ('}
      {nickname && usualName && (firstName || lastName) && ', '}
      {nickname && t('common:alias')}
      {nickname && ' '}
      {nickname && nickname}
      {(usualName || nickname) && ')'}
      {showMenu && <NoteDropdownMenu id={id} modalType={modalTypes.author} />}
    </Fragment>
  );
}

Author.defaultProps = {
  usualName: null,
  firstName: null,
  nickname: null,
  lastName: null,
  lastNameFirst: false,
  showMenu: false,
};

Author.propTypes = {
  id: PropTypes.string.isRequired,
  usualName: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  nickname: PropTypes.string,
  lastNameFirst: PropTypes.bool,
  showMenu: PropTypes.bool,
};

export default Author;
