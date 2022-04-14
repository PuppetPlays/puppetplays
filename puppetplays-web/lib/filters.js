import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import identity from 'lodash/identity';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import split from 'lodash/fp/split';
import parseInteger from 'lodash/fp/parseInt';

const authorsAllowedFilters = ['languages', 'places', 'gender', 'type'];

const worksAllowedFilters = [
  'mainLanguage',
  'compositionPlace',
  'compositionMinDate',
  'authors',
  'literaryTones',
  'animationTechniques',
  'audience',
  'formats',
  'relatedToTags',
  'publicDomain',
];

const getAllowedNonNilFilterKeys = (allowedFilters) => (filters) =>
  Object.keys(pick(omitBy(filters, isNil), allowedFilters));

const reduceQueryArguments = (arr, mappers) =>
  arr.reduce((acc, key) => {
    const argumentType = mappers[key] || '[QueryArgument]';
    acc += `, $${key}: ${argumentType}`;
    return acc;
  }, '');

const reduceEntriesParams = (arr, mappers) =>
  arr.reduce((acc, key) => {
    const params = mappers[key] || `${key}: $${key}`;
    acc += `, ${params}`;
    return acc;
  }, '');

const stateToGraphqlVariables = (allowedFilters, mappers = {}) => (filters) => {
  return mapValues(
    pick(omitBy(filters, isNil), allowedFilters),
    (filter, key) => {
      const mapper = mappers[key] || identity;
      return mapper(filter, filters);
    },
  );
};

const stateToGraphqlQueryArgument = (allowedFilters, mappers = {}) => (
  filters,
) => {
  return reduceQueryArguments(
    getAllowedNonNilFilterKeys(allowedFilters)(filters),
    mappers,
  );
};

const stateToGraphqlEntriesParams = (allowedFilters, mappers = {}) => (
  filters,
) => {
  return reduceEntriesParams(
    getAllowedNonNilFilterKeys(allowedFilters)(filters),
    mappers,
  );
};

const queryParamsToState = (mappers) => (queryParams) => {
  return mapValues(
    pick(omitBy(queryParams, isNil), Object.keys(mappers)),
    (filter, key) => {
      const mapper = mappers[key];
      if (!mapper) {
        throw new Error(
          `A mapper function is required for all filters, provide one for “${key}” filter`,
        );
      }
      return mappers[key](filter);
    },
  );
};

export const authorsStateToGraphqlVariables = stateToGraphqlVariables(
  authorsAllowedFilters,
);
export const worksStateToGraphqlVariables = stateToGraphqlVariables(
  worksAllowedFilters,
  {
    compositionMinDate: (filter, filters) => [
      'and',
      `>= ${filter}`,
      `<= ${filters.compositionMaxDate}`,
    ],
  },
);

export const authorsStateToGraphqlQueryArgument = stateToGraphqlQueryArgument(
  authorsAllowedFilters,
  {
    type: '[String]',
  },
);
export const worksStateToGraphqlQueryArgument = stateToGraphqlQueryArgument(
  worksAllowedFilters,
  {
    publicDomain: 'Boolean',
  },
);

export const authorsStateToGraphqlEntriesParams = stateToGraphqlEntriesParams(
  authorsAllowedFilters,
);
export const worksStateToGraphqlEntriesParams = stateToGraphqlEntriesParams(
  worksAllowedFilters,
  {
    relatedToTags: 'relatedToTags: { id: $relatedToTags }',
  },
);

// There’s no default mapper function, so be sure to provide one for all filters
export const authorsQueryParamsToState = queryParamsToState({
  languages: split(','),
  places: split(','),
  gender: identity,
  type: identity,
});

// There’s no default mapper function, so be sure to provide one for all filters
export const worksQueryParamsToState = queryParamsToState({
  mainLanguage: split(','),
  compositionPlace: split(','),
  compositionMinDate: parseInteger(10),
  compositionMaxDate: parseInteger(10),
  authors: split(','),
  literaryTones: split(','),
  animationTechniques: split(','),
  audience: split(','),
  formats: split(','),
  relatedToTags: split(','),
  publicDomain: (filter) => (filter === 'true' ? true : undefined),
  view: identity,
});

export const authorsQueryParamsToGraphqlVariables = (queryParams) =>
  authorsStateToGraphqlVariables(authorsQueryParamsToState(queryParams));

export const worksQueryParamsToGraphqlVariables = (queryParams) =>
  worksStateToGraphqlVariables(worksQueryParamsToState(queryParams));
