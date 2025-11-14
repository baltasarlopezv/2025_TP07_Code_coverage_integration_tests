# Tests E2E con Cypress

Este directorio contiene los tests End-to-End (E2E) para la aplicación de reservas de canchas.

## 📋 Tests Implementados

### 1. Login → Reservar → Cancelar (`login-reserve-cancel.cy.js`)
Flujo completo de un usuario existente que:
- ✅ Inicia sesión con credenciales existentes (`user@example.com`)
- ✅ Navega a la página de canchas
- ✅ Selecciona una cancha y hace una reserva
- ✅ Verifica la reserva en "Mis Reservas"
- ✅ Cancela la reserva
- ✅ Verifica la cancelación exitosa

### 2. Registro → Reservar → Mantener (`register-reserve-keep.cy.js`)
Flujo completo de un usuario nuevo que:
- ✅ Se registra en el sistema con email único
- ✅ Inicia sesión (automático o manual)
- ✅ Navega a la página de canchas
- ✅ Selecciona una cancha diferente y hace una reserva
- ✅ Verifica la reserva en "Mis Reservas"
- ✅ NO cancela la reserva (la mantiene activa)
- ✅ Verifica que la reserva está activa

## 🚀 Cómo ejecutar los tests

### Prerequisitos
1. **Backend debe estar corriendo:**
   ```bash
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload
   ```

2. **Frontend debe estar corriendo:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Base de datos debe estar inicializada:**
   ```bash
   cd backend
   python init_db.py
   ```
   Esto crea el usuario de prueba: `user@example.com` / `user123`

### Ejecutar tests en modo interactivo (con UI)
```bash
cd frontend
npm run cypress:open
```
Esto abre la interfaz de Cypress donde puedes:
- Ver todos los tests disponibles
- Ejecutar tests individualmente
- Ver la ejecución en tiempo real
- Debuggear fácilmente

### Ejecutar tests en modo headless (CI/CD)
```bash
cd frontend
npm run cypress:run
# o
npm run test:e2e
```

### Ejecutar tests headless pero con ventana visible
```bash
cd frontend
npm run test:e2e:headed
```

## 📊 Resultados

Los tests generan:
- **Videos** (si están habilitados): `cypress/videos/`
- **Screenshots** en caso de fallo: `cypress/screenshots/`
- **Reportes XML** para CI/CD: `cypress/results/`

## 🔧 Configuración

La configuración de Cypress está en `cypress.config.js`:
- **baseUrl**: `http://localhost:5173` (frontend)
- **apiUrl**: `http://localhost:8000` (backend) - disponible como `Cypress.env('apiUrl')`
- **viewport**: 1280x720

## 📝 Notas Importantes

1. **Usuario de prueba**: El primer test usa `user@example.com` que debe existir en la BD
2. **Emails únicos**: El segundo test genera emails únicos usando timestamp para evitar conflictos
3. **Fechas dinámicas**: Los tests usan fechas futuras calculadas automáticamente
4. **Selectores flexibles**: Los tests usan selectores múltiples para mayor robustez
5. **Timeouts**: Se usan timeouts generosos (10s) para esperar carga de datos

## 🐛 Troubleshooting

### Los tests fallan con "element not found"
- Verifica que el frontend esté corriendo en `http://localhost:5173`
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Verifica que la base de datos esté inicializada

### El test de login falla
- Verifica que el usuario `user@example.com` / `user123` existe en la BD
- Ejecuta `python backend/init_db.py` para recrear los usuarios de prueba

### El test de registro falla
- Verifica que el endpoint de registro esté funcionando
- Revisa los logs del backend para ver errores

## 📚 Documentación

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
