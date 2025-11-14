# Sistema de Reservas de Canchas Deportivas 🏟️

## 📋 Descripción
Sistema web completo para la gestión y reserva de canchas deportivas. Permite a los usuarios registrarse, visualizar canchas disponibles, realizar reservas con validación de horarios, y gestionar su historial de reservas.

## 🛠️ Stack Tecnológico

### Backend
- **Framework:** FastAPI 0.115.5
- **Language:** Python 3.13+
- **ORM:** SQLAlchemy 2.0
- **Database:** SQLite (desarrollo)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** passlib[bcrypt]
- **Validation:** Pydantic 2.10
- **Server:** Uvicorn (ASGI server)

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite 6.x
- **Language:** JavaScript/JSX
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **State Management:** React Context API
- **Styling:** CSS3 personalizado

### Testing & Quality
- **Backend Tests:** pytest
- **Frontend Tests:** Jest + React Testing Library
- **E2E Tests:** Cypress
- **Static Analysis:** SonarCloud
- **Coverage:** pytest-cov, Jest --coverage

### CI/CD
- **Platform:** Azure DevOps
- **Pipelines:** Build, Test, Deploy
- **Quality Gates:** Coverage > 70%

## 📁 Estructura del Proyecto

```
2025_TP07_Code_coverage_integration_tests/
├── backend/                    # API REST con FastAPI
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # Entry point de la aplicación
│   │   ├── config.py          # Configuraciones y variables de entorno
│   │   ├── database.py        # Configuración de SQLAlchemy
│   │   ├── models.py          # Modelos de base de datos
│   │   ├── schemas.py         # Schemas de Pydantic para validación
│   │   ├── auth.py            # Autenticación y JWT
│   │   ├── init_db.py         # Script de inicialización de BD
│   │   └── routes/            # Endpoints de la API
│   │       ├── __init__.py
│   │       ├── auth.py        # Rutas de autenticación
│   │       ├── courts.py      # Rutas de canchas
│   │       └── reservations.py # Rutas de reservas
│   ├── tests/                 # Tests con pytest
│   ├── requirements.txt       # Dependencias Python
│   ├── courts.db              # Base de datos SQLite
│   ├── .env                   # Variables de entorno
│   ├── .env.example           # Ejemplo de variables
│   └── README.md
│
├── frontend/                  # React App con Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── CourtCard.jsx  # Card de cancha
│   │   │   └── Navbar.jsx     # Barra de navegación
│   │   ├── pages/             # Páginas de la aplicación
│   │   │   ├── Home.jsx       # Página principal
│   │   │   ├── Courts.jsx     # Listado y reserva de canchas
│   │   │   ├── Login.jsx      # Inicio de sesión
│   │   │   ├── Register.jsx   # Registro
│   │   │   └── MyReservations.jsx # Mis reservas
│   │   ├── services/          # Servicios de API
│   │   │   ├── api.js         # Cliente Axios configurado
│   │   │   ├── auth.js        # Servicio de autenticación
│   │   │   ├── courts.js      # Servicio de canchas
│   │   │   └── reservations.js # Servicio de reservas
│   │   ├── context/           # Context API de React
│   │   │   └── AuthContext.jsx # Contexto de autenticación
│   │   ├── App.jsx            # Componente principal
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   ├── vite.config.js         # Configuración de Vite
│   └── README.md
│
└── README.md                  # Este archivo

```

## ✨ Características

### Gestión de Usuarios
- ✅ Registro y autenticación con JWT
- ✅ Perfiles de usuario
- ✅ Roles (Usuario, Admin)
- ✅ Protección de rutas por autenticación
- ✅ Logout con redirección automática

### Gestión de Canchas
- ✅ CRUD completo de canchas (Admin)
- ✅ Listado de canchas disponibles
- ✅ Información detallada de cada cancha
- ✅ Clasificación por deporte

### Sistema de Reservas
- ✅ Horarios predefinidos (12:00 - 20:00, slots de 1 hora)
- ✅ Verificación de disponibilidad en tiempo real
- ✅ Slots ocupados no se muestran al usuario
- ✅ Validación de conflictos de horario
- ✅ Historial de reservas con información completa
- ✅ Cancelación de reservas
- ✅ Estados de reserva (Pending, Confirmed, Cancelled, Completed)
- ✅ Cálculo automático de precios

## 🚀 Instalación y Ejecución

### Prerequisitos
- Python 3.8 o superior
- Node.js 16 o superior
- npm o yarn

### Backend (FastAPI)

```bash
# Navegar al directorio del backend
cd backend

# Crear entorno virtual (si no existe)
python3 -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate
# En Windows:
# venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (el archivo .env ya debe existir)
# Si no existe, copiar desde el ejemplo:
cp .env.example .env

# Inicializar base de datos con datos de ejemplo (opcional, solo primera vez)
python -m app.init_db

# Ejecutar servidor de desarrollo
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El backend estará disponible en: `http://localhost:8000`
- Documentación Swagger: `http://localhost:8000/docs`
- Documentación ReDoc: `http://localhost:8000/redoc`
- Health check: `http://localhost:8000/health`

**Credenciales de prueba:**
- Admin: `admin@courts.com` / `admin123`
- Usuario: `user@example.com` / `user123`

### Frontend (React + Vite)

```bash
# Navegar al directorio del frontend (en una nueva terminal)
cd frontend

# Instalar dependencias (solo primera vez)
npm install

# Configurar variables de entorno
# El archivo .env.local debe apuntar al backend
# VITE_API_URL=http://localhost:8000

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

### 🔄 Comandos Rápidos

**Levantar Backend:**
```bash
cd backend
source venv/bin/activate  # macOS/Linux
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Levantar Frontend:**
```bash
cd frontend
npm run dev
```

## 🧪 Testing

### Backend
```bash
cd backend
source venv/bin/activate
python3 -m pytest
python3 -m pytest --cov=app tests/
# Ver reporte HTML
open htmlcov/index.html
```

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

### E2E con Cypress
```bash
cd frontend
npm run cypress:open
```

## 📊 Code Coverage

Objetivo: **Mínimo 70% de cobertura**

- Backend: pytest-cov
- Frontend: Jest coverage
- Integración con SonarCloud para análisis estático

## 📚 Documentación API

La documentación interactiva de la API está disponible en:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Endpoints Principales

#### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión (retorna JWT)
- `GET /api/auth/me` - Obtener perfil del usuario autenticado

#### Canchas (`/api/courts`)
- `GET /api/courts` - Listar todas las canchas activas
- `GET /api/courts/{court_id}` - Obtener detalles de una cancha
- `GET /api/courts/{court_id}/available-slots?date=YYYY-MM-DD` - Obtener horarios disponibles
- `POST /api/courts` - Crear cancha (Admin)
- `PUT /api/courts/{court_id}` - Actualizar cancha (Admin)
- `DELETE /api/courts/{court_id}` - Eliminar cancha (Admin)

#### Reservas (`/api/reservations`)
- `POST /api/reservations` - Crear nueva reserva
- `GET /api/reservations/my-reservations` - Obtener reservas del usuario
- `GET /api/reservations/all` - Obtener todas las reservas (Admin)
- `GET /api/reservations/{reservation_id}` - Obtener detalles de una reserva
- `DELETE /api/reservations/{reservation_id}` - Cancelar reserva

## � Troubleshooting

### Backend no inicia
- Verificar que el entorno virtual esté activado
- Verificar que el archivo `.env` exista y tenga las variables correctas
- Verificar que el puerto 8000 no esté en uso

### Frontend no conecta con el backend
- Verificar que el backend esté corriendo en `http://localhost:8000`
- Verificar la variable `VITE_API_URL` en el archivo `.env` del frontend
- Verificar la configuración de CORS en el backend

### Error al hacer reservas
- Verificar que estés autenticado (token JWT válido)
- Los horarios reservados no aparecen como disponibles (esto es correcto)
- Las reservas son validadas para evitar solapamientos

## 📝 Notas Importantes

- **Horarios de Reserva:** 12:00 - 20:00 (slots de 1 hora)
- **Base de Datos:** Se resetea cada vez que se ejecuta `init_db.py`
- **Autenticación:** Los tokens JWT expiran después de 30 minutos
- **Roles:** Solo los administradores pueden crear/editar/eliminar canchas
- **Estados de Reserva:**
  - `PENDING`: Reserva creada, pendiente de confirmación
  - `CONFIRMED`: Reserva confirmada
  - `CANCELLED`: Reserva cancelada por el usuario
  - `COMPLETED`: Reserva completada (horario pasado)

## 🚀 Próximas Mejoras

- [ ] Integración con pasarelas de pago
- [ ] Notificaciones por email
- [ ] Sistema de calificaciones y reseñas
- [ ] Panel de administración avanzado
- [ ] Reportes y estadísticas
- [ ] Soporte multi-idioma

## �👥 Autor

- Baltasar Lopez

## 📄 Licencia

Este proyecto es parte del TP07 de Ingeniería de Software III - 2025
