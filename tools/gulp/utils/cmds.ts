import * as child_process from 'child_process';

function _exec(command: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    child_process.exec(command + ' ' + args.join(' '), (err, stdout) => {
      if (err) {
        return reject(err);
      }

      resolve(stdout.toString());
    });
  });
}

export function cmd(command: string, args: string[]): Promise<string> {
  return _exec(command, args);
}

export function git(args: string[]): Promise<string> {
  return cmd('git', args);
}
