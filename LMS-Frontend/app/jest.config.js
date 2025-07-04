/** @type {import('jest').Config} */
module.exports = {
  // let ts-jest compile *.ts that we `require()` from the JS specs
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/__tests__"],
  testRegex: "(/__tests__/.*\\.spec\\.js)$",

  moduleFileExtensions: ["js", "ts", "json"],

  // simple Angular / HttpClient shims
  setupFiles: ["<rootDir>/jest.setup.js"],

  // keep CI logs quiet
  silent: true,
};
