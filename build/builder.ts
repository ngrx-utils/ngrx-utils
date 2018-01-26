import * as tasks from './tasks';
import { createBuilder } from './util';

export default createBuilder([
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
  ['Rewriting package.json module path for build artifact', tasks.rewriteModulePackageJson],
  ['Copying package.json files', tasks.copyPackageJsonFiles],
  ['Copying modules files for release', tasks.copyPackagesToRelease],
  ['Rewriting package.json module path for publish', tasks.rewriteModulePackageJson],
  ['Removing redundant package.json in release', tasks.removePackageJsonInRelease],
  ['Removing "./dist/packages" Folder', tasks.removePackagesFolder],
  ['Removing summary files', tasks.removeSummaryFiles]
]);
