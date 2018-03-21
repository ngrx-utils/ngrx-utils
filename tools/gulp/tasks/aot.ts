import { series, task } from 'gulp';
import { buildConfig, replaceVersionPlaceholders } from 'material2-build-tools';
import { join } from 'path';

import { execNodeTask } from '../util';

const { packagesDir, outputDir } = buildConfig;

const storePackage = join(packagesDir, 'store');

/** Replace version placeholder in release package */
task('replace-version', done => {
  replaceVersionPlaceholders(outputDir);
  done();
});

task('build:ng-packagr', execNodeTask('ng-packagr', 'ng-packagr', ['-p', storePackage]));

/** Builds the store packages */
task('store:build-release', series('clean', 'build:ng-packagr', 'replace-version'));

/** Builds the example app */
task('example:build-release', execNodeTask('@angular/cli', 'ng', ['build', '--prod']));

/** Builds the required release packages. */
task('build:deps', series('store:build-release', 'example:build-release'));

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('build', series('build:deps'));
