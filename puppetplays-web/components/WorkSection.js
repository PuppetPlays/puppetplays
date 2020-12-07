import styles from './workInList.module.scss';

function WorkSection({ title, children }) {
  return (
    <section className={styles.section}>
      <h1 className={styles.sectionTitle}>{title}</h1>
      <div>{children}</div>
    </section>
  );
}

export default WorkSection;
