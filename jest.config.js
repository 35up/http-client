module.exports = {
  "testURL": "https://caseable.com/de/de/someUrl",
  "setupFilesAfterEnv": [
    "./src/setupTests.js"
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png)$": "<rootDir>/__mocks__/fileMock.js",
    "^.+\\.(css|scss)$": "identity-obj-proxy",
    "\\.svg$": "<rootDir>/__mocks__/svgr-mock.js"
  },
  "testPathIgnorePatterns": [
    "/node_modules/"
  ],
  "testEnvironmentOptions": {
    "url": "https://caseable.com/de/de/someUrl"
  },
  "coverageDirectory": "./coverage",
  "coverageReporters": [
    "lcov"
  ],
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}"
  ]
};
