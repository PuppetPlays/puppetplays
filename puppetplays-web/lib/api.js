export async function fetchAPI(query, { variables, apiUrl = '/api' } = {}) {
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

export const WORKS_PAGE_SIZE = 1;

export const getAllWorksQuery = `
query GetAllWorks($locale: [String], $offset: Int, $limit: Int) {
  entries(section: "works", site: $locale, offset: $offset, limit: $limit) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      translatedTitle,
      keywords {
        title
      },
      authors {
        title 
      },
      writingDisplayDate,
      writingPlace {
        title,
        ... on places_places_Entry {
          country {
            title
          }
        }
      },
      mainLanguage {
        title 
      },
      abstract,
      firstPerformanceDisplayDate,
      register {
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
      license
    }
  }
  entryCount(section: "works")
}
`;

export async function getAllWorks(apiUrl, locale, offset = 0) {
  // otherTitles: It seems that it should have a language associated with each other titles
  // publication: What is it?
  // otherPublication: What is it?,
  const data = await fetchAPI(getAllWorksQuery, {
    apiUrl,
    variables: { locale, offset, limit: WORKS_PAGE_SIZE },
  });
  return data;
}

export const getWorkByIdQuery = `
query getWorkById($locale: [String], $id: [QueryArgument]) {
  entry(section: "works", site: $locale, id: $id) {
    id,
    slug,
    title,
    ... on works_works_Entry {
      translatedTitle,
      keywords {
        title
      },
      authors {
        title 
      },
      writingDisplayDate,
      writingPlace {
        title,
        ... on places_places_Entry {
          country {
            title
          }
        }
      },
      mainLanguage {
        title 
      },
      abstract,
      firstPerformanceDisplayDate,
      register {
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
      license
    }
  }
}`;

export async function getWorkById(apiUrl, id, locale) {
  const data = await fetchAPI(getWorkByIdQuery, {
    apiUrl,
    variables: { locale, id },
  });
  return data;
}
