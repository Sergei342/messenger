import { Block, BlockProps } from './Block';

class Route {
    private _pathname: string;

    private _blockClass: new () => Block<BlockProps>;

    private _block: Block<BlockProps> | null;

    private _props: { rootQuery: string };

    constructor(
        pathname: string,
        view: new () => Block<BlockProps>,
        props: { rootQuery: string },
    ) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    navigate(pathname: string): void {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave(): void {
        if (this._block) {
            this._block.hide();
            const root = document.querySelector(this._props.rootQuery);
            if (root) {
                root.innerHTML = '';
            }
            this._block = null;
        }
    }

    match(pathname: string): boolean {
        return pathname === this._pathname;
    }

    render(): void {
        if (!this._block) {
            this._block = new this._blockClass();
        }

        const root = document.querySelector(this._props.rootQuery);
        if (root) {
            root.innerHTML = '';
            const content = this._block.getContent();
            if (content) {
                root.appendChild(content);
            }
            this._block.dispatchComponentDidMount();
            this._block.show();
        }
    }
}

class Router {
    private static __instance: Router | null = null;

    private routes: Route[] = [];

    private history: History = window.history;

    private _currentRoute: Route | null = null;

    private _rootQuery: string = '';

    private _notFoundRoute: Route | null = null;

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this._rootQuery = rootQuery;
        Router.__instance = this;
    }

    use(
        pathname: string,
        block: new () => Block<BlockProps>,
    ): this {
        const route = new Route(pathname, block, { rootQuery: this._rootQuery });
        this.routes.push(route);
        return this;
    }

    notFound(block: new () => Block<BlockProps>): this {
        this._notFoundRoute = new Route('*', block, { rootQuery: this._rootQuery });
        return this;
    }

    start(): void {
        window.onpopstate = ((event: PopStateEvent) => {
            const target = event.currentTarget as Window;
            this._onRoute(target.location.pathname);
        });

        this._onRoute(window.location.pathname);
    }

    private _onRoute(pathname: string): void {
        const route = this.getRoute(pathname);

        if (this._currentRoute && this._currentRoute !== route) {
            this._currentRoute.leave();
        }

        if (route) {
            this._currentRoute = route;
            route.render();
        } else if (this._notFoundRoute) {
            this._currentRoute = this._notFoundRoute;
            this._notFoundRoute.render();
        }
    }

    go(pathname: string): void {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back(): void {
        this.history.back();
    }

    forward(): void {
        this.history.forward();
    }

    private getRoute(pathname: string): Route | undefined {
        return this.routes.find((route) => route.match(pathname));
    }

    getCurrentRoute(): string {
        return window.location.pathname;
    }

    static getInstance(): Router | null {
        return Router.__instance;
    }

    static reset(): void {
        Router.__instance = null;
    }
}

export { Router };

