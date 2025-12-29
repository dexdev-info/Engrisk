import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"), // Cho phép import @/components thay vì ../../../components
    },
  },
  server: {
    proxy: {
      '/api': { // Proxy API requests to the backend server
        target: 'http://localhost:5000', // Server Backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})