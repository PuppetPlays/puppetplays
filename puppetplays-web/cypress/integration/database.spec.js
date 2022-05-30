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

const isGraphQlQuery = (queryName) => (req) => {
  return req.body.query.includes(queryName);
};

const aliasAndReply = (alias, body) => (req) => {
  req.alias = alias;
  req.reply(body);
};

const graphQlRouteHandler = cond([
  [
    isGraphQlQuery('GetAllWorksKeywords'),
    aliasAndReply('getAllWorksKeywords', keywords),
  ],
  [isGraphQlQuery('GetAllWorks'), aliasAndReply('getAllWorks', works)],
  [
    isGraphQlQuery('GetAllLanguages'),
    aliasAndReply('getAllLanguages', languages),
  ],
  [isGraphQlQuery('GetAllPlaces'), aliasAndReply('getAllPlaces', places)],
  [isGraphQlQuery('GetAllPersons'), aliasAndReply('getAllPersons', persons)],
  [
    isGraphQlQuery('GetAllAnimationTechniques'),
    aliasAndReply('getAllAnimationTechniques', animationTechniques),
  ],
  [
    isGraphQlQuery('GetAllLiteraryTones'),
    aliasAndReply('getAllLiteraryTones', literaryTones),
  ],
  [
    isGraphQlQuery('GetAllTheatricalTechniques'),
    aliasAndReply('getAllTheatricalTechniques', theatricalTechniques),
  ],
  [
    isGraphQlQuery('GetAllAudiences'),
    aliasAndReply('getAllAudiences', audiences),
  ],
  [isGraphQlQuery('GetAllFormats'), aliasAndReply('getAllFormats', formats)],
  [
    isGraphQlQuery('GetPeriodBounds'),
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

  cy.intercept('POST', 'http://puppetplays.ddev.site:7080/graphql', (req) =>
    graphQlRouteHandler(req),
  );

  cy.visit('/base-de-donnees');
  cy.wait([
    '@getAllWorks',
    '@getAllLanguages',
    '@getAllPersons',
    '@getAllAnimationTechniques',
    '@getAllLiteraryTones',
    '@getAllTheatricalTechniques',
    '@getAllAudiences',
    '@getAllFormats',
    '@getAllWorksKeywords',
    '@getPeriodBounds',
  ]);

  // Filter the database by "french" language
  selectFilterOption('mainLanguage', 'Français');
  cy.url().should('include', '/base-de-donnees?mainLanguage=1000&page=1');
  cy.wait('@getAllWorks')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.mainLanguage).to.eql(['1000']);
    });

  // Filter the database by "french or german" language
  selectFilterOption('mainLanguage', 'Allemand');
  cy.url().should('include', '/base-de-donnees?mainLanguage=1000,1300&page=1');
  cy.wait('@getAllWorks')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.mainLanguage).to.eql(['1000', '1300']);
    });

  // Remove the “french” language filter (filter by “german” language)
  cy.get('[aria-label="Remove Français"]').click();
  cy.url().should('include', '/base-de-donnees?mainLanguage=1300&page=1');
  cy.wait('@getAllWorks')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.mainLanguage).to.eql(['1300']);
    });

  // Reset all filters
  cy.get('button').contains('Tout effacer').click();
  cy.url().should('include', '/base-de-donnees?page=1');
  cy.wait('@getAllWorks')
    .its('request.body.variables')
    .should((variables) => {
      expect(variables.mainLanguage).to.be.undefined;
    });
});
