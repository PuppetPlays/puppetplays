import styles from './workInList.module.scss';

function WorkInfo({ label, info, infoExist = true }) {
  if (!info || !infoExist) {
    return null;
  }
  return (
    <div className={styles.info}>
      <span>{label}</span> {info}
    </div>
  );
}

export default WorkInfo;
