import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the site works on GitHub Pages under /<repo>/
  base: './',
  server: { port: 5173 },
});
