import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// No API key is injected into the bundle anymore. The app calls the
// /api/askMaester Cloud Function, which holds the Gemini key server-side.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/thronestrivia/',
  build: {
    outDir: '../public/thronestrivia',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
