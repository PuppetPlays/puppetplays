import { getApiUrl } from 'lib/utils';

export async function fetchAPI(query, { variables } = {}, token) {
  const craftTokenHeader = token ? { 'X-Craft-Token': token } : null;
  const res = await fetch(getApiUrl('graphql'), {
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

export const WORKS_PAGE_SIZE = 10;

export const placeInfoFragment = `
fragment placeInfo on EntryInterface {
  id,
  title,
  ... on places_places_Entry {
    country {
      title
    }
  }
}
`;

export const assetFragment = `
fragment assetFragment on AssetInterface {
  url,
  ... on assets_Asset {
    alt,
    caption,
    copyright
  }
}
`;

export const getAllWorksQuery = `
${placeInfoFragment}
${assetFragment}
query GetAllWorks($locale: [String], $offset: Int, $limit: Int, $search: String) {
  entries(section: "works", site: $locale, offset: $offset, limit: $limit, search: $search, orderBy: "score") {
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
        title
      },
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
  entryCount(section: "works", site: $locale, search: $search)
}
`;

export const buildSearchQuery = (search) => {
  return search ? search.split(' ').join(' OR ') : '';
};

export async function getAllWorks(locale, offset = 0, search = '') {
  const data = await fetchAPI(getAllWorksQuery, {
    variables: { locale, offset, limit: WORKS_PAGE_SIZE, search },
  });
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
        title
      },
      authors {
        id,
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
      additionalLicenseInformation
    }
  }
}`;

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
