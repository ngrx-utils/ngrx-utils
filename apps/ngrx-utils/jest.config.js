module.exports = {
  name: 'ngrx-utils',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/ngrx-utils',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
