import * as tasks from './tasks';
import { createBuilder } from './util';

export const build = createBuilder([
  ['Removing all build artifact Folder', tasks.removeArtifactFolders],
  ['Compiling packages with NGC', tasks.compilePackagesWithNgc],
  ['Bundling FESMs', tasks.bundleFesms],
  ['Down-leveling FESMs to ES5', tasks.downLevelFesmsToES5],
  ['Creating UMD Bundles', tasks.createUmdBundles],
  ['Renaming package entry files', tasks.renamePackageEntryFiles],
  ['Cleaning TypeScript files', tasks.cleanTypeScriptFiles],
  ['Cleaning JavaScript files', tasks.cleanJavaScriptFiles],
  ['Removing remaining sourcemap files', tasks.removeRemainingSourceMapFiles],
  ['Copying type definition files', tasks.copyTypeDefinitionFiles],
  ['Copying executable files', tasks.copyExcecutableFiles],
  ['Minifying UMD bundles', tasks.minifyUmdBundles],
  ['Removing "./dist/packages" folder', tasks.removePackagesFolder],
  ['Removing summary files', tasks.removeSummaryFiles],
  ['Copying package.json files', tasks.copyPackageJsonFiles],
  ['Rewriting package.json module path for build artifact', tasks.rewriteModulePackageJson],
  ['Copying artifact files for release', tasks.copyPackagesToRelease],
  ['Removing redundant package.json in release folder', tasks.removePackageJsonInRelease]
]);
