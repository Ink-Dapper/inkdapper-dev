import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";
import { imagetools } from "vite-imagetools";
import { copyFileSync } from 'fs';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      threshold: 1024,
    }),
    imagetools({
      defaultDirectives: new URLSearchParams([
        ['format', 'webp'],
        ['quality', '75'],
      ]),
      include: /\.(jpe?g|png|gif|tiff|webp|svg)$/i,
      exclude: /node_modules/,
      silent: true,
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
    host: true,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    minify: "terser",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui-components': ['@mui/material', '@mui/icons-material', '@headlessui/react', '@heroicons/react'],
          'utils': ['axios', 'lodash'],
          'toastify': ['react-toastify'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'assets/css/[name]-[hash][extname]';
          if (assetInfo.name === 'main.js') return 'assets/js/[name]-[hash][extname]';
          if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    target: 'es2015',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
        dead_code: true,
        global_defs: {
          'process.env.NODE_ENV': '"production"'
        }
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false,
        ascii_only: true
      },
    },
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
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    esbuildOptions: {
      target: 'es2015',
      treeShaking: true,
      minify: true,
    }
  },
  base: '/',
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
});
