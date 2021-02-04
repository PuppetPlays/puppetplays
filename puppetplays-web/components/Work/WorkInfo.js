import styles from './workInfo.module.scss';

function WorkInfo({ label, info, fill = false, infoExist = true }) {
  if (!info || !infoExist) {
    return null;
  }
  return (
    <div className={styles.container} data-fill={fill}>
      <div className={styles.label}>{label}</div>
      <div className={styles.content}>{info}</div>
    </div>
  );
}

export default WorkInfo;
