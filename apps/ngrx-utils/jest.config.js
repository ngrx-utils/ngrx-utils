module.exports = {
  name: 'ngrx-utils',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ngrx-utils',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
