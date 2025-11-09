import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    plugins: [
        handlebars({
            partialDirectory: resolve(__dirname, 'src/components'),
        }),
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
});