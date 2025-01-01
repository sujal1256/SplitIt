import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Manually load the .env file
dotenv.config()


console.log(process.env.BACKEND_URL);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL, // Use the VITE_ prefixed environment variable
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
