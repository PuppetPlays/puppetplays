import { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';

function WorkAuthor({ commonName, firstName, lastName, nickname }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      {commonName && commonName}
      {commonName && ' ('}
      {firstName && firstName}
      {lastName && ' '}
      {lastName && lastName}
      {!commonName && nickname && ' ('}
      {nickname && commonName && (firstName || lastName) && ', '}
      {nickname && t('common:alias')}
      {nickname && ' '}
      {nickname && nickname}
      {(commonName || nickname) && ')'}
    </Fragment>
  );
}

export default WorkAuthor;
