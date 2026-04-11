# Use an official PHP image with Apache
FROM php:8.3-apache

# ENV Arguments 
ARG APP_NAME
ARG APP_ENV
ARG APP_KEY
ARG APP_DEBUG
ARG APP_URL
ARG FRONTEND_URL
ARG LOG_LEVEL
ARG DB_CONNECTION
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG DB_USERNAME
ARG DB_PASSWORD

ARG VITE_BACKEND_ENDPOINT

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retries 5

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd xml zip

# Provide clean, perfect Apache VirtualHost configuration
COPY server/docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY server/docker/standard.htaccess /var/www/html/public/.htaccess
RUN a2enmod rewrite

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy the application code to the html folder
COPY server/ /var/www/html

# Optimize Client Build: Copy package files first to leverage Docker cache
WORKDIR /var/www/html/client
COPY client/package*.json ./
RUN npm install --no-audit --no-fund || npm install --no-audit --no-fund

# Copy the rest of the client source
COPY client/ ./
RUN npm run build

# Set working directory back to server root
WORKDIR /var/www/html

# Set working directory
WORKDIR /var/www/html

# Install Laravel dependencies
# Using composer update as a last resort if install fails due to lock/env mismatch
RUN composer install --no-interaction --optimize-autoloader || \
    composer update --no-interaction --optimize-autoloader || \
    composer install --no-interaction --optimize-autoloader --ignore-platform-reqs=php

# Set environment variables for server
RUN touch .env
RUN echo "APP_NAME=${APP_NAME}" >> .env && \
    echo "APP_ENV=${APP_ENV}" >> .env && \
    echo "APP_KEY=${APP_KEY}" >> .env && \
    echo "APP_DEBUG=${APP_DEBUG}" >> .env && \
    echo "FRONTEND_URL=${FRONTEND_URL}" >> .env && \
    echo "LOG_LEVEL=${LOG_LEVEL}" >> .env && \
    echo "DB_CONNECTION=${DB_CONNECTION}" >> .env && \
    echo "DB_HOST=${DB_HOST}" >> .env && \
    echo "DB_DATABASE=${DB_DATABASE}" >> .env && \
    echo "DB_USERNAME=${DB_USERNAME}" >> .env && \
    echo "DB_PASSWORD=${DB_PASSWORD}" >> .env && \
    echo "DB_PORT=${DB_PORT}" >> .env

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data /var/www/html && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# RUN ls -a
# RUN echo "hello wrld"

# Move React build to Laravel public directory
RUN cp -r client/dist/* public/

# # Expose port 80 for Apache
EXPOSE 80

# FROM php:8.2-apache
# # Start Apache server
# CMD ["apache2-foreground"]
