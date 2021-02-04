import { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';

function WorkAuthor({ firstName, lastName, nickname }) {
  const { t } = useTranslation();

  return (
    <Fragment>
      <span>
        {firstName} {lastName}
      </span>
      {nickname && (
        <span>
          {' '}
          ({t('common:alias')} {nickname})
        </span>
      )}
    </Fragment>
  );
}

export default WorkAuthor;
