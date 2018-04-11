import { cmd } from '../utils';

export const changelog = async (done: () => void) => {
  await cmd('npx', ['conventional-changelog', '-p', 'angular', '-i', 'CHANGELOG.md', '-s']);
  done();
};
