/// <reference types="vite/client" />

declare module '*.hbs' {
    const content: string;
    export default content;
}

declare module '*.scss' {
    const content: Record<string, string>;
    export default content;
}

declare module 'vite-plugin-handlebars' {
    import { Plugin } from 'vite';

    interface HandlebarsOptions {
        partialDirectory?: string | string[];
        helpers?: Record<string, Function>;
        context?: Record<string, unknown>;
    }

    export default function handlebars(options?: HandlebarsOptions): Plugin;
}
