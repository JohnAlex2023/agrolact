# AgroLact 🥛

Sistema de administración lechera para asociaciones de productores.

## Descripción

AgroLact es una aplicación web que digitaliza y automatiza la gestión
de asociaciones de recolección de leche, incluyendo registro de producción
diaria, liquidaciones quincenales, control de adelantos y gestión de tienda.

## Stack Tecnológico

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Node.js + Express + TypeScript
- **Base de datos:** PostgreSQL + Prisma ORM
- **Despliegue:** Vercel (frontend) + Render (backend) + Neon (BD)

## Módulos

- Gestión de socios
- Registro de leche por jornada
- Quincenas y liquidaciones automáticas
- Control de adelantos
- Tienda (ventas y fiados)
- Reportes administrativos

## Instalación local

### Requisitos previos
- Node.js 20+
- Docker y Docker Compose

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/JohnAlex2023/agrolact.git
cd agrolact

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

## Estructura del proyecto