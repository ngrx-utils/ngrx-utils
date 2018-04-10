import { task, series } from 'gulp';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { sync as glob } from 'glob';
import { buildConfig } from '../utils';

const { green, red } = chalk;

/** Path to the directory where all releases are created. */
const releasesDir = buildConfig.outputDir;
const { releasePackages } = buildConfig;

/** RegExp that matches Angular component inline styles that contain a sourcemap reference. */
const inlineStylesSourcemapRegex = /styles: ?\[["'].*sourceMappingURL=.*["']/;

/** RegExp that matches Angular component metadata properties that refer to external resources. */
const externalReferencesRegex = /(templateUrl|styleUrls): *["'[]/;

/** Task that validates the given release package before releasing. */
function checkReleasePackage(packageName: string): string[] {
  return glob(join(releasesDir, packageName, 'esm2015/*.js')).reduce(
    (failures: string[], bundlePath: string) => {
      return failures.concat(checkEs2015ReleaseBundle(bundlePath));
    },
    []
  );
}

/**
 * Checks an ES2015 bundle inside of a release package. Secondary entry-point bundles will be
 * checked as well.
 */
function checkEs2015ReleaseBundle(bundlePath: string): string[] {
  const bundleContent = readFileSync(bundlePath, 'utf8');
  const failures: string[] = [];

  if (inlineStylesSourcemapRegex.exec(bundleContent) !== null) {
    failures.push('Bundles contain sourcemap references in component styles.');
  }

  if (externalReferencesRegex.exec(bundleContent) !== null) {
    failures.push('Bundles are including references to external resources (templates or styles)');
  }

  return failures;
}

/** Task that checks the release bundles for any common mistakes before releasing to the public. */
export const validateRelease = (done: () => void) => {
  const releaseFailures = releasePackages
    .map(packageName => checkReleasePackage(packageName))
    .map((failures, index) => ({ failures, packageName: releasePackages[index] }));

  releaseFailures.forEach(({ failures, packageName }) => {
    failures.forEach(failure => console.error(red(`Failure (${packageName}): ${failure}`)));
  });

  if (releaseFailures.some(({ failures }) => failures.length > 0)) {
    // Throw an error to notify Gulp about the failures that have been detected.
    throw new Error('Release output is not valid and not ready for being released.');
  } else {
    console.log(green('Release output has been checked and everything looks fine.'));
  }

  done();
};
