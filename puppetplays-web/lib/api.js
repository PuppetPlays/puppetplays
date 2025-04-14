import * as stopWords from 'lib/stopWords';

import {
  authorsStateToGraphqlEntriesParams,
  authorsStateToGraphqlQueryArgument,
  worksQueryParamsToGraphqlVariables,
  worksQueryParamsToState,
  worksStateToGraphqlEntriesParams,
  worksStateToGraphqlQueryArgument,
} from './filters';
import { identity } from './utils';

export const getFetchAPIClient = (params, token) => {
  if (params?.variables?.locale && Array.isArray(params.variables.locale)) {
    params.variables.locale =
      params.variables.locale[0] || params.variables.locale;
  }

  return query => {
    // S'assurer que la requête est une chaîne
    const queryString = Array.isArray(query) ? query[0] : query;
    return fetchAPI(queryString, params, token);
  };
};

export async function fetchAPI(query, { variables } = {}, token) {
  const craftTokenHeader = token ? { 'X-Craft-Token': token } : null;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/graphql`;

  const queryString = Array.isArray(query) ? query[0] : query;

  if (variables && variables.locale && Array.isArray(variables.locale)) {
    variables.locale = variables.locale[0] || variables.locale;
  }

  try {
    console.log(
      'Sending GraphQL query:',
      queryString.substring(0, 100) + '...',
    );
    console.log('Variables:', JSON.stringify(variables));

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...craftTokenHeader,
      },
      body: JSON.stringify({
        query: queryString,
        variables,
      }),
    });

    if (!res.ok) {
      console.error('Network response error:', res.status, res.statusText);
      throw new Error(`API responded with status: ${res.status}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error('GraphQL errors:', JSON.stringify(json.errors));
      throw new Error(
        `GraphQL error: ${json.errors[0]?.message || 'Failed to fetch API'}`,
      );
    }

    return json.data;
  } catch (error) {
    console.error('API fetch error:', error.message);
    throw error;
  }
}

export const placeInfoFragment = `
fragment placeInfo on EntryInterface {
  id,
  title,
  typeHandle,
  ... on places_places_Entry {
    country {
      title,
      ... on countries_countries_Entry {
        latitude,
        longitude
      }
    },
    latitude,
    longitude
  }
  ... on countries_countries_Entry {
    latitude,
    longitude
  }
}
`;

export const assetFragment = `
fragment assetFragment on AssetInterface {
  id,
  url,
  height,
  width,
  ... on images_Asset {
    alt,
    description,
    copyright
  }
}
`;

export const WORKS_PAGE_SIZE = 10;

export const getAllWorksQuery = ({ orderBy, ...filters }) => {
  return `
${placeInfoFragment}
${assetFragment}
query GetAllWorks($locale: [String], $offset: Int, $limit: Int, $search: String${worksStateToGraphqlQueryArgument(
    filters,
  )}) {
  entries(section: "works", site: $locale, offset: $offset, limit: $limit, search: $search, orderBy: "${
    orderBy || 'compositionMinDate'
  }"${worksStateToGraphqlEntriesParams(filters)}) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      translatedTitle,
      subtitle,
      mainImage @transform(width: 200, position: "center-center") {
        ...assetFragment
      },
      theatricalTechniques {
        id,
        title
      },
      keywords {
        id,
        title
      },
      firstAuthorTitle,
      authors {
        id,
        slug,
        title,
        typeHandle,
        ... on persons_persons_Entry { 
         	firstName,
          lastName,
          nickname,
          usualName
        }
      },
      mostRelevantDate,
      compositionMinDate,
      compositionPlace {
        ...placeInfo
      },
      mainLanguage {
        title 
      },
      note,
      mainTheme,
      abstract,
      otherTitles,
      firstPerformanceDate,
      firstPerformancePlace {
        ...placeInfo
      },
      firstPerformanceComplementaryInformation,
      publication,
      modernEdition,
      onlineCopy,
      literaryTones {
        title
      },
      animationTechniques {
        id,
        slug,
        title
      },
      audience {
        title
      },
      textCharacters {
        ... on textCharacters_character_BlockType {
          nameInText
          roles {
            title
          }
        }
      },
      actsCount,
      pagesCount,
      formats {
        title
      },
      publicDomain,
      additionalLicenseInformation
    }
  }
  entryCount(section: "works", site: $locale, search: $search${worksStateToGraphqlEntriesParams(
    filters,
  )})
}
`;
};

export const buildSearchQuery = (search, locale) => {
  const splitRegex = /\s(?=(?:[^'"`]*(['"`])[^'"`]*\1)*[^'"`]*$)/g;
  return search
    ? search
        .replace(/\s*\+/g, '+')
        .replace(/\+\s*/g, '+')
        .split(splitRegex)
        .filter(identity)
        .filter(term =>
          locale === 'fr'
            ? !stopWords.FR.includes(term)
            : !stopWords.EN.includes(term),
        )
        .join(' OR ')
        .replace(/\+/g, ' ')
    : '';
};

export async function getAllWorks(
  locale,
  offset = 0,
  search = '',
  queryParams = {},
) {
  const data = await fetchAPI(
    getAllWorksQuery(worksQueryParamsToState(queryParams)),
    {
      variables: {
        locale,
        offset,
        limit: WORKS_PAGE_SIZE,
        search,
        ...worksQueryParamsToGraphqlVariables(queryParams),
      },
    },
  );
  return data;
}

export const getWorkByIdQuery = `
${placeInfoFragment}
${assetFragment}
query GetWorkById($locale: [String], $id: [QueryArgument]) {
  entry(section: "works", site: $locale, id: $id) {
    id,
    title,
    writtenBy: author {
      firstName,
      lastName
    },
    ... on works_works_Entry {
      doi,
      viafId,
      arkId,
      slug,
      translatedTitle,
      subtitle,
      genre,
      mainImage @transform(width: 520, position: "center-center") {
        ...assetFragment
      },
      keywords {
        id,
        title
      },
      authors {
        id,
        slug,
        title,
        typeHandle,
        ... on persons_persons_Entry { 
         	firstName,
          lastName,
          nickname,
          usualName,
          birthDate,
          deathDate,
          places {
            ...placeInfo
          },
          mainImage @transform(height: 362, width: 260) {
            ...assetFragment
          },
        },
        ... on persons_companies_Entry {
          places {
            ...placeInfo
          },
        }
      },
      mostRelevantDate,
      compositionDisplayDate,
      compositionMinDate,
      compositionPlace {
        ...placeInfo
      },
      mainLanguage {
        title 
      },
      note,
      mainTheme,
      abstract,
      hypotexts {
        title,
        typeHandle
        ... on relatedWorks_relatedWorks_Entry {
          date,
          authors {
            id,
            title,
            typeHandle,
            ... on persons_persons_Entry { 
              firstName,
              lastName,
              nickname,
              usualName
            }
          }
        },
        ... on works_works_Entry {
          date: mostRelevantDate,
          authors {
            id,
            title,
            typeHandle,
            ... on persons_persons_Entry { 
              firstName,
              lastName,
              nickname,
              usualName
            }
          }
        }
      },
      otherTitles,
      firstPerformanceDate,
      firstPerformancePlace {
        ...placeInfo
      },
      firstPerformanceComplementaryInformation,
      publication,
      transcribers {
        id,
        ... on persons_persons_Entry { 
         	firstName,
          lastName,
          nickname,
          usualName
        }
      },
      editors {
        id,
        ... on persons_persons_Entry { 
         	firstName,
          lastName,
          nickname,
          usualName
        }
      },
      modernEdition,
      onlineCopy,
      translations {
        ... on translations_translation_BlockType {
          bibliographicRecord,
          translationLanguage {
            title
          }
        }
      },
      conservationPlace {
        title,
        ... on conservationInstitutions_conservationInstitutions_Entry {
          place {
            ...placeInfo
          }
        }
      },
      literaryTones {
        title
      },
      animationTechniques {
        id,
        slug,
        title
      },
      audience {
        title
      },
      textCharacters {
        ... on textCharacters_character_BlockType {
          nameInText
          roles {
            title
          }
        }
      },
      theatricalTechniques {
        id,
        title
      },
      actsCount,
      pagesCount,
      formats {
        title
      },
      publicDomain,
      additionalLicenseInformation,
      mediasCount: _count(field: "medias")
      scannedDocumentPagesCount: _count(field: "scannedDocumentPages")
    }
  }
}`;

export const getWorkMediasByIdQuery = `
query GetWorkById($locale: [String], $id: [QueryArgument]) {
  entry(section: "works", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      scannedDocumentPagesCount: _count(field: "scannedDocumentPages"),
      medias @transform(width: 600) {
        id,
        url,
        height,
        width,
        kind,
        ... on images_Asset {
          alt,
          description,
          copyright
        },
        ... on videos_Asset {
          description,
          copyright,
          languages {
            title
          }
        },
        ... on sounds_Asset {
          description,
          copyright,
          languages {
            title
          }
        }
      }
    }
  }
}
`;

export const getWorkDocumentByIdQuery = `
${assetFragment}
query GetWorkById($locale: [String], $id: [QueryArgument]) {
  entry(section: "works", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      pdf: scannedDocumentPdf {
        ...assetFragment
      },
      images: scannedDocumentPages {
        ...assetFragment
      }
    }
  }
}
`;

export async function getWorkById(id, locale, token) {
  const data = await fetchAPI(
    getWorkByIdQuery,
    {
      variables: { locale, id },
    },
    token,
  );
  return data;
}

export const getAllWorksAuthorsIdsQuery = `
query GetAllWorksAuthorsIds($locale: [String]) {
  entries(section: "works", site: $locale) {
    ... on works_works_Entry {
      authors {
        id
      }
    }
  }
}`;

export const getAllAuthorsQuery = filters => `
query GetAllAuthors($locale: [String]${authorsStateToGraphqlQueryArgument(
  filters,
)}) {
entries(section: "persons", site: $locale, relatedToEntries: {section: "works"}, orderBy: "title"${authorsStateToGraphqlEntriesParams(
  filters,
)}) {
  id,
  slug,
  title,
  typeHandle,
  ... on persons_persons_Entry { 
    firstName,
    lastName,
    nickname,
    usualName,
    birthDate,
    deathDate,
  },
}
entryCount(section: "persons", site: $locale, relatedToEntries: {section: "works"}${authorsStateToGraphqlEntriesParams(
  filters,
)})
}
`;

export const getAllAuthorsIdsQuery = `
query GetAllAuthorsIds($locale: [String]) {
  entries(section: "persons", site: $locale, relatedToEntries: {section: "works"}) {
    id
  }
}
`;

export const getAuthorsByIdsQuery = `
${assetFragment}
query GetAuthorsByIds($locale: [String], $id: [QueryArgument]) {
  entries(section: "persons", site: $locale, id: $id) {
    id,
    slug,
    title,
    typeHandle,
    ... on persons_persons_Entry { 
      firstName,
      lastName,
      nickname,
      usualName,
      birthDate,
      deathDate,
      mainImage @transform(height: 362, width: 280) {
        ...assetFragment
      },
    },
  }
}
`;

export const getAuthorByIdQuery = `
${assetFragment}
query GetAuthorById($locale: [String], $id: [QueryArgument]) {
  entry(section: "persons", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on persons_persons_Entry {
      firstName,
      lastName,
      nickname,
      usualName,
      birthDate,
      deathDate,
      biographicalNote,
      mainImage @transform(height: 436) {
        ...assetFragment
      },
      images @transform(height: 436) {
        ...assetFragment
      },
      idrefId,
      viafId,
      arkId,
      isniId
    }
  }
}
`;

export const getWorksOfAuthorQuery = `
query GetWorksOfAuthor($locale: [String], $id: [QueryArgument]) {
  entries(section: "works", site: $locale, relatedTo: $id, orderBy: "compositionMinDate") {
    id,
    slug,
    title,
    ... on works_works_Entry {
      date: mostRelevantDate,
      authors {
        id
      }
    }
  }
}
`;

export const getAllAnimationsTechniquesQuery = `
${assetFragment}
query GetAllAnimationsTechniques($locale: [String]) {
  entries(section: "animationTechniques", site: $locale, orderBy: "title") {
    id,
    slug,
    title,
    ... on animationTechniques_animationTechniques_Entry {
      mainImage @transform(height: 362, width: 259) {
        ...assetFragment
      },
    }
  }
}
`;

export const getAnimationTechniqueByIdQuery = `
${assetFragment}
query GetAnimationTechniqueById($locale: [String], $id: [QueryArgument]) {
  entry(section: "animationTechniques", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on animationTechniques_animationTechniques_Entry {
      excerpt,
      description,
      mainImage @transform(height: 436) {
        ...assetFragment
      },
      images @transform(height: 436) {
        ...assetFragment
      }
    }
  }
}
`;

export const getWorksOfAnimationTechniqueQuery = `
query GetWorksOfAnimationTechnique($locale: [String], $id: [QueryArgument]) {
  entries(section: "works", site: $locale, relatedTo: $id, orderBy: "compositionMinDate") {
    id,
    title,
    ... on works_works_Entry {
      date: mostRelevantDate
    }
  }
}
`;

export const getAllWorksKeywordsQuery = `
query GetAllWorksKeywords($locale: [String]) {
  tags(site: $locale, relatedToEntries: { section: "works" }) {
    id,
    title
   }
}
`;

export const getWorksKeywordsByIdsQuery = `
query GetWorksKeywordsByIds($locale: [String], $id: [QueryArgument]) {
  tags(site: $locale, id: $id) {
    id,
    title
   }
}
`;

export const getHomeQuery = `
query GetHome($locale: [String]) {
  entry(section: "home", site: $locale) {
    id,
    slug,
    title,
    ... on home_home_Entry {
      works {
        id
      }
    }
  }
}
`;

export const getWorksCardByIdsQuery = `
${placeInfoFragment}
query GetWorksCardByIds($locale: [String], $id: [QueryArgument]) {
  entries(section: "works", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      authors {
        id,
        slug,
        title,
        typeHandle,
        ... on persons_persons_Entry { 
         	firstName,
          lastName,
          nickname,
          usualName
        }
      },
      mostRelevantDate,
      compositionPlace {
        ...placeInfo
      },
      mainLanguage {
        title 
      },
    }
  }
}
`;

export const getAllDiscoveryPaths = `
${assetFragment}
query GetAllDiscoveryPaths($locale: [String]) {
  entries(section: "discoveryPaths", site: $locale) {
    id,
    slug,
    title,
    ... on discoveryPaths_default_Entry {
      abstract,
      thumbnail @transform(width: 680) {
        ...assetFragment
      }
      richContent
    }
  }
}
`;

export const getDiscoveryPathById = `
query GetDiscoveryPathById($locale: [String], $id: [QueryArgument]) {
  entry(section: "discoveryPaths", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on discoveryPaths_default_Entry {
      abstract,
      richContent
    }
  }
}
`;
