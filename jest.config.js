/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  // moduleNameMapper: {},
  modulePathIgnorePatterns: [
    "src/domain/entities",
    "src/domain/repositories",
    "src/domain/enums",
    "src/domain/interfaces",
    "src/utils",
    "tests/mocks",
  ],
  rootDir: "./",
  roots: ["<rootDir>"],
  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  verbose: true,
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  preset: "ts-jest",
};
