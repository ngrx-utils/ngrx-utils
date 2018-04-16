import { execNodeTask } from '../utils';

/**
 * Runs the unit tests. Does not watch for changes.
 * This task should be used when running tests on the CI server.
 */
export const testUnit = execNodeTask('@angular/cli', 'ng', ['test', 'ngrx-utils'], {
  failOnStderr: false
});
