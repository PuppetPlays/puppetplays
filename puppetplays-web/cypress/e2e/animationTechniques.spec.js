import { cond, noop, stubTrue } from 'lodash';

import { getAllAnimationsTechniquesQuery } from '../../lib/api';
import animationTechniques from '../fixtures/animationTechniques';
import { isGraphQlQuery, aliasAndReply, getGraphQlRequestMock } from '../utils';

const graphQlRouteHandler = cond([
  [
    isGraphQlQuery('GetAllAnimationTechniques'),
    aliasAndReply('getAllAnimationTechniques', animationTechniques),
  ],
  [stubTrue, noop],
]);

const getAllAnimationTechniquesRequestBody = ({ locale = 'fr' } = {}) => ({
  query: getAllAnimationsTechniquesQuery,
  variables: { locale },
});

describe('Animation techniques page', () => {
  beforeEach(() => {
    cy.task('activateNock');
  });

  afterEach(() => {
    cy.task('clearNock');
  });

  it('should display the animation techniques page', () => {
    cy.task(
      'nock',
      getGraphQlRequestMock(
        getAllAnimationTechniquesRequestBody(),
        animationTechniques,
      ),
    );

    cy.intercept(
      'POST',
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      graphQlRouteHandler,
    );

    cy.visit('/techniques-d-animation');
  });
});
