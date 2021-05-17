import omitBy from 'lodash/omitBy';
import isNil from 'lodash/isNil';
import identity from 'lodash/identity';
import mapValues from 'lodash/mapValues';
import pick from 'lodash/pick';
import split from 'lodash/fp/split';

const allowedFilters = ['languages', 'places'];

const stateToGraphqlVariablesMapper = {};

export function stateToGraphqlVariables(filters) {
  return mapValues(
    pick(omitBy(filters, isNil), allowedFilters),
    (filter, key) => {
      const mapper = stateToGraphqlVariablesMapper[key] || identity;
      return mapper(filter, filters);
    },
  );
}

const getAllowedNonNilFilterKeys = (filters) =>
  Object.keys(pick(omitBy(filters, isNil), allowedFilters));

export function stateToGraphqlQueryArgument(filters) {
  return getAllowedNonNilFilterKeys(filters).reduce((acc, key) => {
    acc += `, $${key}: [QueryArgument]`;
    return acc;
  }, '');
}

export function stateToGraphqlEntriesParams(filters) {
  return getAllowedNonNilFilterKeys(filters).reduce((acc, key) => {
    acc += `, ${key}: $${key}`;
    return acc;
  }, '');
}

const queryParamsToStateMapper = {
  languages: split(','),
  places: split(','),
};

export function queryParamsToState(queryParams) {
  return mapValues(
    pick(omitBy(queryParams, isNil), Object.keys(queryParamsToStateMapper)),
    (filter, key) => {
      const mapper = queryParamsToStateMapper[key] || identity;
      return mapper(filter);
    },
  );
}

export function queryParamsToGraphqlVariables(queryParams) {
  return stateToGraphqlVariables(queryParamsToState(queryParams));
}
