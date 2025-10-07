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
    // Temporarily disabled imagetools to fix image processing errors
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
    //     // Add cache busting to prevent stale image references
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
    middlewares: [
      (req, res, next) => {
        if (req.url.endsWith('.jsx')) {
          res.setHeader('Content-Type', 'application/javascript');
        }
        next();
      }
    ],
    hmr: {
      overlay: false
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
          'swiper': ['swiper'],
          'icons': ['react-icons', 'lucide-react'],
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
        passes: 3,
        dead_code: true,
        global_defs: {
          'process.env.NODE_ENV': '"production"'
        },
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        side_effects: true,
        properties: true,
        reduce_vars: true,
        collapse_vars: true,
        sequences: true,
        comparisons: true,
        computed_props: true,
        if_return: true,
        inline: 3,
        reduce_funcs: true,
        typeofs: true,
        warnings: false
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false,
        ascii_only: true,
        beautify: false,
        ecma: 2015
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
