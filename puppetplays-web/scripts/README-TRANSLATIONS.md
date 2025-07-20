# Guide de vérification et correction des traductions

Ce répertoire contient plusieurs scripts pour vérifier et corriger les traductions manquantes dans le projet PuppetPlays.

## Scripts disponibles

### 1. `audit-translations.js`
Analyse le code source pour trouver toutes les utilisations de `t()` et les compare avec les fichiers de traduction définis.

```bash
node scripts/audit-translations.js
```

**Sortie :** 
- Liste des clés manquantes par langue
- Liste des clés non utilisées
- Rapport JSON détaillé

### 2. `generate-missing-translations.js`
Génère des fichiers JSON avec les traductions manquantes, en filtrant les faux positifs.

```bash
node scripts/generate-missing-translations.js
```

**Sortie :** Fichiers dans `scripts/missing-translations/[locale]/`

### 3. `merge-translations.js`
Fusionne les traductions générées avec les fichiers existants (avec sauvegarde).

```bash
node scripts/merge-translations.js
# ou pour garder les fichiers temporaires :
node scripts/merge-translations.js --keep-missing
```

### 4. `fix-missing-translations.js`
Script de correction rapide pour ajouter les traductions principales manquantes.

```bash
node scripts/fix-missing-translations.js
```

### 5. `check-translations.sh`
Teste toutes les pages en production pour détecter les traductions manquantes.

```bash
./scripts/check-translations.sh
```

**Sortie :**
- Logs individuels par page dans `translation-check-logs/`
- Rapport résumé `translation-report-*.txt`

### 6. `test-translations-production.sh`
Teste quelques pages en local pour vérifier rapidement les traductions.

```bash
./scripts/test-translations-production.sh
```

### 7. `full-translation-check.sh`
Script principal qui combine l'audit du code et les tests de production.

```bash
./scripts/full-translation-check.sh
```

### 8. `verify-namespace-config.js`
Vérifie que tous les namespaces sont correctement configurés dans `next-i18next.config.js`.

```bash
node scripts/verify-namespace-config.js
```

## Configuration des namespaces

### ⚠️ Important : Configuration next-i18next

Pour que les traductions fonctionnent, **tous les namespaces** doivent être déclarés dans `next-i18next.config.js` :

```javascript
// next-i18next.config.js
ns: [
  'common',
  'home',
  'project',
  'team',
  'accessibility',
  'anthology',
  'privacy',
  'educationalResources',
  'error',
  'exploreBy',
  'presentation',
  'videoDetail',
],
```

Si vous ajoutez un nouveau fichier de traduction, vous devez :
1. Créer le fichier dans `public/locales/[locale]/[namespace].json`
2. Ajouter le namespace dans la configuration `ns: []`
3. Redémarrer le serveur de développement

## Processus complet de vérification

1. **Audit initial**
   ```bash
   node scripts/audit-translations.js
   ```

2. **Génération des traductions manquantes**
   ```bash
   node scripts/generate-missing-translations.js
   ```

3. **Vérification et ajustement des traductions**
   - Examinez les fichiers dans `missing-translations/`
   - Ajustez les traductions si nécessaire

4. **Fusion avec les fichiers existants**
   ```bash
   node scripts/merge-translations.js
   ```

5. **Vérification de la configuration**
   ```bash
   node scripts/verify-namespace-config.js
   ```

6. **Vérification finale**
   ```bash
   node scripts/audit-translations.js
   ```

## Structure des traductions

Les traductions utilisent le format namespace:key.subkey :

```javascript
// Dans le code :
t('common:animationTechniques')
t('project:scientificPublications.title')

// Dans les fichiers JSON :
// public/locales/fr/common.json
{
  "animationTechniques": "Techniques d'animation"
}

// public/locales/fr/project.json
{
  "scientificPublications": {
    "title": "Publications scientifiques"
  }
}
```

## Clés manquantes fréquentes

Les traductions suivantes sont souvent manquantes :

- `common:animationTechniques`
- `common:error.*`
- `common:filters.*`
- `project:scientificPublications.*`
- `home:*` (pour la page d'accueil)

## Dépannage

### Les traductions ne s'appliquent pas
1. Vérifiez que le namespace est correct
2. Assurez-vous que la structure JSON correspond à la clé utilisée
3. **Vérifiez que le namespace est déclaré dans `next-i18next.config.js`**
4. Redémarrez le serveur de développement

### Faux positifs dans l'audit
Le script filtre déjà :
- Les tests (`renders...`, `calls...`)
- Les chemins de fichiers
- Les template literals
- Les noms propres

Si d'autres faux positifs apparaissent, ajustez `ignorePatterns` dans `generate-missing-translations.js`.

## Restauration

Si vous devez restaurer les fichiers originaux après une fusion :

```bash
# Les sauvegardes sont dans scripts/locales-backup/
cp -r scripts/locales-backup/[timestamp]/* public/locales/
``` 