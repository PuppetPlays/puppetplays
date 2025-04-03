import { cond, noop, stubTrue } from 'lodash';
import { getAllAuthorsQuery, getAllWorksAuthorsIdsQuery } from '../../lib/api';
import {
  isGraphQlQuery,
  aliasAndReply,
  getGraphQlRequestMock,
  selectFilterOption,
  getSelectFilterSelectedValue,
  getSelectFilterSelectedSingleValue,
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

const getAllAuthorsRequestBody = ({ locale = 'fr', ...filters } = {}) => ({
  query: getAllAuthorsQuery(filters),
  variables: { locale, ...filters },
});

describe('Authors page', () => {
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
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
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

  it('should fill the filters according to the url query params', () => {
    const filters = {
      gender: 'female',
      languages: ['1000', '1300'],
      places: ['1300'],
      type: 'persons',
    };
    cy.task(
      'nock',
      getGraphQlRequestMock(getAllWorksAuthorsIdsRequestBody(), works),
    );
    cy.task(
      'nock',
      getGraphQlRequestMock(getAllAuthorsRequestBody(filters), authors),
    );

    cy.intercept(
      'POST',
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      graphQlRouteHandler,
    );

    cy.visit(
      '/auteurs?gender=female&languages=1000,1300&places=1300&type=persons',
    );
    cy.wait(['@getAllAuthors', '@getAllLanguages', '@getAllPlaces']);

    getSelectFilterSelectedValue('languages', 'Allemand').should('exist');
    getSelectFilterSelectedValue('languages', 'Français').should('exist');
    getSelectFilterSelectedValue('places', 'Vienne').should('exist');
    getSelectFilterSelectedSingleValue('gender', 'Femme').should('exist');
    getSelectFilterSelectedSingleValue('type', 'Auteur').should('exist');
  });
});
