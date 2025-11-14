/**
 * Test E2E: Navegación y Login
 * 
 * Este test verifica:
 * 1. Cargar la página de inicio
 * 2. Navegar a la página de login
 * 3. Intentar login (puede fallar o exitoso)
 * 4. Navegar a la página de canchas
 * 5. Verificar que las canchas se muestran
 */

describe('E2E: Navegación y Visualización de Canchas', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('debe cargar la aplicación y mostrar las canchas', () => {
    // 1. PÁGINA DE INICIO
    cy.log('🏠 PASO 1: Cargar página de inicio')
    cy.visit('/')
    cy.url().should('include', 'localhost:5173')
    cy.get('body').should('be.visible')

    // 2. NAVEGACIÓN A LOGIN
    cy.log('🔐 PASO 2: Navegar a la página de login')
    cy.visit('/login')
    cy.url().should('include', '/login')
    cy.contains(/login/i).should('be.visible')

    // 3. VERIFICAR FORMULARIO DE LOGIN
    cy.log('📝 PASO 3: Verificar que el formulario de login existe')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')

    // 4. NAVEGACIÓN A CANCHAS (sin autenticación)
    cy.log('🏟️ PASO 4: Navegar a la página de canchas')
    cy.visit('/courts')
    cy.url().should('include', '/courts')

    // 5. VERIFICAR QUE LAS CANCHAS SE CARGAN
    cy.log('✅ PASO 5: Verificar que las canchas se muestran')
    cy.get('.court-card', { timeout: 10000 }).should('exist')
    cy.get('.court-card').should('have.length.at.least', 1)
    
    // Verificar que cada cancha tiene información básica
    cy.get('.court-card').first().within(() => {
      cy.get('.court-name').should('exist')
      cy.contains('button', /Reserve/i).should('exist')
    })

    cy.log('✨ Test completado - Navegación básica funciona correctamente')
  })

  after(() => {
    cy.log('✨ Test completado exitosamente')
  })
})
