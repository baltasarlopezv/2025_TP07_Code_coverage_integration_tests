#!/bin/bash

# Script para ejecutar los tests E2E de Cypress
# Asegura que el backend y frontend estén corriendo antes de ejecutar los tests

echo "🚀 Preparando para ejecutar tests E2E..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si el backend está corriendo
echo "📡 Verificando backend..."
if curl -s http://localhost:8000/docs > /dev/null; then
    echo -e "${GREEN}✓ Backend está corriendo en http://localhost:8000${NC}"
else
    echo -e "${RED}✗ Backend NO está corriendo${NC}"
    echo -e "${YELLOW}Por favor, ejecuta en otra terminal:${NC}"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  uvicorn app.main:app --reload"
    exit 1
fi

# Verificar si el frontend está corriendo
echo "📡 Verificando frontend..."
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✓ Frontend está corriendo en http://localhost:5173${NC}"
else
    echo -e "${RED}✗ Frontend NO está corriendo${NC}"
    echo -e "${YELLOW}Por favor, ejecuta en otra terminal:${NC}"
    echo "  cd frontend"
    echo "  npm run dev"
    exit 1
fi

echo ""
echo "✅ Todo listo para ejecutar los tests E2E!"
echo ""

# Ejecutar Cypress
cd "$(dirname "$0")"

if [ "$1" == "open" ]; then
    echo "🎭 Abriendo Cypress en modo interactivo..."
    npm run cypress:open
else
    echo "🏃 Ejecutando tests E2E en modo headless..."
    npm run test:e2e
fi
