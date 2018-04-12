import { buildConfig, cleanTask } from '../utils';
import { coverageFolder } from './coverage';

/** Deletes the dist/ directory. */
export const cleanDist = cleanTask(buildConfig.outputDir);

export const cleanCoverage = cleanTask(coverageFolder);
