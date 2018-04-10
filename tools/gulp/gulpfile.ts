import { task, series, parallel } from 'gulp';
import { cleanDist, cleanCoverage } from './tasks/clean';
import { replaceVersion, buildAll } from './tasks/builds';
import { coverageGenerate, coverageUpload } from './tasks/coverage';
import { help } from './tasks/default';
import { lint } from './tasks/lint';
import { testLibs } from './tasks/unit-test';
import { validateRelease } from './tasks/validate-release';
import { npmWhoAmI, npmLogout, npmPublish } from './tasks/publish';
import { deployGithubBuilds } from './tasks/deploy-github';

task('clean:dist', cleanDist);
task('replace-version', replaceVersion);
task('build:all', buildAll);

/** Builds release packages */
task('build:release', series('clean:dist', 'build:all', 'replace-version'));

/** Test coverage */
task('coverage:clean', cleanCoverage);
task('coverage:generate', coverageGenerate);
task('coverage:upload', coverageUpload);
task('coverage', series('coverage:clean', 'coverage:generate', 'coverage:upload'));

task('help', help);
task('default', series('help'));

task('deploy:github-builds', deployGithubBuilds);
task('deploy', series('build:all', 'deploy:github-builds'));

task('lint', lint);

task('test:unit', testLibs);
task('test', parallel('test:unit'));

task('ci:lint', lint);
task('ci:test', testLibs);
task('ci:build', buildAll);
/** Task that uploads the coverage results to codecov. */
task('ci:coverage', series('coverage'));

task('ci', series('ci:build', parallel('ci:lint', 'ci:test'), 'ci:coverage'));

/** Make sure we're logged in. */
task('npm:whoami', npmWhoAmI);
task('npm:logout', npmLogout);
task('npm:publish', npmPublish);
task('validate-release', validateRelease);
task('publish', series('npm:whoami', 'build:all', 'validate-release', 'npm:publish', 'npm:logout'));
