import PropTypes from 'prop-types';
import { useTranslation } from 'next-i18next';
import { ErrorTypes } from 'lib/apiErrorHandler';

/**
 * Component for displaying API errors with appropriate UI based on error type
 */
const ErrorMessage = ({ error, onRetry, className = '' }) => {
  const { t } = useTranslation();

  if (!error) return null;

  const errorTypeToIcon = {
    [ErrorTypes.NETWORK]: '🌐',
    [ErrorTypes.SERVER]: '🖥️',
    [ErrorTypes.AUTHENTICATION]: '🔒',
    [ErrorTypes.VALIDATION]: '⚠️',
    [ErrorTypes.NOT_FOUND]: '🔍',
    [ErrorTypes.UNKNOWN]: '❓',
  };

  const icon = errorTypeToIcon[error.type] || '❓';
  const message =
    error.message || t('common:error.default', 'An error occurred');

  return (
    <div
      className={`p-4 border rounded-md ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <h3 className="font-semibold mb-1">
            {t('common:error.title', 'Error')}
          </h3>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={t('common:error.retry', 'Retry')}
        >
          {t('common:error.retry', 'Retry')}
        </button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
  className: PropTypes.string,
};

export default ErrorMessage;
