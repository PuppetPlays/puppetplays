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

export async function getAllWorks(apiUrl, locale) {
  const data = await fetchAPI(
    `
    query GetAllWorks($locale: [String]) {
      entries(section: "works", site: $locale) {
        id,
        title
        ... on works_works_Entry {
          author,
          authorNickName,
          writingDate,
          writingPlace,
          language,
          keywords,
          summary,
          otherTitles,
          firstRepresentations,
          publication,
          otherPublication,
          register,
          manipulationTechnic,
          audience,
          characters,
          actsCount,
          license
        }
      }
    }
  `,
    { apiUrl, variables: { locale } },
  );
  return data?.entries;
}
