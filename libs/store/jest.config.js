module.exports = {
  name: 'store',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/store',
  setupTestFrameworkScriptFile: '../../setup-jest.ts',
  collectCoverageFrom: ['**/*.{js,ts,tsx}'],
  coveragePathIgnorePatterns: ['/index.ts', '/node_modules/', '/jest.config.js']
};
