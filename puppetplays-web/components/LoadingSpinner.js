import styles from './LoadingSpinner.module.scss';

/**
 * Loading spinner component with customizable size and text
 */
const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

export default LoadingSpinner;
