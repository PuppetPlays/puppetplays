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

export const getAllWorksQuery = `
${placeInfoFragment}
query GetAllWorks($locale: [String], $offset: Int, $limit: Int) {
  entries(section: "works", site: $locale, offset: $offset, limit: $limit) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      translatedTitle,
      subtitle,
      dramaturgicTechniques {
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
          nickname
        }
      },
      referenceDate,
      writingPlace {
        ...placeInfo
      },
      mainLanguage {
        title 
      },
      notice,
      mainTheme,
      abstract,
      otherTitles,
      firstPerformanceDate,
      firstPerformancePlace {
        ...placeInfo
      },
      firstPerformanceExtraInfo,
      edition,
      modernEditions,
      onlineEdition,
      registers {
        title
      },
      handlingTechniques {
        title
      },
      audience {
        title
      },
      characters {
        title
      },
      actsCount,
      pageCount,
      formats {
        title
      },
      publicDomain,
      additionalLicenseInformation
    }
  }
  entryCount(section: "works")
}
`;

export async function getAllWorks(locale, offset = 0) {
  // otherTitles: It seems that it should have a language associated with each other titles
  // publication: What is it?
  // otherPublication: What is it?,
  const data = await fetchAPI(getAllWorksQuery, {
    variables: { locale, offset, limit: WORKS_PAGE_SIZE },
  });
  return data;
}

export const getWorkByIdQuery = `
${placeInfoFragment}
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
      referenceDate,
      writingDisplayDate,
      writingPlace {
        ...placeInfo
      },
      mainLanguage {
        title 
      },
      notice,
      mainTheme,
      abstract,
      hypotexts {
        title
      },
      otherTitles,
      firstPerformanceDate,
      firstPerformancePlace {
        ...placeInfo
      },
      firstPerformanceExtraInfo,
      edition,
      transcriptors {
        id,
        ... on persons_persons_Entry { 
         	firstName,
          lastName,
          nickname
        }
      },
      compilators {
        id,
        ... on persons_persons_Entry { 
         	firstName,
          lastName,
          nickname
        }
      },
      modernEditions,
      onlineEdition,
      translations {
        ... on translations_translation_BlockType {
          bibliographicRecord,
          translationLanguage {
            title
          }
        }
      },
      preservedIn {
        title,
        ... on conservationInstitutions_conservationInstitutions_Entry {
          place {
            ...placeInfo
          }
        }
      },
      registers {
        title
      },
      handlingTechniques {
        title
      },
      audience {
        title
      },
      characters {
        title
      },
      dramaturgicTechniques {
        title
      },
      actsCount,
      pageCount,
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
