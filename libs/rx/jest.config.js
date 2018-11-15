module.exports = {
  name: 'rx',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/rx',
  setupTestFrameworkScriptFile: '../../setup-jest.ts',
  collectCoverageFrom: ['**/*.{js,ts,tsx}'],
  coveragePathIgnorePatterns: ['/index.ts', '/node_modules/', '/jest.config.js']
};
