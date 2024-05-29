import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  it('can mount the app', () => {
    cy.mount(LayoutComponent);
  });

  // on click #menu-item-1, it should navigate to /home page and display HomeComponent
  it('can navigate to /home page', () => {
    cy.get('#menu-item-1').click();
    cy.url().should('include', '/home');
    cy.get('home').should('exist');
  });
});
