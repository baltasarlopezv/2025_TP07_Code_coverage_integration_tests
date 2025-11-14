# Backend - Sports Courts Reservation API

## 🚀 Instalación

### 1. Crear entorno virtual

```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env si es necesario
```

### 4. Inicializar base de datos

```bash
python -m app.init_db
```

Esto creará:
- Tablas en SQLite
- Datos de ejemplo (deportes, canchas)
- Usuarios de prueba:
  - Admin: `admin@courts.com` / `admin123`
  - User: `user@example.com` / `user123`

## 🏃‍♂️ Ejecución

```bash
# Asegurarse de que el entorno virtual esté activado
source venv/bin/activate  # macOS/Linux

# Ejecutar servidor
uvicorn app.main:app --reload

# O también
python -m app.main
```

El servidor estará disponible en: `http://localhost:8000`

## 📚 Documentación API

Una vez iniciado el servidor:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔑 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login (retorna JWT token)
- `GET /api/auth/me` - Perfil del usuario actual

### Canchas
- `GET /api/courts` - Listar canchas
- `GET /api/courts/{id}` - Obtener cancha
- `POST /api/courts` - Crear cancha (Admin)
- `PUT /api/courts/{id}` - Actualizar cancha (Admin)
- `DELETE /api/courts/{id}` - Eliminar cancha (Admin)

### Reservas
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations/my-reservations` - Mis reservas
- `GET /api/reservations/all` - Todas las reservas (Admin)
- `GET /api/reservations/{id}` - Obtener reserva
- `DELETE /api/reservations/{id}` - Cancelar reserva

## 🧪 Testing

```bash
# Ejecutar tests
pytest

# Con cobertura
pytest --cov=app tests/

# Generar reporte HTML de coverage
pytest --cov=app --cov-report=html tests/
```

## 🛠️ Desarrollo

```bash
# Formatear código con black
black app/

# Linting con flake8
flake8 app/

# Type checking con mypy
mypy app/
```

## 📦 Estructura

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app
│   ├── config.py         # Configuración
│   ├── database.py       # Conexión DB
│   ├── models.py         # Modelos SQLAlchemy
│   ├── schemas.py        # Schemas Pydantic
│   ├── auth.py           # Autenticación JWT
│   ├── init_db.py        # Script de inicialización
│   └── routes/           # Endpoints
│       ├── auth.py
│       ├── courts.py
│       └── reservations.py
├── tests/                # Tests pytest
├── requirements.txt
├── .env.example
└── README.md
```

## 🔒 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación:

1. Login con email/password en `/api/auth/login`
2. Recibir token de acceso
3. Incluir token en headers: `Authorization: Bearer <token>`

## 💾 Base de Datos

SQLite para desarrollo (archivo `courts.db`).

Para producción se puede cambiar fácilmente a PostgreSQL modificando `DATABASE_URL` en `.env`.
