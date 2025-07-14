import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'next-i18next';

/**
 * Types d'erreurs prédéfinis
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  API: 'API',
  PDF_LOAD: 'PDF_LOAD',
  HAL_METADATA: 'HAL_METADATA',
  TIMEOUT: 'TIMEOUT',
  PERMISSION: 'PERMISSION',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Hook personnalisé pour gérer les erreurs de manière centralisée
 * @param {Object} options - Options de configuration
 * @returns {Object} Fonctions et état de gestion d'erreurs
 */
const useErrorHandler = (options = {}) => {
  const { t } = useTranslation(['project', 'common']);
  const {
    logErrors = true,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const [errorState, setErrorState] = useState({
    hasError: false,
    error: null,
    errorType: null,
    errorCode: null,
    retryCount: 0,
    canRetry: false
  });

  /**
   * Messages d'erreur localisés par type
   */
  const getErrorMessage = useCallback((type, originalMessage) => {
    const messages = {
      [ERROR_TYPES.NETWORK]: t('common:errors.network', 'Erreur de connexion réseau'),
      [ERROR_TYPES.VALIDATION]: t('common:errors.validation', 'Données invalides'),
      [ERROR_TYPES.API]: t('common:errors.api', 'Erreur de l\'API'),
      [ERROR_TYPES.PDF_LOAD]: t('project:publication.pdfError', 'Erreur de chargement du PDF'),
      [ERROR_TYPES.HAL_METADATA]: t('project:errors.halMetadata', 'Erreur de récupération des métadonnées HAL'),
      [ERROR_TYPES.TIMEOUT]: t('common:errors.timeout', 'Délai d\'attente dépassé'),
      [ERROR_TYPES.PERMISSION]: t('common:errors.permission', 'Accès refusé'),
      [ERROR_TYPES.UNKNOWN]: t('common:errors.unknown', 'Erreur inconnue')
    };

    return messages[type] || originalMessage || messages[ERROR_TYPES.UNKNOWN];
  }, [t]);

  /**
   * Détermine le type d'erreur basé sur l'erreur originale
   */
  const determineErrorType = useCallback((error) => {
    if (!error) return ERROR_TYPES.UNKNOWN;

    // Erreurs réseau
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return ERROR_TYPES.NETWORK;
    }
    
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return ERROR_TYPES.TIMEOUT;
    }

    // Erreurs HTTP
    if (error.status) {
      if (error.status >= 400 && error.status < 500) {
        return error.status === 403 || error.status === 401 
          ? ERROR_TYPES.PERMISSION 
          : ERROR_TYPES.VALIDATION;
      }
      if (error.status >= 500) {
        return ERROR_TYPES.API;
      }
    }

    // Erreurs spécifiques au contexte
    if (error.message.includes('PDF') || error.message.includes('document')) {
      return ERROR_TYPES.PDF_LOAD;
    }
    
    if (error.message.includes('HAL') || error.message.includes('métadonnées')) {
      return ERROR_TYPES.HAL_METADATA;
    }

    return ERROR_TYPES.UNKNOWN;
  }, []);

  /**
   * Détermine si une erreur peut être retentée
   */
  const canRetryError = useCallback((errorType, retryCount) => {
    const retryableTypes = [
      ERROR_TYPES.NETWORK,
      ERROR_TYPES.API,
      ERROR_TYPES.TIMEOUT,
      ERROR_TYPES.HAL_METADATA
    ];
    
    return retryableTypes.includes(errorType) && retryCount < maxRetries;
  }, [maxRetries]);

  /**
   * Enregistre une erreur
   */
  const handleError = useCallback((error, context = '') => {
    const errorType = determineErrorType(error);
    const canRetry = canRetryError(errorType, errorState.retryCount);
    const userMessage = getErrorMessage(errorType, error.message);

    const errorInfo = {
      hasError: true,
      error: {
        original: error,
        message: userMessage,
        context,
        timestamp: new Date().toISOString()
      },
      errorType,
      errorCode: error.status || error.code || null,
      retryCount: errorState.retryCount,
      canRetry
    };

    if (logErrors) {
      console.error(`[useErrorHandler] ${context}:`, {
        type: errorType,
        message: error.message,
        error,
        canRetry,
        retryCount: errorState.retryCount
      });
    }

    setErrorState(errorInfo);
    return errorInfo;
  }, [determineErrorType, canRetryError, getErrorMessage, errorState.retryCount, logErrors]);

  /**
   * Remet l'état d'erreur à zéro
   */
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorType: null,
      errorCode: null,
      retryCount: 0,
      canRetry: false
    });
  }, []);

  /**
   * Incrémente le compteur de retry
   */
  const incrementRetry = useCallback(() => {
    setErrorState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      canRetry: canRetryError(prev.errorType, prev.retryCount + 1)
    }));
  }, [canRetryError]);

  /**
   * Fonction utilitaire pour wrapper des appels avec gestion d'erreurs
   */
  const withErrorHandling = useCallback((asyncFn, context = '') => {
    return async (...args) => {
      try {
        clearError();
        const result = await asyncFn(...args);
        return result;
      } catch (error) {
        handleError(error, context);
        throw error; // Re-throw pour permettre un handling local si nécessaire
      }
    };
  }, [handleError, clearError]);

  /**
   * Fonction de retry avec délai
   */
  const retryWithDelay = useCallback(async (retryFn) => {
    if (!errorState.canRetry) {
      throw new Error('Retry non autorisé pour ce type d\'erreur');
    }

    incrementRetry();
    
    if (retryDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }

    return retryFn();
  }, [errorState.canRetry, incrementRetry, retryDelay]);

  /**
   * Obtient un message d'erreur formaté pour l'affichage
   */
  const getDisplayError = useCallback(() => {
    if (!errorState.hasError || !errorState.error) {
      return null;
    }

    return {
      message: errorState.error.message,
      type: errorState.errorType,
      canRetry: errorState.canRetry,
      retryCount: errorState.retryCount,
      maxRetries,
      context: errorState.error.context
    };
  }, [errorState, maxRetries]);

  return useMemo(() => ({
    // État
    ...errorState,
    displayError: getDisplayError(),
    
    // Actions
    handleError,
    clearError,
    incrementRetry,
    retryWithDelay,
    withErrorHandling,
    
    // Utilitaires
    isRetryable: errorState.canRetry,
    hasReachedMaxRetries: errorState.retryCount >= maxRetries,
    getErrorMessage: (type, message) => getErrorMessage(type, message)
  }), [
    errorState,
    getDisplayError,
    handleError,
    clearError,
    incrementRetry,
    retryWithDelay,
    withErrorHandling,
    maxRetries,
    getErrorMessage
  ]);
};

export default useErrorHandler; 