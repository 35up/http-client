module.exports = {
  setupFilesAfterEnv: [
    './src/setup-tests.js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageDirectory: './coverage',
  coverageReporters: [
    'lcov',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
  ],
};
