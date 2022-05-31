import PropTypes from 'prop-types';
import WorkCard from 'components/Work/WorkCard';
import CrossIcon from '../icon-cross.svg';
import styles from './worksList.module.scss';

const WorksList = ({ works, onClose }) => {
  if (!works) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button type="button" onClick={onClose} className={styles.closeButton}>
        <CrossIcon />
      </button>
      <div className={styles.list}>
        {works.map((work) => (
          <WorkCard key={work.id} {...work} />
        ))}
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
