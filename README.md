# Hướng Dẫn Chạy Project Fullstack (Laravel + ReactJS + Vite) với Docker

## 1. Giới thiệu
Dự án này là một ứng dụng web fullstack sử dụng:
- **Backend**: Laravel
- **Frontend**: ReactJS + Vite
- **Database**: MySQL
- **Docker**: Dockerfile và Docker Compose để quản lý môi trường chạy cục bộ

## 2. Link Triển Khai
- **Backend (Railway)**: [https://user-management-production-f469.up.railway.app/](https://user-management-production-f469.up.railway.app/)
- **Frontend (Railway)**: [https://thriving-charisma-production.up.railway.app](https://thriving-charisma-production.up.railway.app)

## 3. Thông Tin Đăng Nhập
- **Admin**  
  - Email: `admin@example.com`  
  - Mật khẩu: `12345678`
- **User**  
  - Email: `user@example.com`  
  - Mật khẩu: `12345678`

## 4. Cài Đặt và Chạy Ứng Dụng

### 4.1. Yêu Cầu Hệ Thống
Trước khi bắt đầu, đảm bảo bạn đã cài đặt:
- **Docker**: [Tải xuống tại đây](https://www.docker.com/get-started)
- **Docker Compose**: [Hướng dẫn cài đặt](https://docs.docker.com/compose/install/)
- **Git**: [Tải xuống tại đây](https://git-scm.com/)

### 4.2. Clone Code từ GitHub
```bash
 git clone https://github.com/quakhubuon/User-Management.git
 cd user-management-project
```

### 4.3. Cấu Hình Environment Variables
Tạo file `.env` trong thư mục backend và frontend bằng cách sao chép từ file `.env.example`:

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```
Sau đó cập nhật các giá trị cần thiết (database, JWT, ...)

```ini
APP_NAME="Laravel"
APP_ENV="production"
APP_KEY="base64:mpdc4ltFMlqkYvLdPjpIeNtKEjDi1tc7gWGB3yxV5sI="
APP_DEBUG="true"
APP_URL="https://user-management-production-f469.up.railway.app"
DB_CONNECTION="mysql"
DB_HOST="mysql.railway.internal"
DB_PORT="3306"
DB_DATABASE="railway"
DB_USERNAME="root"
DB_PASSWORD="OHhutRtouNHnnAMCULHvrnZesHoPiUPb"
JWT_SECRET="w9kMrSjGj5ybHS7M5dR4TYtOdFln75UZ8v8biAoedlx5eDdWlDIdmiRUZSQNBkrh"
```

#### Frontend (.env)
Chỉnh sửa file `frontend/.env`:
```ini
VITE_API_BASE_URL=https://thriving-charisma-production.up.railway.app
```

### 4.4. Chạy Ứng Dụng với Docker Compose
Chạy lệnh sau để build và chạy backend, frontend và database trong Docker:
```bash
docker-compose up --build -d
```
Lệnh này sẽ:
- Xây dựng container cho backend (Laravel), frontend (ReactJS + Vite) và MySQL.
- Chạy database trước khi backend khởi động.

### 4.5. Truy Cập Ứng Dụng
- **Backend API**: [https://user-management-production-f469.up.railway.app/](https://user-management-production-f469.up.railway.app/)
- **Frontend**: [https://thriving-charisma-production.up.railway.app](https://thriving-charisma-production.up.railway.app)

## 5. CI/CD với Jenkins
Jenkins đã được cài đặt trong Docker. Truy cập:
```bash
http://localhost:8080
```
Cấu hình pipeline để tự động build và deploy mỗi khi push code.

## 6. Triển Khai Lên Cloud
Triển khai backend và frontend lên các dịch vụ miễn phí như:
- **Backend**: Railway
- **Frontend**: Railway
- **Database**: Railway

## 7. Liên Hệ
Mọi thắc mắc vui lòng liên hệ qua email: `tranminh2014.tm@gmail.com`
