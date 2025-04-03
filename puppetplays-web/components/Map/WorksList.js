import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import WorkCard from 'components/Work/WorkCard';
import NoResults from 'components/NoResults';
import CrossIcon from '../icon-cross.svg';
import styles from './worksList.module.scss';

const WorksList = ({ works, onClose }) => {
  const { t } = useTranslation();

  if (!works) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button type="button" onClick={onClose} className={styles.closeButton}>
        <CrossIcon />
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

WorksList.defaultProps = {
  works: null,
};

WorksList.propTypes = {
  works: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
};

export default WorksList;
