import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

/**
 * Loading spinner component with customizable size and text
 */
const LoadingSpinner = ({
  size = 'medium',
  fullPage = false,
  text,
  className,
}) => {
  const { t } = useTranslation();
  const loadingText = text || t('common:loading', 'Loading...');

  const spinnerSizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  const containerClasses = classNames(
    'flex flex-col items-center justify-center',
    {
      'fixed inset-0 bg-white bg-opacity-80 z-50': fullPage,
    },
    className,
  );

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div
        className={classNames(
          'animate-spin rounded-full border-gray-300 border-t-blue-600',
          spinnerSizeClasses[size],
        )}
      />
      {loadingText && (
        <p className="mt-3 text-gray-700 text-center">{loadingText}</p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullPage: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default LoadingSpinner;
