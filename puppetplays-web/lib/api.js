import {
  authorsStateToGraphqlEntriesParams,
  authorsStateToGraphqlQueryArgument,
  worksQueryParamsToGraphqlVariables,
  worksQueryParamsToState,
  worksStateToGraphqlEntriesParams,
  worksStateToGraphqlQueryArgument,
} from 'lib/filters';

export async function fetchAPI(query, { variables } = {}, token) {
  const craftTokenHeader = token ? { 'X-Craft-Token': token } : null;
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/graphql`;
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...craftTokenHeader,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
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

export const getPeriodBoundsQuery = `
query GetPeriodBounds {
  min: entries(section: "works", compositionMinDate: ["not", null], limit: 1, orderBy: "compositionMinDate asc") {
    ... on works_works_Entry {
      value: compositionMinDate
    }
  }
  max: entries(section: "works", compositionMaxDate: ["not", null], limit: 1, orderBy: "compositionMaxDate desc") {
    ... on works_works_Entry {
      value: compositionMaxDate
    }
  }
}
`;

export const getAllLanguagesQuery = `
query GetAllLanguages($locale: [String]) {
  entries(section: "languages", site: $locale, orderBy: "title") {
    id,
    title,
  }
}
`;

export const getAllPlacesQuery = `
${placeInfoFragment}
query GetAllPlaces($locale: [String]) {
  entries(section: "places", site: $locale, orderBy: "title") {
    ...placeInfo
  }
}
`;

export const WORKS_PAGE_SIZE = 10;

export const getAllWorksQuery = (filters) => {
  return `
${placeInfoFragment}
${assetFragment}
query GetAllWorks($locale: [String], $offset: Int, $limit: Int, $search: String${worksStateToGraphqlQueryArgument(
    filters,
  )}) {
  entries(section: "works", site: $locale, offset: $offset, limit: $limit, search: $search, orderBy: "score"${worksStateToGraphqlEntriesParams(
    filters,
  )}) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      translatedTitle,
      subtitle,
      mainImage {
        ...assetFragment
      },
      dramaticDevices {
        title
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
      onlineEdition,
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
      characters {
        title,
        ...on originalsCharacters_originalsCharacters_Entry {
          textName
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

export const buildSearchQuery = (search) => {
  return search ? search.split(' ').join(' OR ') : '';
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
query getWorkById($locale: [String], $id: [QueryArgument]) {
  entry(section: "works", site: $locale, id: $id) {
    id,
    title,
    ... on works_works_Entry {
      doi,
      viafId,
      arkId,
      slug,
      translatedTitle,
      subtitle,
      genre,
      mainImage {
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
      onlineEdition,
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
      characters {
        title,
        ...on originalsCharacters_originalsCharacters_Entry {
          textName
        }
      },
      dramaticDevices {
        title
      },
      actsCount,
      pagesCount,
      formats {
        title
      },
      publicDomain,
      additionalLicenseInformation,
      medias {
        id
      }
    }
  }
}`;

export const getWorkMediasByIdQuery = `
query getWorkById($locale: [String], $id: [QueryArgument]) {
  entry(section: "works", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      medias @transform(width: 600) {
        id,
        url,
        height,
        width,
        kind,
        ... on images_Asset {
          alt,
          imageType,
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

export const getAllAuthorsQuery = (filters) => `
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
query getAuthorsByIds($locale: [String], $id: [QueryArgument]) {
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
    },
  }
}
`;

export const getAuthorByIdQuery = `
${assetFragment}
query getAuthorById($locale: [String], $id: [QueryArgument]) {
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
query getWorksOfAuthor($locale: [String], $id: [QueryArgument]) {
  entries(section: "works", site: $locale, relatedTo: $id) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      date: mostRelevantDate
    }
  }
}
`;

export const getAllAnimationsTechniquesQuery = `
${assetFragment}
query getAllAnimationsTechniques($locale: [String]) {
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
query getAnimationTechniqueById($locale: [String], $id: [QueryArgument]) {
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
query getWorksOfAnimationTechnique($locale: [String], $id: [QueryArgument]) {
  entries(section: "works", site: $locale, relatedTo: $id) {
    id,
    title,
    ... on works_works_Entry {
      date: mostRelevantDate
    }
  }
}
`;

export const getAllWorksKeywordsQuery = `
query getAllWorksKeywords($locale: [String]) {
  tags(site: $locale, relatedToEntries: { section: "works" }) {
    id,
    title
   }
}
`;

export const getWorksKeywordsByIdsQuery = `
query getWorksKeywordsByIds($locale: [String], $id: [QueryArgument]) {
  tags(site: $locale, id: $id) {
    id,
    title
   }
}
`;

export const getHomeQuery = `
query getHome($locale: [String]) {
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
