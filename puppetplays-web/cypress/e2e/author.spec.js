import { getAuthorByIdQuery, getWorksOfAuthorQuery } from '../../lib/api';
import author from '../fixtures/author';
import works from '../fixtures/works';
import { getGraphQlRequestMock } from '../utils';

const getAuthorRequestBody = id => ({
  query: getAuthorByIdQuery,
  variables: { locale: 'fr', id },
});

const getWorksOfAuthorRequestBody = id => ({
  query: getWorksOfAuthorQuery,
  variables: { locale: 'fr', id },
});

describe('Author page', () => {
  beforeEach(() => {
    cy.task('activateNock');
  });

  afterEach(() => {
    cy.task('clearNock');
  });

  it('should display the page of an author', () => {
    cy.task(
      'nock',
      getGraphQlRequestMock(getAuthorRequestBody('5000'), author),
    );
    cy.task(
      'nock',
      getGraphQlRequestMock(getWorksOfAuthorRequestBody('5000'), works),
    );

    cy.visit('/auteurs/5000/bernard-jacquo');

    cy.get('main h1').should('have.text', 'Bernard Jacquo');

    cy.get('h2')
      .contains('Œuvres')
      .next('ul')
      .find('a')
      .should('have.length', 1);
    cy.get('h2')
      .contains('Œuvres')
      .next('ul')
      .find('a')
      .should('have.text', 'Une autre œuvre du répertoire');
  });
});
