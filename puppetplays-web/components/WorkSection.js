import styles from './workInList.module.scss';

function WorkSection({ title, children, show = true }) {
  if (!show) {
    return null;
  }
  return (
    <section className={styles.section}>
      <h1 className={styles.sectionTitle}>
        <span>{title}</span>
      </h1>
      <div>{children}</div>
    </section>
  );
}

export default WorkSection;
