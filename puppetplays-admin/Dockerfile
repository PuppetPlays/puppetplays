# composer dependencies
FROM composer:1 as vendor
COPY composer.json composer.json
COPY composer.lock composer.lock
RUN composer install --ignore-platform-reqs --no-interaction --prefer-dist --no-scripts

FROM craftcms/nginx:8.0

# the user is `www-data`, so we copy the files using the user and group
COPY --chown=www-data:www-data --from=vendor /app/vendor/ /app/vendor/
COPY --chown=www-data:www-data . .

RUN mkdir -p /app/web/static && \
    chmod -R 775 /app/web/static