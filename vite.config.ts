import { defineConfig } from 'vite';
import { resolve } from 'path';
import string from 'vite-plugin-string';
import history from 'connect-history-api-fallback';

export default defineConfig({
  plugins: [
    string({
      include: '**/*.hbs',
      compress: false,
    }),
  ],
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    middlewareMode: true,
    setup: ({ app }) => {
      app.use(history());
    },
  },
  preview: {
    port: 3000,
  },
  publicDir: resolve(__dirname, 'static'),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@services': resolve(__dirname, 'src/services'),
      '@core': resolve(__dirname, 'src/core'),
      '@api': resolve(__dirname, 'src/api'),
      '@controllers': resolve(__dirname, 'src/controllers'),
    },
  },
});
