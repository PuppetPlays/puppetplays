import { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { getFirstItemProp, getFirstItemTitle } from 'lib/utils';
import WorkAuthor from './WorkAuthor';
import CommaSepList from './CommaSepList';
import styles from './WorkInList.module.scss';

const WorkHeader = ({
  title,
  authors,
  writingDisplayDate,
  writingPlace,
  translatedTitle,
  mainLanguage,
}) => {
  const { t } = useTranslation();

  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      <h2 className={styles.subtitle}>
        <span>
          <CommaSepList list={authors} itemComponent={WorkAuthor} />
        </span>
        {writingDisplayDate && <span>, {writingDisplayDate}</span>}
        {writingPlace.length > 0 && (
          <Fragment>
            <span> - {getFirstItemTitle(writingPlace)}</span>
            {writingPlace[0].country.length > 0 && (
              <span>
                , {getFirstItemTitle(getFirstItemProp('country')(writingPlace))}
              </span>
            )}
          </Fragment>
        )}
        {mainLanguage && mainLanguage.length > 0 && (
          <span>
            {' '}
            - {t('common:language')} {getFirstItemTitle(mainLanguage)}
          </span>
        )}
      </h2>
      {translatedTitle && <h3>{translatedTitle}</h3>}
    </header>
  );
};

export default WorkHeader;
