import './commands';
import { mount } from 'cypress/angular';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      login: typeof Function;
      clearCache: typeof Function;
    }
  }
}

Cypress.Commands.add('mount', mount);
