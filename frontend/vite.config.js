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
      overlay: false,
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
      clientPort: 5173
    }
  },
  build: {
    minify: "terser",
    chunkSizeWarningLimit: 500, // Reduced for better performance monitoring
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React chunks
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Router chunk
          if (id.includes('react-router')) {
            return 'react-router';
          }
          
          // UI Libraries - split by size
          if (id.includes('@mui/material') || id.includes('@mui/icons-material')) {
            return 'mui-components';
          }
          if (id.includes('@headlessui') || id.includes('@heroicons')) {
            return 'headless-components';
          }
          
          // Icons - separate chunk for better caching
          if (id.includes('react-icons') || id.includes('lucide-react')) {
            return 'icons';
          }
          
          // Utilities
          if (id.includes('axios') || id.includes('lodash') || id.includes('date-fns')) {
            return 'utils';
          }
          
          // Toast notifications
          if (id.includes('react-toastify')) {
            return 'toastify';
          }
          
          // Swiper for carousels
          if (id.includes('swiper')) {
            return 'swiper';
          }
          
          // Styled components
          if (id.includes('styled-components') || id.includes('@emotion')) {
            return 'styled-components';
          }
          
          // JWT and auth
          if (id.includes('jwt-decode')) {
            return 'auth';
          }
          
          // Workbox for service workers
          if (id.includes('workbox')) {
            return 'workbox';
          }
          
          // Node modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(js)$/i.test(assetInfo.name)) {
            return 'assets/js/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    emptyOutDir: true,
    cssCodeSplit: true,
    reportCompressedSize: false,
    target: 'es2015',
    // Performance optimizations
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssTarget: 'es2015',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2,
        dead_code: true,
        global_defs: {
          'process.env.NODE_ENV': '"production"'
        },
        unsafe: false,
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
        side_effects: true,
        properties: true,
        reduce_vars: true,
        collapse_vars: true,
        sequences: true,
        comparisons: true,
        computed_props: true,
        inline: 3,
        reduce_funcs: true,
        typeofs: true,
        warnings: false,
        // Additional performance optimizations
        keep_infinity: true,
        module: true,
        toplevel: true,
        top_retain: ['__webpack_require__', '__webpack_exports__', '__webpack_module__']
      },
      mangle: {
        safari10: true,
        toplevel: true
      },
      format: {
        comments: false,
        ascii_only: true,
        beautify: false,
        ecma: 2015,
        safari10: true
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
      "lodash",
      "@mui/material",
      "@mui/icons-material",
      "swiper",
      "react-icons",
      "lucide-react",
      "date-fns",
      "jwt-decode"
    ],
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
    esbuildOptions: {
      target: 'es2015',
      treeShaking: true,
      minify: true,
      // Additional optimizations
      legalComments: 'none',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      drop: ['console', 'debugger'],
      pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
    },
    // Force optimization of these dependencies
    force: true
  },
  base: '/',
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
});
