import { cond, noop, stubTrue } from 'lodash';
import { getAllWorksQuery } from '../../lib/api';
import works from '../fixtures/works';
import languages from '../fixtures/languages';
import places from '../fixtures/places';
import persons from '../fixtures/persons';
import animationTechniques from '../fixtures/animationTechniques';
import literaryTones from '../fixtures/literaryTones';
import theatricalTechniques from '../fixtures/theatricalTechniques';
import audiences from '../fixtures/audiences';
import formats from '../fixtures/formats';
import keywords from '../fixtures/keywords';

const isGraphQlQuery = (queryName) => (req) =>
  req.body.query.includes(queryName);

const aliasAndReply = (alias, body) => (req) => {
  req.alias = alias;
  req.reply(body);
};

const graphQlRouteHandler = cond([
  [isGraphQlQuery('query GetAllWorks'), aliasAndReply('getAllWorks', works)],
  [
    isGraphQlQuery('query GetAllLanguages'),
    aliasAndReply('getAllLanguages', languages),
  ],
  [isGraphQlQuery('query GetAllPlaces'), aliasAndReply('getAllPlaces', places)],
  [
    isGraphQlQuery('query GetAllPersons'),
    aliasAndReply('getAllPersons', persons),
  ],
  [
    isGraphQlQuery('query GetAllAnimationTechniques'),
    aliasAndReply('getAllAnimationTechniques', animationTechniques),
  ],
  [
    isGraphQlQuery('query GetAllLiteraryTones'),
    aliasAndReply('getAllLiteraryTones', literaryTones),
  ],
  [
    isGraphQlQuery('query GetAllTheatricalTechniques'),
    aliasAndReply('getAllTheatricalTechniques', theatricalTechniques),
  ],
  [
    isGraphQlQuery('query GetAllAudiences'),
    aliasAndReply('getAllAudiences', audiences),
  ],
  [
    isGraphQlQuery('query GetAllFormats'),
    aliasAndReply('getAllFormats', formats),
  ],
  [
    isGraphQlQuery('query GetAllWorksKeywords'),
    aliasAndReply('getAllWorksKeywords', keywords),
  ],
  [
    isGraphQlQuery('query GetPeriodBounds'),
    aliasAndReply('getPeriodBounds', {
      data: { min: [{ value: 1720 }], max: [{ value: 1920 }] },
    }),
  ],
  [stubTrue, noop],
]);

const getGraphQlRequestMock = (reqBody, resBody) => ({
  hostname: 'http://puppetplays.ddev.site:7080',
  method: 'POST',
  path: '/graphql',
  reqBody,
  statusCode: 200,
  body: resBody,
});

const getAllWorksRequestBody = (
  { locale = 'fr', offset = null, limit = 10, search = '', ...rest } = {},
  filters = {},
) => ({
  query: getAllWorksQuery(filters),
  variables: { locale, offset, limit, search, ...rest },
});

const selectFilterOption = (filterKey, optionLabel) => {
  cy.get(`input[aria-labelledby="aria-label-of-${filterKey}"]`).click();
  cy.get(`#react-select-select-id-${filterKey}-listbox`)
    .contains(optionLabel)
    .click();
};

beforeEach(() => {
  cy.task('clearNock');
});

it('should allow to filter the database by languages', () => {
  cy.task('nock', getGraphQlRequestMock(getAllWorksRequestBody(), works));

  cy.intercept(
    'POST',
    'http://puppetplays.ddev.site:7080/graphql',
    graphQlRouteHandler,
  );

  cy.visit('/base-de-donnees');

  // Filter the database by "french" language
  selectFilterOption('mainLanguage', 'Français');
  cy.url().should('include', '/base-de-donnees?mainLanguage=1000&page=1');
  cy.wait('@getAllWorks');

  // Filter the database by "french or german" language
  selectFilterOption('mainLanguage', 'Allemand');
  cy.url().should('include', '/base-de-donnees?mainLanguage=1000,1300&page=1');
  cy.wait('@getAllWorks');

  // Remove the “french” language filter (filter by “german” language)
  cy.get('[aria-label="Remove Français"]').click();
  cy.url().should('include', '/base-de-donnees?mainLanguage=1300&page=1');
  cy.wait('@getAllWorks');

  // Reset all filters
  cy.get('button').contains('Tout effacer').click();
  cy.url().should('include', '/base-de-donnees?page=1');
  cy.wait('@getAllWorks');
});
