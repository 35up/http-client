module.exports = {
  setupFilesAfterEnv: [
    './src/setup-tests.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageDirectory: './coverage',
  coverageReporters: [
    'lcov',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
  ],
};
