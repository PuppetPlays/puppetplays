# API Documentation

Ce document présente l'architecture API du projet PuppetPlays, incluant le schéma GraphQL, les endpoints disponibles et les champs CMS utilisés par le frontend.

## Table des matières

- [Architecture générale](#architecture-générale)
- [Schéma GraphQL](#schéma-graphql)
- [Endpoints API](#endpoints-api)
- [Types de contenu et champs CMS](#types-de-contenu-et-champs-cms)
- [Relations entre types de contenu](#relations-entre-types-de-contenu)
- [Exemples de requêtes](#exemples-de-requêtes)
- [Gestion des erreurs](#gestion-des-erreurs)

## Architecture générale

Le projet PuppetPlays utilise deux types d'API pour communiquer entre le backend (Craft CMS) et le frontend (Next.js) :

1. **API GraphQL** : Interface principale pour les requêtes complexes et les filtres
2. **Element API** : Endpoints REST pour certaines fonctionnalités spécifiques

Toutes les communications API se font via HTTPS. L'URL de base de l'API GraphQL est configurée dans la variable d'environnement `NEXT_PUBLIC_API_URL`.

## Schéma GraphQL

### Configuration

Le schéma GraphQL est défini dans `puppetplays-admin/config/project/graphql/schemas/b203ce66-4f2e-4fab-a0be-e3b6d42f7e41.yaml` et expose les sections et types d'entrées suivants :

```yaml
isPublic: true
name: 'Public Schema'
scope:
  - 'elements.drafts:read'
  - 'elements.revisions:read'
  - 'elements.inactive:read'
  - 'sections.bfac270e-899c-4fde-90e4-d4fbb11f05ea:read' # Accueil
  - 'entrytypes.db53251e-e713-455c-a15e-37016be4971f:read' # Accueil
  - 'sections.22b828fc-b5e2-42a0-9050-446047f73230:read' # Formats
  - 'entrytypes.8c8213c1-75f5-4c1c-bc23-96b213711e06:read' # Formats
  - 'sections.492cc09a-052e-40d6-a33b-7ca74a831805:read' # Institutions de conservation
  - 'entrytypes.e9587719-a8d4-42d6-97c2-f0259ec67922:read' # Institutions de conservation
  - 'sections.ec7faa37-6b19-44d2-95ec-2b752648c37d:read' # Langues
  - 'entrytypes.2cbf68ec-55ec-4aee-bf2d-b255cad39232:read' # Langues
  - 'sections.6591dcc5-c98b-41db-91e2-1b3dcd8eb31b:read' # Lieux
  - 'entrytypes.92ef2670-a9bc-47e7-9d07-dfdbee32a0b2:read' # Lieux
  - 'sections.53b06a2d-abbf-4ee4-b770-ca48f26e094e:read' # Nom du personnage dans le texte
  - 'entrytypes.67544b27-a5f2-4753-acf4-8a396c6d000e:read' # Personnages originaux
  - 'sections.bfd49b21-b009-43f4-bb18-fcb1b08f5bd5:read' # Nom du personnage pour l'indexation
  - 'entrytypes.33cd919f-b3f5-4276-be62-d114dbab9934:read' # Personnages
  - 'sections.374cfc9a-f44d-4173-9b1a-08ee58b72e0c:read' # Parcours découverte
  - 'entrytypes.8bb29c67-1705-4166-95be-10680e4e36a9:read' # Par défaut
  - 'sections.e205ebe8-5557-4b7c-a43f-9cf548e90c8d:read' # Pays
  - 'entrytypes.bd5e6b34-8b0b-4a47-93f3-f9a23c0a39aa:read' # Pays
  - 'sections.63ea829e-b0e4-4021-8ab5-1b0f095d3daf:read' # Personnes
  - 'entrytypes.8e095ccd-7ed1-4c9b-99e1-b98480a0e9df:read' # Compagnies
  - 'entrytypes.e0954bb8-d8bb-4fbb-b5e7-944b482e521e:read' # Personnes
  - 'sections.ccd48638-f531-4032-a057-8af4f24cd187:read' # Procédés théâtraux
  - 'entrytypes.5e83af75-a401-46c6-918f-f56ab78ad797:read' # Procédés théâtraux
  - 'sections.9cac54fd-67ff-4311-a127-785048ff9146:read' # Publics
  - 'entrytypes.fa8f9cfe-9074-40b9-b300-5a58cd4ff61c:read' # Publics
  - 'sections.8e72b0db-f5f6-4385-9228-33dd62285d5c:read' # Registres littéraires
  - 'entrytypes.19568c88-e81b-48e1-bab2-ba7f106a823f:read' # Registres
  - 'sections.1817d1f9-6682-4c22-b338-19654ae0c45c:read' # Techniques d'animation
  - 'entrytypes.48898581-e621-4ea2-bcf6-3c65ac54487f:read' # Techniques d'animation
  - 'sections.29f1cf63-9c38-484a-9026-94010557c5af:read' # Œuvres
  - 'entrytypes.09da97ae-fc6f-4555-ade3-73e42fd9bf6a:read' # Œuvres
  - 'sections.e2d5c38e-3607-4630-bddf-0875190aa133:read' # Œuvres corrélées
  - 'entrytypes.e4e23bc0-a6bd-4075-943f-4607a5fac9be:read' # Œuvres corrélées
  - 'volumes.ef2dfdac-243c-4f75-8385-ee787d2e7765:read' # Images
  - 'volumes.48645943-e026-4046-ae42-c8efbe3d0b1c:read' # Videos
  - 'volumes.37720b4b-f4c6-42b4-8400-af5f71b3e072:read' # Sounds
  - 'usergroups.everyone:read'
  - 'taggroups.18acc84f-5d36-4e13-8a6b-deff0a3d529b:read' # Mots-clé des œuvres
```

### Types GraphQL principaux

#### Query

Le type `Query` est le point d'entrée principal de l'API GraphQL et expose les méthodes suivantes :

- `entries(section: [String], site: [String], ...)` : Récupère des entrées avec filtrage
- `entry(id: ID, uid: String)` : Récupère une entrée spécifique
- `entryCount(section: [String], ...)` : Compte le nombre d'entrées avec filtrage

#### Entry

Le type `Entry` est l'interface commune pour tous les types d'entrées et contient les champs suivants :

- `id: ID!` : Identifiant unique de l'entrée
- `title: String` : Titre de l'entrée
- `slug: String` : Slug URL de l'entrée
- `site: [SiteInterface]` : Site(s) associé(s) à l'entrée
- `sectionId: Int` : ID de la section
- `typeId: Int` : ID du type d'entrée
- `... autres champs communs`

## Endpoints API

### GraphQL

**Endpoint principal** : `/graphql`

Cet endpoint accepte des requêtes POST avec un corps JSON au format standard GraphQL :

```json
{
  "query": "...",
  "variables": { ... },
  "operationName": "..."
}
```

### Element API

L'Element API expose des endpoints REST pour certaines fonctionnalités, définis dans `puppetplays-admin/config/element-api.php` :

#### GET /works

Récupère une liste d'œuvres avec les champs suivants :
- `title` : Titre de l'œuvre
- `abstract` : Résumé
- `doi` : Identifiant DOI
- `startWritingDate` : Date de début d'écriture
- `endWritingDate` : Date de fin d'écriture
- `writingDisplayDate` : Date d'écriture formatée pour affichage

#### GET /works/:entryId

Récupère une œuvre spécifique par son ID avec les mêmes champs que l'endpoint de liste.

## Types de contenu et champs CMS

Cette section détaille les types de contenu principaux et leurs champs utilisés par le frontend. Les identifiants réels des champs dans la base de données Craft CMS sont inclus pour référence.

### Œuvres (Works)

Les œuvres représentent les pièces de théâtre de marionnettes et leurs documents associés.

| Champ | ID du champ | Type | Description | GraphQL |
|-------|-------------|------|-------------|---------|
| `title` | Native CMS | Text | Titre de l'œuvre | `title: String` |
| `abstract` | 26b83bbf-b7b9-48cd-979e-d69b22bceaf1 | Rich Text | Résumé de l'œuvre | `abstract: String` |
| `doi` | 3802b7c5-d17c-4241-873e-872425f9ea93 | Text | Identifiant DOI | `doi: String` |
| `compositionMinDate` | b4287b8a-4f37-43f2-894b-428e99411a04 | Date | Date minimale de composition | `compositionMinDate: DateTime` |
| `compositionMaxDate` | cfc8c93d-134d-4d7f-84dd-31c7c229e699 | Date | Date maximale de composition | `compositionMaxDate: DateTime` |
| `compositionDisplayDate` | a63454cc-f4ca-4c63-a17f-8772cff10def | Text | Date formatée pour affichage | `compositionDisplayDate: String` |
| `authors` | 2dd7c17a-3ef4-4aaf-a784-62648f6632fd | Relations | Auteurs liés | `authors: [EntryInterface]` |
| `characters` | f1aeb04a-7fb6-4c3c-87a1-59320850b52e | Relations | Personnages dans l'œuvre | `characters: [EntryInterface]` |
| `places` | 3eec2c18-4dce-4184-a668-02f225266314 | Relations | Lieux associés | `places: [EntryInterface]` |
| `languages` | 96e274be-acfe-4d13-a01e-13b327b04fd1 | Relations | Langues utilisées | `languages: [EntryInterface]` |
| `formats` | a47eb338-13e7-427d-a6a9-9854d7ecf096 | Relations | Formats | `formats: [EntryInterface]` |
| `animationTechniques` | 93343e67-8611-4266-b864-d311771afbc9 | Relations | Techniques d'animation | `animationTechniques: [EntryInterface]` |
| `theatricalTechniques` | 412f63f1-746e-468d-8c05-6e0deedc2b05 | Relations | Procédés théâtraux | `theatricalTechniques: [EntryInterface]` |
| `mainImage` | 8d9ba885-0f2b-4591-926e-73e3a6ecc23f | Asset | Image principale | `mainImage: AssetInterface` |
| `scannedDocumentPdf` | 2634dd0c-e6eb-4be4-88a7-c3b674e71c36 | Asset | Document PDF scanné | `scannedDocumentPdf: AssetInterface` |
| `scannedDocumentPages` | 2e9e0ef6-71c0-4e08-931b-6b53d7197c7d | Assets | Pages scannées | `scannedDocumentPages: [AssetInterface]` |
| `keywords` | e170dd2d-c858-4261-834a-9c2fee02cbd5 | Tags | Mots-clés | `keywords: [TagInterface]` |
| `genre` | 45df3231-3a21-4a0c-93ea-01b0f58c5582 | Text | Genre | `genre: String` |
| `publicDomain` | 1c1041b2-7307-47b5-b3da-f7da389ed14b | Boolean | Domaine public | `publicDomain: Boolean` |
| `copyright` | a2007d0c-252f-4367-8e53-da567f836922 | Text | Information de copyright | `copyright: String` |
| `medias` | 155d31de-d871-4f90-a86c-9d29b851c29d | Assets | Médias associés | `medias: [AssetInterface]` |
| `hypotexts` | 084dbff2-63eb-420b-aac6-22102df927f9 | Relations | Hypotextes liés | `hypotexts: [EntryInterface]` |
| `literaryTones` | f9d69522-b5ad-442c-873f-739859f6e7f7 | Relations | Registres littéraires | `literaryTones: [EntryInterface]` |
| `audience` | 1b752928-627a-4f0d-a6a9-41a22636ab41 | Relations | Publics cibles | `audience: [EntryInterface]` |
| `actsCount` | 0efb8d7c-638f-4652-b952-44092a5657f1 | Number | Nombre d'actes | `actsCount: Int` |
| `pagesCount` | 2d8643ae-5357-48a9-a90c-59e78c29508c | Number | Nombre de pages | `pagesCount: Int` |
| `conservationPlace` | b37dab53-e816-48fb-aa32-daece0392d17 | Relations | Lieu de conservation | `conservationPlace: EntryInterface` |

### Personnes (Authors)

Les personnes incluent les auteurs, compositeurs, et autres contributeurs.

| Champ | ID du champ | Type | Description | GraphQL |
|-------|-------------|------|-------------|---------|
| `firstName` | 23c8664d-0988-47dc-96c4-e3887b436569 | Text | Prénom | `firstName: String` |
| `lastName` | 6e506719-d279-4e2c-9e84-fbf315440712 | Text | Nom de famille | `lastName: String` |
| `birthDate` | c18b0f9d-717f-4ce0-a996-f482d7432dba | Date | Date de naissance | `birthDate: DateTime` |
| `deathDate` | a36b8a5f-17c5-46c5-8d97-43a29656c564 | Date | Date de décès | `deathDate: DateTime` |
| `biographicalNote` | 9e670e52-0ab0-4dc1-a6e1-adc8efea5c13 | Rich Text | Notice biographique | `biographicalNote: String` |
| `viafId` | 91e5559d-8541-4d49-90fa-8f06aefe00b7 | Text | Identifiant VIAF | `viafId: String` |
| `idrefId` | f03405c5-53d6-4a5b-820a-1a1880a63524 | Text | Identifiant IdRef | `idrefId: String` |
| `isniId` | 240995cf-5c01-4d81-8338-b19a74e20d1a | Text | Identifiant ISNI | `isniId: String` |
| `arkId` | 3df1d9d7-f431-4e77-8af6-67a22c501379 | Text | Identifiant ARK | `arkId: String` |
| `usualName` | 66501227-1575-4af8-9ad7-8ddf21716146 | Text | Nom usuel | `usualName: String` |
| `pseudonyms` | 2a3117bf-dd2f-46f2-802d-42fbd2e52e0a | Relations | Pseudonymes | `pseudonyms: [EntryInterface]` |
| `gender` | a5261331-a813-4df9-ab61-a125b7713179 | Dropdown | Genre | `gender: String` |
| `places` | 3eec2c18-4dce-4184-a668-02f225266314 | Relations | Lieux d'activité | `places: [EntryInterface]` |
| `mainImage` | 8d9ba885-0f2b-4591-926e-73e3a6ecc23f | Asset | Image principale | `mainImage: AssetInterface` |
| `images` | 07c0d544-d28a-449e-a643-936d89cb7a3a | Assets | Images | `images: [AssetInterface]` |
| `languages` | 96e274be-acfe-4d13-a01e-13b327b04fd1 | Relations | Langues | `languages: [EntryInterface]` |

### Personnages (Characters)

Les personnages présents dans les œuvres.

| Champ | ID du champ | Type | Description | GraphQL |
|-------|-------------|------|-------------|---------|
| `title` | Native CMS | Text | Nom du personnage | `title: String` |
| `description` | 5258bc33-a2cb-4dd3-9a79-6a8db921d40c | Rich Text | Description | `description: String` |
| `textName` | 209da50a-0d77-41a6-9d9c-8946eb198e71 | Text | Nom dans le texte | `textName: String` |
| `textCharacters` | 07cc50ee-05e5-483d-8911-22552f44be92 | Text | Caractères textuels | `textCharacters: String` |
| `typeOf` | 6e173e2f-1a52-45d7-bc3d-ccd4901e799b | Text | Type de personnage | `typeOf: String` |
| `mainImage` | 8d9ba885-0f2b-4591-926e-73e3a6ecc23f | Asset | Image principale | `mainImage: AssetInterface` |
| `otherVersions` | f7587c45-1123-417a-9e51-c0a292fb22e8 | Relations | Autres versions | `otherVersions: [EntryInterface]` |
| `note` | fa0087ff-5695-4bdc-8bf4-9650ee08cde6 | Rich Text | Notice | `note: String` |

### Lieux (Places)

Les lieux géographiques associés aux œuvres et personnes.

| Champ | ID du champ | Type | Description | GraphQL |
|-------|-------------|------|-------------|---------|
| `title` | Native CMS | Text | Nom du lieu | `title: String` |
| `country` | 157ddd75-0868-4e2b-ba35-028ae3c8ae42 | Relation | Pays | `country: EntryInterface` |
| `latitude` | 69ee7666-95f0-4e8f-bf8b-09d970d7b777 | Number | Latitude | `latitude: Float` |
| `longitude` | 07a590cd-d68b-4af3-96b5-4b6f46cebe31 | Number | Longitude | `longitude: Float` |

## Relations entre types de contenu

Cette section précise les relations entre les différents types de contenu. Ces relations sont importantes pour la navigation et les requêtes GraphQL.

### Relations Œuvres <-> Personnes
- Une œuvre peut avoir plusieurs auteurs (champ `authors` dans Œuvres)
- Une personne peut être liée à plusieurs œuvres 

### Relations Œuvres <-> Personnages
- Une œuvre peut contenir plusieurs personnages (champ `characters` dans Œuvres)
- Un personnage peut apparaître dans plusieurs œuvres

### Relations Œuvres <-> Lieux
- Une œuvre peut être associée à plusieurs lieux (champ `places` dans Œuvres)
- Un lieu peut être associé à plusieurs œuvres
- Les lieux de composition sont spécifiquement indiqués par le champ `compositionPlace`

### Relations Personnes <-> Lieux
- Une personne peut être associée à plusieurs lieux d'activité (champ `places` dans Personnes)
- Un lieu peut être associé à plusieurs personnes

### Relations Techniques d'animation <-> Œuvres
- Une œuvre peut utiliser plusieurs techniques d'animation (champ `animationTechniques`)
- Une technique d'animation peut être utilisée dans plusieurs œuvres

### Relations Registres littéraires <-> Œuvres
- Une œuvre peut avoir plusieurs registres littéraires (champ `literaryTones`)
- Un registre littéraire peut être associé à plusieurs œuvres

## Exemples de requêtes

### Récupérer des œuvres avec filtres

```graphql
query GetAllWorks($locale: [String], $offset: Int, $limit: Int, $search: String, $relatedTo: [Int]) {
  entries(section: "works", site: $locale, offset: $offset, limit: $limit, search: $search, relatedTo: $relatedTo) {
    id
    title
    ... on works_works_Entry {
      abstract
      doi
      compositionDisplayDate
      authors {
        id
        title
        ... on persons_persons_Entry {
          firstName
          lastName
          birthDate
          deathDate
        }
      }
      mainImage {
        url
        alt
      }
      formats {
        id
        title
      }
      animationTechniques {
        id
        title
      }
    }
  }
  entryCount(section: "works", site: $locale, search: $search, relatedTo: $relatedTo)
}
```

### Récupérer les détails d'une œuvre spécifique

```graphql
query GetWorkById($id: [QueryArgument], $locale: [String]) {
  entry(id: $id, site: $locale) {
    id
    title
    ... on works_works_Entry {
      abstract
      doi
      compositionDisplayDate
      compositionMinDate
      compositionMaxDate
      authors {
        id
        title
        ... on persons_persons_Entry {
          firstName
          lastName
          arkId
          viafId
          idrefId
        }
      }
      characters {
        id
        title
        ... on characters_characters_Entry {
          description
          textName
          typeOf
        }
      }
      places {
        id
        title
        ... on places_places_Entry {
          latitude
          longitude
          country {
            id
            title
          }
        }
      }
      languages {
        id
        title
      }
      animationTechniques {
        id
        title
        ... on animationTechniques_animationTechniques_Entry {
          description
        }
      }
      theatricalTechniques {
        id
        title
      }
      formats {
        id
        title
      }
      literaryTones {
        id
        title
      }
      keywords {
        id
        title
      }
      genre
      publicDomain
      copyright
      actsCount
      pagesCount
      scannedDocumentPdf {
        url
        title
      }
      scannedDocumentPages {
        url
        alt
        title
      }
      medias {
        url
        title
        alt
      }
      hypotexts {
        id
        title
      }
    }
  }
}
```

### Récupérer des auteurs avec leurs œuvres

```graphql
query GetAllAuthors($locale: [String], $offset: Int, $limit: Int) {
  entries(section: "persons", site: $locale, offset: $offset, limit: $limit) {
    id
    title
    ... on persons_persons_Entry {
      firstName
      lastName
      birthDate
      deathDate
      biographicalNote
      viafId
      idrefId
      isniId
      arkId
      usualName
      gender
      mainImage {
        url
        alt
      }
      places {
        id
        title
      }
    }
  }
  entryCount(section: "persons", site: $locale)
}
```

### Récupérer des personnages avec filtrage

```graphql
query GetCharacters($search: String, $locale: [String], $limit: Int, $offset: Int) {
  entries(section: "characters", site: $locale, search: $search, limit: $limit, offset: $offset) {
    id
    title
    ... on characters_characters_Entry {
      description
      textName
      textCharacters
      typeOf
      mainImage {
        url
        alt
      }
      note
    }
  }
  entryCount(section: "characters", site: $locale, search: $search)
}
```

## Gestion des erreurs

L'API GraphQL renvoie des erreurs standardisées au format suivant :

```json
{
  "errors": [
    {
      "message": "Message d'erreur",
      "locations": [...],
      "path": [...],
      "extensions": {
        "category": "Type d'erreur"
      }
    }
  ]
}
```

### Codes d'erreur courants

- **400** : Requête invalide (syntaxe GraphQL incorrecte)
- **401** : Non authentifié
- **403** : Non autorisé (permissions insuffisantes)
- **404** : Ressource non trouvée
- **500** : Erreur serveur interne

## Maintenance et extension

### Ajouter un nouveau champ au schéma GraphQL

1. Ajouter le champ dans Craft CMS
2. S'assurer que le champ est exposé dans le schéma GraphQL en vérifiant les permissions dans `config/project/graphql/schemas/`
3. Mettre à jour les requêtes frontend pour utiliser le nouveau champ

### Ajouter un nouveau type de contenu

1. Créer la nouvelle section et le type d'entrée dans Craft CMS
2. Ajouter les permissions de lecture dans le schéma GraphQL public
3. Mettre à jour la documentation avec les nouveaux champs disponibles 