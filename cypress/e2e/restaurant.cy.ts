import { channels, restaurant, user, userToEdit } from '../support/data';

describe('Eddy Tests', () => {
  beforeEach(() => {
    cy.clearCache();
    cy.visit('http://localhost:4200/structures');
    cy.login('ivan.martorelli00@gmail.com', 'Ivan2010!');
  });

  it('Set Restaurant', () => {
    cy.get('button[id^=choose-structure-]').first().click();
    cy.get('button[id=user-menu-button-desktop]').click();
    cy.get('button[id=structure-item]').click();
    cy.get('button[id=change-restaurant]').click();
  });

  it('Create Restaurant', () => {
    const randomConsonant = () => 'bcdfghjklmnpqrstvwxyz'.charAt(Math.floor(Math.random() * 21));
    const randomVowel = () => 'aeiou'.charAt(Math.floor(Math.random() * 5));

    cy.get('button[id=open-create-restaurant-panel]').click();
    cy.get('input#restaurant-name').type(`Ristorante ${randomConsonant().toUpperCase()}${randomVowel()}`);
    cy.get('.pac-container').find('.pac-item').first().click();
    cy.wait(2000);

    cy.get('button[id=create-restaurant-button]').click();
  });

  it('Check Restaurant', () => {
    cy.intercept('GET', '/api/restaurants').as('getRestaurants');
    cy.wait('@getRestaurants', { timeout: 15000 });

    cy.get('button[id^=choose-structure-]').first().click();
    cy.get('button[id=user-menu-button-desktop]').click();
    cy.get('button[id=structure-item]').click();

    // overview tab
    cy.get('a[id=overview-restaurant-tab]').click();
    cy.get('restaurant-panel-overview').find('#error-view').should('not.exist');

    // log restaurant data
    const logRestaurant = Cypress.log({
      displayName: 'RESTAURANT DATA',
      message: [
        `name: ${restaurant.name} 
        address: ${restaurant.address}
        city: ${restaurant.city} 
        zipCode: ${restaurant.zipCode} 
        telephone: ${restaurant.telephone} 
        website: ${restaurant.website} 
        email: ${restaurant.email}`,
      ],
      autoEnd: false,
    });

    // info tab
    cy.get('a[id=info-restaurant-tab]').click();
    cy.get('input#restaurant-edit-name').clear();
    cy.get('input#restaurant-edit-name').type(restaurant.name);
    cy.get('input#restaurant-edit-address').clear();
    cy.get('input#restaurant-edit-address').type(restaurant.address);
    cy.get('input#restaurant-edit-zip-code').clear();
    cy.get('input#restaurant-edit-zip-code').type(restaurant.zipCode);
    cy.get('input#restaurant-edit-city').clear();
    cy.get('input#restaurant-edit-city').type(restaurant.city);
    cy.get('input#restaurant-edit-phone-number').clear();
    cy.get('input#restaurant-edit-phone-number').type(restaurant.telephone);
    cy.get('input#restaurant-edit-website').clear();
    cy.get('input#restaurant-edit-website').type(restaurant.website);
    cy.get('input#restaurant-edit-email').clear();
    cy.get('input#restaurant-edit-email').type(restaurant.email);

    cy.intercept('PUT', '/api/restaurants').as('setRestaurant');
    cy.get('button[id=edit-restaurant-button]').click();
    cy.wait('@setRestaurant');

    cy.get('div[id=edit-restaurant-success-alert]').should('exist');

    // channels tab
    cy.get('a[id=channels-restaurant-tab]').click();

    cy.get('button[id=delete-tripadvisor-button]').click();
    cy.get('button[id=delete-google-button]').click();
    cy.get('button[id=delete-thefork-button]').click();

    cy.get('input#restaurant-channels-tripadvisor').clear();
    cy.get('input#restaurant-channels-tripadvisor').type(channels.tripadvisor);

    cy.get('input#restaurant-channels-google').clear();
    cy.get('input#restaurant-channels-google').type(channels.google);

    cy.get('input#restaurant-channels-thefork').clear();
    cy.get('input#restaurant-channels-thefork').type(channels.thefork);

    cy.intercept('PUT', 'api/restaurants/channels').as('setChannels');
    cy.get('button[id=delete-restaurant-button]').click();
    cy.wait('@setChannels');

    cy.get('div[id=channels-restaurant-success-alert]').should('exist');

    // users tab
    cy.get('a[id=users-restaurant-tab]').click();
    cy.get('a[id=open-dialog-user]').click();

    cy.get('input#user-name').type(user.name);
    cy.get('input#user-surname').type(user.surname);
    cy.get('input#user-email').type(user.email);

    cy.get('button[id=add-user-button]').click();

    // i shoud see the user in the list
    cy.get('tbody[id=user-list]').contains(user.name).should('exist');
    cy.get('tbody[id=user-list]').contains(user.surname).should('exist');
    cy.get('tbody[id=user-list]').contains(user.email).should('exist');

    const logUserCreated = Cypress.log({
      displayName: 'USER CREATED',
      message: [`👤 User created | ${user.email} | ${user.name} | ${user.surname}`],
      autoEnd: false,
    });
    logUserCreated.end();

    // i should edit the user
    cy.get('tbody[id=user-list]').find('tr').first().find('a').first().click();
    cy.get('input#user-name').clear();
    cy.get('input#user-name').type(userToEdit.name);
    cy.get('input#user-surname').clear();
    cy.get('input#user-surname').type(userToEdit.surname);
    // cy.intercept('POST', '/api/users').as('addUser');
    cy.get('button[id=add-user-button]').click();
    // cy.wait('@addUser');

    // i shoud see the new user in the list
    cy.get('tbody[id=user-list]').contains(userToEdit.name).should('exist');
    cy.get('tbody[id=user-list]').contains(userToEdit.surname).should('exist');
    cy.get('tbody[id=user-list]').contains(user.email).should('exist');

    const logUserEdited = Cypress.log({
      displayName: 'USER EDITED',
      message: [`👤 User edited | ${user.email}`],
      autoEnd: false,
    });
    logUserEdited.end();

    // delete user
    cy.intercept('DELETE', '/api/users/*').as('deleteUser');
    cy.get('tbody[id=user-list]').find('tr').first().find('a').last().click();
    cy.wait('@deleteUser');
    cy.get('tbody[id=user-list]').contains(user.email).should('not.exist');

    const logUserDeleted = Cypress.log({
      displayName: 'USER DELETED',
      message: [`👤 User deleted | ${user.email}`],
      autoEnd: false,
    });
    logUserDeleted.end();

    // refresh page
    cy.reload();

    cy.get('button[id=user-menu-button-desktop]').click();
    cy.get('button[id=structure-item]').click();

    // check overview
    cy.get('a[id=overview-restaurant-tab]').click();
    cy.get('restaurant-panel-overview').find('#error-view').should('not.exist');

    cy.get('dd[id=restaurant-overview-email]').contains(restaurant.email).should('exist');
    cy.get('dd[id=restaurant-overview-telephone]').contains(restaurant.telephone).should('exist');
    cy.get('dd[id=restaurant-overview-address]').contains(restaurant.address).should('exist');
    cy.get('dd[id=restaurant-overview-city]').contains(restaurant.city).should('exist');

    const logOverview = Cypress.log({
      displayName: 'OVERVIEW CHECKED',
      message: [`🍕 Restaurant data`],
      autoEnd: false,
    });
    logOverview.end();

    // check info
    cy.get('a[id=info-restaurant-tab]').click();
    cy.get('input#restaurant-edit-name').should('have.value', restaurant.name);
    cy.get('input#restaurant-edit-address').should('have.value', restaurant.address);
    cy.get('input#restaurant-edit-zip-code').should('have.value', restaurant.zipCode);
    cy.get('input#restaurant-edit-city').should('have.value', restaurant.city);
    cy.get('input#restaurant-edit-phone-number').should('have.value', restaurant.telephone);
    cy.get('input#restaurant-edit-website').should('have.value', restaurant.website);
    cy.get('input#restaurant-edit-email').should('have.value', restaurant.email);

    const logInfo = Cypress.log({
      displayName: 'INFO CHECKED',
      message: [`🍕 Restaurant info`],
      autoEnd: false,
    });
    logInfo.end();

    // check channels field should be disabled
    cy.get('a[id=channels-restaurant-tab]').click();
    cy.get('input#restaurant-channels-google').should('be.disabled');
    cy.get('input#restaurant-channels-thefork').should('be.disabled');
    cy.get('input#restaurant-channels-tripadvisor').should('be.disabled');

    const logChannels = Cypress.log({
      displayName: 'CHANNELS CHECKED',
      message: [`🍕 Restaurant channels`],
      autoEnd: false,
    });
    logChannels.end();

    // delete restaurant
    cy.get('a[id=delete-restaurant-tab]').click();
    cy.get('button[id=delete-restaurant-button]').click();

    const logRestaurantDeleted = Cypress.log({
      displayName: 'RESTAURANT DELETED',
      message: [`🍕 Restaurant deleted | ${restaurant.name}`],
      autoEnd: false,
    });
    logRestaurantDeleted.end();
  });

  Cypress.on('uncaught:exception', () => false);
});
