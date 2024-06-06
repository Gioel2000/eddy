import { login } from './auth0';
import { clearCache } from './cache';

Cypress.Commands.add('login', (username: string, password: string) => {
  const log = Cypress.log({
    displayName: 'AUTH0 LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  });
  log.snapshot('before');

  login(username, password);

  log.snapshot('after');
  log.end();
});

Cypress.Commands.add('clearCache', () => {
  const log = Cypress.log({
    displayName: 'CLEAR CACHE',
    message: '🧹 Clearing cache',
    autoEnd: false,
  });
  log.snapshot('before');

  clearCache();

  log.snapshot('after');
  log.end();
});
