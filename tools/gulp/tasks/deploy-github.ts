import { task } from 'gulp';
import { cmd, git } from 'material2-build-tools';

import { releasePackages } from './publish';

/**
 * Deploy build artifacts to repos
 */
function _publishToRepo() {
  return async (done: (err?: string) => void) => {
    for (let pkg of releasePackages) {
      const SOURCE_DIR = `./dist/releases/${pkg}`;
      const REPO_URL = `git@github.com:ngrx-utils/${pkg}-builds.git`;
      const REPO_DIR = `./tmp/${pkg}`;
      const SHA = await git([`rev-parse HEAD`]);
      const SHORT_SHA = await git([`rev-parse --short HEAD`]);
      const COMMITTER_USER_NAME = await git([`--no-pager show -s --format='%cN' HEAD`]);
      const COMMITTER_USER_EMAIL = await git([`--no-pager show -s --format='%cE' HEAD`]);

      await cmd('rm -rf', [`${REPO_DIR}`]);
      await cmd('mkdir ', [`-p ${REPO_DIR}`]);
      await process.chdir(`${REPO_DIR}`);
      await git([`init`]);
      await git([`remote add origin ${REPO_URL}`]);
      await git(['fetch origin master --depth=1']);
      await git(['checkout origin/master']);
      await git(['checkout -b master']);
      await process.chdir('../../');
      await cmd('rm -rf', [`${REPO_DIR}/*`]);
      await git([`log --format="%h %s" -n 1 > ${REPO_DIR}/commit_message`]);
      await cmd('cp', [`-R ${SOURCE_DIR}/* ${REPO_DIR}/`]);
      await process.chdir(`${REPO_DIR}`);
      await git([`config user.name "${COMMITTER_USER_NAME}"`]);
      await git([`config user.email "${COMMITTER_USER_EMAIL}"`]);
      await git(['add --all']);
      await git([`commit -F commit_message`]);
      await cmd('rm', ['commit_message']);
      await git(['push origin master --force']);
      await process.chdir('../../');
      done();
    }
  };
}

task('deploy:github-builds', _publishToRepo);
