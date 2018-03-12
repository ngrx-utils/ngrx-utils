import { task } from 'gulp';
import { join } from 'path';
import { statSync } from 'fs';
import { sync as glob } from 'glob';
import { isTravisBuild, isTravisMasterBuild } from '../util/travis-ci';
import { buildConfig } from 'material2-build-tools';
import { spawnSync } from 'child_process';

// These imports lack of type definitions.
const request = require('request');

/** Path to the directory where all bundles are living. */
const bundlesDir = join(buildConfig.outputDir, 'bundles');

/** Returns the size of the given library bundle. */
function getBundleSize(bundleName: string) {
  return glob(bundleName, { cwd: bundlesDir }).reduce(
    (sum, fileName) => sum + getFilesize(join(bundlesDir, fileName)),
    0
  );
}

/** Returns the size of a file in kilobytes. */
function getFilesize(filePath: string) {
  return statSync(filePath).size / 1000;
}

/**
 * Updates the Github status of a given commit by sending a request to a Firebase function of
 * the dashboard. The function has access to the Github repository and can set status for PRs too.
 */
async function updateGithubStatus(
  commitSha: string,
  packageName: string,
  packageDiff: number,
  packageFullSize: number,
  authToken: string
) {
  const options = {
    url: 'https://us-central1-material2-board.cloudfunctions.net/payloadGithubStatus',
    headers: {
      'User-Agent': 'Material2/PayloadTask',
      'auth-token': authToken,
      'commit-sha': commitSha,
      'package-name': packageName,
      'package-full-size': packageFullSize,
      'package-size-diff': packageDiff
    }
  };

  return new Promise((resolve, reject) => {
    request(options, (err: any, response: any, body: string) => {
      if (err) {
        reject(`Dashboard Error ${err.toString()}`);
      } else {
        console.info(`Dashboard Response (${response.statusCode}): ${body}`);
        resolve(response.statusCode);
      }
    });
  });
}

/** Gets the SHA of the commit where the payload was uploaded before this Travis Job started. */
function getCommitFromPreviousPayloadUpload(): string {
  if (isTravisMasterBuild()) {
    const commitRange = process.env['TRAVIS_COMMIT_RANGE']!;
    // In some situations, Travis will include multiple commits in a single Travis Job. This means
    // that we can't just resolve the previous commit by using the parent commit of HEAD.
    // By resolving the amount of commits inside of the current Travis Job, we can figure out
    // how many commits before HEAD the last Travis Job ran.
    const commitCount = spawnSync('git', ['rev-list', '--count', commitRange])
      .stdout.toString()
      .trim();
    // With the amount of commits inside of the current Travis Job, we can query Git to print
    // the SHA of the commit that ran before this Travis Job was created.
    return spawnSync('git', ['rev-parse', `HEAD~${commitCount}`])
      .stdout.toString()
      .trim();
  } else {
    // Travis applies the changes of Pull Requests in new branches. This means that resolving
    // the commit that previously ran on the target branch (mostly "master") can be done
    // by just loading the SHA of the most recent commit in the target branch.
    return spawnSync('git', ['rev-parse', process.env['TRAVIS_BRANCH']!])
      .stdout.toString()
      .trim();
  }
}

/** Rounds the specified file size to two decimal places. */
function roundFileSize(fileSize: number) {
  return Math.round(fileSize * 100) / 100;
}
