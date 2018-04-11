import { parallel } from 'gulp';

import { buildConfig, execNodeTask } from '../utils';

const { releasePackages } = buildConfig;

/**
 * Runs the unit tests. Does not watch for changes.
 * This task should be used when running tests on the CI server.
 */
export const testUnit = parallel(
  ...releasePackages.map(pkg =>
    execNodeTask('@angular/cli', 'ng', ['test', pkg, '--code-coverage', '--progress', 'false'], {
      failOnStderr: false
    })
  )
);
