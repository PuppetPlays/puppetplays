#!/usr/bin/env node

/**
 * Script pour générer les traductions manquantes à partir du rapport d'audit
 * Filtre les faux positifs et crée des fichiers JSON avec les traductions à ajouter
 */

const fs = require('fs');
const path = require('path');

// Trouver le dernier rapport d'audit
const scriptsDir = path.join(__dirname);
const auditFiles = fs.readdirSync(scriptsDir)
  .filter(f => f.startsWith('translation-audit-') && f.endsWith('.json'))
  .sort()
  .reverse();

if (auditFiles.length === 0) {
  console.error('Aucun rapport d\'audit trouvé. Exécutez d\'abord audit-translations.js');
  process.exit(1);
}

const latestAudit = path.join(scriptsDir, auditFiles[0]);
console.log(`Lecture du rapport: ${auditFiles[0]}`);

const audit = JSON.parse(fs.readFileSync(latestAudit, 'utf8'));

// Patterns à ignorer (faux positifs)
const ignorePatterns = [
  /^renders\s/,           // Tests
  /^calls\s/,             // Tests
  /^applies\s/,           // Tests
  /^set\s/,               // Tests
  /^\.\//,                // Chemins relatifs
  /^\.\.\//,              // Chemins relatifs
  /^#/,                   // Sélecteurs CSS
  /^\//,                  // Chemins absolus (sauf quelques exceptions)
  /^\?$/,                 // Single ?
  /^T$/,                  // Single T
  /^\.$/,                 // Single .
  /^,$/,                  // Single ,
  /^id$/,                 // Single id
  /^title$/,              // Single title sans namespace
  /^metaDescription$/,    // Single metaDescription sans namespace
  /^subtitle$/,           // Single subtitle sans namespace
  /^author$/,             // Single author sans namespace
  /^authors$/,            // Single authors sans namespace
  /^medias$/,             // Single medias sans namespace
  /\$\{/,                 // Template literals complexes
  /^[A-Z][a-z]+\s[A-Z][a-z]+/, // Noms propres (ex: Raymond Poisson)
  /^[A-Z][a-z]+$/,        // Mots simples commençant par majuscule
  /keyword|tag|thing/,    // Exemples de test
  /Homére|Liliade|Fishy|Fish/, // Exemples de test
  /Paris|France/,         // Lieux de test
  /\d{4}/,                // Années
  /-\d+/,                 // Nombres négatifs
];

// Patterns de clés valides à traduire
const validKeyPatterns = [
  /^common:/,
  /^home:/,
  /^project:/,
  /^team:/,
  /^anthology:/,
  /^accessibility:/,
  /^privacy:/,
  /^educationalResources\./,
  /^exploreBy\./,
  /^presentation\./,
  /^videoDetail\./,
  /^error\./,
  /^contentNotAvailable$/,
  /^authorsSectionComingSoon$/,
  /^accessToIntregralWorks$/,
  /^animationTechniqueTitle$/,
  /^animationTechniqueDescription$/,
  /^seeAllAnimationTechniques$/,
  /^exploreByKeywords$/,
  /^exploreByAuthors$/,
  /^browseAllAuthors$/,
  /^lightOnWork$/,
  /^ourPublications$/,
  /^discoveryPathwayTitle$/,
  /^pathway$/,
  /^subscribeLabel$/,
  /^emailPlaceholder$/,
  /^subscribe$/,
  /^subscriptionSuccessful$/,
  /^subscriptionError$/,
  /^present$/,
  /^viewOrcid$/,
  /^viewCV$/,
  /^viewProfile$/,
  /^close$/,
  /^researchProjects$/,
  /^viewProject$/,
  /^partnersNote$/,
  /^layer$/,
  /^mapLoadingMessage$/,
];

// Filtrer les clés manquantes
function filterMissingKeys(keys) {
  return keys.filter(key => {
    // Ignorer les patterns à ignorer
    for (const pattern of ignorePatterns) {
      if (pattern.test(key)) {
        return false;
      }
    }
    
    // Garder seulement les clés valides
    for (const pattern of validKeyPatterns) {
      if (pattern.test(key)) {
        return true;
      }
    }
    
    return false;
  });
}

// Créer la structure de traduction pour une clé
function createTranslationStructure(key, locale) {
  const [namespace, ...keyParts] = key.split(':');
  const actualKey = keyParts.join(':') || namespace;
  
  // Traductions par défaut basées sur la clé
  const translations = {
    fr: {
      // Common
      'animationTechniques': 'Techniques d\'animation',
      'meta.animationTechniques.description': 'Explorez les différentes techniques d\'animation utilisées dans le théâtre de marionnettes',
      'contentNotAvailable': 'Contenu non disponible',
      'animationTechniquesNotAvailable': 'Techniques d\'animation non disponibles',
      'animationTechnique': 'Technique d\'animation',
      'readNote': 'Lire la note',
      'yes': 'Oui',
      'no': 'Non',
      'chronology': 'Chronologie',
      'chronologyInverse': 'Chronologie inverse',
      'score': 'Score',
      'title': 'Titre',
      'author': 'Auteur',
      'database': 'Base de données',
      'results': 'Résultats',
      'showMap': 'Afficher la carte',
      'showList': 'Afficher la liste',
      'authors': 'Auteurs',
      'meta.authors.description': 'Découvrez les auteurs du théâtre de marionnettes',
      'authorsSectionComingSoon': 'Section auteurs bientôt disponible',
      'titleUnavailable': 'Titre non disponible',
      'error.loadingData': 'Erreur lors du chargement des données',
      'error.title': 'Erreur',
      'error.dataNotFound': 'Données non trouvées',
      'error.noResultsFound': 'Aucun résultat trouvé',
      'error.notFound': 'Non trouvé',
      'error': 'Erreur',
      'notFound': 'Non trouvé',
      'projectNotFound': 'Projet non trouvé',
      'collections': 'Collections',
      'descriptionUnavailable': 'Description non disponible',
      'seeLess': 'Voir moins',
      'seeMore': 'Voir plus',
      'loading': 'Chargement...',
      'filters.filterByTag': 'Filtrer par mot-clé',
      'date': 'Date',
      'errorLoading': 'Erreur lors du chargement',
      'noData': 'Aucune donnée',
      'months.${month}': 'Mois',
      'image': 'Image',
      'dateLabel': 'Date',
      'durationLabel': 'Durée',
      'authorLabel': 'Auteur',
      'description': 'Description',
      'searchPlaceholder': 'Rechercher...',
      'previous': 'Précédent',
      'next': 'Suivant',
      'menu': 'Menu',
      'launchSearch': 'Lancer la recherche',
      'openNote': 'Ouvrir la note',
      'close': 'Fermer',
      'navMenu': 'Menu de navigation',
      'map': 'Carte',
      'tactPlatform': 'Plateforme TACT',
      'backToHome': 'Retour à l\'accueil',
      'filters.title': 'Filtres',
      'filters.eraseAll': 'Effacer tout',
      'filters.noOptions': 'Aucune option',
      'filters.periodRange': 'Période',
      'filters.lowerBoundPeriod': 'Période début',
      'filters.upperBoundPeriod': 'Période fin',
      'filters.composeAfter': 'Composé après',
      'filters.composeBefore': 'Composé avant',
      'filters.mainLanguagePlaceholder': 'Langue principale',
      'filters.compositionPlacePlaceholder': 'Lieu de composition',
      'filters.authorsPlaceholder': 'Auteurs',
      'filters.literaryTonesPlaceholder': 'Tonalités littéraires',
      'filters.animationTechniquesPlaceholder': 'Techniques d\'animation',
      'filters.theatricalTechniquesPlaceholder': 'Techniques théâtrales',
      'filters.audiencePlaceholder': 'Public',
      'filters.formatsPlaceholder': 'Formats',
      'filters.relatedToTagsPlaceholder': 'Mots-clés associés',
      'filters.female': 'Femme',
      'filters.male': 'Homme',
      'filters.author': 'Auteur',
      'filters.company': 'Compagnie',
      'filters.genderPlaceholder': 'Genre',
      'filters.typePlaceholder': 'Type',
      'imageCopyright': 'Droits d\'image',
      'alias': 'alias',
      'sortBy.titleAsc': 'Titre (A-Z)',
      'sortBy.titleDesc': 'Titre (Z-A)',
      'sortBy.dateAsc': 'Date (ancienne)',
      'sortBy.dateDesc': 'Date (récente)',
      'sortBy.label': 'Trier par',
      'language': 'Langue',
      'century': 'Siècle',
      'work': 'Œuvre',
      'pagesCount': 'Nombre de pages',
      'note': 'Note',
      'otherTitles': 'Autres titres',
      'publications': 'Publications',
      'publication': 'Publication',
      'modernEdition': 'Édition moderne',
      'onlineCopy': 'Copie en ligne',
      'literaryTones': 'Tonalités littéraires',
      'audience': 'Public',
      'characters': 'Personnages',
      'actsCount': 'Nombre d\'actes',
      'license': 'Licence',
      'publicDomain': 'Domaine public',
      'presentation': 'Présentation',
      'medias': 'Médias',
      'anthology': 'Anthologie',
      'document': 'Document',
      'flatplan': 'Plan',
      'author(s)': 'Auteur(s)',
      'genre': 'Genre',
      'compositionDate': 'Date de composition',
      'publicationsAndTranslations': 'Publications et traductions',
      'transcribers': 'Transcripteurs',
      'editors': 'Éditeurs',
      'translations': 'Traductions',
      'conservationPlace': 'Lieu de conservation',
      'keywords': 'Mots-clés',
      'theatricalTechniques': 'Techniques théâtrales',
      'ids': 'Identifiants',
      'permalink': 'Permalien',
      'permalinkCopy': 'Copier le permalien',
      'writtenBy': 'Écrit par',
      'translatedBy': 'Traduit par',
      'languageWithColon': 'Langue :',
      'hypotexts': 'Hypotextes',
      'firstPerformance': 'Première représentation',
      'abstract': 'Résumé',
      'comingSoon': 'Bientôt disponible',
      'video': 'Vidéo',
      'works': 'Œuvres',
      'noWorksForAuthor': 'Aucune œuvre pour cet auteur',
      'noWorksForTechnique': 'Aucune œuvre pour cette technique',
      'discoveryPaths': 'Parcours de découverte',
      'meta.discoveryPaths.description': 'Explorez nos parcours de découverte thématiques',
      'ourPartners': 'Nos partenaires',
    },
    en: {
      // Common
      'animationTechniques': 'Animation Techniques',
      'meta.animationTechniques.description': 'Explore the different animation techniques used in puppet theatre',
      'contentNotAvailable': 'Content not available',
      'animationTechniquesNotAvailable': 'Animation techniques not available',
      'animationTechnique': 'Animation technique',
      'readNote': 'Read note',
      'yes': 'Yes',
      'no': 'No',
      'chronology': 'Chronology',
      'chronologyInverse': 'Reverse chronology',
      'score': 'Score',
      'title': 'Title',
      'author': 'Author',
      'database': 'Database',
      'results': 'Results',
      'showMap': 'Show map',
      'showList': 'Show list',
      'authors': 'Authors',
      'meta.authors.description': 'Discover puppet theatre authors',
      'authorsSectionComingSoon': 'Authors section coming soon',
      'titleUnavailable': 'Title unavailable',
      'error.loadingData': 'Error loading data',
      'error.title': 'Error',
      'error.dataNotFound': 'Data not found',
      'error.noResultsFound': 'No results found',
      'error.notFound': 'Not found',
      'error': 'Error',
      'notFound': 'Not found',
      'projectNotFound': 'Project not found',
      'collections': 'Collections',
      'descriptionUnavailable': 'Description unavailable',
      'seeLess': 'See less',
      'seeMore': 'See more',
      'loading': 'Loading...',
      'filters.filterByTag': 'Filter by tag',
      'date': 'Date',
      'errorLoading': 'Error loading',
      'noData': 'No data',
      'months.${month}': 'Month',
      'image': 'Image',
      'dateLabel': 'Date',
      'durationLabel': 'Duration',
      'authorLabel': 'Author',
      'description': 'Description',
      'searchPlaceholder': 'Search...',
      'previous': 'Previous',
      'next': 'Next',
      'menu': 'Menu',
      'launchSearch': 'Launch search',
      'openNote': 'Open note',
      'close': 'Close',
      'navMenu': 'Navigation menu',
      'map': 'Map',
      'tactPlatform': 'TACT Platform',
      'backToHome': 'Back to home',
      'filters.title': 'Filters',
      'filters.eraseAll': 'Clear all',
      'filters.noOptions': 'No options',
      'filters.periodRange': 'Period',
      'filters.lowerBoundPeriod': 'Start period',
      'filters.upperBoundPeriod': 'End period',
      'filters.composeAfter': 'Composed after',
      'filters.composeBefore': 'Composed before',
      'filters.mainLanguagePlaceholder': 'Main language',
      'filters.compositionPlacePlaceholder': 'Composition place',
      'filters.authorsPlaceholder': 'Authors',
      'filters.literaryTonesPlaceholder': 'Literary tones',
      'filters.animationTechniquesPlaceholder': 'Animation techniques',
      'filters.theatricalTechniquesPlaceholder': 'Theatrical techniques',
      'filters.audiencePlaceholder': 'Audience',
      'filters.formatsPlaceholder': 'Formats',
      'filters.relatedToTagsPlaceholder': 'Related tags',
      'filters.female': 'Female',
      'filters.male': 'Male',
      'filters.author': 'Author',
      'filters.company': 'Company',
      'filters.genderPlaceholder': 'Gender',
      'filters.typePlaceholder': 'Type',
      'imageCopyright': 'Image copyright',
      'alias': 'alias',
      'sortBy.titleAsc': 'Title (A-Z)',
      'sortBy.titleDesc': 'Title (Z-A)',
      'sortBy.dateAsc': 'Date (oldest)',
      'sortBy.dateDesc': 'Date (newest)',
      'sortBy.label': 'Sort by',
      'language': 'Language',
      'century': 'Century',
      'work': 'Work',
      'pagesCount': 'Page count',
      'note': 'Note',
      'otherTitles': 'Other titles',
      'publications': 'Publications',
      'publication': 'Publication',
      'modernEdition': 'Modern edition',
      'onlineCopy': 'Online copy',
      'literaryTones': 'Literary tones',
      'audience': 'Audience',
      'characters': 'Characters',
      'actsCount': 'Acts count',
      'license': 'License',
      'publicDomain': 'Public domain',
      'presentation': 'Presentation',
      'medias': 'Media',
      'anthology': 'Anthology',
      'document': 'Document',
      'flatplan': 'Flatplan',
      'author(s)': 'Author(s)',
      'genre': 'Genre',
      'compositionDate': 'Composition date',
      'publicationsAndTranslations': 'Publications and translations',
      'transcribers': 'Transcribers',
      'editors': 'Editors',
      'translations': 'Translations',
      'conservationPlace': 'Conservation place',
      'keywords': 'Keywords',
      'theatricalTechniques': 'Theatrical techniques',
      'ids': 'IDs',
      'permalink': 'Permalink',
      'permalinkCopy': 'Copy permalink',
      'writtenBy': 'Written by',
      'translatedBy': 'Translated by',
      'languageWithColon': 'Language:',
      'hypotexts': 'Hypotexts',
      'firstPerformance': 'First performance',
      'abstract': 'Abstract',
      'comingSoon': 'Coming soon',
      'video': 'Video',
      'works': 'Works',
      'noWorksForAuthor': 'No works for this author',
      'noWorksForTechnique': 'No works for this technique',
      'discoveryPaths': 'Discovery paths',
      'meta.discoveryPaths.description': 'Explore our thematic discovery paths',
      'ourPartners': 'Our partners',
    }
  };
  
  const localeTranslations = translations[locale] || {};
  
  if (localeTranslations[actualKey]) {
    return localeTranslations[actualKey];
  }
  
  // Générer une traduction par défaut basée sur la clé
  const words = actualKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/[._-]/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ');
  
  if (locale === 'fr') {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  } else {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  }
}

// Grouper les clés par namespace
function groupKeysByNamespace(keys, locale) {
  const grouped = {};
  
  keys.forEach(key => {
    let namespace, actualKey;
    
    if (key.includes(':')) {
      [namespace, ...actualKeyParts] = key.split(':');
      actualKey = actualKeyParts.join(':');
    } else if (key.includes('.')) {
      const parts = key.split('.');
      namespace = parts[0];
      actualKey = parts.slice(1).join('.');
    } else {
      // Clés sans namespace vont dans home
      namespace = 'home';
      actualKey = key;
    }
    
    if (!grouped[namespace]) {
      grouped[namespace] = {};
    }
    
    // Créer la structure imbriquée pour les clés avec des points
    const keyParts = actualKey.split('.');
    let current = grouped[namespace];
    
    for (let i = 0; i < keyParts.length - 1; i++) {
      if (!current[keyParts[i]]) {
        current[keyParts[i]] = {};
      }
      current = current[keyParts[i]];
    }
    
    const lastKey = keyParts[keyParts.length - 1];
    current[lastKey] = createTranslationStructure(key, locale);
  });
  
  return grouped;
}

// Traiter les traductions manquantes
console.log('\n=== Génération des traductions manquantes ===\n');

['fr', 'en'].forEach(locale => {
  console.log(`\n--- Traitement pour ${locale.toUpperCase()} ---`);
  
  const missingKeys = filterMissingKeys(audit.missingKeys[locale]);
  console.log(`${missingKeys.length} clés valides à traduire (sur ${audit.missingKeys[locale].length} au total)`);
  
  if (missingKeys.length > 0) {
    const grouped = groupKeysByNamespace(missingKeys, locale);
    
    // Créer un répertoire pour les traductions manquantes
    const outputDir = path.join(__dirname, 'missing-translations', locale);
    fs.mkdirSync(outputDir, { recursive: true });
    
    // Sauvegarder chaque namespace dans un fichier séparé
    Object.entries(grouped).forEach(([namespace, translations]) => {
      const outputFile = path.join(outputDir, `${namespace}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(translations, null, 2));
      console.log(`  ✅ Créé: missing-translations/${locale}/${namespace}.json`);
    });
  }
});

console.log('\n=== Instructions pour appliquer les traductions ===\n');
console.log('1. Vérifiez les traductions générées dans scripts/missing-translations/');
console.log('2. Ajustez les traductions si nécessaire');
console.log('3. Fusionnez les traductions avec les fichiers existants dans public/locales/');
console.log('4. Exécutez à nouveau audit-translations.js pour vérifier');
console.log('\n✅ Génération terminée!\n'); 