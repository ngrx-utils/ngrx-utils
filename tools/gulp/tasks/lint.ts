import { task } from 'gulp';
import { execNodeTask } from '../util';

/** Task to run ng lint against the apps/ and libs/ directories. */
task('lint', execNodeTask('@angular/cli', 'ng', ['lint']));
