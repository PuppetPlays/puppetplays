# Hooks personnalisés PuppetPlays

Cette documentation décrit les hooks personnalisés créés pour améliorer la qualité du code et centraliser les fonctionnalités communes.

## 🎣 useHalMetadata

Hook pour récupérer automatiquement les métadonnées d'un document HAL via l'API officielle.

### Utilisation

```javascript
import useHalMetadata from 'hooks/useHalMetadata';

const MyComponent = ({ halUrl }) => {
  const {
    metadata,
    isLoading,
    error,
    isSuccess,
    hasMetadata,
    displayData,
    fetchMetadata,
    refetchMetadata,
    reset
  } = useHalMetadata(halUrl, {
    autoFetch: true,
    retryCount: 2,
    timeout: 10000
  });

  if (isLoading) return <div>Chargement des métadonnées...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {displayData && (
        <>
          <h3>{displayData.title}</h3>
          <p>Auteurs: {displayData.authors}</p>
          <p>Année: {displayData.year}</p>
        </>
      )}
    </div>
  );
};
```

### Options

| Option | Type | Défaut | Description |
|--------|------|--------|--------------|
| `autoFetch` | boolean | `true` | Récupération automatique au montage |
| `retryCount` | number | `2` | Nombre de tentatives en cas d'échec |
| `retryDelay` | number | `1000` | Délai entre les tentatives (ms) |
| `timeout` | number | `10000` | Timeout des requêtes (ms) |

### Retour

| Propriété | Type | Description |
|-----------|------|-------------|
| `metadata` | object|null | Métadonnées brutes HAL |
| `isLoading` | boolean | État de chargement |
| `error` | string|null | Message d'erreur |
| `isSuccess` | boolean | Indique si la récupération a réussi |
| `hasMetadata` | boolean | Indique si des métadonnées sont disponibles |
| `displayData` | object|null | Métadonnées formatées pour l'affichage |
| `fetchMetadata` | function | Fonction pour récupérer les métadonnées |
| `refetchMetadata` | function | Fonction pour forcer une nouvelle récupération |
| `reset` | function | Fonction pour réinitialiser l'état |
| `halId` | string|null | Identifiant HAL extrait |

### Métadonnées disponibles

Le hook récupère les métadonnées suivantes depuis l'API HAL :

- **Titre** (`title`)
- **Auteurs** (`authors`, `authorsString`)
- **Date de soumission** (`submittedDate`, `year`)
- **Revue/Journal** (`journal`)
- **DOI** (`doi`)
- **Résumé** (`abstract`)
- **Mots-clés** (`keywords`, `keywordsString`)
- **Langue** (`language`)
- **Type de document** (`docType`)

## 🛡️ useErrorHandler

Hook pour centraliser la gestion d'erreurs avec classification automatique et retry intelligent.

### Utilisation

```javascript
import useErrorHandler, { ERROR_TYPES } from 'hooks/useErrorHandler';

const MyComponent = () => {
  const {
    hasError,
    error,
    displayError,
    handleError,
    clearError,
    retryWithDelay,
    withErrorHandling,
    isRetryable
  } = useErrorHandler({
    maxRetries: 3,
    retryDelay: 1000
  });

  const fetchData = withErrorHandling(async () => {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }, 'Data fetching');

  const handleRetry = () => {
    retryWithDelay(() => fetchData());
  };

  return (
    <div>
      {hasError && (
        <div className="error">
          <p>{displayError.message}</p>
          {isRetryable && (
            <button onClick={handleRetry}>
              Réessayer ({displayError.retryCount}/{displayError.maxRetries})
            </button>
          )}
        </div>
      )}
    </div>
  );
};
```

### Types d'erreurs

Le hook classifie automatiquement les erreurs :

| Type | Description | Retriable |
|------|-------------|-----------|
| `NETWORK` | Erreurs de réseau | ✅ |
| `API` | Erreurs serveur (5xx) | ✅ |
| `TIMEOUT` | Délais d'attente | ✅ |
| `HAL_METADATA` | Erreurs spécifiques HAL | ✅ |
| `VALIDATION` | Erreurs de validation (4xx) | ❌ |
| `PERMISSION` | Erreurs d'autorisation | ❌ |
| `PDF_LOAD` | Erreurs de chargement PDF | ❌ |
| `UNKNOWN` | Erreurs non classifiées | ❌ |

### Options

| Option | Type | Défaut | Description |
|--------|------|--------|--------------|
| `logErrors` | boolean | `true` | Journalisation des erreurs |
| `maxRetries` | number | `3` | Nombre maximum de tentatives |
| `retryDelay` | number | `1000` | Délai entre les tentatives (ms) |

## 🏗️ Architecture des composants

### PDFViewer refactorisé

Le composant `PDFViewer` a été complètement refactorisé pour utiliser les nouveaux hooks :

```javascript
import PDFViewer from 'components/PDF/PDFViewer';

<PDFViewer 
  halUrl="https://hal.science/hal-12345/document"
  title="Mon document"
  showHalMetadata={true}
  enableMetadataFallback={true}
  showControls={true}
  showDownloadButton={true}
/>
```

### Nouvelles props

| Prop | Type | Défaut | Description |
|------|------|--------|--------------|
| `showHalMetadata` | boolean | `false` | Afficher les métadonnées HAL enrichies |
| `enableMetadataFallback` | boolean | `true` | Utiliser les métadonnées HAL comme fallback pour le titre |

### Composants internes

Le PDFViewer est maintenant composé de sous-composants réutilisables :

- **`PDFActions`** - Boutons d'action (téléchargement, HAL)
- **`LoadingState`** - État de chargement avec spinner
- **`ErrorState`** - Gestion des erreurs avec retry
- **`NoDocumentState`** - État "aucun document"
- **`HalMetadataDisplay`** - Affichage des métadonnées enrichies

## 🎨 Améliorations UX

### Gestion d'erreurs améliorée

- Classification automatique des erreurs
- Messages d'erreur localisés
- Boutons de retry intelligents
- Fallbacks gracieux

### Accessibilité

- Attributs ARIA appropriés
- États de chargement annoncés aux lecteurs d'écran
- Navigation clavier complète
- Couleurs et contrastes respectant les standards

### Performance

- Mémorisation avec `useMemo` et `useCallback`
- Composants optimisés avec `memo`
- Chargement paresseux des iframes
- Gestion intelligente des requêtes

## 🔧 Développement

### Tests recommandés

Pour tester les nouveaux hooks :

```bash
# Test avec une URL HAL réelle
yarn dev
# Naviguer vers /publications-scientifiques/[id]/[slug]

# Test avec une URL HAL invalide
# Observer la gestion d'erreurs

# Test des métadonnées HAL
# Utiliser showHalMetadata={true}
```

### Bonnes pratiques

1. **Toujours** utiliser `useErrorHandler` pour les opérations async
2. **Préférer** `useHalMetadata` pour enrichir les données CraftCMS
3. **Éviter** les appels directs à l'API HAL dans les composants
4. **Utiliser** les traductions pour tous les messages utilisateur
5. **Tester** avec de vraies URLs HAL et des cas d'erreur

## 📚 Références

- [API HAL Documentation](https://api.archives-ouvertes.fr/docs/search)
- [React Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Error Handling Patterns](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react) 