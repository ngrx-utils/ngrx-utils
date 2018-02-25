import * as tasks from './tasks';
import { createBuilder, TaskDef } from './util';
import { Config } from 'build/config';

const env = process.env.NODE_ENV;

let taskList: TaskDef[] = [];

const cleanTasks: TaskDef[] = [['Removing all build artifact Folder', tasks.removeArtifactFolders]];

const buildTasks: TaskDef[] = [
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
  ['Rewriting package.json module path for build artifact', tasks.rewriteModulePackageJson]
];

const releaseTasks: TaskDef[] = [
  ['Copying artifact files for release', tasks.copyPackagesToRelease],
  ['Removing redundant package.json in release folder', tasks.removePackageJsonInRelease]
];

const deployTasks: TaskDef[] = [['Deploy builds', tasks.publishToRepo]];

switch (env) {
  case 'build':
    taskList = [...cleanTasks, ...buildTasks];
    break;
  case 'release':
    taskList = [...cleanTasks, ...buildTasks, ...releaseTasks];
    break;
  case 'deploy':
    taskList = [...deployTasks];
    break;
  case 'clean':
    taskList = [...cleanTasks];
    break;
  default:
    taskList = [['Nothing to do', (config: Config) => Promise.resolve()]];
}

export const build = createBuilder(taskList);
