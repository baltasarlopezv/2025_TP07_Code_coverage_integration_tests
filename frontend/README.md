# Frontend - Courts Reservation

## 🚀 Instalación

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

## 🏃‍♂️ Ejecución

```bash
# Modo desarrollo
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 🏗️ Build

```bash
# Crear build de producción
npm run build

# Preview build de producción
npm run preview
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage
```

## 📁 Estructura

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   └── CourtCard.jsx
│   ├── pages/            # Páginas/vistas
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Courts.jsx
│   │   └── MyReservations.jsx
│   ├── services/         # API services
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── courts.js
│   │   └── reservations.js
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## 🔑 Características

- ✅ Autenticación con JWT
- ✅ Navegación con React Router
- ✅ Context API para manejo de estado
- ✅ Axios para llamadas API
- ✅ Responsive design
- ✅ Formularios de reserva
- ✅ Gestión de reservas del usuario

## 🎨 Páginas

- **Home**: Página de inicio con información del sistema
- **Login**: Inicio de sesión
- **Register**: Registro de usuarios
- **Courts**: Listado de canchas con opción de reservar
- **My Reservations**: Gestión de reservas del usuario

## 🔌 Integración con Backend

El frontend se comunica con el backend FastAPI en `http://localhost:8000`.

La configuración del proxy en `vite.config.js` redirige las peticiones a `/api/*` al backend.
