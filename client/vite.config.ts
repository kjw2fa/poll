import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import relay from 'vite-plugin-relay';
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    relay,
  ],
  define: {
    'global': {},
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
});