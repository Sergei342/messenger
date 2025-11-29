import { defineConfig, Plugin } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Собственный плагин для загрузки .hbs файлов как строк
function handlebarsPlugin(): Plugin {
  return {
    name: 'vite-plugin-handlebars-loader',
    transform(code, id) {
      if (id.endsWith('.hbs')) {
        // Читаем содержимое .hbs файла
        const content = readFileSync(id, 'utf-8');
        // Возвращаем как ES модуль со строкой
        return {
          code: `export default ${JSON.stringify(content)}`,
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [handlebarsPlugin()],
  root: resolve(__dirname, 'src'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        signUp: resolve(__dirname, 'src/sign-up.html'),
        messenger: resolve(__dirname, 'src/messenger.html'),
        settings: resolve(__dirname, 'src/settings.html'),
        error404: resolve(__dirname, 'src/404.html'),
        error500: resolve(__dirname, 'src/500.html'),
      },
    },
  },
  server: {
    port: 3000,
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
    },
  },
});
