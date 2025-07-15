describe('Unauth redirect', () => {
  it('visits root and lands on /login', () => {
    cy.visit('/');
    cy.location('pathname').should('eq', '/login');
  });
});