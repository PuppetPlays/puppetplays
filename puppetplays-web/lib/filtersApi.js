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
query GetAllPlaces($locale: [String]) {
  entries(section: "places", site: $locale, orderBy: "title") {
    id,
    title,
    ... on places_places_Entry {
      country {
        title
      }
    }
  }
}
`;

export const getAllPersonsQuery = `
query GetAllPersons($locale: [String]) {
  entries(section: "persons", site: $locale, orderBy: "title") {
    id,
    title,
  }
}
`;

export const getAllAnimationTechniquesQuery = `
query GetAllAnimationTechniques($locale: [String]) {
  entries(section: "animationTechniques", site: $locale, orderBy: "title") {
    id,
    title,
  }
}
`;

export const getAllLiteraryTonesQuery = `
query GetAllLiteraryTones($locale: [String]) {
  entries(section: "literaryTones", site: $locale, orderBy: "title") {
    id,
    title,
  }
}
`;

export const getAllAudiencesQuery = `
query GetAllAudiences($locale: [String]) {
  entries(section: "audiences", site: $locale, orderBy: "title") {
    id,
    title,
  }
}
`;

export const getAllFormatsQuery = `
query GetAllFormats($locale: [String]) {
  entries(section: "formats", site: $locale, orderBy: "title") {
    id,
    title,
  }
}
`;
