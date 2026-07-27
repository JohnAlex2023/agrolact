FROM php:8.4-fpm

ENV DEBIAN_FRONTEND=noninteractive

# Instalar extensiones y dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    unzip \
    git \
    nginx \
    gettext-base \
    && docker-php-ext-install pdo pdo_pgsql bcmath \
    && rm -rf /var/lib/apt/lists/*

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar dependencias primero (cache de Docker layers)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist

# Copiar el resto del código
COPY . .

# Completar la instalación de Composer (autoload, post-scripts)
RUN composer dump-autoload --optimize --no-dev

# Configurar Nginx y script de arranque
COPY docker/nginx.conf /etc/nginx/nginx.conf.template
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Permisos para storage y cache de Laravel
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

EXPOSE 8000

CMD ["/usr/local/bin/start.sh"]
