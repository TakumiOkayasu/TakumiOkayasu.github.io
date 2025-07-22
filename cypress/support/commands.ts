// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for tab navigation
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  return cy.wrap(subject).trigger('keydown', {
    keyCode: 9,
    which: 9,
    key: 'Tab',
  });
});

// Add type definitions
declare global {
  namespace Cypress {
    interface Chainable {
      tab(): Chainable<Element>;
    }
  }
}