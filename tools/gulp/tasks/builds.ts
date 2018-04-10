import { parallel } from 'gulp';

import { buildConfig, execNodeTask, replaceVersionPlaceholders } from '../utils';

const { outputDir, releasePackages } = buildConfig;

/** Replace version placeholder in release package */
export const replaceVersion = (done: () => void) => {
  replaceVersionPlaceholders(outputDir);
  done();
};

/** Build all packages */
export const buildAll = parallel(
  ...releasePackages.map(pkg => execNodeTask('@angular/cli', 'ng', ['build', pkg, '--prod']))
);
