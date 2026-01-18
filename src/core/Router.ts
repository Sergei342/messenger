import { Block, BlockProps } from './Block';
import { Route } from './Route';

class Router {
  private static instance: Router;

  private routes: Route[] = [];

  private history: History = window.history;

  private currentRoute: Route | null = null;

  private rootQuery: string;

  private notFoundRoute: Route | null = null;

  private constructor(rootQuery: string) {
    this.rootQuery = rootQuery;
  }

  static getInstance(rootQuery = '#app'): Router {
    if (!Router.instance) {
      Router.instance = new Router(rootQuery);
    }
    return Router.instance;
  }

  use(pathname: string, block: new () => Block<BlockProps>): this {
    const route = new Route(pathname, block, { rootQuery: this.rootQuery });
    this.routes.push(route);
    return this;
  }

  notFound(block: new () => Block<BlockProps>): this {
    this.notFoundRoute = new Route('*', block, { rootQuery: this.rootQuery });
    return this;
  }

  start(): void {
    window.onpopstate = () => {
      this.onRoute(window.location.pathname);
    };

    this.onRoute(window.location.pathname);
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this.onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getCurrentRoute(): string {
    return window.location.pathname;
  }

  private onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
    }

    if (route) {
      this.currentRoute = route;
      route.render();
      return;
    }

    if (this.notFoundRoute) {
      this.currentRoute = this.notFoundRoute;
      this.notFoundRoute.render();
    }
  }

  private getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}

export { Router };
