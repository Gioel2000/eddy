// for delete restaurant:
// cy.get('a[id=delete-restaurant-tab]').click();
// cy.get('button[id=delete-restaurant-button]').click();

describe('Eddy Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    cy.login('ivan.martorelli00@gmail.com', 'Ivan2010!');
  });

  // it('Set Restaurant', () => {
  //   cy.get('button[id^=choose-structure-]').first().click();

  //   cy.get('button[id=user-menu-button-desktop]').click();
  //   cy.get('button[id=structure-item]').click();
  //   cy.get('button[id=change-restaurant]').click();
  // });

  Cypress._.times(20, () => {
    it('Create Restaurant', () => {
      cy.get('button[id=user-menu-button-desktop]').click();
      cy.get('button[id=structure-item]').click();
      cy.get('button[id=change-restaurant]').click();

      cy.get('button[id=open-create-restaurant-panel]').click();

      const randomConsonant = () => {
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        return consonants.charAt(Math.floor(Math.random() * consonants.length));
      };

      const randomVowel = () => {
        const vowels = 'aeiou';
        return vowels.charAt(Math.floor(Math.random() * vowels.length));
      };

      cy.get('input#restaurant-name').type(`Ristorante ${randomConsonant().toUpperCase()}${randomVowel()}`);
      cy.get('.pac-container').find('.pac-item').first().click();
      cy.wait(2000);

      cy.get('button[id=create-restaurant-button]').click();
      cy.wait(6000);
      cy.get('button[id^=choose-structure-]').first().click();
      cy.get('button[id=user-menu-button-desktop]').click();
      cy.get('button[id=structure-item]').click();
    });
  });

  // it('check graph data are valid', () => {

  // })
});
