import * as path from 'path';

export function canonicalPath(filePath: string) {
  if (path.sep === '\\') {
    filePath = filePath.replace(/\\/g, '/');
  }
  return filePath;
}

function wrapWithCanonical(fn: Function) {
  return (...args: string[]) => {
    return canonicalPath(fn.apply(path, args));
  };
}

export const normalize = wrapWithCanonical(path.normalize);
export const join = wrapWithCanonical(path.join);
export const resolve = wrapWithCanonical(path.resolve);
export const relative = wrapWithCanonical(path.relative);
export const dirname = wrapWithCanonical(path.dirname);
export const basename = wrapWithCanonical(path.basename);
export const extname = wrapWithCanonical(path.extname);
export const sep = path.sep;
export const delimiter = path.delimiter;
export const canonical = canonicalPath;
