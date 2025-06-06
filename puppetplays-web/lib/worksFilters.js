import parseInteger from 'lodash/fp/parseInt';
import split from 'lodash/fp/split';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import mapValues from 'lodash/mapValues';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';

/* Query params
 *
 * ?mainLanguage=1,2
 * &compositionPlace=1,2
 * &compositionMinDate=1821
 * &compositionMaxDate=1920
 *
 */

/* Filters state
 *
 * {
 *    mainLanguage: ["1", "2"],
 *    compositionPlace: ["1", "2"],
 *    compositionMinDate: 1821,
 *    compositionMaxDate: 1920,
 * }
 *
 */

/* Graphql variables
 *
 * {
 *    mainLanguage: ["1", "2"],
 *    compositionPlace: ["1", "2"],
 *    compositionMinDate: ["and", ">= 1821", "<= 1920"],
 * }
 *
 */

/* Graphql query arguments
 *
 * `$mainLanguage: [QueryArgument]
 *  $compositionPlace: [QueryArgument]
 *  $compositionMinDate: [QueryArgument]`
 *
 */

/* Graphql entries params
 *
 * `mainLanguage: $mainLanguage
 *  compositionPlace: $compositionPlace
 *  compositionMinDate: $compositionMinDate`
 *
 */

const allowedFilters = [
  'mainLanguage',
  'compositionPlace',
  'compositionMinDate',
];

const stateToGraphqlVariablesMapper = {
  compositionMinDate: (filter, filters) => [
    'and',
    `>= ${filter}`,
    `<= ${filters.compositionMaxDate}`,
  ],
};

export function stateToGraphqlVariables(filters) {
  return mapValues(
    pick(omitBy(filters, isNil), allowedFilters),
    (filter, key) => {
      const mapper = stateToGraphqlVariablesMapper[key] || identity;
      return mapper(filter, filters);
    },
  );
}

const getAllowedNonNilFilterKeys = filters =>
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
  mainLanguage: split(','),
  compositionPlace: split(','),
  compositionMinDate: parseInteger(10),
  compositionMaxDate: parseInteger(10),
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
