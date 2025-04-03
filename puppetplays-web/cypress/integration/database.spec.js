import { cond, noop, stubTrue } from 'lodash';
import { getAllWorksQuery } from '../../lib/api';
import {
  isGraphQlQuery,
  aliasAndReply,
  getGraphQlRequestMock,
  selectFilterOption,
  getSelectFilterSelectedValue,
} from '../utils';
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
  [
    isGraphQlQuery('GetLanguagesByIds'),
    aliasAndReply('getLanguagesByIds', languages),
  ],
  [isGraphQlQuery('GetAllPlaces'), aliasAndReply('getAllPlaces', places)],
  [isGraphQlQuery('GetPlacesByIds'), aliasAndReply('getPlacesByIds', places)],
  [isGraphQlQuery('GetAllPersons'), aliasAndReply('getAllPersons', persons)],
  [
    isGraphQlQuery('GetPersonsByIds'),
    aliasAndReply('getPersonsByIds', persons),
  ],
  [
    isGraphQlQuery('GetAllAnimationTechniques'),
    aliasAndReply('getAllAnimationTechniques', animationTechniques),
  ],
  [
    isGraphQlQuery('GetAnimationTechniquesByIds'),
    aliasAndReply('getAnimationTechniquesByIds', animationTechniques),
  ],
  [
    isGraphQlQuery('GetAllLiteraryTones'),
    aliasAndReply('getAllLiteraryTones', literaryTones),
  ],
  [
    isGraphQlQuery('GetLiteraryTonesByIds'),
    aliasAndReply('getLiteraryTonesByIds', literaryTones),
  ],
  [
    isGraphQlQuery('GetAllTheatricalTechniques'),
    aliasAndReply('getAllTheatricalTechniques', theatricalTechniques),
  ],
  [
    isGraphQlQuery('GetTheatricalTechniquesByIds'),
    aliasAndReply('getTheatricalTechniquesByIds', theatricalTechniques),
  ],
  [
    isGraphQlQuery('GetAllAudiences'),
    aliasAndReply('getAllAudiences', audiences),
  ],
  [
    isGraphQlQuery('GetAudiencesByIds'),
    aliasAndReply('getAudiencesByIds', audiences),
  ],
  [isGraphQlQuery('GetAllFormats'), aliasAndReply('getAllFormats', formats)],
  [
    isGraphQlQuery('GetFormatsByIds'),
    aliasAndReply('getFormatsByIds', formats),
  ],
  [
    isGraphQlQuery('GetPeriodBounds'),
    aliasAndReply('getPeriodBounds', {
      data: { min: [{ value: 1720 }], max: [{ value: 1920 }] },
    }),
  ],
  [stubTrue, noop],
]);

const getAllWorksRequestBody = ({
  locale = 'fr',
  offset = null,
  limit = 10,
  search = '',
  ...filters
} = {}) => ({
  query: getAllWorksQuery(filters),
  variables: { locale, offset, limit, search, ...filters },
});

describe('Database page', () => {
  beforeEach(() => {
    cy.task('activateNock');
  });

  afterEach(() => {
    cy.task('clearNock');
  });

  it('should allow to filter the database by languages', () => {
    cy.task('nock', getGraphQlRequestMock(getAllWorksRequestBody(), works));

    cy.intercept(
      'POST',
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      graphQlRouteHandler,
    );

    cy.visit('/base-de-donnees');
    cy.wait(['@getAllWorks', '@getPeriodBounds']);

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
    cy.url().should(
      'include',
      '/base-de-donnees?mainLanguage=1000,1300&page=1',
    );
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

  it('should fill the filters according to the url query params', () => {
    const filters = {
      mainLanguage: ['1000', '1300'],
      compositionPlace: ['1300'],
      authors: ['5000'],
      literaryTones: ['2000'],
      animationTechniques: ['5000'],
      theatricalTechniques: ['1200'],
      audience: ['2000'],
      formats: ['1000'],
      relatedToTags: ['1100'],
      publicDomain: true,
    };
    cy.task(
      'nock',
      getGraphQlRequestMock(getAllWorksRequestBody(filters), works),
    );

    cy.intercept(
      'POST',
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      graphQlRouteHandler,
    );

    cy.visit(
      '/base-de-donnees?mainLanguage=1000,1300&compositionPlace=1300&authors=5000&literaryTones=2000&animationTechniques=5000&theatricalTechniques=1200&audience=2000&formats=1000&relatedToTags=1100&publicDomain=true',
    );
    cy.wait([
      '@getAllWorks',
      '@getPeriodBounds',
      '@getLanguagesByIds',
      '@getPlacesByIds',
      '@getPersonsByIds',
      '@getLiteraryTonesByIds',
      '@getAnimationTechniquesByIds',
      '@getTheatricalTechniquesByIds',
      '@getAudiencesByIds',
      '@getFormatsByIds',
      '@getAllWorksKeywords',
    ]);

    getSelectFilterSelectedValue('mainLanguage', 'Allemand').should('exist');
    getSelectFilterSelectedValue('mainLanguage', 'Français').should('exist');

    getSelectFilterSelectedValue('compositionPlace', 'Vienne').should('exist');

    getSelectFilterSelectedValue('authors', 'Jacquo Bernard').should('exist');

    getSelectFilterSelectedValue('literaryTones', 'loufoque').should('exist');

    getSelectFilterSelectedValue(
      'animationTechniques',
      'marionnettes à fils',
    ).should('exist');

    getSelectFilterSelectedValue('theatricalTechniques', 'Le mime').should(
      'exist',
    );

    getSelectFilterSelectedValue('audience', 'jeunesse').should('exist');

    getSelectFilterSelectedValue('formats', 'manuscrit').should('exist');

    cy.get('input[aria-labelledby="aria-label-of-publicDomain"]').should(
      'be.checked',
    );
  });

  it('should allow to search the database', () => {
    cy.task('nock', getGraphQlRequestMock(getAllWorksRequestBody(), works));

    cy.intercept(
      'POST',
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      graphQlRouteHandler,
    );

    cy.visit('/base-de-donnees');
    cy.wait(['@getAllWorks', '@getPeriodBounds']);

    cy.get('input[name="search"]').type('polux');

    cy.url().should('include', '/base-de-donnees?page=1&search=polux');
    cy.wait('@getAllWorks')
      .its('request.body.variables')
      .should((variables) => {
        expect(variables.search).to.equal('polux');
      });

    cy.get('input[name="search"]').next('button').click();

    cy.url().should('include', '/base-de-donnees?page=1&search=');
    cy.wait('@getAllWorks')
      .its('request.body.variables')
      .should((variables) => {
        expect(variables.search).to.equal('');
      });
  });
});
