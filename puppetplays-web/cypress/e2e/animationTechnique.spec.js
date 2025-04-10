import {
  getAnimationTechniqueByIdQuery,
  getWorksOfAnimationTechniqueQuery,
} from '../../lib/api';
import { getGraphQlRequestMock } from '../utils';
import animationTechnique from '../fixtures/animationTechnique';
import works from '../fixtures/works';

const getAnimationTechniqueRequestBody = id => ({
  query: getAnimationTechniqueByIdQuery,
  variables: { locale: 'fr', id },
});

const getWorksOfAnimationTechniqueRequestBody = id => ({
  query: getWorksOfAnimationTechniqueQuery,
  variables: { locale: 'fr', id },
});

describe('Animation technique page', () => {
  beforeEach(() => {
    cy.task('activateNock');
  });

  afterEach(() => {
    cy.task('clearNock');
  });

  it('should display the page of an animation technique', () => {
    cy.task(
      'nock',
      getGraphQlRequestMock(
        getAnimationTechniqueRequestBody('5000'),
        animationTechnique,
      ),
    );
    cy.task(
      'nock',
      getGraphQlRequestMock(
        getWorksOfAnimationTechniqueRequestBody('5000'),
        works,
      ),
    );

    cy.visit('/techniques-d-animation/5000/marionnettes-a-fils');

    cy.get('main h1').should('have.text', 'marionnettes à fils');

    cy.get('h2')
      .contains('Œuvres')
      .next('ul')
      .find('a')
      .should('have.length', 2);
  });
});
