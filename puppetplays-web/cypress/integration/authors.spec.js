import { cond, noop, stubTrue } from 'lodash';
import { getAllAuthorsQuery, getAllWorksAuthorsIdsQuery } from '../../lib/api';
import {
  isGraphQlQuery,
  aliasAndReply,
  getGraphQlRequestMock,
  selectFilterOption,
} from '../utils';
import works from '../fixtures/works';
import authors from '../fixtures/persons';
import languages from '../fixtures/languages';
import places from '../fixtures/places';

const graphQlRouteHandler = cond([
  [isGraphQlQuery('GetAllAuthors'), aliasAndReply('getAllAuthors', authors)],
  [
    isGraphQlQuery('GetAllLanguages'),
    aliasAndReply('getAllLanguages', languages),
  ],
  [isGraphQlQuery('GetAllPlaces'), aliasAndReply('getAllPlaces', places)],
  [stubTrue, noop],
]);

const getAllWorksAuthorsIdsRequestBody = ({ locale = 'fr' } = {}) => ({
  query: getAllWorksAuthorsIdsQuery,
  variables: { locale },
});

const getAllAuthorsRequestBody = (
  { locale = 'fr', ...rest } = {},
  filters = {},
) => ({
  query: getAllAuthorsQuery(filters),
  variables: { locale, ...rest },
});

beforeEach(() => {
  cy.task('activateNock');
});

afterEach(() => {
  cy.task('clearNock');
});

it('should allow to filter the authors by languages', () => {
  cy.task(
    'nock',
    getGraphQlRequestMock(getAllWorksAuthorsIdsRequestBody(), works),
  );
  cy.task('nock', getGraphQlRequestMock(getAllAuthorsRequestBody(), authors));

  cy.intercept(
    'POST',
    'http://puppetplays.ddev.site:7080/graphql',
    graphQlRouteHandler,
  );

  cy.visit('/auteurs');
  cy.wait(['@getAllAuthors', '@getAllLanguages', '@getAllPlaces']);

  // Filter the authors by "french" language
  selectFilterOption('languages', 'Français');
  cy.url().should('include', '/auteurs?languages=1000');
  cy.wait('@getAllAuthors')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.languages).to.eql(['1000']);
    });

  // Filter the authors by "french or german" language
  selectFilterOption('languages', 'Allemand');
  cy.url().should('include', '/auteurs?languages=1000,1300');
  cy.wait('@getAllAuthors')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.languages).to.eql(['1000', '1300']);
    });

  // Remove the “french” language filter (filter by “german” language)
  cy.get('[aria-label="Remove Français"]').click();
  cy.url().should('include', '/auteurs?languages=1300');
  cy.wait('@getAllAuthors')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.languages).to.eql(['1300']);
    });

  // Reset all filters
  cy.get('button').contains('Tout effacer').click();
  cy.url().should('include', '/auteurs');
  cy.wait('@getAllAuthors')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.languages).to.be.undefined;
    });
});
