import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { copyFileSync } from 'fs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files larger than 10kb
      deleteOriginFile: false
    }),
    {
      name: 'copy-seo-files',
      closeBundle() {
        // Copy robots.txt
        copyFileSync(
          resolve(__dirname, 'robots.txt'),
          resolve(__dirname, 'dist/robots.txt')
        );
        // Copy sitemap.xml
        copyFileSync(
          resolve(__dirname, 'sitemap.xml'),
          resolve(__dirname, 'dist/sitemap.xml')
        );
        // Copy sitemap-main.xml
        copyFileSync(
          resolve(__dirname, 'sitemap-main.xml'),
          resolve(__dirname, 'dist/sitemap-main.xml')
        );
      }
    }
  ],
  server: { 
    port: 5173,
    host: true
  },
  build: {
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom"],
          reactRouter: ["react-router-dom"],
          toastify: ["react-toastify"],
          ui: ["@headlessui/react", "@heroicons/react"],
          utils: ["axios", "lodash"]
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
    sourcemap: false, // Disable sourcemaps in production
    emptyOutDir: true,
    cssCodeSplit: true,
    reportCompressedSize: false, // Disable compressed size reporting for faster builds
    target: 'es2015', // Target modern browsers
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react-router-dom", 
      "react-toastify",
      "@headlessui/react",
      "@heroicons/react",
      "axios",
      "lodash"
    ],
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] // Exclude heavy dependencies
  },
  base: '/',
  // Add history fallback for SPA routing
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
});
