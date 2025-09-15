const axios = require('axios');

async function testPlacesQuery() {
  const query = `
    query GetAllPlaces {
      entries(section: ["places", "countries"], limit: 10, orderBy: "title") {
        id
        title
        typeHandle
        ... on places_places_Entry {
          country {
            id
            title
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://admin.staging.puppetplays.eu/graphql',
      {
        query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Afficher uniquement les 5 premiers résultats
    const entries = response.data.data.entries.slice(0, 5);
    entries.forEach(entry => {
      console.log(`${entry.title} (${entry.typeHandle})`);
      if (entry.country) {
        console.log(`  -> Country: ${entry.country.title}`);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPlacesQuery();
