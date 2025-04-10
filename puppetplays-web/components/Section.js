import PropTypes from 'prop-types';
import styles from './section.module.scss';

function Section({ title = null, children = null, show = true }) {
  if (!show) {
    return null;
  }
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        <span>{title}</span>
      </h1>
      <div className={styles.content}>{children}</div>
    </section>
  );
}


Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  show: PropTypes.bool,
};

export default Section;
