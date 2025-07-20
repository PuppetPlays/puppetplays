/**
 * Configuration pour l'intégration HAL
 */

// Domaines HAL autorisés
export const HAL_DOMAINS = [
  'hal.science',
  'hal.archives-ouvertes.fr',
  'hal.inria.fr',
  'tel.archives-ouvertes.fr',
  'cea.hal.science',
  'inria.hal.science',
  'hal-cea.archives-ouvertes.fr',
  'hal-inria.archives-ouvertes.fr',
  'hal.univ-lille.fr',
  'hal.sorbonne-universite.fr',
  'hal-paris1.archives-ouvertes.fr',
  'hal-amu.archives-ouvertes.fr',
];

/**
 * Valide si une URL est une URL HAL valide
 * @param {string} url - L'URL à valider
 * @returns {boolean} true si l'URL est valide
 */
export function isValidHalUrl(url) {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    
    // Vérifier le domaine
    const isValidDomain = HAL_DOMAINS.some(domain =>
      parsedUrl.hostname.includes(domain)
    );

    // Vérifier la présence d'un identifiant HAL
    const hasHalId = /hal-[\w\d]+/i.test(url);

    return isValidDomain && hasHalId;
  } catch (error) {
    return false;
  }
}

/**
 * Construit l'URL du PDF à partir d'une URL HAL
 * @param {string} halUrl - L'URL HAL de base
 * @returns {string} L'URL du document PDF
 */
export function getHalPdfUrl(halUrl) {
  if (!halUrl) return null;

  // Si l'URL se termine déjà par /document, la retourner telle quelle
  if (halUrl.endsWith('/document')) {
    return halUrl;
  }

  // Si l'URL contient un identifiant HAL mais pas /document, l'ajouter
  if (isValidHalUrl(halUrl)) {
    // Retirer les paramètres de requête et fragments
    const cleanUrl = halUrl.split('?')[0].split('#')[0];
    
    // Ajouter /document si ce n'est pas déjà présent
    return cleanUrl.endsWith('/') 
      ? `${cleanUrl}document` 
      : `${cleanUrl}/document`;
  }

  return halUrl;
}

/**
 * Configuration des headers pour les requêtes HAL
 */
export const HAL_REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; PuppetPlays/1.0)',
  'Accept': 'application/pdf,text/html,application/xhtml+xml',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
};

/**
 * Options de cache pour les PDFs
 */
export const PDF_CACHE_OPTIONS = {
  maxAge: 3600, // 1 heure
  sMaxAge: 86400, // 24 heures pour le CDN
  staleWhileRevalidate: 604800, // 7 jours
}; 