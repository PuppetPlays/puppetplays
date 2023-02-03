import { cond, constant, identity, stubTrue } from 'lodash';
import { isEqual } from 'lodash/fp';

export const getSectionName = cond([
  [isEqual('authors'), constant('persons')],
  [isEqual('mainLanguage'), constant('languages')],
  [isEqual('compositionPlace'), constant('places')],
  [isEqual('audience'), constant('audiences')],
  [isEqual('relatedToTags'), constant('tags')],
  [stubTrue, identity],
]);

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getFilterEntriesByIdsQuery = (section) => `
query Get${capitalizeFirstLetter(
  section,
)}ByIds($locale: [String], $ids: [QueryArgument]) {
  entries(section: "${section}", site: $locale, orderBy: "title", id: $ids) {
    id,
    title,
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

export const getAllLanguagesQuery = (relatedToSection) => `
query GetAllLanguages($locale: [String]) {
  entries(section: "languages", site: $locale, orderBy: "title", relatedToEntries: { section: "${relatedToSection}" }) {
    id,
    title,
  }
}
`;

export const getAllPlacesQuery = (relatedToSection) => `
query GetAllPlaces($locale: [String]) {
  entries(section: ["places", "countries"], site: $locale, orderBy: "title", relatedToEntries: { section: "${relatedToSection}" }) {
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
  entries(section: "persons", site: $locale, orderBy: "title", relatedToEntries: { section: "works" }) {
    id,
    title,
  }
}
`;

export const getAllWorksQuery = `
query GetAllWorks($locale: [String]) {
  entries(section: "works", site: $locale, orderBy: "title") {
    ... on works_works_Entry {
      authors {
        id,
        title
      }
    }
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

export const getAllTheatricalTechniquesQuery = `
query GetAllTheatricalTechniques($locale: [String]) {
  entries(section: "theatricalTechniques", site: $locale, orderBy: "title") {
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
