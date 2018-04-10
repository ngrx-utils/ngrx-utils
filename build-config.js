/**
 * Build configuration for the packaging tool. This file will be automatically detected and used
 * to build the different packages inside of Material.
 */
const { join } = require('path');

const package = require('./package.json');

/** Current version of the project*/
const buildVersion = package.version;

/**
 * Required Angular version for all Angular Material packages. This version will be used
 * as the peer dependency version for Angular in all release packages.
 */
const angularVersion = '^6.0.0-rc.0 || ^6.0.0';

/** License that will be placed inside of all created bundles. */
const buildLicense = `/**
 * @license
 * MIT License
 * Copyright (c) 2018 San Nguyen
 * 
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/ngrx-utils/ngrx-utils/blob/master/LICENSE
 */`;

module.exports = {
  projectVersion: buildVersion,
  angularVersion: angularVersion,
  projectDir: __dirname,
  packagesDir: join(__dirname, 'projects'),
  outputDir: join(__dirname, 'dist/releases'),
  licenseBanner: buildLicense,
  releasePackages: ['store']
};
