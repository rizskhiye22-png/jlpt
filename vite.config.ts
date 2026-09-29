import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' supaya hasil build bisa dibuka dari subfolder (GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
  server: { port: 5173, host: true },
});
