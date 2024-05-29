export const login = (username: string, password: string) => {
  cy.visit('/');

  // Login on Auth0.
  cy.origin(Cypress.env('auth0_domain'), { args: { username, password } }, ({ username, password }) => {
    cy.get('input#username').type(username);
    cy.get('input#password').type(password, { log: false });
    cy.contains('button[value=default]', 'Continua').click();
  });
};
