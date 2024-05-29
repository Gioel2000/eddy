import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('can mount the app', () => {
    cy.mount(AppComponent);
  });
});
