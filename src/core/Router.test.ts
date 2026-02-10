/* eslint-disable max-classes-per-file */
import { Router } from './Router';
import { Block, BlockProps } from './Block';

class TestPage extends Block<BlockProps> {
  render(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.textContent = 'Test Page';
    fragment.appendChild(div);
    return fragment;
  }
}

class AnotherPage extends Block<BlockProps> {
  render(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.textContent = 'Another Page';
    fragment.appendChild(div);
    return fragment;
  }
}

describe('Router', () => {
  beforeEach(() => {
    (Router as any).instance = undefined;
  });

  it('должен быть синглтоном', () => {
    const router1 = Router.getInstance('#app');
    const router2 = Router.getInstance('#app');
    expect(router1).toBe(router2);
  });

  it('должен регистрировать маршруты через use()', () => {
    const router = Router.getInstance('#app');
    router.use('/', TestPage);
    router.use('/test', AnotherPage);

    expect((router as any).routes).toHaveLength(2);
  });

  it('должен возвращать this при вызове use() для цепочки', () => {
    const router = Router.getInstance('#app');
    const result = router.use('/', TestPage);
    expect(result).toBe(router);
  });

  it('должен переходить по маршруту через go()', () => {
    const router = Router.getInstance('#app');
    router.use('/', TestPage);
    router.use('/test', AnotherPage);
    router.start();

    router.go('/test');

    expect(window.location.pathname).toBe('/test');
  });

  it('должен возвращать текущий путь через getCurrentRoute()', () => {
    const router = Router.getInstance('#app');
    router.use('/', TestPage);
    router.start();

    expect(router.getCurrentRoute()).toBe(window.location.pathname);
  });

  it('должен вызывать history.back() при вызове back()', () => {
    const backSpy = jest.spyOn(window.history, 'back');

    const router = Router.getInstance('#app');
    router.use('/', TestPage);
    router.start();
    router.back();

    expect(backSpy).toHaveBeenCalled();
  });

  it('должен вызывать history.forward() при вызове forward()', () => {
    const forwardSpy = jest.spyOn(window.history, 'forward');

    const router = Router.getInstance('#app');
    router.use('/', TestPage);
    router.start();
    router.forward();

    expect(forwardSpy).toHaveBeenCalled();
  });

  it('должен регистрировать notFound маршрут', () => {
    const router = Router.getInstance('#app');
    router.notFound(TestPage);

    expect((router as any).notFoundRoute).not.toBeNull();
  });
});
