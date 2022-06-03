import { getWorkByIdQuery } from '../../lib/api';
import { getGraphQlRequestMock } from '../utils';
import work from '../fixtures/work';

const getWorkRequestBody = (id) => ({
  query: getWorkByIdQuery,
  variables: { locale: 'fr', id },
});

describe('Work page', () => {
  beforeEach(() => {
    cy.task('activateNock');
  });

  afterEach(() => {
    cy.task('clearNock');
  });

  it('should display the page of a work', () => {
    cy.task('nock', getGraphQlRequestMock(getWorkRequestBody('2000'), work));

    cy.visit('/oeuvres/2000/une-oeuvre-du-repertoire');

    cy.get('h1').contains('Une œuvre du répertoire').should('exist');
    cy.get('h2').contains('Le sous-titre de l’œuvre').should('exist');

    cy.get('h1')
      .contains('Auteur(s)')
      .parents('section')
      .find('a')
      .each((link) => {
        cy.wrap(link).should(
          'have.attr',
          'href',
          '/auteurs/3000/fran%C3%A7oise-dufour',
        );
      });

    cy.get('h1')
      .contains('Mots-clés')
      .parents('section')
      .find('a')
      .each((link, index) => {
        cy.wrap(link).should(
          'have.attr',
          'href',
          `/base-de-donnees?relatedToTags=${(index + 1) * 100 + 1000}`,
        );
      });
  });

  it('should open and close the author menu', () => {
    cy.task('nock', getGraphQlRequestMock(getWorkRequestBody('2000'), work));

    cy.visit('/oeuvres/2000/une-oeuvre-du-repertoire');

    cy.get(
      '[data-testid="work-header-authors"] button[aria-label="Menu"]',
    ).click();
    cy.get('#floating-ui-root [role="menu"]').should('exist');

    cy.get('[data-testid="work-header-authors"]').click();
    cy.get('#floating-ui-root [role="menu"]').should('not.exist');
  });
});
