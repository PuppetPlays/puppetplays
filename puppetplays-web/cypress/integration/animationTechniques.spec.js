import { cond, noop, stubTrue } from 'lodash';
import { getAllAnimationsTechniquesQuery } from '../../lib/api';
import {
  isGraphQlQuery,
  aliasAndReply,
  getGraphQlRequestMock,
  selectFilterOption,
} from '../utils';
import animationTechniques from '../fixtures/animationTechniques';

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
    'http://puppetplays.ddev.site:7080/graphql',
    graphQlRouteHandler,
  );

  cy.visit('/techniques-d-animation');
});
