import { describe, it, expect, vi } from 'vitest';
import { Block, BlockProps } from './Block';

interface TestProps extends BlockProps {
    text?: string;
}

class TestBlock extends Block<TestProps> {
    render(): DocumentFragment {
        const fragment = document.createDocumentFragment();
        const div = document.createElement('div');
        div.className = 'test-block';
        div.textContent = this.props.text || 'Default';
        fragment.appendChild(div);
        return fragment;
    }
}

describe('Block', () => {
    it('должен создавать элемент при инициализации', () => {
        const block = new TestBlock({ text: 'Hello' });

        expect(block.element).not.toBeNull();
        expect(block.element?.textContent).toBe('Hello');
    });

    it('должен иметь уникальный id', () => {
        const block1 = new TestBlock({});
        const block2 = new TestBlock({});

        expect(block1.id).not.toBe(block2.id);
    });

    it('должен обновлять props через setProps()', () => {
        const block = new TestBlock({ text: 'Initial' });

        block.setProps({ text: 'Updated' });

        expect(block.element?.textContent).toBe('Updated');
    });

    it('должен возвращать элемент через getContent()', () => {
        const block = new TestBlock({ text: 'Test' });

        const content = block.getContent();

        expect(content).toBe(block.element);
    });

    it('должен скрывать элемент через hide()', () => {
        const block = new TestBlock({});

        block.hide();

        expect(block.element?.style.display).toBe('none');
    });

    it('должен показывать элемент через show()', () => {
        const block = new TestBlock({});
        block.hide();

        block.show();

        expect(block.element?.style.display).toBe('block');
    });

    it('должен вызывать componentDidMount при dispatchComponentDidMount()', () => {
        class TestBlockWithMount extends Block<BlockProps> {
            public mounted = false;

            protected componentDidMount(): void {
                this.mounted = true;
            }

            render(): DocumentFragment {
                const fragment = document.createDocumentFragment();
                const div = document.createElement('div');
                fragment.appendChild(div);
                return fragment;
            }
        }

        const block = new TestBlockWithMount({});
        block.dispatchComponentDidMount();

        expect(block.mounted).toBe(true);
    });

    it('должен добавлять события из props', () => {
        const clickHandler = vi.fn();
        const block = new TestBlock({
            events: {
                click: clickHandler,
            },
        });

        block.element?.click();

        expect(clickHandler).toHaveBeenCalledOnce();
    });

    it('не должен изменять props при передаче null в setProps()', () => {
        const block = new TestBlock({ text: 'Test' });
        const originalText = block.element?.textContent;

        block.setProps(null as any);

        expect(block.element?.textContent).toBe(originalText);
    });
});
