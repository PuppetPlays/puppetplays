import useTranslation from 'next-translate/useTranslation';
import { getFirstItemTitle } from 'lib/utils';
import Place from './Place';
import WorkAuthor from './WorkAuthor';
import CommaSepList from './CommaSepList';
import styles from './workInList.module.scss';

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
        {writingPlace.length > 0 && <Place place={writingPlace[0]} />}
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
