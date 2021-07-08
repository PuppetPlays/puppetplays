import PropTypes from 'prop-types';
import WorkCard from 'components/Work/WorkCard';
import styles from './worksList.module.scss';

const WorksList = ({ works }) => {
  if (!works) {
    return null;
  }

  return (
    <div className={styles.container}>
      {works.map((work) => (
        <WorkCard key={work.id} {...work} />
      ))}
    </div>
  );
};

WorksList.defaultProps = {
  works: null,
};

WorksList.propTypes = {
  works: PropTypes.arrayOf(PropTypes.object),
};

export default WorksList;
