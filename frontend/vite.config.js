import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), compression()],
  server: { port: 5173 },
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
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "react-toastify"],
  },
});
