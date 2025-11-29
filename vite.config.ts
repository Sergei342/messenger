import { defineConfig } from 'vite';
import { resolve } from 'path';
// @ts-ignore - нет официальных типов для vite-plugin-handlebars
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/components'),
    }),
    {
      name: 'handlebars-loader',
      transform(code: string, id: string) {
        if (id.endsWith('.hbs')) {
          // Возвращаем содержимое .hbs файла как строку
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null,
          };
        }
        return null;
      },
    },
  ],
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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.hbs'],
  },
});
