#!/usr/bin/env node

/**
 * Script pour auditer les traductions
 * Compare les clés de traduction utilisées dans le code avec celles définies dans les fichiers de localisation
 */

const fs = require('fs');
const path = require('path');

const glob = require('glob');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const PAGES_DIR = path.join(__dirname, '../pages');
const COMPONENTS_DIR = path.join(__dirname, '../components');
const SUPPORTED_LOCALES = ['fr', 'en'];

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Charger toutes les traductions
function loadTranslations() {
  const translations = {};

  SUPPORTED_LOCALES.forEach(locale => {
    translations[locale] = {};
    const localeDir = path.join(LOCALES_DIR, locale);

    if (fs.existsSync(localeDir)) {
      const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));

      files.forEach(file => {
        const namespace = path.basename(file, '.json');
        const filePath = path.join(localeDir, file);
        try {
          translations[locale][namespace] = JSON.parse(
            fs.readFileSync(filePath, 'utf8'),
          );
        } catch (err) {
          log(
            `Erreur lors du chargement de ${filePath}: ${err.message}`,
            'red',
          );
        }
      });
    }
  });

  return translations;
}

// Extraire toutes les clés d'un objet de traduction (récursif)
function extractKeys(obj, prefix = '') {
  const keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys.push(...extractKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Trouver toutes les utilisations de t() dans les fichiers
function findTranslationUsages(directory) {
  const usages = new Set();
  const patterns = [
    /t\(['"`]([^'"`]+)['"`]/g, // t('key')
    /t\(\s*['"`]([^'"`]+)['"`]/g, // t( 'key' )
    /\{t\(['"`]([^'"`]+)['"`]\}/g, // {t('key')}
    /\{\s*t\(['"`]([^'"`]+)['"`]\s*\}/g, // { t('key') }
  ];

  const files = glob.sync(`${directory}/**/*.{js,jsx,ts,tsx}`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  });

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        usages.add(match[1]);
      }
    });
  });

  return Array.from(usages);
}

// Analyser les différences
function analyzeTranslations() {
  log('\n=== Audit des traductions Puppetplays ===\n', 'blue');

  // Charger les traductions
  log('Chargement des fichiers de traduction...', 'cyan');
  const translations = loadTranslations();

  // Extraire toutes les clés définies
  const definedKeys = {};
  SUPPORTED_LOCALES.forEach(locale => {
    definedKeys[locale] = {};
    for (const namespace in translations[locale]) {
      const keys = extractKeys(translations[locale][namespace]);
      definedKeys[locale][namespace] = keys.map(k => `${namespace}.${k}`);
    }
  });

  // Trouver toutes les utilisations
  log('Recherche des utilisations de traduction dans le code...', 'cyan');
  const usedKeysInPages = findTranslationUsages(PAGES_DIR);
  const usedKeysInComponents = findTranslationUsages(COMPONENTS_DIR);
  const allUsedKeys = [
    ...new Set([...usedKeysInPages, ...usedKeysInComponents]),
  ];

  log(
    `\nTrouvé ${allUsedKeys.length} clés de traduction utilisées dans le code\n`,
    'green',
  );

  // Analyser les clés manquantes par locale
  const missingKeys = {};
  const unusedKeys = {};

  SUPPORTED_LOCALES.forEach(locale => {
    log(`\n--- Analyse pour ${locale.toUpperCase()} ---`, 'yellow');

    missingKeys[locale] = [];
    unusedKeys[locale] = [];

    // Toutes les clés définies pour cette locale
    const allDefinedKeys = [];
    for (const namespace in definedKeys[locale]) {
      allDefinedKeys.push(...definedKeys[locale][namespace]);
    }

    // Vérifier les clés utilisées mais non définies
    allUsedKeys.forEach(key => {
      if (!allDefinedKeys.includes(key)) {
        // Vérifier aussi sans le namespace (pour les imports directs)
        const keyParts = key.split('.');
        const namespace = keyParts[0];
        const subKey = keyParts.slice(1).join('.');

        let found = false;
        if (translations[locale][namespace]) {
          const namespaceKeys = extractKeys(translations[locale][namespace]);
          if (namespaceKeys.includes(subKey)) {
            found = true;
          }
        }

        if (!found) {
          missingKeys[locale].push(key);
        }
      }
    });

    // Vérifier les clés définies mais non utilisées
    allDefinedKeys.forEach(key => {
      if (!allUsedKeys.includes(key)) {
        unusedKeys[locale].push(key);
      }
    });

    // Afficher les résultats
    if (missingKeys[locale].length > 0) {
      log(`\n  ❌ Clés manquantes (${missingKeys[locale].length}):`, 'red');
      missingKeys[locale].forEach(key => {
        log(`     - ${key}`, 'red');
      });
    } else {
      log('\n  ✅ Aucune clé manquante', 'green');
    }

    if (unusedKeys[locale].length > 0) {
      log(
        `\n  ⚠️  Clés non utilisées (${unusedKeys[locale].length}):`,
        'yellow',
      );
      // Limiter l'affichage à 10 clés
      const displayKeys = unusedKeys[locale].slice(0, 10);
      displayKeys.forEach(key => {
        log(`     - ${key}`, 'yellow');
      });
      if (unusedKeys[locale].length > 10) {
        log(`     ... et ${unusedKeys[locale].length - 10} autres`, 'yellow');
      }
    }
  });

  // Vérifier la cohérence entre les locales
  log('\n\n--- Cohérence entre les locales ---', 'magenta');

  const frKeys = new Set();
  const enKeys = new Set();

  for (const namespace in definedKeys.fr) {
    definedKeys.fr[namespace].forEach(key => frKeys.add(key));
  }

  for (const namespace in definedKeys.en) {
    definedKeys.en[namespace].forEach(key => enKeys.add(key));
  }

  const onlyInFr = [...frKeys].filter(key => !enKeys.has(key));
  const onlyInEn = [...enKeys].filter(key => !frKeys.has(key));

  if (onlyInFr.length > 0) {
    log(
      `\n  ⚠️  Clés présentes uniquement en FR (${onlyInFr.length}):`,
      'yellow',
    );
    onlyInFr.slice(0, 10).forEach(key => {
      log(`     - ${key}`, 'yellow');
    });
    if (onlyInFr.length > 10) {
      log(`     ... et ${onlyInFr.length - 10} autres`, 'yellow');
    }
  }

  if (onlyInEn.length > 0) {
    log(
      `\n  ⚠️  Clés présentes uniquement en EN (${onlyInEn.length}):`,
      'yellow',
    );
    onlyInEn.slice(0, 10).forEach(key => {
      log(`     - ${key}`, 'yellow');
    });
    if (onlyInEn.length > 10) {
      log(`     ... et ${onlyInEn.length - 10} autres`, 'yellow');
    }
  }

  if (onlyInFr.length === 0 && onlyInEn.length === 0) {
    log('\n  ✅ Les clés sont cohérentes entre FR et EN', 'green');
  }

  // Générer un rapport
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalUsedKeys: allUsedKeys.length,
      totalDefinedKeysFr: frKeys.size,
      totalDefinedKeysEn: enKeys.size,
    },
    missingKeys,
    unusedKeys: {
      fr: unusedKeys.fr.length,
      en: unusedKeys.en.length,
    },
    inconsistencies: {
      onlyInFr: onlyInFr.length,
      onlyInEn: onlyInEn.length,
    },
  };

  const reportPath = path.join(
    __dirname,
    `translation-audit-${Date.now()}.json`,
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  log(`\n\n✅ Rapport d'audit sauvegardé: ${reportPath}`, 'green');
  log("\n=== Fin de l'audit ===\n", 'blue');
}

// Vérifier si glob est installé
try {
  require.resolve('glob');
  analyzeTranslations();
} catch (err) {
  log('Le module "glob" n\'est pas installé. Installation...', 'yellow');
  log('Exécutez: npm install glob', 'cyan');
  process.exit(1);
}
