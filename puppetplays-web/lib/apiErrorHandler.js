/**
 * Standard error types for consistent error handling
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  SERVER: 'SERVER_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

/**
 * Creates a standardized error object
 * @param {string} type - Error type from ErrorTypes
 * @param {string} message - User-friendly error message
 * @param {any} originalError - The original error for debugging
 * @returns {Object} Standardized error object
 */
export const createErrorObject = (type, message, originalError = null) => ({
  type,
  message,
  originalError,
  timestamp: new Date().toISOString(),
});

/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error to process
 * @returns {Object} Standardized error object
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Network errors
  if (!navigator.onLine || error.message === 'Network Error' || error.name === 'TypeError') {
    return createErrorObject(
      ErrorTypes.NETWORK,
      'Unable to connect to the server. Please check your internet connection.',
      error
    );
  }
  
  // Server errors (status 5xx)
  if (error.response && error.response.status >= 500) {
    return createErrorObject(
      ErrorTypes.SERVER,
      'The server encountered an error. Please try again later.',
      error
    );
  }
  
  // Authentication errors (status 401, 403)
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    return createErrorObject(
      ErrorTypes.AUTHENTICATION,
      'You do not have permission to access this resource.',
      error
    );
  }
  
  // Validation errors (status 400)
  if (error.response && error.response.status === 400) {
    return createErrorObject(
      ErrorTypes.VALIDATION,
      'The request contains invalid data.',
      error
    );
  }
  
  // Not found errors (status 404)
  if (error.response && error.response.status === 404) {
    return createErrorObject(
      ErrorTypes.NOT_FOUND,
      'The requested resource was not found.',
      error
    );
  }
  
  // Default case - unknown error
  return createErrorObject(
    ErrorTypes.UNKNOWN,
    'An unexpected error occurred. Please try again later.',
    error
  );
};

/**
 * Helper function to check if an error is of a certain type
 * @param {Object} error - Error object from handleApiError
 * @param {string} type - Error type from ErrorTypes
 * @returns {boolean} True if error is of the given type
 */
export const isErrorOfType = (error, type) => {
  return error && error.type === type;
}; 