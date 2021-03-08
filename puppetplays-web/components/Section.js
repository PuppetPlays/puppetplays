import styles from './section.module.scss';

function WorkSection({ title, children, show = true }) {
  if (!show) {
    return null;
  }
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        <span>{title}</span>
      </h1>
      <div>{children}</div>
    </section>
  );
}

export default WorkSection;
