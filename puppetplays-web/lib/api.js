async function fetchAPI(query, { variables, apiUrl = '/api' } = {}) {
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

export async function getAllWorks(apiUrl, locale, offset = 0) {
  // otherTitles: It seems that it should have a language associated with each other titles
  // publication: What is it?
  // otherPublication: What is it?,

  const data = await fetchAPI(
    `
    query GetAllWorks($locale: [String], $offset: Int) {
      entries(section: "works", site: $locale, offset: $offset, limit: 20) {
        id,
        title,
        ... on works_works_Entry {
          translatedTitle,
          authors {
            title 
          },
          writingDisplayDate,
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
  `,
    { apiUrl, variables: { locale, offset } },
  );
  return { works: data?.entries, count: data.entryCount };
}
