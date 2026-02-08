import { Block, BlockProps } from './Block';

class Route {
  private pathname: string;

  private BlockClass: new () => Block<BlockProps>;

  private block: Block<BlockProps> | null = null;

  private props: { rootQuery: string };

  constructor(
    pathname: string,
    view: new () => Block<BlockProps>,
    props: { rootQuery: string },
  ) {
    this.pathname = pathname;
    this.BlockClass = view;
    this.props = props;
  }

  match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this.render();
    }
  }

  leave(): void {
    if (!this.block) {
      return;
    }

    this.block.hide();
    const root = document.querySelector(this.props.rootQuery);
    if (root) {
      root.innerHTML = '';
    }
    this.block = null;
  }

  render(): void {
    if (!this.block) {
      this.block = new this.BlockClass();
    }

    const root = document.querySelector(this.props.rootQuery);
    if (!root) {
      return;
    }

    root.innerHTML = '';
    const content = this.block.getContent();

    if (content) {
      root.appendChild(content);
    }

    this.block.dispatchComponentDidMount();
    this.block.show();
  }
}

export { Route };
