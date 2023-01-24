/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  fakeTimers: {
      enableGlobally: true,
  },
  setupFilesAfterEnv: ['./tests/setup.ts']
};