// import type { Config } from 'jest';

// const config: Config = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//     '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
//   },
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest',
//   },
// };

// export default config;

const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // raiz do projeto Next.js
});

const customJestConfig = {
  testEnvironment: 'jsdom',           // necessário para React
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // configuração de jest-dom
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',   // alias @/ para src/
  },
};

module.exports = createJestConfig(customJestConfig);
