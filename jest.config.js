module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "/node_modules/(?!(expo|react-native|@react-native|@react-navigation|expo-modules-core|firebase|@firebase|@expo/vector-icons)/)",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "<rootDir>/report/test-report.html",
        includeFailureMsg: true,
        includeSuiteFailure: true,
        customLanguage: "en",
      },
    ],
  ],
};
