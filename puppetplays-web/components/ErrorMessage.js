import styles from './ErrorMessage.module.scss';

const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p className={styles.errorMessage}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
