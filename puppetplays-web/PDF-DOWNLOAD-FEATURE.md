# Fonctionnalité de téléchargement PDF des transcriptions

## Description
Une nouvelle fonctionnalité a été ajoutée pour permettre aux utilisateurs de télécharger les transcriptions des manuscrits numérisés au format PDF directement depuis la page d'anthologie.

## Composants ajoutés

### 1. `TranscriptionPDFDownload.js`
- **Emplacement** : `components/TranscriptionPDFDownload.js`
- **Fonction** : Génère et télécharge un PDF de la transcription
- **Caractéristiques** :
  - Génération côté client (pas de serveur requis)
  - Support pour télécharger la page courante ou toute la transcription
  - Formatage adapté au contenu théâtral (dialogues, didascalies, etc.)
  - Indicateur de chargement pendant la génération

### 2. Styles
- **Fichier** : `components/TranscriptionPDFDownload.module.scss`
- **Design** : Bouton bleu avec icône de téléchargement, responsive

## Intégration

### Page Anthologie (`pages/anthologie/[slug].js`)
Le bouton de téléchargement PDF est maintenant affiché dans l'en-tête de la section transcription, à côté du titre.

```jsx
<TranscriptionPDFDownload
  transcriptionPages={transcriptionPages}
  title={anthologyData.title}
  anthologyTitle={anthologyData.title}
  currentPage={currentTranscriptionPage}
/>
```

## Dépendances installées

```json
{
  "jspdf": "^2.x.x",
  "html2canvas": "^1.x.x"
}
```

## Fonctionnalités du PDF généré

### Format
- **Page** : A4 portrait
- **Marges** : 20mm gauche/droite, 25mm haut, 20mm bas
- **Police** : Standard PDF (Helvetica)

### Contenu structuré
- **Titre principal** : Nom de l'anthologie
- **Numérotation** : Pages numérotées (ex: "Page 5")
- **Pagination** : X/Y en bas de chaque page PDF

### Styles de texte
- **Auteur** : Gras, 14pt
- **Titre** : Gras, 16pt
- **Sous-titre** : Italique, 13pt
- **Personnages** : Gras, 12pt
- **Dialogues** : Normal, 11pt
- **Didascalies** : Italique, 10pt
- **Scènes** : Gras, 13pt

## Traductions

### Français
- "Télécharger en PDF"
- "Télécharger la page actuelle en PDF"
- "Génération du PDF..."
- "Erreur lors de la génération du PDF. Veuillez réessayer."

### Anglais
- "Download as PDF"
- "Download current page as PDF"
- "Generating PDF..."
- "Error generating PDF. Please try again."

## Utilisation

1. **Naviguer vers une anthologie** : `/anthologie/[slug]`
2. **Localiser le bouton** : En haut de la section "Transcription"
3. **Cliquer pour télécharger** :
   - Le PDF est généré côté client
   - Un indicateur de chargement apparaît
   - Le fichier est automatiquement téléchargé

## Nom du fichier généré
Format : `{titre_anthologie}_transcription.pdf`
- Les caractères spéciaux sont remplacés par des underscores
- Exemple : `La_Fee_aux_roses_transcription.pdf`

## Limitations actuelles

1. **Taille** : Les très longues transcriptions peuvent prendre du temps à générer
2. **Images** : Les images intégrées ne sont pas supportées
3. **Formatage complexe** : Certains formatages TEI complexes sont simplifiés

## Améliorations futures possibles

1. **Options d'export** :
   - Choix du format de page (A4, Letter, etc.)
   - Options de mise en page (marges, police)
   - Export de pages sélectionnées

2. **Performance** :
   - Génération en arrière-plan avec Web Workers
   - Mise en cache des PDFs générés

3. **Contenu enrichi** :
   - Table des matières cliquable
   - Métadonnées du document
   - Filigrane ou logo

## Dépannage

### Le bouton n'apparaît pas
- Vérifier que `transcriptionPages` contient des données
- Vérifier les imports dans le composant parent

### Erreur de génération
- Vérifier la console pour les erreurs JavaScript
- S'assurer que les dépendances sont installées
- Vérifier la structure des données de transcription

### PDF vide ou mal formaté
- Vérifier le format des données dans `transcriptionPages`
- S'assurer que le contenu suit la structure attendue

## Tests recommandés

1. **Test de base** : Télécharger une transcription simple
2. **Test de volume** : Télécharger une transcription longue (50+ pages)
3. **Test multilingue** : Vérifier les traductions FR/EN
4. **Test responsive** : Vérifier l'affichage mobile
5. **Test de contenu** : Vérifier différents types de contenu (dialogues, didascalies, etc.)
