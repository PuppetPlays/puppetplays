import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'next-i18next';

/**
 * Hook personnalisé pour récupérer les métadonnées d'un document HAL
 * @param {string} halUrl - URL HAL du document
 * @param {Object} options - Options de configuration
 * @returns {Object} État contenant les métadonnées, état de chargement et erreurs
 */
const useHalMetadata = (halUrl, options = {}) => {
  const { t } = useTranslation();
  const {
    autoFetch = true,
    retryCount = 2,
    retryDelay = 1000,
    timeout = 10000
  } = options;

  const [state, setState] = useState({
    metadata: null,
    isLoading: false,
    error: null,
    isSuccess: false
  });

  /**
   * Extrait l'identifiant HAL depuis une URL
   * @param {string} url - URL HAL
   * @returns {string|null} Identifiant HAL ou null
   */
  const extractHalId = useCallback((url) => {
    if (!url) return null;
    
    try {
      const matches = url.match(/hal-([\\w\\d]+)(?:v\\d+)?/);
      return matches ? `hal-${matches[1]}` : null;
    } catch (error) {
      console.warn('[useHalMetadata] Erreur extraction ID HAL:', error);
      return null;
    }
  }, []);

  /**
   * Construit l'URL de l'API HAL pour les métadonnées
   * @param {string} halId - Identifiant HAL
   * @returns {string} URL de l'API HAL
   */
  const buildApiUrl = useCallback((halId) => {
    if (!halId) return null;
    return `https://api.archives-ouvertes.fr/search/?q=halId_s:${halId}&fl=title_s,authFullName_s,submittedDate_s,journalTitle_s,doiId_s,abstract_s,keyword_s,language_s,docType_s&format=json`;
  }, []);

  /**
   * Effectue une requête avec retry et timeout
   * @param {string} url - URL à appeler
   * @param {number} attempt - Tentative actuelle
   * @returns {Promise<Response>} Réponse de l'API
   */
  const fetchWithRetry = useCallback(async (url, attempt = 1) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PuppetPlays-MetadataFetcher/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API HAL erreur ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (attempt <= retryCount && !controller.signal.aborted) {
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchWithRetry(url, attempt + 1);
      }
      
      throw error;
    }
  }, [retryCount, retryDelay, timeout]);

  /**
   * Transforme les données brutes HAL en métadonnées structurées
   * @param {Object} rawData - Données brutes de l'API HAL
   * @returns {Object} Métadonnées structurées
   */
  const transformMetadata = useCallback((rawData) => {
    if (!rawData?.response?.docs?.[0]) {
      return null;
    }

    const doc = rawData.response.docs[0];
    
    return {
      title: doc.title_s?.[0] || null,
      authors: doc.authFullName_s || [],
      submittedDate: doc.submittedDate_s || null,
      journal: doc.journalTitle_s?.[0] || null,
      doi: doc.doiId_s?.[0] || null,
      abstract: doc.abstract_s?.[0] || null,
      keywords: doc.keyword_s || [],
      language: doc.language_s?.[0] || null,
      docType: doc.docType_s?.[0] || null,
      // Données calculées
      authorsString: doc.authFullName_s?.join(', ') || '',
      keywordsString: doc.keyword_s?.join(', ') || '',
      year: doc.submittedDate_s ? new Date(doc.submittedDate_s).getFullYear() : null
    };
  }, []);

  /**
   * Fonction principale pour récupérer les métadonnées
   * @param {boolean} force - Forcer la récupération même si déjà chargé
   */
  const fetchMetadata = useCallback(async (force = false) => {
    if (!halUrl) {
      setState(prev => ({
        ...prev,
        error: 'URL HAL manquante',
        isLoading: false
      }));
      return;
    }

    if (state.isLoading && !force) {
      return; // Éviter les appels multiples
    }

    const halId = extractHalId(halUrl);
    if (!halId) {
      setState(prev => ({
        ...prev,
        error: 'Identifiant HAL invalide',
        isLoading: false
      }));
      return;
    }

    const apiUrl = buildApiUrl(halId);
    if (!apiUrl) {
      setState(prev => ({
        ...prev,
        error: 'Impossible de construire l\'URL API',
        isLoading: false
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false
    }));

    try {
      
      
      const response = await fetchWithRetry(apiUrl);
      const rawData = await response.json();
      const metadata = transformMetadata(rawData);

      if (!metadata) {
        throw new Error('Aucune métadonnée trouvée pour ce document HAL');
      }

      setState({
        metadata,
        isLoading: false,
        error: null,
        isSuccess: true
      });

      
    } catch (error) {
      console.error('[useHalMetadata] Erreur récupération métadonnées:', error);
      
      const errorMessage = error.name === 'AbortError' 
        ? 'Timeout de récupération des métadonnées'
        : error.message || 'Erreur inconnue lors de la récupération';

      setState({
        metadata: null,
        isLoading: false,
        error: errorMessage,
        isSuccess: false
      });
    }
  }, [halUrl, extractHalId, buildApiUrl, fetchWithRetry, transformMetadata, state.isLoading]);

  /**
   * Fonction pour réinitialiser l'état
   */
  const reset = useCallback(() => {
    setState({
      metadata: null,
      isLoading: false,
      error: null,
      isSuccess: false
    });
  }, []);

  // Récupération automatique au montage si autoFetch est activé
  useEffect(() => {
    if (autoFetch && halUrl) {
      fetchMetadata();
    }
  }, [halUrl, autoFetch, fetchMetadata]);

  return {
    // État
    ...state,
    
    // Actions
    fetchMetadata: useCallback(() => fetchMetadata(false), [fetchMetadata]),
    refetchMetadata: useCallback(() => fetchMetadata(true), [fetchMetadata]),
    reset,
    
    // Utilitaires
    halId: extractHalId(halUrl),
    hasMetadata: !!state.metadata,
    
    // Métadonnées formatées pour l'affichage
    displayData: state.metadata ? {
      title: state.metadata.title,
      authors: state.metadata.authorsString,
      year: state.metadata.year,
      journal: state.metadata.journal,
      doi: state.metadata.doi,
      abstract: state.metadata.abstract
    } : null
  };
};

export default useHalMetadata; 