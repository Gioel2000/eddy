describe('Eddy Tests', () => {
  beforeEach(() => {
    cy.clearCache();
    cy.visit('http://localhost:4200/structures');
    cy.login('ivan.martorelli00@gmail.com', 'Ivan2010!');

    cy.intercept('GET', '/api/restaurants').as('getRestaurants');
    cy.wait('@getRestaurants');

    cy.get('button[id^=choose-structure-]').last().click();
  });

  it('Check data', () => {
    cy.intercept('POST', '/api/reviews/graph/average').as('brandReputationGraph');
    cy.intercept('POST', '/api/reviews/rating/grouped').as('ratingsGraph');
    cy.intercept('POST', '/api/reviews/channel/grouped').as('channelsGraph');
    cy.intercept('POST', '/api/reviewscores/category/grouped').as('categoriesGraph');
    cy.intercept('POST', '/api/reviews/sentiment/categories').as('reviewsLastDay');

    cy.visit('/home');

    cy.wait('@brandReputationGraph');
    cy.wait('@ratingsGraph');
    cy.wait('@channelsGraph');
    cy.wait('@categoriesGraph');
    cy.wait('@reviewsLastDay');

    cy.get('brand-reputation-graph').find('#error-view').should('not.exist');
    cy.get('ratings-graph').find('#error-view').should('not.exist');
    cy.get('categories-graph').find('#error-view').should('not.exist');
    cy.get('channels-graph').find('#error-view').should('not.exist');
    cy.get('reviews-last-day').find('#error-view').should('not.exist');
    cy.get('overview-reviews-last-day').find('#error-view').should('not.exist');
  });

  Cypress.on('uncaught:exception', () => false);
});
