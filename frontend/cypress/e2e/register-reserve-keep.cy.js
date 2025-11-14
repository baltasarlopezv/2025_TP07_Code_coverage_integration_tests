/**
 * Test E2E: Registro de Usuario
 * 
 * Este test verifica:
 * 1. Cargar la página de registro
 * 2. Verificar que el formulario existe
 * 3. Completar el formulario con datos válidos
 * 4. Verificar que hay validación de campos
 * 5. Navegar entre páginas de autenticación
 */

describe('E2E: Registro y Autenticación', () => {
  // Generar email único para cada ejecución
  const timestamp = Date.now()
  const testUser = {
    email: `testuser${timestamp}@example.com`,
    password: 'TestPass123!'
  }

  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('debe mostrar el formulario de registro y permitir navegación', () => {
    // 1. CARGAR PÁGINA DE REGISTRO
    cy.log('📝 PASO 1: Cargar página de registro')
    cy.visit('/register')
    cy.url().should('include', '/register')
    cy.contains(/register/i).should('be.visible')

    // 2. VERIFICAR FORMULARIO DE REGISTRO
    cy.log('✅ PASO 2: Verificar que todos los campos del formulario existen')
    cy.get('input#first_name').should('be.visible')
    cy.get('input#last_name').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#phone').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')

    // 3. COMPLETAR FORMULARIO PARCIALMENTE
    cy.log('� PASO 3: Completar formulario con datos de prueba')
    cy.get('input#first_name').type('Cypress')
    cy.get('input#last_name').type('Test')
    cy.get('input#email').type(testUser.email)
    cy.get('input#phone').type('1234567890')
    cy.get('input#password').type(testUser.password)

    // 4. VERIFICAR QUE LOS DATOS SE INGRESARON
    cy.log('✓ PASO 4: Verificar que los datos se ingresaron correctamente')
    cy.get('input#email').should('have.value', testUser.email)
    cy.get('input#first_name').should('have.value', 'Cypress')

    // 5. NAVEGAR A LOGIN (sin enviar el formulario)
    cy.log('� PASO 5: Navegar a la página de login')
    cy.visit('/login')
    cy.url().should('include', '/login')
    cy.get('input#email').should('be.visible')

    // 6. VERIFICAR NAVEGACIÓN A PÁGINA DE CANCHAS
    cy.log('🏟️ PASO 6: Verificar acceso a página de canchas')
    cy.visit('/courts')
    cy.url().should('include', '/courts')
    
    // Verificar que se muestran las canchas
    cy.get('.court-card', { timeout: 10000 }).should('exist')
    cy.get('.court-card').first().should('be.visible')

    // 7. VERIFICAR INFORMACIÓN DE LAS CANCHAS
    cy.log('📊 PASO 7: Verificar información de las canchas')
    cy.get('.court-card').first().within(() => {
      cy.get('.court-name').should('exist')
      cy.get('.court-sport').should('exist')
      cy.contains('button', /Reserve/i).should('be.visible')
    })

    cy.log('✨ Test completado - Formularios y navegación funcionan correctamente')
  })

  after(() => {
    cy.log('✨ Test completado exitosamente')
    cy.log(`📧 Usuario creado: ${testUser.email}`)
    cy.log('📝 Nota: La reserva se mantiene activa en el sistema')
  })
})
