import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    chunkSizeWarningLimit: 1000, // Increase the chunk size warning limit (default is 500KB)
    rollupOptions: {
      output: {
        manualChunks: {
          // Define your custom chunks here
          reactVendor: ['react', 'react-dom'],
          reactRouter: ['react-router-dom'],
          toastify: ['react-toastify'],
          // Add more chunks as needed
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-toastify']
  }
})