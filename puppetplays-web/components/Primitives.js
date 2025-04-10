import PropTypes from 'prop-types';
import styles from './primitives.module.scss';

const childrenProp = {
  children: PropTypes.node.isRequired,
};

export function PageTitle({ children, smaller = false, ...props }) {
  return (
    <h1
      className={`${styles.pageTitle} ${smaller ? styles.isSmaller : ''}`}
      {...props}
    >
      {children}
    </h1>
  );
}

PageTitle.propTypes = {
  ...childrenProp,
  smaller: PropTypes.bool,
};

export function PageSubtitle({ children, ...props }) {
  return (
    <div className={styles.pageSubtitle} {...props}>
      {children}
    </div>
  );
}

PageSubtitle.propTypes = childrenProp;

export function PageIntertitle({ children, ...props }) {
  return (
    <h2 className={styles.pageIntertitle} {...props}>
      {children}
    </h2>
  );
}

PageIntertitle.propTypes = childrenProp;
