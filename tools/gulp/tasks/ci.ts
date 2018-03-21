import { parallel, task, series } from 'gulp';

task('ci:lint', series('lint'));

// Travis sometimes does not exit the process and times out. This is to prevent that.
task('ci:test', series('test:single-run'));

/** Task to compile all library. */
task('ci:build', series('build'));

/** Task that uploads the coverage results to codecov. */
task('ci:coverage', series('coverage:upload'));

task('ci', series('build', parallel('ci:lint', 'ci:test'), 'ci:coverage'));
