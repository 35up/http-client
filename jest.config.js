module.exports = {
  setupFilesAfterEnv: [
    './src/setup-tests.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/test/**/*',
  ],
};
