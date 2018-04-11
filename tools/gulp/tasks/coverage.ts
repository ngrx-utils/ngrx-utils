import { createReadStream, createWriteStream } from 'fs';
import { join } from 'path';

import { buildConfig, execNodeTask } from '../utils';

export const coverageFile = join(buildConfig.outputDir, 'lcov.info');

const { releasePackages } = buildConfig;

/** Path to the file that includes all coverage information form Karma. */
export const coverageUpload = execNodeTask('codecov', 'codecov', ['-f', coverageFile]);

export const coverageGenerate = (done: () => void) => {
  concatCoverageFiles();
  done();
};

function concatCoverageFiles() {
  releasePackages.map(pkg => join(buildConfig.packagesDir, `${pkg}/coverage/lcov.info`)).map(file =>
    createReadStream(file).pipe(
      createWriteStream(coverageFile, {
        flags: 'a'
      })
    )
  );
}
