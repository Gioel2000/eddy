import { defineConfig } from 'cypress';
import { environment } from './src/environments/environment';

require('dotenv').config();

export default defineConfig({
  chromeWebSecurity: false,

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: '**/*.cy.ts',
  },

  viewportWidth: 1024,
  viewportHeight: 768,

  env: {
    auth0_username: 'ivan.martorelli00@gmail.com',
    auth0_password: 'Ivan2010!',
    auth0_audience: 'https://api.eddy.restaurant',
    auth0_client_secret: 'OW__Oa28JWqUy1hPEWUIdfuC1Wp-7vpRrJyzzNYlkP7ioJBh7mIU04rMOM3_OVU0',
    auth0_domain: environment.auth.domain,
    auth0_client_id: environment.auth.clientId,
    auth0_server_url: environment.auth.serverUrl,
    // auth0_scope: process.env.REACT_APP_AUTH0_SCOPE,
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/index.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
