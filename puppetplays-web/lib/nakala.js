// Nakala API base URL and helper functions

const NAKALA_BASE_URL = 'https://api.nakala.fr';

/**
 * Makes a request to the Nakala API with debugging
 * @param {string} endpoint - The API endpoint (starting with /)
 * @returns {Promise<any>} - The JSON response
 */
async function fetchNakala(endpoint) {
  const url = `${NAKALA_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(`Error for ${endpoint}:`, err);
    throw err;
  }
}

// Collections à utiliser
export const NAKALA_COLLECTIONS = {
  LANCEMENTS_PUBLICS: '10.34847/nkl.ff0dmvni',
  JOURNEE_ETUDES_GUIGNOL: '10.34847/nkl.d6a0715c',
  SECOND_COLLOQUE: '10.34847/nkl.2e6b0u0o',
  PREMIER_COLLOQUE: '10.34847/nkl.fb7fa5e8',
};

/**
 * Extrait la première valeur d'une métadonnée spécifique du tableau metas.
 * @param {Array} metas - Le tableau des métadonnées.
 * @param {string} propertyUri - L'URI de la propriété à rechercher.
 * @param {string} [lang] - La langue préférée (optionnel).
 * @returns {string|object|null} La valeur de la métadonnée ou null.
 */
export function getMetaValue(metas, propertyUri, lang = null) {
  if (!Array.isArray(metas)) return null;

  // 1. Essayer avec la langue exacte demandée
  if (lang) {
    const exactLangMeta = metas.find(
      meta => meta.propertyUri === propertyUri && meta.lang === lang,
    );
    if (exactLangMeta) return exactLangMeta.value;
  }

  // 2. Si la langue demandée est l'anglais, essayer avec le français
  if (lang === 'en') {
    const frMeta = metas.find(
      meta => meta.propertyUri === propertyUri && meta.lang === 'fr',
    );
    if (frMeta) return frMeta.value;
  }

  // 3. Si la langue demandée est le français, essayer avec l'anglais
  if (lang === 'fr') {
    const enMeta = metas.find(
      meta => meta.propertyUri === propertyUri && meta.lang === 'en',
    );
    if (enMeta) return enMeta.value;
  }

  // 4. Dernier recours : prendre la première métadonnée disponible avec ce propertyUri
  const fallbackMeta = metas.find(meta => meta.propertyUri === propertyUri);
  return fallbackMeta ? fallbackMeta.value : null;
}

/**
 * Extrait toutes les valeurs d'une métadonnée spécifique du tableau metas.
 * @param {Array} metas - Le tableau des métadonnées.
 * @param {string} propertyUri - L'URI de la propriété à rechercher.
 * @returns {Array} Un tableau des valeurs trouvées.
 */
export function getMetaValues(metas, propertyUri) {
  if (!Array.isArray(metas)) return [];
  return metas
    .filter(meta => meta.propertyUri === propertyUri)
    .map(meta => meta.value);
}

// Fonction helper pour obtenir les détails d'une collection
export async function fetchCollection(collectionId) {
  return fetchNakala(`/collections/${collectionId}`);
}

/**
 * Fetches the videos for a specific collection
 * @param {string} collectionId
 * @param {Object} pagination
 * @param {number} pagination.page - Page number (1-indexed)
 * @param {number} pagination.limit - Number of items per page
 * @returns {Promise<Object>} - Object containing data array, total, currentPage, and lastPage
 */
export const fetchCollectionVideos = async (
  collectionId,
  pagination = { page: 1, limit: 10 },
) => {
  try {
    const { page, limit } = pagination;
    const url = `/collections/${collectionId}/datas?${new URLSearchParams({
      page,
      limit,
    })}`;

    const response = await fetchNakala(url);
    return response;
  } catch (err) {
    console.error(`Error fetching videos for collection ${collectionId}:`, err);
    return {
      data: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
    };
  }
};

// Fonction helper pour obtenir le nombre de vidéos d'une collection
export async function fetchCollectionVideoCount(collectionId) {
  try {
    // On utilise limit=1 pour optimiser et ne pas charger toutes les métadonnées des vidéos
    const response = await fetchNakala(
      `/collections/${collectionId}/datas?limit=1`,
    );
    return response?.total || 0; // Retourne le total ou 0 si non trouvé
  } catch (error) {
    console.error(
      `Could not fetch video count for collection ${collectionId}:`,
      error,
    );
    return 0; // Retourne 0 en cas d'erreur
  }
}

// Fonction helper pour obtenir les détails d'une donnée (vidéo)
export async function fetchVideoData(videoId) {
  return fetchNakala(`/data/${videoId}`);
}

/**
 * Fetches collection data (similar to fetchCollectionVideos but more generic)
 * @param {string} collectionId
 * @param {Object} pagination
 * @param {number} pagination.page - Page number (1-indexed)
 * @param {number} pagination.limit - Number of items per page
 * @returns {Promise<Object>} - Object containing data array, total, currentPage, and lastPage
 */
export const fetchCollectionData = async (
  collectionId,
  pagination = { page: 1, limit: 10 },
) => {
  try {
    const { page, limit } = pagination;
    const url = `/collections/${collectionId}/datas?${new URLSearchParams({
      page,
      limit,
    })}`;

    const response = await fetchNakala(url);
    return response;
  } catch (err) {
    console.error(`Error fetching data for collection ${collectionId}:`, err);
    return {
      data: [],
      total: 0,
      currentPage: 1,
      lastPage: 1,
    };
  }
};

/**
 * Fetches a specific Nakala item by its identifier
 * @param {string} itemId - The Nakala item identifier (full DOI format like "10.34847/nkl.xxxxxxxx")
 * @returns {Promise<Object>} - The item data
 */
export async function fetchNakalaItem(itemId) {
  // For Nakala, the proper endpoint is /datas/{identifier}
  // Example: https://api.nakala.fr/datas/10.34847/nkl.xxxxxxxx
  const endpoint = `/datas/${itemId}`;

  try {
    return await fetchNakala(endpoint);
  } catch (error) {
    console.error(`Failed to fetch item ${itemId}:`, error.message);
    throw new Error(`Failed to fetch Nakala item ${itemId}: ${error.message}`);
  }
}

/**
 * Generates the URL for the Nakala embed viewer (IIIF viewer)
 * @param {string} identifier - The Nakala item identifier (full DOI format)
 * @param {string} fileIdentifier - The file SHA1 identifier
 * @param {Object} options - Additional options for the viewer
 * @param {boolean} options.buttons - Show viewer buttons (default: true)
 * @returns {string} - The embed viewer URL
 */
export function getNakalaEmbedUrl(identifier, fileIdentifier, options = {}) {
  const { buttons = true } = options;
  const baseUrl = 'https://api.nakala.fr/embed';

  // Build URL: /embed/{identifier}/{fileIdentifier}
  let url = `${baseUrl}/${encodeURIComponent(identifier)}/${fileIdentifier}`;

  // Add query parameters
  const params = new URLSearchParams();
  if (buttons) {
    params.append('buttons', 'true');
  }

  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}

/**
 * Attempts to fetch transcription XML file for a given item
 * @param {string} identifier - The Nakala item identifier
 * @param {string} title - The title of the item (used to construct XML filename)
 * @returns {Promise<string|null>} - The XML content or null if not found
 */
export async function fetchTranscriptionXML(identifier, title) {
  if (!identifier || !title) return null;

  // Try different approaches to get the XML file
  const possibleUrls = [
    // Approach 1: Direct file access with title
    `https://api.nakala.fr/data/${encodeURIComponent(identifier)}/${title}.xml`,

    // Approach 2: Try with common XML patterns
    `https://api.nakala.fr/data/${encodeURIComponent(identifier)}/${title}_transcription.xml`,
    `https://api.nakala.fr/data/${encodeURIComponent(identifier)}/${title}_ENG.xml`,
    `https://api.nakala.fr/data/${encodeURIComponent(identifier)}/${title}_FR.xml`,

    // Approach 3: Try with files endpoint
    `https://api.nakala.fr/files/${title}.xml`,
  ];

  for (const url of possibleUrls) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        const content = await response.text();

        // Check if it's actually XML content
        if (
          content.includes('<?xml') ||
          content.includes('<TEI') ||
          content.includes('<text>')
        ) {
          return content;
        }
      }
    } catch (error) {
      // Continue trying other URLs
    }
  }

  return null;
}
