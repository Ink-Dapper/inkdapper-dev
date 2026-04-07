import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";
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
    // imagetools disabled — import is missing; re-enable after adding:
    // import imagetools from 'vite-imagetools'
    // imagetools({
    //   defaultDirectives: new URLSearchParams([
    //     ['format', 'webp'],
    //     ['quality', '75'],
    //   ]),
    //   include: /\.(jpe?g|png|gif|tiff|webp)$/i,
    //   exclude: [/node_modules/, /\.svg$/],
    //   silent: true,
    //   failOnError: false,
    //   extendURL: (url, { searchParams }) => {
    //     searchParams.set('v', Date.now());
    //     return url;
    //   },
    // }),
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
        target: process.env.VITE_API_URL || 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      }
    },
    hmr: {
      overlay: false
    }
  },
  build: {
    minify: "terser",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Function-based splitting gives Rollup full path context and avoids
        // circular-reference errors that object-based splitting can produce.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // React core — always first (other chunks depend on it)
          if (id.includes('/react-dom/') || id.match(/\/react\/(?!.*node_modules)/)) return 'react-vendor';
          // Router
          if (id.includes('react-router')) return 'react-router';
          // MUI icons are ~2 MB on their own — keep separate so they tree-shake better
          if (id.includes('@mui/icons-material')) return 'mui-icons';
          // MUI core + system
          if (id.includes('@mui/material') || id.includes('@mui/system') || id.includes('@mui/base') || id.includes('@mui/utils')) return 'mui-core';
          // NOTE: @emotion and styled-components are intentionally NOT split into their
          // own chunk — they depend on React and splitting them causes a TDZ crash
          // ("Cannot access 'R' before initialization") due to Rollup chunk init order.
          // They fall through to the 'vendor' chunk below.
          // Swiper (carousel) — heavy, rarely changes
          if (id.includes('swiper')) return 'swiper';
          // Icon libraries
          if (id.includes('lucide-react') || id.includes('react-icons') || id.includes('@heroicons')) return 'icons';
          // Notifications
          if (id.includes('react-toastify')) return 'toastify';
          // Data / HTTP utils
          if (id.includes('axios') || id.includes('lodash')) return 'utils';
          // Headless UI primitives
          if (id.includes('@headlessui')) return 'headlessui';
          // Everything else from node_modules → a single shared vendor chunk
          return 'vendor';
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
