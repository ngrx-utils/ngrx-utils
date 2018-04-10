import { task, series } from 'gulp';
import { buildConfig } from '../utils';
import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { execNodeTask } from '../utils';

export const coverageFile = join(buildConfig.outputDir, 'lcov.info');

/** Path to the file that includes all coverage information form Karma. */
export const coverageUpload = execNodeTask('codecov', 'codecov', ['-f', coverageFile]);

export const coverageGenerate = (done: () => void) => {
  concatCoverageFiles();
  done();
};

function concatCoverageFiles() {
  const releasePackages = ['store', 'example'];
  releasePackages.map(pkg => join(buildConfig.packagesDir, `${pkg}/coverage/lcov.info`)).map(file =>
    createReadStream(file).pipe(
      createWriteStream(coverageFile, {
        flags: 'a'
      })
    )
  );
}
