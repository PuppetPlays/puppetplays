#!/usr/bin/env node

/**
 * Script pour fusionner les traductions manquantes avec les fichiers existants
 * Préserve les traductions existantes et ajoute seulement les nouvelles
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MISSING_TRANSLATIONS_DIR = path.join(__dirname, 'missing-translations');
const LOCALES_DIR = path.join(__dirname, '../public/locales');
const BACKUP_DIR = path.join(__dirname, 'locales-backup');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fusionner deux objets de manière récursive
function deepMerge(target, source) {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        if (typeof result[key] === 'object' && result[key] !== null && !Array.isArray(result[key])) {
          result[key] = deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        // N'écraser que si la clé n'existe pas déjà
        if (!(key in result)) {
          result[key] = source[key];
        }
      }
    }
  }
  
  return result;
}

// Sauvegarder les fichiers existants
function backupExistingFiles() {
  log('\n=== Sauvegarde des fichiers existants ===', 'blue');
  
  // Créer le répertoire de sauvegarde avec timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, timestamp);
  fs.mkdirSync(backupPath, { recursive: true });
  
  // Copier tous les fichiers de locales
  ['fr', 'en'].forEach(locale => {
    const sourceDir = path.join(LOCALES_DIR, locale);
    const targetDir = path.join(backupPath, locale);
    
    if (fs.existsSync(sourceDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      
      const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        fs.copyFileSync(
          path.join(sourceDir, file),
          path.join(targetDir, file)
        );
      });
      
      log(`  ✅ Sauvegardé: ${locale}/ (${files.length} fichiers)`, 'green');
    }
  });
  
  log(`\nSauvegarde créée dans: ${backupPath}`, 'cyan');
  return backupPath;
}

// Fusionner les traductions
function mergeTranslations() {
  log('\n=== Fusion des traductions ===', 'blue');
  
  let totalAdded = 0;
  let totalSkipped = 0;
  
  ['fr', 'en'].forEach(locale => {
    log(`\n--- Traitement pour ${locale.toUpperCase()} ---`, 'yellow');
    
    const missingDir = path.join(MISSING_TRANSLATIONS_DIR, locale);
    const localeDir = path.join(LOCALES_DIR, locale);
    
    if (!fs.existsSync(missingDir)) {
      log(`  ⚠️  Aucune traduction manquante trouvée pour ${locale}`, 'yellow');
      return;
    }
    
    const missingFiles = fs.readdirSync(missingDir).filter(f => f.endsWith('.json'));
    
    missingFiles.forEach(file => {
      const namespace = path.basename(file, '.json');
      const missingPath = path.join(missingDir, file);
      const existingPath = path.join(localeDir, file);
      
      // Charger les traductions manquantes
      const missingTranslations = JSON.parse(fs.readFileSync(missingPath, 'utf8'));
      
      // Charger les traductions existantes ou créer un objet vide
      let existingTranslations = {};
      if (fs.existsSync(existingPath)) {
        existingTranslations = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
      }
      
      // Compter les clés avant la fusion
      const keysBefore = countKeys(existingTranslations);
      
      // Fusionner
      const merged = deepMerge(existingTranslations, missingTranslations);
      
      // Compter les clés après la fusion
      const keysAfter = countKeys(merged);
      const added = keysAfter - keysBefore;
      
      // Sauvegarder le fichier fusionné
      fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2) + '\n');
      
      totalAdded += added;
      totalSkipped += (countKeys(missingTranslations) - added);
      
      log(`  ✅ ${namespace}.json: +${added} clés ajoutées`, 'green');
    });
  });
  
  log(`\n=== Résumé ===`, 'blue');
  log(`  Total ajouté: ${totalAdded} clés`, 'green');
  log(`  Total ignoré (déjà existant): ${totalSkipped} clés`, 'yellow');
}

// Compter le nombre de clés dans un objet (récursif)
function countKeys(obj) {
  let count = 0;
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        count += countKeys(obj[key]);
      } else {
        count++;
      }
    }
  }
  
  return count;
}

// Nettoyer les fichiers temporaires
function cleanup() {
  log('\n=== Nettoyage ===', 'blue');
  
  const response = process.argv.includes('--keep-missing') ? 'n' : 'y';
  
  if (response === 'y') {
    fs.rmSync(MISSING_TRANSLATIONS_DIR, { recursive: true, force: true });
    log('  ✅ Fichiers de traductions manquantes supprimés', 'green');
  } else {
    log('  ℹ️  Fichiers de traductions manquantes conservés', 'cyan');
  }
}

// Main
async function main() {
  log('=== Fusion des traductions manquantes ===', 'blue');
  
  // Vérifier que le répertoire des traductions manquantes existe
  if (!fs.existsSync(MISSING_TRANSLATIONS_DIR)) {
    log('\n❌ Aucune traduction manquante trouvée.', 'red');
    log('Exécutez d\'abord generate-missing-translations.js', 'yellow');
    process.exit(1);
  }
  
  // Sauvegarder les fichiers existants
  const backupPath = backupExistingFiles();
  
  try {
    // Fusionner les traductions
    mergeTranslations();
    
    // Nettoyer
    cleanup();
    
    log('\n✅ Fusion terminée avec succès!', 'green');
    log(`\nPour restaurer les fichiers originaux:`, 'cyan');
    log(`  cp -r "${backupPath}"/* public/locales/`, 'cyan');
    
  } catch (error) {
    log(`\n❌ Erreur lors de la fusion: ${error.message}`, 'red');
    log('\nRestauration des fichiers originaux...', 'yellow');
    
    // Restaurer depuis la sauvegarde
    ['fr', 'en'].forEach(locale => {
      const sourceDir = path.join(backupPath, locale);
      const targetDir = path.join(LOCALES_DIR, locale);
      
      if (fs.existsSync(sourceDir)) {
        const files = fs.readdirSync(sourceDir);
        files.forEach(file => {
          fs.copyFileSync(
            path.join(sourceDir, file),
            path.join(targetDir, file)
          );
        });
      }
    });
    
    log('✅ Fichiers originaux restaurés', 'green');
    process.exit(1);
  }
}

// Exécuter
main().catch(console.error); 