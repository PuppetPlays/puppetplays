import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

function Author({ usualName, firstName, lastName, nickname }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      {usualName && usualName}
      {usualName && ' ('}
      {firstName && firstName}
      {lastName && ' '}
      {lastName && lastName}
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
};

Author.propTypes = {
  usualName: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string.isRequired,
  nickname: PropTypes.string,
};

export default Author;
