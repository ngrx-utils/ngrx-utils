import { task, series, parallel } from 'gulp';
import { cleanDist, cleanCoverage } from './tasks/clean';
import { replaceVersion, buildAll } from './tasks/builds';
import { coverageGenerate, coverageUpload } from './tasks/coverage';
import { help } from './tasks/default';
import { lint } from './tasks/lint';
import { testUnit } from './tasks/unit-test';
import { validateRelease } from './tasks/validate-release';
import { npmWhoAmI, npmLogout, npmPublish } from './tasks/publish';
import { deployGithubBuilds } from './tasks/deploy-github';

task('clean:dist', cleanDist);
task('replace-version', replaceVersion);
task('build:all', buildAll);

const buildRelease = series('clean:dist', 'build:all', 'replace-version');
/** Builds release packages */
task('build:release', buildRelease);

/** Test coverage */
task('coverage:clean', cleanCoverage);
task('coverage:generate', coverageGenerate);
task('coverage:upload', coverageUpload);
const coverage = series('coverage:clean', 'coverage:generate', 'coverage:upload');
task('coverage', coverage);

task('help', help);
task('default', help);

task('deploy:github-builds', deployGithubBuilds);
const deploy = series('build:release', 'deploy:github-builds');
task('deploy', deploy);

task('lint', lint);

task('test:unit', testUnit);
const test = parallel('test:unit');
task('test', test);

task('ci:lint', lint);
task('ci:test', testUnit);
task('ci:build', buildRelease);
/** Task that uploads the coverage results to codecov. */
task('ci:coverage', coverage);
const ci = series('ci:build', parallel('ci:lint', 'ci:test'), 'ci:coverage');
task('ci', ci);

/** Make sure we're logged in. */
task('npm:whoami', npmWhoAmI);
task('npm:logout', npmLogout);
task('npm:publish', npmPublish);
task('validate-release', validateRelease);
const publish = series(
  'npm:whoami',
  'build:release',
  'validate-release',
  'npm:publish',
  'npm:logout'
);
task('publish', publish);
