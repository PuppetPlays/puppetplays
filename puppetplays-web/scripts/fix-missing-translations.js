#!/usr/bin/env node

/**
 * Script pour corriger les traductions manquantes
 * Ajoute directement les traductions dans les fichiers existants
 */

const fs = require('fs');
const path = require('path');

// Traductions manquantes principales
const missingTranslations = {
  common: {
    fr: {
      animationTechniques: "Techniques d'animation",
      animationTechniquesNotAvailable: "Techniques d'animation non disponibles",
      animationTechnique: "Technique d'animation",
      contentNotAvailable: 'Contenu non disponible',
      readNote: 'Lire la note',
      yes: 'Oui',
      no: 'Non',
      chronology: 'Chronologie',
      chronologyInverse: 'Chronologie inverse',
      score: 'Score',
      title: 'Titre',
      author: 'Auteur',
      database: 'Base de données',
      results: 'Résultats',
      showMap: 'Afficher la carte',
      showList: 'Afficher la liste',
      authors: 'Auteurs',
      authorsSectionComingSoon: 'Section auteurs bientôt disponible',
      titleUnavailable: 'Titre non disponible',
      collections: 'Collections',
      descriptionUnavailable: 'Description non disponible',
      seeLess: 'Voir moins',
      seeMore: 'Voir plus',
      loading: 'Chargement...',
      date: 'Date',
      errorLoading: 'Erreur lors du chargement',
      noData: 'Aucune donnée',
      image: 'Image',
      dateLabel: 'Date',
      durationLabel: 'Durée',
      authorLabel: 'Auteur',
      description: 'Description',
      searchPlaceholder: 'Rechercher...',
      previous: 'Précédent',
      next: 'Suivant',
      menu: 'Menu',
      launchSearch: 'Lancer la recherche',
      openNote: 'Ouvrir la note',
      close: 'Fermer',
      navMenu: 'Menu de navigation',
      map: 'Carte',
      tactPlatform: 'Plateforme TACT',
      backToHome: "Retour à l'accueil",
      imageCopyright: "Droits d'image",
      alias: 'alias',
      language: 'Langue',
      century: 'Siècle',
      work: 'Œuvre',
      pagesCount: 'Nombre de pages',
      note: 'Note',
      otherTitles: 'Autres titres',
      publications: 'Publications',
      publication: 'Publication',
      modernEdition: 'Édition moderne',
      onlineCopy: 'Copie en ligne',
      literaryTones: 'Tonalités littéraires',
      audience: 'Public',
      characters: 'Personnages',
      actsCount: "Nombre d'actes",
      license: 'Licence',
      publicDomain: 'Domaine public',
      presentation: 'Présentation',
      medias: 'Médias',
      anthology: 'Anthologie',
      document: 'Document',
      flatplan: 'Plan',
      'author(s)': 'Auteur(s)',
      genre: 'Genre',
      compositionDate: 'Date de composition',
      publicationsAndTranslations: 'Publications et traductions',
      transcribers: 'Transcripteurs',
      editors: 'Éditeurs',
      translations: 'Traductions',
      conservationPlace: 'Lieu de conservation',
      keywords: 'Mots-clés',
      theatricalTechniques: 'Techniques théâtrales',
      ids: 'Identifiants',
      permalink: 'Permalien',
      permalinkCopy: 'Copier le permalien',
      writtenBy: 'Écrit par',
      translatedBy: 'Traduit par',
      languageWithColon: 'Langue :',
      hypotexts: 'Hypotextes',
      firstPerformance: 'Première représentation',
      abstract: 'Résumé',
      comingSoon: 'Bientôt disponible',
      video: 'Vidéo',
      works: 'Œuvres',
      noWorksForAuthor: 'Aucune œuvre pour cet auteur',
      noWorksForTechnique: 'Aucune œuvre pour cette technique',
      discoveryPaths: 'Parcours de découverte',
      ourPartners: 'Nos partenaires',
      notFound: 'Non trouvé',
      projectNotFound: 'Projet non trouvé',
      error: {
        title: 'Erreur',
        dataNotFound: 'Données non trouvées',
        noResultsFound: 'Aucun résultat trouvé',
        notFound: 'Non trouvé',
        loadingData: 'Erreur lors du chargement des données',
      },
      meta: {
        animationTechniques: {
          description:
            "Explorez les différentes techniques d'animation utilisées dans le théâtre de marionnettes",
        },
        discoveryPaths: {
          description: 'Explorez nos parcours de découverte thématiques',
        },
        authors: {
          description: 'Découvrez les auteurs du théâtre de marionnettes',
        },
      },
      filters: {
        title: 'Filtres',
        eraseAll: 'Effacer tout',
        noOptions: 'Aucune option',
        periodRange: 'Période',
        lowerBoundPeriod: 'Période début',
        upperBoundPeriod: 'Période fin',
        composeAfter: 'Composé après',
        composeBefore: 'Composé avant',
        filterByTag: 'Filtrer par mot-clé',
        mainLanguagePlaceholder: 'Langue principale',
        compositionPlacePlaceholder: 'Lieu de composition',
        authorsPlaceholder: 'Auteurs',
        literaryTonesPlaceholder: 'Tonalités littéraires',
        animationTechniquesPlaceholder: "Techniques d'animation",
        theatricalTechniquesPlaceholder: 'Techniques théâtrales',
        audiencePlaceholder: 'Public',
        formatsPlaceholder: 'Formats',
        relatedToTagsPlaceholder: 'Mots-clés associés',
        female: 'Femme',
        male: 'Homme',
        author: 'Auteur',
        company: 'Compagnie',
        genderPlaceholder: 'Genre',
        typePlaceholder: 'Type',
      },
      sortBy: {
        titleAsc: 'Titre (A-Z)',
        titleDesc: 'Titre (Z-A)',
        dateAsc: 'Date (ancienne)',
        dateDesc: 'Date (récente)',
        label: 'Trier par',
      },
      mediaKinds: {
        video: 'Vidéo',
        image: 'Image',
        audio: 'Audio',
        text: 'Texte',
      },
      months: {
        january: 'Janvier',
        february: 'Février',
        march: 'Mars',
        april: 'Avril',
        may: 'Mai',
        june: 'Juin',
        july: 'Juillet',
        august: 'Août',
        september: 'Septembre',
        october: 'Octobre',
        november: 'Novembre',
        december: 'Décembre',
      },
    },
    en: {
      animationTechniques: 'Animation Techniques',
      animationTechniquesNotAvailable: 'Animation techniques not available',
      animationTechnique: 'Animation technique',
      contentNotAvailable: 'Content not available',
      readNote: 'Read note',
      yes: 'Yes',
      no: 'No',
      chronology: 'Chronology',
      chronologyInverse: 'Reverse chronology',
      score: 'Score',
      title: 'Title',
      author: 'Author',
      database: 'Database',
      results: 'Results',
      showMap: 'Show map',
      showList: 'Show list',
      authors: 'Authors',
      authorsSectionComingSoon: 'Authors section coming soon',
      titleUnavailable: 'Title unavailable',
      collections: 'Collections',
      descriptionUnavailable: 'Description unavailable',
      seeLess: 'See less',
      seeMore: 'See more',
      loading: 'Loading...',
      date: 'Date',
      errorLoading: 'Error loading',
      noData: 'No data',
      image: 'Image',
      dateLabel: 'Date',
      durationLabel: 'Duration',
      authorLabel: 'Author',
      description: 'Description',
      searchPlaceholder: 'Search...',
      previous: 'Previous',
      next: 'Next',
      menu: 'Menu',
      launchSearch: 'Launch search',
      openNote: 'Open note',
      close: 'Close',
      navMenu: 'Navigation menu',
      map: 'Map',
      tactPlatform: 'TACT Platform',
      backToHome: 'Back to home',
      imageCopyright: 'Image copyright',
      alias: 'alias',
      language: 'Language',
      century: 'Century',
      work: 'Work',
      pagesCount: 'Page count',
      note: 'Note',
      otherTitles: 'Other titles',
      publications: 'Publications',
      publication: 'Publication',
      modernEdition: 'Modern edition',
      onlineCopy: 'Online copy',
      literaryTones: 'Literary tones',
      audience: 'Audience',
      characters: 'Characters',
      actsCount: 'Acts count',
      license: 'License',
      publicDomain: 'Public domain',
      presentation: 'Presentation',
      medias: 'Media',
      anthology: 'Anthology',
      document: 'Document',
      flatplan: 'Flatplan',
      'author(s)': 'Author(s)',
      genre: 'Genre',
      compositionDate: 'Composition date',
      publicationsAndTranslations: 'Publications and translations',
      transcribers: 'Transcribers',
      editors: 'Editors',
      translations: 'Translations',
      conservationPlace: 'Conservation place',
      keywords: 'Keywords',
      theatricalTechniques: 'Theatrical techniques',
      ids: 'IDs',
      permalink: 'Permalink',
      permalinkCopy: 'Copy permalink',
      writtenBy: 'Written by',
      translatedBy: 'Translated by',
      languageWithColon: 'Language:',
      hypotexts: 'Hypotexts',
      firstPerformance: 'First performance',
      abstract: 'Abstract',
      comingSoon: 'Coming soon',
      video: 'Video',
      works: 'Works',
      noWorksForAuthor: 'No works for this author',
      noWorksForTechnique: 'No works for this technique',
      discoveryPaths: 'Discovery paths',
      ourPartners: 'Our partners',
      notFound: 'Not found',
      projectNotFound: 'Project not found',
      error: {
        title: 'Error',
        dataNotFound: 'Data not found',
        noResultsFound: 'No results found',
        notFound: 'Not found',
        loadingData: 'Error loading data',
      },
      meta: {
        animationTechniques: {
          description:
            'Explore the different animation techniques used in puppet theatre',
        },
        discoveryPaths: {
          description: 'Explore our thematic discovery paths',
        },
        authors: {
          description: 'Discover puppet theatre authors',
        },
      },
      filters: {
        title: 'Filters',
        eraseAll: 'Clear all',
        noOptions: 'No options',
        periodRange: 'Period',
        lowerBoundPeriod: 'Start period',
        upperBoundPeriod: 'End period',
        composeAfter: 'Composed after',
        composeBefore: 'Composed before',
        filterByTag: 'Filter by tag',
        mainLanguagePlaceholder: 'Main language',
        compositionPlacePlaceholder: 'Composition place',
        authorsPlaceholder: 'Authors',
        literaryTonesPlaceholder: 'Literary tones',
        animationTechniquesPlaceholder: 'Animation techniques',
        theatricalTechniquesPlaceholder: 'Theatrical techniques',
        audiencePlaceholder: 'Audience',
        formatsPlaceholder: 'Formats',
        relatedToTagsPlaceholder: 'Related tags',
        female: 'Female',
        male: 'Male',
        author: 'Author',
        company: 'Company',
        genderPlaceholder: 'Gender',
        typePlaceholder: 'Type',
      },
      sortBy: {
        titleAsc: 'Title (A-Z)',
        titleDesc: 'Title (Z-A)',
        dateAsc: 'Date (oldest)',
        dateDesc: 'Date (newest)',
        label: 'Sort by',
      },
      mediaKinds: {
        video: 'Video',
        image: 'Image',
        audio: 'Audio',
        text: 'Text',
      },
      months: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
      },
    },
  },
  project: {
    fr: {
      scientificPublications: {
        volume: 'Volume',
        pages: 'Pages',
        title: 'Publications scientifiques',
        metaDescription:
          'Explorez nos publications scientifiques et recherches académiques',
        pageDescription:
          "Cette page rassemble l'ensemble des publications scientifiques produites dans le cadre du projet PuppetPlays.",
        noPublicationsFound: 'Aucune publication trouvée',
        categories: {
          phds: 'Thèses de doctorat',
          didierPlassardsMonography: 'Monographie de Didier Plassard',
          peerReviewedPublications: 'Publications à comité de lecture',
          conferenceProceedings: 'Actes de colloque',
          cahiersElizabethains: 'Cahiers Élisabéthains',
          nonPeerReviewed: 'Publications sans comité de lecture',
        },
        conferences: {
          conference1: 'Conférence 1',
          conference2: 'Conférence 2',
          conference3: 'Conférence 3',
        },
      },
      mainNav: {
        videos: 'Vidéos',
      },
      videos: {
        exploreIntro:
          'Explorez notre collection de vidéos sur le théâtre de marionnettes',
        noCollections: 'Aucune collection',
        oneCollection: '1 collection',
        video: 'vidéo',
        video_plural: 'vidéos',
        noVideos: 'Aucune vidéo',
        oneVideoTotal: '1 vidéo au total',
        videosTotal: '{{count}} vidéos au total',
        loadingVideos: 'Chargement des vidéos...',
        metaDescription:
          'Collections de vidéos sur le théâtre de marionnettes - Projet PuppetPlays',
      },
      publication: {
        openInHal: 'Ouvrir sur HAL',
        open: 'Ouvrir',
        loadingPdf: 'Chargement du PDF en cours...',
        loadingNote: 'Le chargement peut prendre quelques secondes...',
        pdfError: 'Erreur de chargement PDF',
        pdfErrorMessage:
          "Impossible de charger le document. Veuillez essayer d'ouvrir le document directement sur HAL.",
        pdfNote: 'Document hébergé sur',
        viewerNote: 'Visualisation via',
      },
    },
    en: {
      scientificPublications: {
        volume: 'Volume',
        pages: 'Pages',
        title: 'Scientific Publications',
        metaDescription:
          'Explore our scientific publications and academic research',
        pageDescription:
          'This page brings together all the scientific publications produced as part of the PuppetPlays project.',
        noPublicationsFound: 'No publications found',
        categories: {
          phds: 'PhD Theses',
          didierPlassardsMonography: "Didier Plassard's Monography",
          peerReviewedPublications: 'Peer-reviewed Publications',
          conferenceProceedings: 'Conference Proceedings',
          cahiersElizabethains: 'Cahiers Élisabéthains',
          nonPeerReviewed: 'Non-peer-reviewed Publications',
        },
        conferences: {
          conference1: 'Conference 1',
          conference2: 'Conference 2',
          conference3: 'Conference 3',
        },
      },
      mainNav: {
        videos: 'Videos',
      },
      videos: {
        exploreIntro: 'Explore our collection of puppet theatre videos',
        noCollections: 'No collections',
        oneCollection: '1 collection',
        video: 'video',
        video_plural: 'videos',
        noVideos: 'No videos',
        oneVideoTotal: '1 video total',
        videosTotal: '{{count}} videos total',
        loadingVideos: 'Loading videos...',
        metaDescription:
          'Puppet theatre video collections - PuppetPlays Project',
      },
      publication: {
        openInHal: 'Open in HAL',
        open: 'Open',
        loadingPdf: 'Loading PDF...',
        loadingNote: 'Loading may take a few seconds...',
        pdfError: 'PDF Loading Error',
        pdfErrorMessage:
          'Unable to load document. Please try opening the document directly on HAL.',
        pdfNote: 'Document hosted on',
        viewerNote: 'Viewing via',
      },
    },
  },
};

// Appliquer les traductions
function applyTranslations() {
  console.log('=== Application des traductions manquantes ===\n');

  ['fr', 'en'].forEach(locale => {
    console.log(`--- ${locale.toUpperCase()} ---`);

    Object.keys(missingTranslations).forEach(namespace => {
      const filePath = path.join(
        __dirname,
        '../public/locales',
        locale,
        `${namespace}.json`,
      );

      if (fs.existsSync(filePath)) {
        // Charger le fichier existant
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Fusionner avec les nouvelles traductions
        const merged = deepMerge(
          existing,
          missingTranslations[namespace][locale],
        );

        // Sauvegarder
        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n');
        console.log(`  ✅ Mis à jour: ${namespace}.json`);
      } else {
        // Créer le nouveau fichier
        fs.writeFileSync(
          filePath,
          JSON.stringify(missingTranslations[namespace][locale], null, 2) +
            '\n',
        );
        console.log(`  ✅ Créé: ${namespace}.json`);
      }
    });
  });

  console.log('\n✅ Traductions appliquées avec succès!');
}

// Fusionner deux objets de manière récursive
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        if (
          typeof result[key] === 'object' &&
          result[key] !== null &&
          !Array.isArray(result[key])
        ) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
}

// Exécuter
applyTranslations();
