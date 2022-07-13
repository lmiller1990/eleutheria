it('works', () => {
  cy.task('foo').then(() => {
    expect(Cypress.env('MY_FOO')).to.eq('foo')
  })
})
                    
