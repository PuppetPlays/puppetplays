import { Fragment } from 'react';
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

export default Author;
