import useTranslation from 'next-translate/useTranslation';
import { getFirstItemTitle } from 'lib/utils';
import Place from './Place';
import WorkAuthor from './WorkAuthor';
import WorkCompany from './WorkCompany';
import CommaSepList from './CommaSepList';
import styles from './workInList.module.scss';

const WorkHeader = ({
  title,
  subtitle,
  authors,
  referenceDate,
  writingPlace,
  mainLanguage,
}) => {
  const { t } = useTranslation();

  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
      <h3 className={styles.authors}>
        <span>
          <CommaSepList
            list={authors}
            itemComponents={{ persons: WorkAuthor, companies: WorkCompany }}
          />
        </span>
        {referenceDate && <span>, {referenceDate}</span>}
        {writingPlace.length > 0 && (
          <span>
            {' '}
            - <Place {...writingPlace[0]} />
          </span>
        )}
        {mainLanguage && mainLanguage.length > 0 && (
          <span>
            {' '}
            - {t('common:language')} {getFirstItemTitle(mainLanguage)}
          </span>
        )}
      </h3>
    </header>
  );
};

export default WorkHeader;
