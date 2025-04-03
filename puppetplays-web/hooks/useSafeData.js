import useSWR from 'swr';

/**
 * A wrapper around SWR that enforces proper error handling and null safety
 * @param {string|Array|null} key - The SWR key
 * @param {Function} fetcher - The fetcher function
 * @param {Object} options - SWR options
 * @returns {Object} Extended SWR response with isLoading and safeData
 */
const useSafeData = (key, fetcher, options = {}) => {
  const { data, error, mutate, isValidating, ...rest } = useSWR(key, fetcher, {
    suspense: false, // Default to not using Suspense
    ...options,
  });
  
  // Explicit loading state
  const isLoading = !error && !data;
  
  // Safe data access - never undefined or null
  const safeData = data || {};
  
  return {
    data, // Original data for backwards compatibility
    safeData, // Guaranteed to be at least an empty object
    error,
    isLoading,
    isValidating,
    mutate,
    ...rest,
  };
};

export default useSafeData; 