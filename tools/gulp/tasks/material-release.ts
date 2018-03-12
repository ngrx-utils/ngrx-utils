import { task, src, dest } from 'gulp';
import { join } from 'path';
import { writeFileSync, mkdirpSync } from 'fs-extra';
import { composeRelease, buildConfig, sequenceTask } from 'material2-build-tools';
import { materialPackage } from '../packages';

// There are no type definitions available for these imports.
const gulpRename = require('gulp-rename');

const distDir = buildConfig.outputDir;
const { sourceDir, outputDir } = materialPackage;

/** Path to the directory where all releases are created. */
const releasesDir = join(distDir, 'releases');

// Path to the release output of material.
const releasePath = join(releasesDir, 'material');
// The entry-point for the scss theming bundle.
const themingEntryPointPath = join(sourceDir, 'core', 'theming', '_all-theme.scss');
// Output path for the scss theming bundle.
const themingBundlePath = join(releasePath, '_theming.scss');
// Matches all pre-built theme css files
const prebuiltThemeGlob = join(outputDir, '**/theming/prebuilt/*.css?(.map)');
// Matches all SCSS files in the different packages.
const allScssGlob = join(buildConfig.packagesDir, '**/*.scss');

/**
 * Overwrite the release task for the material package. The material release will include special
 * files, like a bundled theming SCSS file or all prebuilt themes.
 */
task('material:build-release', ['material:prepare-release'], () => composeRelease(materialPackage));

/**
 * Task that will build the material package. It will also copy all prebuilt themes and build
 * a bundled SCSS file for theming
 */
task(
  'material:prepare-release',
  sequenceTask('material:build', ['material:copy-prebuilt-themes', 'material:bundle-theming-scss'])
);

/** Copies all prebuilt themes into the release package under `prebuilt-themes/` */
task('material:copy-prebuilt-themes', () => {
  src(prebuiltThemeGlob)
    .pipe(gulpRename({ dirname: '' }))
    .pipe(dest(join(releasePath, 'prebuilt-themes')));
});
