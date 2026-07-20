# AgroLact 🥛

Sistema de administración lechera para asociaciones de productores.

## Descripción

AgroLact es una aplicación web que digitaliza y automatiza la gestión
de asociaciones de recolección de leche, incluyendo registro de producción
diaria, liquidaciones quincenales, control de adelantos y gestión de tienda.

## Stack Tecnológico

- **Frontend:** Angular + TypeScript
- **Backend:** PHP + Laravel (API REST) + JWT (tymon/jwt-auth)
- **Base de datos:** PostgreSQL + Eloquent ORM
- **Despliegue:** Neon (BD) + Docker Compose (backend/frontend en desarrollo)

## Módulos

- Autenticación y roles (Administrador, Presidente, Recepcionista, Encargado de tienda)
- Gestión de socios
- Registro de leche por jornada
- Quincenas y liquidaciones automáticas
- Control de adelantos
- Tienda (ventas y fiados)
- Gastos operativos
- Reportes administrativos

## Instalación local

### Requisitos previos
- Docker y Docker Compose (no se requiere PHP ni Composer instalados localmente)
- Node.js 20+ (para el frontend Angular)

### Backend (Laravel)

```bash
cd backend
cp .env.example .env
# completa DB_HOST, DB_USERNAME, DB_PASSWORD (Neon) y JWT_SECRET en .env

# Construir la imagen de desarrollo
docker compose -f ../docker-compose.dev.yml build

# Instalar dependencias, migrar y sembrar datos de prueba
docker compose -f ../docker-compose.dev.yml run --rm backend composer install
docker compose -f ../docker-compose.dev.yml run --rm backend php artisan migrate --seed

# Levantar el servidor (http://localhost:8000)
docker compose -f ../docker-compose.dev.yml up backend
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

## Estructura del proyecto
