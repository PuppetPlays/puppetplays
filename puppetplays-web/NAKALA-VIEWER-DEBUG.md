# Debug du Viewer IIIF Nakala

## Problème initial
Les boutons "Page précédente" et "Page suivante" ne fonctionnaient pas pour naviguer entre les pages des documents Nakala.

## Investigation

### 1. Structure des documents Nakala
Après investigation avec l'exemple DOI `10.34847/nkl.1ae55hwt/9a04cd87bc84ab64cea7dde017e9b85e706725c3`, nous avons découvert deux cas possibles :

#### Cas 1 : Document multi-fichiers (RÉSOLU)
- Les pages sont stockées comme fichiers séparés (ex: 19_F_BELFORT-DEVAUX_FoireDeStCloud_FR_AN_01.jpg, _02.jpg, etc.)
- Chaque fichier a son propre SHA1
- La navigation est possible en changeant l'URL du viewer pour pointer vers le bon fichier

#### Cas 2 : Document mono-fichier
- Toutes les pages sont assemblées dans une seule grande image composite
- Navigation uniquement par zoom et déplacement dans l'image

### 2. API IIIF de Nakala
Tests effectués sur l'API :

```
✓ https://api.nakala.fr/iiif/10.34847/nkl.1ae55hwt/9a04cd87bc84ab64cea7dde017e9b85e706725c3/info.json
✓ https://api.nakala.fr/iiif/10.34847/nkl.1ae55hwt/9a04cd87bc84ab64cea7dde017e9b85e706725c3/full/full/0/default.jpg
✗ Pas de manifest IIIF disponible
✗ Pas de structure de navigation par pages
```

### 3. Viewer embarqué Nakala
Le viewer embarqué de Nakala (`https://api.nakala.fr/embed/...`) :
- N'accepte pas de paramètres de navigation par page
- Utilise un viewer IIIF personnalisé avec zoom et pan
- Ne supporte pas les méthodes standard IIIF de navigation (cv, canvas, etc.)

## Solution implémentée

### 1. Détection automatique du type de document
```javascript
// Récupération de tous les fichiers images depuis Nakala
const imageFiles = anthologyData.nakalaData.files
  .filter(file => file.mime_type && file.mime_type.startsWith('image/'))
  .sort((a, b) => a.name.localeCompare(b.name));

if (imageFiles.length > 1) {
  // Document multi-fichiers : navigation possible
  setTotalPages(imageFiles.length);
  setImageUrls(imageFiles);
} else {
  // Document mono-fichier : pas de navigation
  setTotalPages(1);
}
```

### 2. Navigation entre les fichiers
```javascript
// Changement de page = changement de fichier
const currentFile = imageUrls[currentPage - 1];
const pageUrl = getNakalaEmbedUrl(
  anthologyData.nakalaIdentifier,
  currentFile.sha1,  // SHA1 du fichier spécifique
  { buttons: true }
);
setNakalaViewerUrl(pageUrl);
```

### 3. Interface utilisateur adaptative
- Les boutons de navigation s'affichent automatiquement pour les documents multi-fichiers
- Ils restent cachés pour les documents mono-fichier
- Le viewer Nakala est utilisé dans tous les cas

## Solutions alternatives envisagées (non implémentées)

### Option 1 : Viewer OpenSeadragon personnalisé
Créer notre propre viewer avec OpenSeadragon qui :
- Charge l'image complète via l'API IIIF
- Définit des régions pour chaque "page"
- Permet une navigation par régions

### Option 2 : Découpage automatique
- Analyser les dimensions de l'image
- Découper virtuellement en pages basées sur des ratios standards
- Créer une navigation artificielle

### Option 3 : Métadonnées externes
- Stocker les coordonnées de chaque page dans notre base
- Utiliser ces coordonnées pour naviguer via l'API IIIF

## Recommandations

1. **Court terme** : ✅ FAIT - Navigation fonctionnelle pour les documents multi-fichiers
2. **Moyen terme** : Pour les documents mono-fichier, envisager un viewer OpenSeadragon avec régions prédéfinies
3. **Long terme** : Collaborer avec Nakala pour une API de navigation standardisée

## Ressources utiles

- API IIIF Image de Nakala : `https://api.nakala.fr/iiif/{identifier}/{file}/info.json`
- Viewer embarqué : `https://api.nakala.fr/embed/{identifier}/{file}?buttons=true`
- Documentation IIIF : https://iiif.io/api/presentation/3.0/ 