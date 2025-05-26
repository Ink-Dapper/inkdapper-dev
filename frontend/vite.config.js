import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  server: { 
    port: 5173,
    host: true
  },
  build: {
    minify: "esbuild", // Use esbuild for faster builds
    chunkSizeWarningLimit: 500, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Define your custom chunks here
          reactVendor: ["react", "react-dom"],
          reactRouter: ["react-router-dom"],
          toastify: ["react-toastify"],
          // Add more chunks as needed
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'assets/css/[name]-[hash][extname]';
          if (assetInfo.name === 'main.js') return 'assets/js/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "react-toastify"],
  },
  base: '/',
  // Add history fallback for SPA routing
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
});
