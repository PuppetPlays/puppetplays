import styles from './info.module.scss';

function WorkInfo({ label, children, fill = false, show = true }) {
  if (!show) {
    return null;
  }
  return (
    <div className={styles.container} data-fill={fill}>
      <div className={styles.label}>{label}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default WorkInfo;
