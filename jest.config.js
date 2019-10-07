module.exports = {
  setupFilesAfterEnv: [
    './src/setupTests.js',
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
