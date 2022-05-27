import { get, isMatch } from 'lodash';
import { getAllWorksQuery } from '../../lib/api';
import works from '../fixtures/works';

beforeEach(() => {
  cy.task('clearNock');
});

it('should visit the database page', () => {
  const reqBody = {
    query: getAllWorksQuery({}),
    variables: {
      locale: 'fr',
      offset: null,
      limit: 10,
      search: '',
    },
  };
  const getAllWorksRequestParams = {
    hostname: 'http://puppetplays.ddev.site:7080',
    method: 'POST',
    path: '/graphql',
    reqBody,
    statusCode: 200,
    body: works,
  };

  cy.task('nock', getAllWorksRequestParams);

  cy.intercept('POST', 'http://puppetplays.ddev.site:7080/graphql', (req) => {
    if (
      isMatch(req.body, {
        ...reqBody,
        variables: { ...reqBody.variables, offset: 0 },
      })
    ) {
      req.reply(works);
    }
  });

  cy.visit('/base-de-donnees');
});
