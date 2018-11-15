module.exports = {
  name: 'ng',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ng',
  setupTestFrameworkScriptFile: '../../setup-jest.ts',
  collectCoverageFrom: ['**/*.{js,ts,tsx}'],
  coveragePathIgnorePatterns: ['/index.ts', '/node_modules/', '/jest.config.js']
};
