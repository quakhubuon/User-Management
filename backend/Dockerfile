# Sử dụng PHP 8.2 với Apache
FROM php:8.2-apache

# Cài đặt các thư viện cần thiết
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring gd exif pcntl bcmath xml

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Tạo thư mục làm việc
WORKDIR /var/www/html

# Copy toàn bộ source code Laravel vào container
COPY . .

# Cấp quyền cho storage và bootstrap
RUN chmod -R 777 storage bootstrap/cache

# Cài đặt các package của Laravel
RUN composer install --no-dev --optimize-autoloader

# Expose cổng 8000
EXPOSE 8000

# Chạy Laravel với php artisan serve
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
