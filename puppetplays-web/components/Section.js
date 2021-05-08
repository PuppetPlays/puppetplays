import PropTypes from 'prop-types';
import styles from './section.module.scss';

function Section({ title, children, show }) {
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

Section.defaultProps = {
  show: true,
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  show: PropTypes.bool,
};

export default Section;
