export async function fetchNakala(endpoint) {
  const baseUrl = 'https://api.nakala.fr';

  const url = `${baseUrl}${endpoint}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Erreur API Nakala:', err);
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
