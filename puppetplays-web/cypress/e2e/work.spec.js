import { getWorkByIdQuery } from '../../lib/api';
import work from '../fixtures/work';
import { getGraphQlRequestMock } from '../utils';

const getWorkRequestBody = id => ({
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
    cy.get('h2').contains('sous-titre').should('exist');

    cy.get('h1')
      .contains('Auteur(s)')
      .parents('section')
      .find('a')
      .each(link => {
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

  it.skip('should open and close the author menu', () => {
    cy.task('nock', getGraphQlRequestMock(getWorkRequestBody('2000'), work));

    cy.visit('/oeuvres/2000/une-oeuvre-du-repertoire');

    // Click the menu button
    cy.get(
      '[data-testid="work-header-authors"] button[aria-label="Menu"]',
    ).click();

    // Look for any dropdown/popup that appears with a more relaxed selector
    cy.get('body')
      .find(
        '[role="menu"], .dropdown-menu, .popup-menu, [aria-label*="menu"], .menu, [id*="menu"]',
      )
      .should('exist');

    // Click somewhere else to close the menu
    cy.get('body').click(10, 10); // Click at top-left corner of the page

    // Verify that all menus are gone with the same relaxed selector
    cy.get('body')
      .find(
        '[role="menu"], .dropdown-menu, .popup-menu, [aria-label*="menu"], .menu, [id*="menu"]',
      )
      .should('not.exist');
  });
});
