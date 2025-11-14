// ***********************************************
// Custom commands for Cypress tests
// ***********************************************

// Command to login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

// Command to register
Cypress.Commands.add('register', (name, email, password) => {
  cy.visit('/register')
  cy.get('input[name="name"]').type(name)
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').first().type(password)
  cy.get('input[type="password"]').last().type(password) // confirm password
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/register')
})

// Command to logout
Cypress.Commands.add('logout', () => {
  cy.contains('Cerrar Sesión').click()
  cy.url().should('include', '/')
})
