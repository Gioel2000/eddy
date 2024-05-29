import { login } from './auth0';

Cypress.Commands.add('login', (username: string, password: string) => {
  const log = Cypress.log({
    displayName: 'AUTH0 LOGIN',
    message: [`🔐 Authenticating | ${username}`],
    // @ts-ignore
    autoEnd: false,
  });
  log.snapshot('before');

  login(username, password);

  log.snapshot('after');
  log.end();
});
