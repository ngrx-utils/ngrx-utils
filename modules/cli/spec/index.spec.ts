import * as fs from 'fs';
import * as path from '../src/path-wrapper';

import { generateFileOutput } from '../src';

const promisify = (fn: Function, ...args: any[]) =>
  new Promise((resolve, reject) => {
    fn(...args, (err: Error, data: any) => {
      if (err) reject(err);
      resolve(data);
    });
  });

describe('@ngrx-utils/cli', () => {
  const filePath = (fileName: string) => path.resolve(__dirname, `./fixtures/${fileName}.ts`);

  it('should get correct Union Action Class', async () => {
    generateFileOutput(filePath('sample.action'));

    const [result, output] = await Promise.all([
      promisify(fs.readFile, filePath('sample.action.helper')),
      promisify(fs.readFile, filePath('output'))
    ]);

    expect(result.toString()).toBe(output.toString());
  });

  it('should generate correct reducer function', async () => {
    generateFileOutput(filePath('sample.action'), true);

    const [result, output] = await Promise.all([
      promisify(fs.readFile, filePath('sample.action.helper')),
      promisify(fs.readFile, filePath('output.reducer'))
    ]);

    expect(result.toString()).toBe(output.toString());
  });
});

describe('canonical-path', function() {
  describe('normalize', function() {
    it('should return a normalized path only using forward slashes', function() {
      expect(path.normalize('a/c/../b')).toEqual('a/b');
      // test on windows
      // expect(path.normalize('a\\c\\..\\b')).toEqual('a/b');
    });
  });

  describe('join', function() {
    it('should join paths only using forward slashes', function() {
      expect(path.join('a/b', 'c/d')).toEqual('a/b/c/d');
      // test on windows
      // expect(path.join('a\\b', 'c\\d')).toEqual('a/b/c/d');
    });
  });

  describe('canonical', function() {
    it('should return a path with forward slashes', function() {
      expect(path.canonical('a' + path.sep + 'b' + path.sep + 'c')).toEqual('a/b/c');
    });
  });
});
