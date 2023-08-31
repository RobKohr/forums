import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
  plugins: [solidPlugin(), solidSvg()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    }
  },
  build: {
    target: 'esnext',
  },
});
