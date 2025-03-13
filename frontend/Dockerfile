# Sử dụng Node.js phiên bản mới nhất
FROM node:18

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép package.json và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# Sao chép toàn bộ project vào container
COPY . .

# Mở cổng cho Vite
EXPOSE 5173

# Khởi động Vite Dev Server với host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
