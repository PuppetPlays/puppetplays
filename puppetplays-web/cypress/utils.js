export const isGraphQlQuery = queryName => req => {
  return req.body.query.includes(queryName);
};

export const aliasAndReply = (alias, body) => req => {
  req.alias = alias;
  req.reply(body);
};

export const getGraphQlRequestMock = (reqBody, resBody) => ({
  hostname: 'http://puppetplays.ddev.site:7080',
  method: 'POST',
  path: '/graphql',
  reqBody,
  statusCode: 200,
  body: resBody,
});

export const selectFilterOption = (filterKey, optionLabel) => {
  cy.get(`input[aria-labelledby="aria-label-of-${filterKey}"]`).click();
  cy.get(`#react-select-select-id-${filterKey}-listbox`)
    .contains(optionLabel)
    .click();
};

export const getSelectFilterSelectedValue = (filterKey, value) => {
  return cy
    .get(`label[for="select-input-of-${filterKey}"] + div .select__multi-value`)
    .contains(value);
};

export const getSelectFilterSelectedSingleValue = (filterKey, value) => {
  return cy
    .get(
      `label[for="select-input-of-${filterKey}"] + div .select__single-value`,
    )
    .contains(value);
};
