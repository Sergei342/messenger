/// <reference types="vite/client" />

declare module '*.hbs' {
  const content: string;
  export default content;
}

declare module '*.hbs?raw' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module 'vite-plugin-handlebars' {
  import type { Plugin } from 'vite';

  export interface HandlebarsPluginOptions {
    partialDirectory?: string | string[];
    helpers?: Record<string, (...args: any[]) => any>;
    context?: Record<string, any>;
  }

  export default function handlebarsPlugin(
    options?: HandlebarsPluginOptions
  ): Plugin;
}
