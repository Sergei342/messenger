import * as Handlebars from 'handlebars';
import { EventBus } from './EventBus';
import { nanoid } from './utils';

export interface BlockProps {
  events?: Record<string, EventListener>;
  [key: string]: unknown;
}

export abstract class Block<P extends BlockProps = BlockProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  private _element: HTMLElement | null = null;

  protected props: P;

  protected children: Record<string, Block>;

  private eventBus: EventBus;

  public id = nanoid(6);

  constructor(propsAndChildren: P = {} as P) {
    const eventBus = new EventBus();
    const { props, children } = this._getChildrenAndProps(propsAndChildren);

    this.children = children;
    this.props = this._makePropsProxy(props);
    this.eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _getChildrenAndProps(propsAndChildren: P) {
    const children: Record<string, Block> = {};
    const props = {} as P;

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) children[key] = value;
      else props[key as keyof P] = value as P[keyof P];
    });

    return { props, children };
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this.componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, (...args: any[]) => {
      this._componentDidUpdate(args[0] as P, args[1] as P);
    });
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _init(): void {
    this.init();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected init(): void {}

  protected componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
    Object.values(this.children).forEach((child) => child.dispatchComponentDidMount());
  }

  protected componentDidUpdate(oldProps: P, newProps: P): boolean {
    return oldProps !== newProps;
  }

  setProps = (nextProps: Partial<P>): void => {
    if (!nextProps) return;
    Object.assign(this.props, nextProps);
  };

  get element(): HTMLElement | null {
    return this._element;
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (response) this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected _render(): void {
    const fragment = this.render();
    const newElement = fragment.firstElementChild as HTMLElement;

    if (!newElement) return;

    // Только если элемент реально отличается
    if (this._element && this._element !== newElement) {
      this._removeEvents();
      if (this._element.parentNode) this._element.replaceWith(newElement);
      this._element = newElement;
    } else if (!this._element) {
      this._element = newElement;
    }

    this._addEvents();
  }

  protected abstract render(): DocumentFragment;

  protected compile(template: string, context: Record<string, unknown>): DocumentFragment {
    const contextAndStubs = { ...context };

    Object.entries(this.children).forEach(([name, component]) => {
      contextAndStubs[name] = `<div data-id="${component.id}"></div>`;
    });

    const html = Handlebars.compile(template)(contextAndStubs);
    const temp = document.createElement('template');
    temp.innerHTML = html;

    Object.entries(this.children).forEach(([, component]) => {
      const stub = temp.content.querySelector(`[data-id="${component.id}"]`);
      if (!stub) return;
      const content = component.getContent();
      if (content) stub.replaceWith(content);
    });

    return temp.content;
  }

  getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: P): P {
    return new Proxy(props, {
      get: (target, prop: string) => {
        const value = target[prop as keyof P];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set: (target, prop: string, value) => {
        const oldTarget = { ...target };
        target[prop as keyof P] = value;
        this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty: () => {
        throw new Error('Нет доступа');
      },
    });
  }

  private _addEvents(): void {
    const { events = {} } = this.props as { events?: Record<string, EventListener> };
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props as { events?: Record<string, EventListener> };
    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  show(): void {
    const content = this.getContent();
    if (content) content.style.display = 'block';
  }

  hide(): void {
    const content = this.getContent();
    if (content) content.style.display = 'none';
  }
}
