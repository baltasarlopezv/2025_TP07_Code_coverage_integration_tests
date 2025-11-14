describe('Sports Court Reservation System', () => {
  it('should load the home page', () => {
    cy.visit('/')
    cy.contains('Sistema de Reservas de Canchas')
  })

  it('should navigate to login page', () => {
    cy.visit('/')
    cy.contains('Iniciar Sesión').click()
    cy.url().should('include', '/login')
  })

  it('should display courts page', () => {
    cy.visit('/courts')
    cy.contains('Canchas Disponibles')
  })
})
