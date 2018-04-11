import { execNodeTask } from '../utils';

/** Task to run ng lint against the apps/ and libs/ directories. */
export const lint = execNodeTask('@angular/cli', 'ng', ['lint']);
