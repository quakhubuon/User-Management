import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Cho phép truy cập từ bên ngoài
    allowedHosts: ['thriving-charisma-production.up.railway.app'], // Thêm domain Railway vào danh sách cho phép
  },
})
