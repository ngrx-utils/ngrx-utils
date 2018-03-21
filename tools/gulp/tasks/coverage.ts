import { task, series } from 'gulp';
import { buildConfig } from 'material2-build-tools';
import { join } from 'path';
import { execNodeTask } from '../util';

/** Path to the file that includes all coverage information form Karma. */
const coverageResultFile = join(buildConfig.projectDir, 'coverage/lcov.info');

task('coverage:upload', execNodeTask('codecov', 'codecov', ['-f', coverageResultFile]));
