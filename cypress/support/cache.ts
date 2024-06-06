export const clearCache = () => {
  cy.clearLocalStorage();
  cy.clearCookies();

  indexedDB.deleteDatabase('ngStorage');
};
