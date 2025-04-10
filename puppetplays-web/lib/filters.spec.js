import {
  worksStateToGraphqlVariables,
  worksStateToGraphqlQueryArgument,
  worksStateToGraphqlEntriesParams,
  worksQueryParamsToState,
  worksQueryParamsToGraphqlVariables,
} from './filters';

const filtersState = {
  mainLanguage: ['1', '2'],
  compositionPlace: ['1', '2'],
  compositionMinDate: [1821, 1920],
};

const queryParams = {
  mainLanguage: '1,2',
  compositionPlace: '1,2',
  compositionMinDate: '1821,1920',
};

describe('worksStateToGraphqlVariables', () => {
  test('should return graphql variables from the state', () => {
    const graphqlVariables = worksStateToGraphqlVariables(filtersState);

    expect(graphqlVariables).toEqual({
      mainLanguage: ['1', '2'],
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });

  test('should omit nil filters', () => {
    const localFiltersState = { ...filtersState, mainLanguage: null };
    const graphqlVariables = worksStateToGraphqlVariables(localFiltersState);

    expect(graphqlVariables).toEqual({
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });
});

describe('worksStateToGraphqlQueryArgument', () => {
  test('should return graphql query arguments from the state', () => {
    const graphqlQueryArguments =
      worksStateToGraphqlQueryArgument(filtersState);

    expect(graphqlQueryArguments).toEqual(
      ', $mainLanguage: [QueryArgument], $compositionPlace: [QueryArgument], $compositionMinDate: [QueryArgument]',
    );
  });

  test('should omit nil filters', () => {
    const localFiltersState = { ...filtersState, mainLanguage: null };
    const graphqlQueryArguments =
      worksStateToGraphqlQueryArgument(localFiltersState);

    expect(graphqlQueryArguments).toEqual(
      ', $compositionPlace: [QueryArgument], $compositionMinDate: [QueryArgument]',
    );
  });

  test('should handle an empty object', () => {
    const state = worksStateToGraphqlQueryArgument({});

    expect(state).toEqual('');
  });
});

describe('worksStateToGraphqlEntriesParams', () => {
  test('should return graphql entries params from the state', () => {
    const graphqlEntriesParams = worksStateToGraphqlEntriesParams(filtersState);

    expect(graphqlEntriesParams).toEqual(
      ', mainLanguage: $mainLanguage, compositionPlace: $compositionPlace, compositionMinDate: $compositionMinDate',
    );
  });

  test('should omit nil filters', () => {
    const localFiltersState = { ...filtersState, mainLanguage: null };
    const graphqlEntriesParams =
      worksStateToGraphqlEntriesParams(localFiltersState);

    expect(graphqlEntriesParams).toEqual(
      ', compositionPlace: $compositionPlace, compositionMinDate: $compositionMinDate',
    );
  });

  test('should handle an empty object', () => {
    const state = worksStateToGraphqlQueryArgument({});

    expect(state).toEqual('');
  });
});

describe('worksQueryParamsToState', () => {
  test('should return state from query params', () => {
    const state = worksQueryParamsToState(queryParams);

    expect(state).toEqual(filtersState);
  });

  test('should omit nil filters', () => {
    const localQueryParams = { ...queryParams, mainLanguage: null };
    const state = worksQueryParamsToState(localQueryParams);

    expect(state).toEqual({
      compositionPlace: ['1', '2'],
      compositionMinDate: [1821, 1920],
    });
  });

  test('should handle an empty object', () => {
    const state = worksQueryParamsToState({});

    expect(state).toEqual({});
  });
});

describe('worksQueryParamsToGraphqlVariables', () => {
  test('should return graphql variables from query params', () => {
    const graphqlVariables = worksQueryParamsToGraphqlVariables(queryParams);

    expect(graphqlVariables).toEqual({
      mainLanguage: ['1', '2'],
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });

  test('should omit nil filters', () => {
    const localQueryParams = { ...queryParams, mainLanguage: null };
    const graphqlVariables =
      worksQueryParamsToGraphqlVariables(localQueryParams);

    expect(graphqlVariables).toEqual({
      compositionPlace: ['1', '2'],
      compositionMinDate: ['and', '>= 1821', '<= 1920'],
    });
  });
});
