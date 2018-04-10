import chalk from 'chalk';
import { spawn } from 'child_process';
import { existsSync, statSync } from 'fs-extra';
import { series, task } from 'gulp';
import { buildConfig } from '../utils';
import * as minimist from 'minimist';
import { join } from 'path';

import { execTask } from '../utils';

const { yellow, green, red, grey } = chalk;

/** Packages that will be published to NPM by the release task. */
const { releasePackages } = buildConfig;

/** Regular Expression that matches valid version numbers of Angular Material. */
export const validVersionRegex = /^\d+\.\d+\.\d+(-(alpha|beta|rc)\.\d+)?$/;

/** Parse command-line arguments for release task. */
const argv = minimist(process.argv.slice(3));

export const npmWhoAmI = execTask('npm', ['whoami'], {
  silent: true,
  errMessage: 'You must be logged in to publish.'
});

export const npmLogout = execTask('npm', ['logout']);

export const npmPublish = async (done: () => void) => {
  const tag = argv['tag'];
  const version = buildConfig.projectVersion;
  const currentDir = process.cwd();

  if (!version.match(validVersionRegex)) {
    console.log(
      red(
        `Error: Cannot publish due to an invalid version name. Version "${version}" ` +
          `is not following our semver format.`
      )
    );
    console.log(
      yellow(
        `A version should follow this format: d.d.d, d.d.d-beta.x, d.d.d-alpha.x, ` + `d.d.d-rc.x`
      )
    );
    return;
  }

  console.log('');
  if (!tag) {
    console.log(grey('> You can specify the tag by passing --tag=labelName.\n'));
    console.log(green(`Publishing version "${version}" to the latest tag...`));
  } else {
    console.log(yellow(`Publishing version "${version}" to the ${tag} tag...`));
  }
  console.log('');

  if (version.match(/(alpha|beta|rc)/) && (!tag || tag === 'latest')) {
    console.log(red(`Publishing ${version} to the "latest" tag is not allowed.`));
    console.log(red(`Alpha, Beta or RC versions shouldn't be published to "latest".`));
    console.log();
    return;
  }

  if (releasePackages.length > 1) {
    console.warn(red('Warning: Multiple packages will be released if proceeding.'));
    console.warn(red('Warning: Packages to be released:', releasePackages.join(', ')));
    console.log();
  }

  console.log(yellow('> Make sure to check the "angularVersion" in the build config.'));
  console.log(yellow('> The version in the config defines the peer dependency of Angular.'));
  console.log();

  // Iterate over every declared release package and publish it on NPM.
  for (const packageName of releasePackages) {
    await _execNpmPublish(tag, packageName);
  }

  process.chdir(currentDir);
  done();
};

function _execNpmPublish(tag: string, packageName: string): Promise<{}> | undefined {
  const packageDir = join(buildConfig.outputDir, packageName);

  if (!statSync(packageDir).isDirectory()) {
    return;
  }

  if (!existsSync(join(packageDir, 'package.json'))) {
    throw new Error(`"${packageDir}" does not have a package.json.`);
  }

  if (!existsSync(join(packageDir, 'LICENSE'))) {
    throw new Error(`"${packageDir}" does not have a LICENSE file`);
  }

  process.chdir(packageDir);
  console.log(green(`Publishing ${packageName}...`));

  const command = 'npm';
  const args = ['publish', '--access', 'public'];

  if (tag) {
    args.push('--tag', tag);
  }

  return new Promise((resolve, reject) => {
    console.log(grey(`Executing: ${command} ${args.join(' ')}`));
    if (argv['dry']) {
      resolve();
      return;
    }

    const childProcess = spawn(command, args);
    childProcess.stdout.on('data', (data: Buffer) => {
      console.log(
        `  stdout: ${data
          .toString()
          .split(/[\n\r]/g)
          .join('\n          ')}`
      );
    });
    childProcess.stderr.on('data', (data: Buffer) => {
      console.error(
        `  stderr: ${data
          .toString()
          .split(/[\n\r]/g)
          .join('\n          ')}`
      );
    });

    childProcess.on('close', (code: number) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Could not publish ${packageName}, status: ${code}.`));
      }
    });
  });
}
