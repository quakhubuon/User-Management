Hướng Dẫn Chạy Project Fullstack (Laravel + ReactJS + Vite) với Docker
Link backend khi đã deploy trên Railway: https://user-management-production-f469.up.railway.app/
Link frontend khi đã deploy trên Railway: https://thriving-charisma-production.up.railway.app
•	Admin 
  o	Email: admin@example.com
  o	Mật khẩu: 12345678
•	User
  o	Email: user@example.com
  o	Mật khẩu: 12345678
1. Giới thiệu
Dự án này là một ứng dụng web fullstack sử dụng:
•	Backend: Laravel
•	Frontend: ReactJS + Vite
•	Database: MySQL
•	Docker: Dockerfile và Docker Compose để quản lý môi trường chạy cục bộ
2. Cài Đặt và Chạy Ứng Dụng
2.1. Yêu Cầu Hệ Thống
Trước khi bắt đầu, đảm bảo bạn đã cài đặt:
•	Docker: https://www.docker.com/get-started
•	Docker Compose: https://docs.docker.com/compose/install/
•	Git: https://git-scm.com/
2.2. Clone Code từ GitHub
 git clone https://github.com/quakhubuon/User-Management.git
 cd user-management-project
2.3. Cấu Hình Environment Variables
Tạo file .env trong thư mục backend và frontend bằng cách sao chép từ file .env.example:
Backend (.env)
cp backend/.env.example backend/.env
Sau đó cập nhật các giá trị cần thiết (database, JWT, ...)
  
  APP_NAME="Laravel"
  APP_ENV="production"
  APP_KEY="base64:mpdc4ltFMlqkYvLdPjpIeNtKEjDi1tc7gWGB3yxV5sI="
  APP_DEBUG="true"
  APP_URL="http://user-management-production-f469.up.railway.app"
  APP_LOCALE="en"
  APP_FALLBACK_LOCALE="en"
  APP_FAKER_LOCALE="en_US"
  APP_MAINTENANCE_DRIVER="file"
  PHP_CLI_SERVER_WORKERS="4"
  BCRYPT_ROUNDS="12"
  LOG_CHANNEL="stack"
  LOG_STACK="single"
  LOG_DEPRECATIONS_CHANNEL="null"
  LOG_LEVEL="debug"
  DB_CONNECTION="mysql"
  DB_HOST="mysql.railway.internal"
  DB_PORT="3306"
  DB_DATABASE="railway"
  DB_USERNAME="root"
  DB_PASSWORD="OHhutRtouNHnnAMCULHvrnZesHoPiUPb"
  SESSION_DRIVER="database"
  SESSION_LIFETIME="120"
  SESSION_ENCRYPT="false"
  SESSION_PATH="/"
  SESSION_DOMAIN="null"
  BROADCAST_CONNECTION="log"
  FILESYSTEM_DISK="local"
  QUEUE_CONNECTION="database"
  CACHE_STORE="database"
  MEMCACHED_HOST="127.0.0.1"
  REDIS_CLIENT="phpredis"
  REDIS_HOST="redis"
  REDIS_PASSWORD="null"
  REDIS_PORT="6379"
  MAIL_MAILER="log"
  MAIL_SCHEME="null"
  MAIL_HOST="mailhog"
  MAIL_PORT="2525"
  MAIL_USERNAME="null"
  MAIL_PASSWORD="null"
  MAIL_FROM_ADDRESS="hello@example.com"
  MAIL_FROM_NAME="${APP_NAME}"
  AWS_ACCESS_KEY_ID=""
  AWS_SECRET_ACCESS_KEY=""
  AWS_DEFAULT_REGION="us-east-1"
  AWS_BUCKET=""
  AWS_USE_PATH_STYLE_ENDPOINT="false"
  VITE_APP_NAME="${APP_NAME}"
  JWT_SECRET="w9kMrSjGj5ybHS7M5dR4TYtOdFln75UZ8v8biAoedlx5eDdWlDIdmiRUZSQNBkrh"
  JWT_ALGO="HS256"Frontend (.env)
Sửa file frontend/.env
VITE_API_BASE_URL=http://localhost:8000
2.5. Chạy Ứng Dụng với Docker Compose
Chạy lệnh sau để build và chạy backend, frontend và database trong Docker:
docker-compose up --build -d
Lệnh này sẽ:
•	Xây dựng container cho backend (Laravel), frontend (ReactJS + Vite) và MySQL.
•	Chạy database trước khi backend khởi động.
2.6. Truy Cập Ứng Dụng
•	Backend API: http://localhost:8000
•	Frontend: http://localhost:5173
•	phpMyAdmin: http://localhost:9090
3. Quản Lý User
•	Admin 
o	Email: admin@example.com
o	Mật khẩu: 12345678
•	User
o	Email: user@example.com
o	Mật khẩu: 12345678
4. CI/CD với Jenkins
Jenkins đã được cài đặt trong Docker. Truy cập:
http://localhost:8080
Cấu hình pipeline để tự động build và deploy mỗi khi push code.
5. Triển Khai Lên Cloud
Triển khai backend và frontend lên các dịch vụ miễn phí như:
•	Backend: Railway
•	Frontend: Railway
•	Database: Railway
6. Liên Hệ
Mọi thắc mắc vui lòng liên hệ qua email: tranminh2014.tm@gmail.com

