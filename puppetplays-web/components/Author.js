import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

function Author({ usualName, firstName, lastName, nickname, lastNameFirst }) {
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
    </Fragment>
  );
}

Author.defaultProps = {
  usualName: null,
  firstName: null,
  nickname: null,
  lastName: null,
  lastNameFirst: false,
};

Author.propTypes = {
  usualName: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  nickname: PropTypes.string,
  lastNameFirst: PropTypes.bool,
};

export default Author;
