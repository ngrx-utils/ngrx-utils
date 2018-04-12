import { join } from 'path';

import { buildConfig, execNodeTask } from '../utils';

export const coverageFolder = join(buildConfig.projectDir, 'coverage');

export const coverageFile = `${coverageFolder}/lcov.info`;

/** Path to the file that includes all coverage information form Karma. */
export const coverageUpload = execNodeTask('codecov', 'codecov', ['-f', coverageFile]);
