import NoResults from 'components/NoResults';
import WorkCard from 'components/Work/WorkCard';
import { useTranslation } from 'next-i18next';
import PropTypes from 'prop-types';

import styles from './worksList.module.scss';

const WorksList = ({ works = null, onClose = null }) => {
  const { t } = useTranslation();

  if (!works) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button type="button" onClick={onClose} className={styles.closeButton}>
        <svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.23218 1.52502L1.52515 2.23218L3.29297 4L1.52515 5.76782L2.23218 6.47485L4 4.70703L5.76782 6.47485L6.47485 5.7677L4.70703 4L6.47485 2.2323L5.76782 1.52515L4 3.29297L2.23218 1.52502Z" />
        </svg>
      </button>
      <div className={styles.list}>
        {works && Array.isArray(works) && works.length > 0 ? (
          works.map(work => <WorkCard key={work.id} {...work} />)
        ) : (
          <NoResults
            icon="search"
            title={t('common:error.dataNotFound')}
            message={t('common:error.noResultsFound')}
            customStyles={{ margin: '20px auto' }}
          />
        )}
      </div>
    </div>
  );
};

WorksList.propTypes = {
  works: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
};

export default WorksList;
