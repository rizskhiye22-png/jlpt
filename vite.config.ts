import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' supaya hasil build bisa dibuka dari subfolder (GitHub Pages)
// Tanda versi build: dipasang ke css/js lama (?v=...) supaya HP tidak memakai file lama dari cache
const BUILD = new Date().toISOString().replace(/\D/g, '').slice(0, 12);
const cacheBust = {
  name: 'cache-bust',
  transformIndexHtml: (html: string) => html.replace(/(href="css\/[^"?]+\.css|src="js\/[^"?]+\.js)"/g, `$1?v=${BUILD}"`).replace('__BUILD__', BUILD),
};

export default defineConfig({
  base: './',
  plugins: [react(), cacheBust],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
  server: { port: 5173, host: true },
});
