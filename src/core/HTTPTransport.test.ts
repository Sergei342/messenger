import { describe, it, expect } from 'vitest';
import { queryStringify } from './HTTPTransport';

describe('HTTPTransport', () => {
    describe('queryStringify', () => {
        it('должен преобразовывать объект в query string', () => {
            const data = { name: 'John', age: 30 };
            const result = queryStringify(data);

            expect(result).toBe('?name=John&age=30');
        });

        it('должен кодировать специальные символы', () => {
            const data = { text: 'hello world' };
            const result = queryStringify(data);

            expect(result).toBe('?text=hello%20world');
        });

        it('должен выбрасывать ошибку если data не объект', () => {
            expect(() => queryStringify('string' as any)).toThrow('Data must be object');
        });

        it('должен возвращать пустой query string для пустого объекта', () => {
            const result = queryStringify({});

            expect(result).toBe('?');
        });

        it('должен обрабатывать числовые значения', () => {
            const data = { page: 1, limit: 10 };
            const result = queryStringify(data);

            expect(result).toBe('?page=1&limit=10');
        });

        it('должен обрабатывать булевы значения', () => {
            const data = { active: true, deleted: false };
            const result = queryStringify(data);

            expect(result).toBe('?active=true&deleted=false');
        });
    });
});
