# composer dependencies
FROM composer:2 AS vendor
COPY composer.json composer.json
COPY composer.lock composer.lock
RUN composer install --ignore-platform-reqs --no-interaction --prefer-dist --no-scripts

# Runtime image. Rebuilds the deprecated craftcms/nginx image
# (https://github.com/craftcms/docker, archived, last built Dec 2024) on a
# maintained PHP base so security releases arrive with each `docker build --pull`.
# Config files in docker/ are copied verbatim from that repository.
FROM alpine:3.13 AS iconv-build
RUN apk add --no-cache gnu-libiconv

FROM php:8.2-fpm-alpine

# PHP 8.2.35 fixes CVE-2026-109618 and CVE-2026-109619 (php2shell).
RUN php -r 'exit(version_compare(PHP_VERSION, "8.2.35", "<") ? 1 : 0);' \
    || (echo "PHP $(php -r 'echo PHP_VERSION;') is older than 8.2.35" && exit 1)

ENV PHP_MEMORY_LIMIT=256M \
    PHP_MAX_EXECUTION_TIME=120 \
    PHP_UPLOAD_MAX_FILESIZE=20M \
    PHP_MAX_INPUT_VARS=1000 \
    PHP_POST_MAX_SIZE=8M \
    PHP_REGISTER_ARGC_ARGV=0 \
    PHP_OPCACHE_ENABLE=1 \
    PHP_OPCACHE_REVALIDATE_FREQ=0 \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS=0 \
    PHP_OPCACHE_MAX_ACCELERATED_FILES=10000 \
    PHP_OPCACHE_MEMORY_CONSUMPTION=128 \
    PHP_OPCACHE_MAX_WASTED_PERCENTAGE=10 \
    PHP_OPCACHE_INTERNED_STRINGS_BUFFER=16 \
    PHP_OPCACHE_FAST_SHUTDOWN=1

RUN set -ex \
    && apk upgrade --no-cache \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        freetype-dev \
        icu-dev \
        imagemagick-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libwebp-dev \
        libxml2-dev \
        libzip-dev \
        postgresql-dev \
    && apk add --no-cache \
        gifsicle \
        icu-data-full \
        imagemagick \
        jpegoptim \
        libjpeg-turbo-utils \
        libwebp-tools \
        nginx \
        optipng \
        pngquant \
        supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        gd \
        intl \
        opcache \
        pdo_mysql \
        pdo_pgsql \
        soap \
        zip \
    && pecl install imagick redis \
    && docker-php-ext-enable imagick redis \
    && RUNTIME_DEPS="$(scanelf --needed --nobanner --recursive /usr/local \
        | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
        | sort -u \
        | xargs -r apk info --installed \
        | sort -u)" \
    && apk add --no-cache --virtual .runtime-deps $RUNTIME_DEPS \
    && apk del --no-network .build-deps \
    && rm -rf /tmp/* /tmp/pear

# https://github.com/craftcms/docker/issues/16
COPY --from=iconv-build /usr/lib/preloadable_libiconv.so /usr/lib/preloadable_libiconv.so
ENV LD_PRELOAD=/usr/lib/preloadable_libiconv.so

COPY docker/php/craft-cms.ini docker/php/puppetplays.ini /usr/local/etc/php/conf.d/
COPY docker/supervisor/supervisor.conf /etc/supervisor/conf.d/supervisor.conf
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/craftcms/ /etc/nginx/craftcms/
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

RUN rm -f /etc/nginx/http.d/default.conf \
    && touch /run/nginx.pid /run/supervisord.pid \
    && chown www-data /run/nginx.pid /run/supervisord.pid \
    && chown -R www-data:www-data /var/lib/nginx/

USER www-data
WORKDIR /app

# the user is `www-data`, so we copy the files using the user and group
COPY --chown=www-data:www-data --from=vendor /app/vendor/ /app/vendor/
COPY --chown=www-data:www-data . .

RUN mkdir -p /app/web/static && \
    chmod -R 775 /app/web/static

EXPOSE 8080
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisor.conf"]
