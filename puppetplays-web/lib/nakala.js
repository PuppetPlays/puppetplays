export async function fetchNakala(endpoint) {
  const baseUrl = 'https://api.nakala.fr';

  const url = `${baseUrl}${endpoint}`;
  console.log(`🔍 [NAKALA DEBUG] Fetching: ${url}`);

  try {
    const res = await fetch(url);
    console.log(
      `📡 [NAKALA DEBUG] Response status: ${res.status} ${res.statusText}`,
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ [NAKALA DEBUG] HTTP Error ${res.status}:`, errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    console.log(`✅ [NAKALA DEBUG] Success for ${endpoint}:`, {
      dataType: Array.isArray(data) ? 'Array' : typeof data,
      arrayLength: Array.isArray(data) ? data.length : 'N/A',
      keys:
        typeof data === 'object' && data !== null ? Object.keys(data) : 'N/A',
      sampleData:
        typeof data === 'object' && data !== null
          ? Array.isArray(data)
            ? data.slice(0, 2)
            : data
          : data,
    });

    // Debug détaillé pour les files et metas si présents
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.files && Array.isArray(data.files)) {
        console.log(`📁 [NAKALA DEBUG] Files details for ${endpoint}:`, {
          filesCount: data.files.length,
          fileTypes: data.files.map(file => ({
            name: file.name,
            extension: file.extension,
            mimetype: file.mimetype,
            size: file.size,
            sha1: file.sha1?.substring(0, 8) + '...' || 'N/A',
          })),
          sampleFiles: data.files.slice(0, 3),
        });
      }

      if (data.metas && Array.isArray(data.metas)) {
        console.log(`🏷️ [NAKALA DEBUG] Metas details for ${endpoint}:`, {
          metasCount: data.metas.length,
          metaProperties: data.metas.map(meta => ({
            propertyUri: meta.propertyUri,
            value:
              typeof meta.value === 'string'
                ? meta.value.length > 100
                  ? meta.value.substring(0, 100) + '...'
                  : meta.value
                : meta.value,
            lang: meta.lang || 'N/A',
            type: typeof meta.value,
          })),
          sampleMetas: data.metas.slice(0, 5),
        });
      }
    }

    // Debug pour les collections de données
    if (Array.isArray(data) && data.length > 0 && data[0].metas) {
      console.log(
        `📚 [NAKALA DEBUG] Collection items sample for ${endpoint}:`,
        {
          itemsCount: data.length,
          sampleItemMetas: data.slice(0, 2).map(item => ({
            identifier: item.identifier,
            metasCount: item.metas?.length || 0,
            filesCount: item.files?.length || 0,
            mainMetas:
              item.metas?.slice(0, 3).map(meta => ({
                property: meta.propertyUri,
                value:
                  typeof meta.value === 'string' && meta.value.length > 50
                    ? meta.value.substring(0, 50) + '...'
                    : meta.value,
              })) || [],
          })),
        },
      );
    }

    return data;
  } catch (err) {
    console.error(`💥 [NAKALA DEBUG] Error for ${endpoint}:`, err);
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
  return fetchNakala(`/datas/${videoId}`);
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
 * @param {string} itemId - The Nakala item identifier
 * @returns {Promise<Object>} - The item data
 */
export async function fetchNakalaItem(itemId) {
  return fetchNakala(`/datas/${itemId}`);
}

/**
 * Generates the URL for the Nakala embed viewer
 * @param {string} identifier - The Nakala item identifier
 * @param {string} fileIdentifier - The file SHA1 identifier
 * @param {Object} options - Additional options for the viewer
 * @param {boolean} options.buttons - Show viewer buttons (default: true)
 * @returns {string} - The embed viewer URL
 */
export function getNakalaEmbedUrl(identifier, fileIdentifier, options = {}) {
  const { buttons = true } = options;
  const baseUrl = 'https://api.nakala.fr/embed';
  const params = new URLSearchParams();

  if (buttons) {
    params.append('buttons', 'true');
  }

  const queryString = params.toString();
  return `${baseUrl}/${encodeURIComponent(identifier)}/${fileIdentifier}${queryString ? `?${queryString}` : ''}`;
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
    `https://api.nakala.fr/datas/${encodeURIComponent(identifier)}/${title}.xml`,

    // Approach 2: Try with common XML patterns
    `https://api.nakala.fr/datas/${encodeURIComponent(identifier)}/${title}_transcription.xml`,
    `https://api.nakala.fr/datas/${encodeURIComponent(identifier)}/${title}_ENG.xml`,
    `https://api.nakala.fr/datas/${encodeURIComponent(identifier)}/${title}_FR.xml`,

    // Approach 3: Try with files endpoint
    `https://api.nakala.fr/files/${title}.xml`,
  ];

  for (const url of possibleUrls) {
    try {
      console.log(`🔍 [TRANSCRIPTION] Trying URL: ${url}`);
      const response = await fetch(url);

      if (response.ok) {
        const content = await response.text();

        // Check if it's actually XML content
        if (
          content.includes('<?xml') ||
          content.includes('<TEI') ||
          content.includes('<text>')
        ) {
          console.log(`✅ [TRANSCRIPTION] Found XML at: ${url}`);
          return content;
        }
      }

      console.log(
        `❌ [TRANSCRIPTION] Failed for: ${url} (Status: ${response.status})`,
      );
    } catch (error) {
      console.log(`💥 [TRANSCRIPTION] Error for: ${url}`, error.message);
    }
  }

  console.log(
    `🚫 [TRANSCRIPTION] No XML transcription found for: ${identifier}`,
  );
  return null;
}
