import {
  stateToGraphqlVariables,
  stateToGraphqlQueryArgument,
  stateToGraphqlEntriesParams,
  queryParamsToState,
  queryParamsToGraphqlVariables,
} from './worksFilters';

const filtersState = {
  mainLanguage: ['1', '2'],
  compositionPlace: ['1', '2'],
  compositionMinDate: 1821,
  compositionMaxDate: 1920,
};

const queryParams = {
  mainLanguage: '1,2',
  compositionPlace: '1,2',
  compositionMinDate: '1821',
  compositionMaxDate: '1920',
};

describe('stateToGraphqlVariables', () => {
  test('should return graphql variables from the state', () => {
    const graphqlVariables = stateToGraphqlVariables(filtersState);

    expect(graphqlVariables).toEqual({
      mainLanguage: ['1', '2'],
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });

  test('should omit nil filters', () => {
    const localFiltersState = { ...filtersState, mainLanguage: null };
    const graphqlVariables = stateToGraphqlVariables(localFiltersState);

    expect(graphqlVariables).toEqual({
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });
});

describe('stateToGraphqlQueryArgument', () => {
  test('should return graphql query arguments from the state', () => {
    const graphqlQueryArguments = stateToGraphqlQueryArgument(filtersState);

    expect(graphqlQueryArguments).toEqual(
      ', $mainLanguage: [QueryArgument], $compositionPlace: [QueryArgument], $compositionMinDate: [QueryArgument]',
    );
  });

  test('should omit nil filters', () => {
    const localFiltersState = { ...filtersState, mainLanguage: null };
    const graphqlQueryArguments = stateToGraphqlQueryArgument(
      localFiltersState,
    );

    expect(graphqlQueryArguments).toEqual(
      ', $compositionPlace: [QueryArgument], $compositionMinDate: [QueryArgument]',
    );
  });

  test('should handle an empty object', () => {
    const state = stateToGraphqlQueryArgument({});

    expect(state).toEqual('');
  });
});

describe('stateToGraphqlEntriesParams', () => {
  test('should return graphql entries params from the state', () => {
    const graphqlEntriesParams = stateToGraphqlEntriesParams(filtersState);

    expect(graphqlEntriesParams).toEqual(
      ', mainLanguage: $mainLanguage, compositionPlace: $compositionPlace, compositionMinDate: $compositionMinDate',
    );
  });

  test('should omit nil filters', () => {
    const localFiltersState = { ...filtersState, mainLanguage: null };
    const graphqlEntriesParams = stateToGraphqlEntriesParams(localFiltersState);

    expect(graphqlEntriesParams).toEqual(
      ', compositionPlace: $compositionPlace, compositionMinDate: $compositionMinDate',
    );
  });

  test('should handle an empty object', () => {
    const state = stateToGraphqlQueryArgument({});

    expect(state).toEqual('');
  });
});

describe('queryParamsToState', () => {
  test('should return state from query params', () => {
    const state = queryParamsToState(queryParams);

    expect(state).toEqual(filtersState);
  });

  test('should omit nil filters', () => {
    const localQueryParams = { ...queryParams, mainLanguage: null };
    const state = queryParamsToState(localQueryParams);

    expect(state).toEqual({
      compositionPlace: ['1', '2'],
      compositionMinDate: 1821,
      compositionMaxDate: 1920,
    });
  });

  test('should handle an empty object', () => {
    const state = queryParamsToState({});

    expect(state).toEqual({});
  });
});

describe('queryParamsToGraphqlVariables', () => {
  test('should return graphql variables from query params', () => {
    const graphqlVariables = queryParamsToGraphqlVariables(queryParams);

    expect(graphqlVariables).toEqual({
      mainLanguage: ['1', '2'],
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });

  test('should omit nil filters', () => {
    const localQueryParams = { ...queryParams, mainLanguage: null };
    const graphqlVariables = queryParamsToGraphqlVariables(localQueryParams);

    expect(graphqlVariables).toEqual({
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });
});
