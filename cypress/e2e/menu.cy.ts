import { category, categoryToEdit, dish, dishToEdit } from '../support/data';

describe('Eddy Tests', () => {
  beforeEach(() => {
    cy.clearCache();
    cy.visit('http://localhost:4200/structures');
    cy.login('ivan.martorelli00@gmail.com', 'Ivan2010!');
    cy.intercept('GET', '/api/restaurants').as('getRestaurants');
    cy.wait('@getRestaurants', { timeout: 15000 });
    cy.get('.iubenda-cs-accept-btn').click();

    cy.get('button[id^=choose-structure-]').first().click();
  });

  afterEach(() => {
    cy.get('menu-dishes').find('#error-view').should('not.exist');
    cy.get('menu-menus').find('#error-view').should('not.exist');
  });

  it('Check categories', () => {
    cy.visit('/menu');

    cy.get('a[id=open-add-category-dialog]').click();
    cy.get('input#category-name').type(category.name);
    cy.intercept('POST', '/api/menus/categories').as('postCategories');
    cy.get('button[id=add-category]').click();
    cy.wait('@postCategories');

    cy.get('#menu-categories-list').find('span').contains(category.name);

    const logCreate = Cypress.log({
      displayName: 'CATEGORY CREATED',
      message: [`🍕 category created | ${category.name}`],
      autoEnd: false,
    });
    logCreate.end();

    // edit
    cy.get('#menu-categories-list').find('span').contains(category.name).click();
    cy.get('input#category-name').clear().type(categoryToEdit.name);
    cy.intercept('PUT', '/api/menus/categories/*').as('putCategories');
    cy.get('button[id=add-category]').click();
    cy.wait('@putCategories');

    cy.reload();
    cy.visit('/menu');

    // check
    cy.get('#menu-categories-list').find('span').contains(categoryToEdit.name);

    const logEdit = Cypress.log({
      displayName: 'CATEGORY EDITED',
      message: [`🍕 category edited | ${categoryToEdit.name}`],
      autoEnd: false,
    });
    logEdit.end();
  });

  it('Check dishes', () => {
    cy.visit('/menu');

    cy.get('a[id=open-add-dish-dialog]').click();
    cy.get('input#dish-name').type(dish.name);
    cy.get('input#dish-price').type(dish.price.toString());
    cy.get('textarea#dish-description').type(dish.descrtiption);

    cy.get('select#dish-category').select(categoryToEdit.name);

    cy.intercept('POST', '/api/menus/dishes').as('postDishes');
    cy.get('button[id=add-dish]').click();
    cy.wait('@postDishes');

    const logCreate = Cypress.log({
      displayName: 'DISH CREATED',
      message: [`🍕 dish created | ${dish.name}`],
      autoEnd: false,
    });
    logCreate.end();

    // check
    cy.get('menu-dishes').find('span').contains(dish.name);
    cy.get(`a[id^=edit-dish-${dish.name}]`).click();
    cy.get('input#dish-name').should('have.value', dish.name);
    cy.get('input#dish-price').should('have.value', dish.price.toString());
    cy.get('textarea#dish-description').should('have.value', dish.descrtiption);

    // edit
    cy.get('input#dish-name').clear().type(dishToEdit.name);
    cy.get('input#dish-price').clear().type(dishToEdit.price.toString());
    cy.get('textarea#dish-description').clear().type(dishToEdit.descrtiption);

    cy.intercept('PUT', '/api/menus/dishes/*').as('putDishes');
    cy.get('button[id=add-dish]').click();
    cy.wait('@putDishes');

    cy.intercept('GET', '/api/menus/categories').as('categories');
    cy.intercept('GET', '/api/menus/dishes').as('dishes');
    cy.intercept('GET', '/api/menus').as('menus');

    cy.reload();
    cy.visit('/menu');

    cy.wait('@categories', { timeout: 15000 });
    cy.wait('@dishes', { timeout: 15000 });
    cy.wait('@menus', { timeout: 15000 });

    // check
    cy.get('menu-dishes').find('span').contains(dishToEdit.name);
    cy.get(`a[id^=edit-dish-${dishToEdit.name}]`).click();
    cy.get('input#dish-name').should('have.value', dishToEdit.name);
    cy.get('input#dish-price').should('have.value', dishToEdit.price.toString());
    cy.get('textarea#dish-description').should('have.value', dishToEdit.descrtiption);
    cy.get('button[id=close-add-dish-dialog]').click();

    const logEdit = Cypress.log({
      displayName: 'DISH EDITED',
      message: [`🍕 dish edited | ${dishToEdit.name}`],
      autoEnd: false,
    });
    logEdit.end();

    // delete category
    cy.get('#menu-categories-list').find('span').first().find('button').click();
    cy.get('button#yes').click();

    const logDelete = Cypress.log({
      displayName: 'CATEGORY DELETED',
      message: [`🍕 category deleted | ${categoryToEdit.name}`],
      autoEnd: false,
    });
    logDelete.end();

    // check
    cy.get('#menu-categories-list').find('span').contains(categoryToEdit.name).should('not.exist');

    // visibility
    cy.intercept('PUT', '/api/menus/dishes/*/visible/*').as('hideDish');
    cy.get('menu-dishes').find(`a[id^=hide-dish-${dishToEdit.name}]`).click();
    cy.wait('@hideDish', { timeout: 15000 });

    cy.intercept('PUT', '/api/menus/dishes/*/visible/*').as('showDish');
    cy.get('menu-dishes').first().find(`a[id^=show-dish-${dishToEdit.name}]`).click();
    cy.wait('@showDish');
  });

  Cypress.on('uncaught:exception', () => false);
});
