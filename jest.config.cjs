module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@core/(.*)$': '<rootDir>/src/core/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@api/(.*)$': '<rootDir>/src/api/$1',
        '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(nanoid)/)',
    ],
};