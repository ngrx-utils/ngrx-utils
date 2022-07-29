/** @jest-environment jsdom */

import { getGreeting } from '../support/app.po';

describe('ngrx-utils', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains('Welcome to ngrx-utils!');
  });
});
