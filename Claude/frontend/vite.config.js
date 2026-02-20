// vite.config.js
// Vite bundler configuration.
// The proxy setting forwards /api/* requests to the backend
// during development, avoiding CORS issues from the browser.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to the backend dev server
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
