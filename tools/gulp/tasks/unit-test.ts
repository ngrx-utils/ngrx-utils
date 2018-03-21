import { task } from 'gulp';

import { execNodeTask } from '../util';

/**
 * Runs the unit tests. Does not watch for changes.
 * This task should be used when running tests on the CI server.
 */
task(
  'test:single-run',
  execNodeTask('@angular/cli', 'ng', ['test', '--single-run', '--code-coverage'])
);

/**
 * [Watch task] Runs the unit tests, rebuilding and re-testing when sources change.
 * Does not inline resources.
 *
 * This task should be used when running unit tests locally.
 */
task('test', execNodeTask('@angular/cli', 'ng', ['test']));
