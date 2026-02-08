declare module 'vite-plugin-handlebars' {
  import { Plugin } from 'vite';

  interface HandlebarsOptions {
    partialDirectory?: string | string[];
    helpers?: Record<string, Function>;
    context?: Record<string, unknown>;
  }

  function handlebars(options?: HandlebarsOptions): Plugin;
  export default handlebars;
}
