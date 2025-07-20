#!/usr/bin/env node

/**
 * Script pour vérifier que tous les namespaces utilisés sont déclarés dans next-i18next.config.js
 */

const fs = require('fs');
const path = require('path');

// Charger la configuration next-i18next
const i18nConfig = require('../next-i18next.config.js');

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

// Vérifier la configuration
log('\n=== Vérification de la configuration des namespaces ===\n', 'blue');

// 1. Vérifier que tous les namespaces déclarés ont des fichiers correspondants
log('1. Vérification des fichiers de traduction pour chaque namespace déclaré:', 'cyan');

const declaredNamespaces = i18nConfig.ns;
const locales = i18nConfig.i18n.locales;
let missingFiles = [];

declaredNamespaces.forEach(namespace => {
  log(`\n  Namespace: ${namespace}`, 'yellow');
  
  locales.forEach(locale => {
    const filePath = path.join(__dirname, '../public/locales', locale, `${namespace}.json`);
    
    if (fs.existsSync(filePath)) {
      log(`    ✅ ${locale}/${namespace}.json`, 'green');
    } else {
      log(`    ❌ ${locale}/${namespace}.json - MANQUANT`, 'red');
      missingFiles.push(`${locale}/${namespace}.json`);
    }
  });
});

// 2. Vérifier s'il y a des fichiers de traduction non déclarés
log('\n\n2. Vérification des fichiers non déclarés dans la configuration:', 'cyan');

let undeclaredFiles = [];

locales.forEach(locale => {
  const localeDir = path.join(__dirname, '../public/locales', locale);
  
  if (fs.existsSync(localeDir)) {
    const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
      const namespace = path.basename(file, '.json');
      
      if (!declaredNamespaces.includes(namespace)) {
        log(`  ⚠️  ${locale}/${file} - Non déclaré dans ns[]`, 'yellow');
        undeclaredFiles.push(`${locale}/${file}`);
      }
    });
  }
});

if (undeclaredFiles.length === 0) {
  log('  ✅ Tous les fichiers sont déclarés', 'green');
}

// 3. Résumé
log('\n\n=== Résumé ===', 'blue');
log(`Namespaces déclarés: ${declaredNamespaces.length}`, 'cyan');
log(`Locales configurées: ${locales.join(', ')}`, 'cyan');

if (missingFiles.length > 0) {
  log(`\n❌ Fichiers manquants: ${missingFiles.length}`, 'red');
  missingFiles.forEach(file => log(`  - ${file}`, 'red'));
} else {
  log('\n✅ Tous les fichiers de traduction existent', 'green');
}

if (undeclaredFiles.length > 0) {
  log(`\n⚠️  Fichiers non déclarés: ${undeclaredFiles.length}`, 'yellow');
  log('Ajoutez ces namespaces dans next-i18next.config.js:', 'yellow');
  const uniqueNamespaces = [...new Set(undeclaredFiles.map(f => {
    const parts = f.split('/');
    return parts[1].replace('.json', '');
  }))];
  uniqueNamespaces.forEach(ns => log(`  - '${ns}',`, 'yellow'));
}

// 4. Vérifier les namespaces utilisés dans le code
log('\n\n3. Namespaces utilisés dans le code:', 'cyan');

const usedNamespaces = new Set();

// Patterns pour détecter l'utilisation de namespaces
const patterns = [
  /t\(['"`]([a-zA-Z]+):/g,  // t('namespace:key')
  /useTranslation\(['"`]([a-zA-Z]+)['"`]\)/g,  // useTranslation('namespace')
];

// Parcourir les fichiers JS/JSX
const findFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
      findFiles(filePath, fileList);
    } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
};

const sourceFiles = [
  ...findFiles(path.join(__dirname, '../pages')),
  ...findFiles(path.join(__dirname, '../components')),
];

sourceFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      usedNamespaces.add(match[1]);
    }
  });
});

const usedNamespacesList = Array.from(usedNamespaces).sort();
log(`\nNamespaces utilisés dans le code: ${usedNamespacesList.length}`, 'cyan');
usedNamespacesList.forEach(ns => {
  if (declaredNamespaces.includes(ns)) {
    log(`  ✅ ${ns}`, 'green');
  } else {
    log(`  ❌ ${ns} - Non déclaré dans la configuration`, 'red');
  }
});

log('\n✅ Vérification terminée!\n', 'blue'); 