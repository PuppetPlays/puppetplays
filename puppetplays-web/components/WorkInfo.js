import styles from './workInList.module.scss';

function WorkInfo({ label, info, fill = false, infoExist = true }) {
  if (!info || !infoExist) {
    return null;
  }
  return (
    <div className={styles.info} data-fill={fill}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoContent}>{info}</div>
    </div>
  );
}

export default WorkInfo;
