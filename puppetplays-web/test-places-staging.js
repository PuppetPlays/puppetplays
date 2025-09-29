#!/usr/bin/env node

// Script pour tester la requête des lieux sur staging
const https = require('https');

const query = `
query GetAllPlaces($locale: [String]) {
  entries(section: ["places", "countries"], site: $locale, orderBy: "title", relatedToEntries: { section: "works" }) {
    id,
    title,
    typeHandle,
    ... on places_places_Entry {
      country {
        id,
        title
      }
    }
  }
}
`;

const data = JSON.stringify({
  query: query,
  variables: { locale: 'fr' },
});

const options = {
  hostname: 'staging.puppetplays.eu',
  port: 443,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = https.request(options, res => {
  let responseData = '';

  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      if (response.data && response.data.entries) {
        console.log('=== PLACES DATA FROM STAGING ===');
        console.log(`Total places found: ${response.data.entries.length}`);

        // Afficher les premiers 10 lieux
        response.data.entries.slice(0, 10).forEach((place, index) => {
          console.log(`\n${index + 1}. ${place.title}`);
          console.log(`   - ID: ${place.id}`);
          console.log(`   - Type: ${place.typeHandle}`);
          if (place.country) {
            console.log(
              `   - Country: ${place.country.title} (ID: ${place.country.id})`,
            );
          } else {
            console.log(`   - Country: null`);
          }
        });

        // Statistiques
        const cities = response.data.entries.filter(
          p => p.typeHandle === 'places',
        );
        const countries = response.data.entries.filter(
          p => p.typeHandle === 'countries',
        );
        const citiesWithCountry = cities.filter(
          p => p.country && p.country.title,
        );
        const citiesWithoutCountry = cities.filter(
          p => !p.country || !p.country.title,
        );

        console.log('\n=== STATISTICS ===');
        console.log(`Total entries: ${response.data.entries.length}`);
        console.log(`Countries: ${countries.length}`);
        console.log(`Cities: ${cities.length}`);
        console.log(`Cities with country: ${citiesWithCountry.length}`);
        console.log(`Cities without country: ${citiesWithoutCountry.length}`);

        if (citiesWithoutCountry.length > 0) {
          console.log('\n=== CITIES WITHOUT COUNTRY ===');
          citiesWithoutCountry.slice(0, 5).forEach(city => {
            console.log(`- ${city.title} (${city.id})`);
          });
        }
      } else {
        console.error('No data found in response:', response);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.log('Raw response:', responseData.substring(0, 500));
    }
  });
});

req.on('error', error => {
  console.error('Request error:', error);
});

req.write(data);
req.end();



