#!/bin/sh
set -e

# Usar PORT de Render o 8000 por defecto
export PORT="${PORT:-8000}"

# Sustituir $PORT en la plantilla de nginx
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Optimizaciones de Laravel para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# No ejecutar migraciones automáticamente en cada arranque.
# Si la base de datos ya contiene tablas, esto puede causar errores de duplicado.
# Ejecutar migraciones de forma manual o como paso de despliegue separado.
# php artisan migrate --force

# Iniciar PHP-FPM en background y Nginx en foreground
php-fpm -D
exec nginx -g 'daemon off;'
