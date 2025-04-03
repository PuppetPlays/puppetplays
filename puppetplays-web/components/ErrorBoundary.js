import { Component } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

/**
 * Error boundary component to catch and display errors in a user-friendly way
 */
class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You could log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return (
        fallback || (
          <div className="p-6 mx-auto my-8 max-w-md border border-red-300 rounded-md bg-red-50 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">
              Something went wrong
            </h2>
            <p className="text-red-600 mb-4">
              An error occurred while rendering this component.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return children;
  }
}

ErrorBoundaryClass.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

// Wrapper with translation support
const ErrorBoundary = ({ children, fallback }) => {
  const { t } = useTranslation();

  const defaultFallback = (
    <div className="p-6 mx-auto my-8 max-w-md border border-red-300 rounded-md bg-red-50 text-center">
      <h2 className="text-xl font-semibold text-red-700 mb-2">
        {t('common:error.title', 'Something went wrong')}
      </h2>
      <p className="text-red-600 mb-4">
        {t(
          'common:error.message',
          'An error occurred while rendering this component.',
        )}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {t('common:error.tryAgain', 'Try again')}
      </button>
    </div>
  );

  return (
    <ErrorBoundaryClass fallback={fallback || defaultFallback}>
      {children}
    </ErrorBoundaryClass>
  );
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default ErrorBoundary;
