# 1. Base image
FROM php:8.3.0-fpm

# 2. Build arguments & environment
ARG HOST_APP_ROOT_DIR=./codes
ARG WORK_DIR=/var/www/html/
ENV TZ=Asia/Dhaka
ENV ACCEPT_EULA=Y

WORKDIR $WORK_DIR

# 3. System deps + Microsoft repo key & list
RUN apt-get update \
 && apt-get install -y curl gnupg2 \
 && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
 && curl https://packages.microsoft.com/config/debian/11/prod.list \
      | tee /etc/apt/sources.list.d/mssql-release.list \
 && apt-get update

# 4. Install ODBC driver & other libs
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
      msodbcsql18 \
      unixodbc-dev \
      libpng-dev \
      zlib1g-dev \
      libxml2-dev \
      libzip-dev \
      libonig-dev \
      unzip \
 && rm -rf /var/lib/apt/lists/*

# 5. PHP extensions (gd, mysql, intl, zip, opcache)
RUN docker-php-ext-configure gd \
 && docker-php-ext-install -j$(nproc) gd \
 && docker-php-ext-install pdo_mysql mysqli zip opcache \
 && docker-php-ext-configure intl \
 && docker-php-ext-install intl \
 && docker-php-source delete

# 6. Redis & SQLSRV extensions via PECL
RUN pecl install redis \
 && docker-php-ext-enable redis \
 && pecl install sqlsrv pdo_sqlsrv \
 && docker-php-ext-enable sqlsrv pdo_sqlsrv

# 7. Install Composer
RUN php -r "copy('https://getcomposer.org/installer','composer-setup.php');" \
 && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
 && php -r "unlink('composer-setup.php');"

# 8. Create non-root user
RUN groupadd -g 1000 app \
 && useradd -u 1000 -ms /bin/bash -g app app \
 && chown -R app:app $WORK_DIR

USER app

# 9. Copy Composer files & php.ini
COPY --chown=app:app $HOST_APP_ROOT_DIR/composer.json $WORK_DIR
COPY --chown=app:app $HOST_APP_ROOT_DIR/composer.lock $WORK_DIR
COPY --chown=app:app ./docker/app/php.ini /usr/local/etc/php/php.ini

# 10. Install PHP dependencies
RUN composer install --no-interaction --no-scripts --no-autoloader \
 && composer install --no-dev --optimize-autoloader --classmap-authoritative

# 11. Default command
CMD ["php-fpm"]
