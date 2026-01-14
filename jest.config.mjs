/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',
    transform: {},
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    testMatch: ['**/__tests__/**/*.test.mjs'],
};

export default config;
