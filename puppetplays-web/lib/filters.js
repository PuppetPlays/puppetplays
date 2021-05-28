import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import identity from 'lodash/identity';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import split from 'lodash/fp/split';
import parseInteger from 'lodash/fp/parseInt';

const authorsAllowedFilters = ['languages', 'places', 'gender'];

const worksAllowedFilters = [
  'mainLanguage',
  'compositionPlace',
  'compositionMinDate',
  'authors',
  'literaryTones',
  'animationTechniques',
  'audience',
  'formats',
  'publicDomain',
];

const getAllowedNonNilFilterKeys = (allowedFilters) => (filters) =>
  Object.keys(pick(omitBy(filters, isNil), allowedFilters));

const reduceQueryArguments = (arr, filters) =>
  arr.reduce((acc, key) => {
    const argumentType =
      typeof filters[key] === 'boolean' ? 'Boolean' : '[QueryArgument]';
    acc += `, $${key}: ${argumentType}`;
    return acc;
  }, '');

const reduceEntriesParams = (arr) =>
  arr.reduce((acc, key) => {
    acc += `, ${key}: $${key}`;
    return acc;
  }, '');

const stateToGraphqlVariables = (mappers, allowedFilters) => (filters) => {
  return mapValues(
    pick(omitBy(filters, isNil), allowedFilters),
    (filter, key) => {
      const mapper = mappers[key] || identity;
      return mapper(filter, filters);
    },
  );
};

const stateToGraphqlQueryArgument = (allowedFilters) => (filters) => {
  return reduceQueryArguments(
    getAllowedNonNilFilterKeys(allowedFilters)(filters),
    filters,
  );
};

const stateToGraphqlEntriesParams = (allowedFilters) => (filters) => {
  return reduceEntriesParams(
    getAllowedNonNilFilterKeys(allowedFilters)(filters),
  );
};

const queryParamsToState = (mappers) => (queryParams) => {
  return mapValues(
    pick(omitBy(queryParams, isNil), Object.keys(mappers)),
    (filter, key) => {
      const mapper = mappers[key] || identity;
      return mapper(filter);
    },
  );
};

export const authorsStateToGraphqlVariables = stateToGraphqlVariables(
  {},
  authorsAllowedFilters,
);
export const worksStateToGraphqlVariables = stateToGraphqlVariables(
  {
    compositionMinDate: (filter, filters) => [
      'and',
      `>= ${filter}`,
      `<= ${filters.compositionMaxDate}`,
    ],
  },
  worksAllowedFilters,
);

export const authorsStateToGraphqlQueryArgument = stateToGraphqlQueryArgument(
  authorsAllowedFilters,
);
export const worksStateToGraphqlQueryArgument = stateToGraphqlQueryArgument(
  worksAllowedFilters,
);

export const authorsStateToGraphqlEntriesParams = stateToGraphqlEntriesParams(
  authorsAllowedFilters,
);
export const worksStateToGraphqlEntriesParams = stateToGraphqlEntriesParams(
  worksAllowedFilters,
);

export const authorsQueryParamsToState = queryParamsToState({
  languages: split(','),
  places: split(','),
  gender: split(','),
});

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
  publicDomain: (filter) => (filter === 'true' ? true : false),
});

export const authorsQueryParamsToGraphqlVariables = (queryParams) =>
  authorsStateToGraphqlVariables(authorsQueryParamsToState(queryParams));

export const worksQueryParamsToGraphqlVariables = (queryParams) =>
  worksStateToGraphqlVariables(worksQueryParamsToState(queryParams));
